use lazy_static::lazy_static;
use regex::Regex;
use std::{
    borrow::Borrow,
    collections::{HashMap, HashSet},
    fs,
    hash::Hash,
    path::PathBuf,
};

use serde::de::value::Error;
use swc_common::{chain, util::take::Take, Mark, DUMMY_SP};
use swc_core::{ecma::transforms::base::resolver, plugin::proxies::TransformPluginProgramMetadata};
use swc_ecma_ast::{
    Ident, ImportDecl, ImportNamedSpecifier, ImportPhase, ImportSpecifier, ModuleDecl,
    ModuleExportName, ModuleItem, Program, Str,
};
use swc_ecma_parser::{EsConfig, Syntax, TsConfig};
use swc_ecma_transforms_testing::test_fixture;
use swc_ecma_utils::ident;
use swc_ecma_visit::{as_folder, FoldWith, VisitMut, VisitMutWith};
use swc_plugin_macro::plugin_transform;

lazy_static! {
    static ref QUOTES_REGEX: Regex = Regex::new(r#""|'"#).unwrap();
}

pub struct TransformVisitor {
    manifest: HashMap<String, HashMap<String, String>>,
    imports: HashSet<(String, ImportSpecifier)>,
    scss_imports: HashSet<String>,
    use_src: bool,
    sass: bool,
}

impl TransformVisitor {
    fn insert_import(&mut self, src: &str, import_specifier: ImportSpecifier) {
        self.imports.insert((src.to_string(), import_specifier));
    }

    fn add_specifier(&mut self, import_key: String, specifier: ImportSpecifier) -> bool {
        match self.manifest.get(&import_key) {
            Some(value) => {
                let mut changes = false;
                if (self.sass) {
                    match value.get("scss") {
                        Some(scss_import) => {
                            let new_import_src = format!("cx/{}", scss_import);
                            changes = true;
                            self.scss_imports.insert(new_import_src);
                        }
                        None => {}
                    }
                }

                if (self.use_src) {
                    match value.get("js") {
                        Some(js_import) => {
                            let new_import_src = format!("cx/{}", js_import);
                            changes = true;
                            self.insert_import(new_import_src.as_str(), specifier);
                        }
                        None => {}
                    }
                }

                return changes;
            }
            None => false,
        }
    }
}

impl VisitMut for TransformVisitor {
    fn visit_mut_import_decl(&mut self, n: &mut swc_ecma_ast::ImportDecl) {
        let source = *n.src.clone();
        let mut changes = false;
        match source.raw {
            Some(source_atom) => {
                let src = source_atom.as_str();
                let replaced = QUOTES_REGEX.replace_all(src, r"").to_string();
                if true {
                    let stripped_format = &replaced[3..replaced.len()]; // Strip the cx/ part and the quotes

                    n.specifiers.to_owned().into_iter().for_each(|specifier| {
                        match specifier.to_owned() {
                            ImportSpecifier::Named(named_specifier) => {
                                let mut component_name: &str;
                                let x = match named_specifier.imported {
                                    Some(ref imp) => {
                                        match imp {
                                            ModuleExportName::Ident(ident) => {
                                                component_name = ident.sym.as_str();
                                            }
                                            ModuleExportName::Str(str) => {
                                                component_name = str.value.as_str();
                                            }
                                        };
                                    }
                                    None => {
                                        component_name = named_specifier.local.sym.as_str();
                                    }
                                };

                                let import_key = format!("{}/{}", stripped_format, component_name);
                                // if component_name.contains("isComponentFactory") {
                                //     panic!(
                                //         "{} {}  {} --- {} $$${}$$$",
                                //         replaced, stripped_format, component_name, import_key, src
                                //     );
                                // }

                                if replaced.starts_with("cx/") && !replaced.starts_with("cx/src") {
                                    if self.add_specifier(import_key, specifier) {
                                        changes = true;
                                    }
                                }
                            }
                            ImportSpecifier::Namespace(ns_specifier) => {
                                let component_name = ns_specifier.local.sym.as_str();
                                let import_key = format!("{}/{}", stripped_format, component_name);

                                if replaced.starts_with("cx/") && !replaced.starts_with("cx/src") {
                                    if self.add_specifier(import_key, specifier) {
                                        changes = true;
                                    }
                                }
                            }
                            // ImportSpecifier::Default(default_specifier) => {
                            //     let component_name = default_specifier.local.sym.as_str();
                            //     let import_key = format!("{}/{}", stripped_format, component_name);
                            //     panic!("{}/{}", stripped_format, component_name);
                            //     if self.add_specifier(import_key, specifier) {
                            //         changes = true;
                            //     }
                            // }
                            _ => {}
                        }
                    });
                }
            }
            None => {}
        }

        if changes == true {
            n.take();
        }

        n.visit_mut_children_with(self);
    }

    fn visit_mut_module(&mut self, n: &mut swc_ecma_ast::Module) {
        n.visit_mut_children_with(self);

        let new_imports = self
            .imports
            .iter()
            .map(|(src, value)| {
                ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                    span: DUMMY_SP,
                    type_only: false,
                    with: None,
                    phase: ImportPhase::Evaluation,
                    specifiers: vec![value.clone()],
                    src: Box::new(Str::from(src.to_owned())),
                }))
            })
            .collect::<Vec<_>>();

        let new_scss_imports = self
            .scss_imports
            .iter()
            .map(|(src)| {
                ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                    span: DUMMY_SP,
                    type_only: false,
                    with: None,
                    phase: ImportPhase::Evaluation,
                    specifiers: vec![],
                    src: Box::new(Str::from(src.to_owned())),
                }))
            })
            .collect::<Vec<_>>();

        n.body.retain(|b| match b {
            ModuleItem::ModuleDecl(decl) => match decl.to_owned() {
                ModuleDecl::Import(import) => {
                    let str = *import.src;
                    if str.value.to_owned().is_empty() {
                        return false;
                    }

                    return true;
                }

                _ => true,
            },
            _ => true,
        });

        n.body.append(new_imports.clone().as_mut());
        n.body.append(new_scss_imports.clone().as_mut());
    }
}

#[plugin_transform]
pub fn process_transform(program: Program, _metadata: TransformPluginProgramMetadata) -> Program {
    let manifest: HashMap<String, HashMap<String, String>>;
    let config_string_opt = _metadata.get_transform_plugin_config();

    if config_string_opt.is_none() {
        panic!("Unable to deserialize the config.")
    }

    let mut use_src = false;
    let mut sass = false;

    let config_string = config_string_opt.unwrap().to_string();

    let config: Result<HashMap<String, serde_json::Value>, serde_json::Error> =
        serde_json::from_str(&config_string);
    match config {
        Ok(value) => {
            let manifest_value = value.get("manifest");
            match manifest_value {
                Some(man) => {
                    manifest = serde_json::from_value(man.clone()).unwrap();
                }
                None => panic!("Could not read manifest."),
            }

            let use_src_value = value.get("useSrc");
            match use_src_value {
                Some(value) => {
                    let test_value: Result<bool, serde_json::Error> =
                        serde_json::from_value(value.clone());

                    match test_value {
                        Ok(val) => {
                            use_src = val;
                        }
                        Err(err) => {
                            panic!("Could not deserialize useSrc. {}", err);
                        }
                    }
                }
                None => {}
            }
        }
        Err(err) => panic!("Could not read manifest. {}", err),
    }

    program.fold_with(&mut as_folder(TransformVisitor {
        imports: HashSet::new(),
        scss_imports: HashSet::new(),
        manifest,
        use_src,
        sass,
    }))
}

#[testing::fixture("tests/**/input.js")]
#[testing::fixture("tests/**/input.tsx")]
fn exec(input: PathBuf) {
    let output = input.with_file_name("output.js");
    let mainfest_content = fs::read_to_string("tests/manifest.json");

    match mainfest_content {
        Ok(value) => {
            let manifest: HashMap<String, HashMap<String, String>> =
                serde_json::from_str(value.as_str()).unwrap();

            test_fixture(
                Syntax::Typescript(TsConfig {
                    tsx: true,
                    ..Default::default()
                }),
                &|_| {
                    chain!(
                        resolver(Mark::new(), Mark::new(), true),
                        as_folder(TransformVisitor {
                            imports: HashSet::new(),
                            scss_imports: HashSet::new(),
                            manifest: manifest.to_owned(),
                            use_src: true,
                            sass: false
                        })
                    )
                },
                &input,
                &output,
                Default::default(),
            )
        }
        Err(_) => panic!("Could not load manifest.json"),
    }
}
