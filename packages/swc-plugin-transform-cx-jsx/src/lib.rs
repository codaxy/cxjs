use std::borrow::BorrowMut;
use std::collections::{HashMap, HashSet};

use lazy_static::lazy_static;
use regex::Regex;
use swc_core::common::{SyntaxContext, DUMMY_SP};
use swc_core::ecma::ast::{
    Program, ArrayLit, BlockStmtOrExpr, CallExpr, Expr, ExprOrSpread, Ident, IdentName, ImportDecl,
    ImportNamedSpecifier, ImportSpecifier, JSXAttr, JSXAttrName, JSXAttrOrSpread, JSXAttrValue,
    JSXClosingElement, JSXElement, JSXElementChild, JSXElementName, JSXExpr, JSXExprContainer,
    JSXOpeningElement, JSXText, KeyValueProp, Lit, MemberExpr, MemberProp, Module, ModuleDecl,
    ModuleItem, Null, ObjectLit, Prop, PropName, PropOrSpread, Str, Callee, ImportPhase,
};
use swc_core::ecma::visit::{visit_mut_pass, VisitMut, VisitMutWith};
use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};

pub struct TransformVisitor {
    imports: HashMap<String, HashSet<String>>,
}

fn create_key_value_prop(key: String, value: Box<Expr>) -> PropOrSpread {
    PropOrSpread::Prop(Box::from(Prop::KeyValue(KeyValueProp {
        key: PropName::Str(Str::from(key)),
        value,
    })))
}

fn obj_key_identifier(name: &str) -> (Option<Str>, Option<Ident>) {
    let mut str: Option<Str> = None;
    let mut ident: Option<Ident> = None;

    if name.find('-').is_some() {
        str = Some(Str::from(name));
    } else {
        ident = Some(Ident {
            span: DUMMY_SP,
            sym: name.into(),
            optional: false,
            ctxt: SyntaxContext::empty(),
        });
    }

    return (str, ident);
}

lazy_static! {
    static ref NULL_LIT_EXPR: Expr = Expr::Lit(Lit::Null(Null { span: DUMMY_SP }));
    static ref DASH_REGEX: Regex = Regex::new(r"(.*)-(bind|tpl|expr)").unwrap();
    static ref WHITESPACE_REGEX: Regex = Regex::new(r"\s+").unwrap();
}

impl TransformVisitor {
    fn transform_cx_element(&mut self, expr: &mut Expr) -> Expr {
        match expr {
            Expr::JSXElement(jsx_el) => {
                let children: &mut Vec<JSXElementChild> = &mut jsx_el.children;
                let opening: JSXOpeningElement = jsx_el.opening.clone();
                let closing: &mut Option<JSXClosingElement> = &mut jsx_el.closing;

                let mut attrs: Vec<PropOrSpread> = vec![];

                let ws_flag = opening.attrs.iter().any(|a| match a {
                    JSXAttrOrSpread::JSXAttr(jsx_attr) => match &jsx_attr.name {
                        JSXAttrName::Ident(ident) => ident.sym.to_string() == "ws",
                        _ => false,
                    },
                    _ => false,
                });

                if let JSXElementName::Ident(ident) = &opening.name {
                    let tag_name: String = ident.sym.to_string();
                    if tag_name == "cx" || tag_name == "Cx" {
                        let mut transformed_children = children
                            .iter_mut()
                            .filter(|child| match *child {
                                JSXElementChild::JSXElement(..) => true,
                                _ => false,
                            })
                            .map(|child| self.transform_cx_child(child, ws_flag))
                            .filter(|child| child.is_some())
                            .map(|child| child.unwrap())
                            .collect::<Vec<_>>();

                        let transformed_children_expr = transformed_children
                            .iter_mut()
                            .map(|child| match child {
                                JSXElementChild::JSXElement(el) => {
                                    Some(ExprOrSpread::from(Expr::JSXElement(el.to_owned())))
                                }
                                JSXElementChild::JSXText(jsx_text) => Some(ExprOrSpread::from(
                                    Expr::Lit(Lit::JSXText(jsx_text.to_owned())),
                                )),
                                JSXElementChild::JSXExprContainer(jsx_expr_cont) => {
                                    Some(ExprOrSpread::from(match &jsx_expr_cont.expr {
                                        JSXExpr::Expr(expr) => self.transform_cx_element(
                                            expr.to_owned().unwrap_parens_mut(),
                                        ),
                                        JSXExpr::JSXEmptyExpr(_) => NULL_LIT_EXPR.to_owned(),
                                    }))
                                }
                                _ => {
                                    println!("Error creating Cx react element");
                                    panic!("Error creating Cx react element")
                                }
                            })
                            .collect::<Vec<_>>();

                        let transformed_children_array_expr = Expr::Array(ArrayLit {
                            span: DUMMY_SP,
                            elems: transformed_children_expr,
                        });

                        if tag_name == "Cx" {
                            let mut attrs: Vec<JSXAttrOrSpread> = opening.attrs;
                            if !children.is_empty() {
                                let items_container = JSXExprContainer {
                                    span: DUMMY_SP,
                                    expr: JSXExpr::Expr(Box::new(
                                        transformed_children_array_expr.to_owned(),
                                    )),
                                };

                                let ident_name = IdentName {
                                    span: DUMMY_SP,
                                    sym: "items".into(),
                                };

                                let items_attr = JSXAttr {
                                    span: DUMMY_SP,
                                    name: JSXAttrName::Ident(ident_name),
                                    value: Some(JSXAttrValue::JSXExprContainer(items_container)),
                                };

                                attrs.push(JSXAttrOrSpread::JSXAttr(items_attr))
                            }

                            let element = JSXElement {
                                span: DUMMY_SP,
                                opening: JSXOpeningElement {
                                    name: opening.name,
                                    span: DUMMY_SP,
                                    attrs,
                                    self_closing: opening.self_closing,
                                    type_args: opening.type_args,
                                },
                                children: vec![],
                                closing: closing.to_owned(),
                            };

                            return Expr::JSXElement(Box::new(element));
                        }

                        return match transformed_children.len() {
                            0 => NULL_LIT_EXPR.to_owned(),
                            1 => {
                                let only_child = transformed_children[0].borrow_mut();

                                return match only_child {
                                    JSXElementChild::JSXElement(jsx_el) => {
                                        Expr::JSXElement(jsx_el.to_owned())
                                    }
                                    JSXElementChild::JSXFragment(jsx_fragment) => {
                                        Expr::JSXFragment(jsx_fragment.to_owned())
                                    }
                                    JSXElementChild::JSXText(jsx_text) => {
                                        Expr::Lit(Lit::from(jsx_text.clone()))
                                    }
                                    JSXElementChild::JSXExprContainer(jsx_expr_cont) => {
                                        match &jsx_expr_cont.expr {
                                            JSXExpr::Expr(expr) => *expr.to_owned(),
                                            JSXExpr::JSXEmptyExpr(_) => NULL_LIT_EXPR.to_owned(),
                                        }
                                    }
                                    _ => {
                                        println!("Failed transforming only child");
                                        panic!("Failed transforming only child.")
                                    }
                                };
                            }
                            _ => transformed_children_array_expr,
                        };
                    }

                    let tag_first_char = tag_name.get(0..1).unwrap();
                    if tag_first_char.to_lowercase() == tag_first_char {
                        // HtmlElement
                        let html_element_sym = "HtmlElement";
                        self.insert_import("cx/widgets", html_element_sym);
                        let html_element = create_key_value_prop(
                            String::from("$type"),
                            Box::from(Expr::Ident(Ident {
                                span: DUMMY_SP,
                                sym: html_element_sym.into(),
                                optional: false,
                                ctxt: SyntaxContext::empty(),
                            })),
                        );

                        attrs.push(html_element);

                        if let JSXElementName::Ident(_) = opening.name {
                            let tag = create_key_value_prop(
                                String::from("tag"),
                                Box::from(Expr::Lit(Lit::Str(tag_name.into()))),
                            );

                            attrs.push(tag);
                        };
                    } else {
                        if let JSXElementName::Ident(ident) = opening.name {
                            let prop = create_key_value_prop(
                                String::from("$type"),
                                Box::from(Expr::Ident(ident)),
                            );

                            attrs.push(prop);
                        };
                    }
                }

                let mut attr_names: Vec<String> = vec![];
                let mut spread: Vec<Option<ExprOrSpread>> = vec![];
                let attributes: Vec<JSXAttrOrSpread> = opening.attrs.clone();

                if !opening.attrs.is_empty() {
                    attributes.iter().for_each(|a| match a {
                        JSXAttrOrSpread::SpreadElement(spread_el) => {
                            spread.push(Some(ExprOrSpread {
                                spread: None,
                                expr: Box::new(
                                    self.transform_cx_element(&mut spread_el.expr.clone()),
                                ),
                            }));
                        }
                        JSXAttrOrSpread::JSXAttr(jsx_attr) => {
                            let processed = self.transform_cx_attribute(jsx_attr.clone());
                            attrs.push(PropOrSpread::Prop(Box::new(processed.to_owned())));
                            let attr_name = match processed {
                                Prop::KeyValue(kv) => self.get_prop_name(&kv),
                                _ => {
                                    println!("cannot parse attr_names Prop");
                                    panic!("cannot parse attr_names Prop")
                                }
                            };

                            attr_names.push(attr_name);
                        }
                    });
                }

                if !spread.is_empty() {
                    attrs.push(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                        key: PropName::Str("jsxSpread".into()),
                        value: Box::new(Expr::Array(ArrayLit {
                            span: DUMMY_SP,
                            elems: spread,
                        })),
                    }))));
                }

                if !attr_names.is_empty() {
                    attrs.push(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                        key: PropName::Str("jsxAttributes".into()),
                        value: Box::new(Expr::Array(ArrayLit {
                            span: DUMMY_SP,
                            elems: attr_names
                                .into_iter()
                                .map(|a| {
                                    Some(ExprOrSpread {
                                        spread: None,
                                        expr: Box::new(Expr::Lit(Lit::Str(a.to_owned().into()))),
                                    })
                                })
                                .collect::<Vec<_>>(),
                        })),
                    }))))
                }

                if !children.is_empty() {
                    let mut new_children: Vec<JSXElementChild> = vec![];
                    children.iter_mut().for_each(|child| {
                        let processed = self.transform_cx_child(child, ws_flag);
                        if processed.is_some() {
                            new_children.push(processed.unwrap());
                        }
                    });

                    attrs.push(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                        key: PropName::Str("children".into()),
                        value: Box::new(Expr::Array(ArrayLit {
                            span: DUMMY_SP,
                            elems: new_children
                                .iter_mut()
                                .map(|child| {
                                    Some(ExprOrSpread {
                                        spread: None,
                                        expr: Box::new(match child {
                                            JSXElementChild::JSXText(jsx_text) => {
                                                Expr::Lit(jsx_text.value.to_owned().into())
                                            }
                                            JSXElementChild::JSXElement(jsx_el) => {
                                                Expr::JSXElement(jsx_el.to_owned())
                                            }
                                            JSXElementChild::JSXSpreadChild(spread) => {
                                                *spread.expr.to_owned()
                                            }
                                            JSXElementChild::JSXExprContainer(expr_cont) => {
                                                match &expr_cont.expr {
                                                    JSXExpr::JSXEmptyExpr(_) => {
                                                        NULL_LIT_EXPR.to_owned()
                                                    }
                                                    JSXExpr::Expr(expr) => *expr.to_owned(),
                                                }
                                            }
                                            JSXElementChild::JSXFragment(jsx_fragment) => {
                                                Expr::JSXFragment(jsx_fragment.to_owned())
                                            }
                                        }),
                                    })
                                })
                                .collect::<Vec<_>>(),
                        })),
                    }))));
                }

                if let JSXElementName::JSXMemberExpr(member_expr) = jsx_el.opening.name.to_owned() {
                    if member_expr.obj.to_owned().is_ident() {
                        let dot_prop = create_key_value_prop(
                            String::from("$type"),
                            Box::new(Expr::Member(MemberExpr {
                                span: DUMMY_SP,
                                obj: Box::new(Expr::Ident(
                                    member_expr.obj.to_owned().expect_ident(),
                                )),
                                prop: MemberProp::Ident(member_expr.prop.to_owned()),
                            })),
                        );

                        attrs.push(dot_prop);
                    }
                }

                return Expr::Object(ObjectLit {
                    span: DUMMY_SP,
                    props: attrs,
                });
            }
            Expr::Array(array) => {
                let mut elems: Vec<Option<ExprOrSpread>> = vec![];

                array
                    .elems
                    .iter_mut()
                    .filter(|el| el.is_some())
                    .for_each(|el| {
                        let transformed = el.as_mut().map(|spread| {
                            ExprOrSpread {
                                spread: spread.spread,
                                expr: Box::new(self.transform_cx_element(&mut spread.expr)),
                            }
                        });
                        elems.push(transformed);
                    });

                return Expr::Array(ArrayLit {
                    span: DUMMY_SP,
                    elems,
                });
            }
            Expr::Object(obj) => {
                let mut attrs: Vec<PropOrSpread> = vec![];

                obj.props
                    .iter_mut()
                    .for_each(|obj_props| match obj_props.to_owned() {
                        PropOrSpread::Prop(prop) => match *prop {
                            Prop::KeyValue(key_value) => {
                                let value =
                                    self.transform_cx_element(&mut key_value.to_owned().value);

                                attrs.push(PropOrSpread::Prop(Box::new(Prop::KeyValue(
                                    KeyValueProp {
                                        key: key_value.key,
                                        value: Box::new(value),
                                    },
                                ))))
                            }
                            Prop::Getter(_) => attrs.push(obj_props.to_owned()),
                            Prop::Setter(_) => attrs.push(obj_props.to_owned()),
                            Prop::Shorthand(_) => attrs.push(obj_props.to_owned()),
                            Prop::Method(_) => attrs.push(obj_props.to_owned()),
                            _ => {
                                println!("EXPR OBJ PROPS");
                                todo!("EXPR OBJ PROPS")
                            }
                        },
                        PropOrSpread::Spread(_) => attrs.push(obj_props.to_owned()),
                    });

                return Expr::Object(ObjectLit {
                    span: DUMMY_SP,
                    props: attrs,
                });
            }
            _ => expr.to_owned(),
        }
    }

    fn get_prop_name(&mut self, kv_prop: &KeyValueProp) -> String {
        match &kv_prop.key {
            PropName::Ident(ident) => ident.sym.as_str().to_string(),
            PropName::Str(str) => str.value.as_str().unwrap_or("").to_string(),
            PropName::Num(num) => num.value.to_string(),
            PropName::BigInt(big_int) => big_int.value.to_string(),
            _ => {
                println!("cannot parse attr_names prop keyValue");
                panic!("cannot parse attr_names prop keyValue")
            }
        }
    }

    fn transform_cx_attribute(&mut self, attr: JSXAttr) -> Prop {
        match &attr.value {
            Some(value) => match value {
                JSXAttrValue::Str(str_value) => {
                    self.generate_cx_property(attr.name, Box::new(Expr::Lit(Lit::Str(str_value.to_owned()))))
                }
                JSXAttrValue::JSXElement(jsx_element) => {
                    let processed =
                        self.transform_cx_element(&mut Expr::JSXElement(jsx_element.to_owned()));

                    self.generate_cx_property(attr.name, Box::new(processed))
                }
                JSXAttrValue::JSXExprContainer(jsx_expr_cont) => match &jsx_expr_cont.expr {
                    JSXExpr::Expr(expr) => {
                        let processed = self.transform_cx_element(&mut expr.to_owned());
                        return self.generate_cx_property(attr.name, Box::new(processed));
                    }
                    JSXExpr::JSXEmptyExpr(_) => {
                        println!("EMPTY PROP EXPR");
                        todo!("EMPTY PROP EXPR")
                    }
                },
                _ => self.generate_cx_property(attr.name, Box::new(NULL_LIT_EXPR.to_owned())),
            },
            None => {
                self.generate_cx_property(attr.name, Box::new(Expr::Lit(Lit::Bool(true.into()))))
            }
        }
    }

    fn generate_cx_property(&mut self, name: JSXAttrName, value: Box<Expr>) -> Prop {
        match name {
            JSXAttrName::JSXNamespacedName(ns_name) => Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(ns_name.ns),
                value: Box::from(
                    self.bind_cx_expr_tpl_object(&ns_name.name.sym.to_string(), value),
                ),
            }),
            JSXAttrName::Ident(ident) => {
                let symbol = ident.sym.to_string();

                let regex_matches = DASH_REGEX.captures(&symbol);
                match regex_matches {
                    Some(matches) => {
                        let (_, ident) = obj_key_identifier(&matches[1]);

                        if ident.is_some() {
                            let unwrapped_ident = ident.unwrap();
                            let ident_name = IdentName {
                                span: unwrapped_ident.span,
                                sym: unwrapped_ident.sym,
                            };

                            return Prop::KeyValue(KeyValueProp {
                                key: PropName::Ident(ident_name),
                                value: Box::new(self.bind_cx_expr_tpl_object(&matches[2], value)),
                            });
                        } else {
                            return Prop::KeyValue(KeyValueProp {
                                key: PropName::Str(symbol.into()),
                                value,
                            });
                        }
                    }
                    None => Prop::KeyValue(KeyValueProp {
                        key: PropName::Str(symbol.into()),
                        value,
                    }),
                }
            }
        }
    }

    fn bind_cx_expr_tpl_object(&mut self, instr: &str, value: Box<Expr>) -> Expr {
        let local_value: Box<Expr> = value.clone();
        if instr == "expr" && false {
            todo!("fat arrows")
        } // TODO: Fat arrows

        let identifiers = obj_key_identifier(instr);
        let key: PropName;

        // TODO: Make this a lot cleaner
        if identifiers.0.is_some() {
            key = PropName::Str(identifiers.0.unwrap());
        } else {
            let unwrapped_ident = identifiers.1.unwrap();
            let ident_name = IdentName {
                span: unwrapped_ident.span,
                sym: unwrapped_ident.sym,
            };
            key = PropName::Ident(ident_name);
        }

        let prop = Prop::KeyValue(KeyValueProp {
            key,
            value: local_value,
        });
        let props: Vec<PropOrSpread> = vec![PropOrSpread::Prop(Box::from(prop))];

        return Expr::Object(ObjectLit {
            span: DUMMY_SP,
            props,
        });
    }

    fn transform_cx_child(
        &mut self,
        child: &mut JSXElementChild,
        preserve_whitespace: bool,
    ) -> Option<JSXElementChild> {
        match child {
            JSXElementChild::JSXText(jsx_text) => {
                if preserve_whitespace {
                    return Some(child.to_owned());
                } else {
                    let inner_text = jsx_text.value.to_string();

                    if inner_text.trim().is_empty() {
                        return None;
                    }
                    let result = WHITESPACE_REGEX
                        .replace_all(inner_text.as_str(), " ")
                        .into_owned();

                    return Some(JSXElementChild::JSXText(JSXText {
                        span: DUMMY_SP,
                        value: result.clone().into(),
                        raw: result.escape_default().to_string().into(),
                        // raw: WHITESPACE_REGEX.replace_all(result.as_str().escape_default().collect::<std::string::String>().as_str(), "&nbsp;").into_owned().into(),
                    }));
                }
            }
            JSXElementChild::JSXElement(jsx_element) => {
                Some(JSXElementChild::JSXExprContainer(JSXExprContainer {
                    span: DUMMY_SP,
                    expr: JSXExpr::Expr(Box::new(self.transform_cx_element(
                        &mut Expr::JSXElement(Box::new(*jsx_element.to_owned())),
                    ))),
                }))
            }
            _ => Some(child.to_owned()),
        }
    }

    fn insert_import(&mut self, key: &str, value: &str) {
        if self.imports.contains_key(key) {
            self.imports.get_mut(key).unwrap().insert(value.into());
        } else {
            let mut import_set: HashSet<String> = HashSet::new();
            import_set.insert(value.into());
            self.imports.insert(key.into(), import_set);
        }
    }
}

impl VisitMut for TransformVisitor {
    fn visit_mut_program(&mut self, program: &mut Program) {
        program.visit_mut_children_with(self);

        if self.imports.is_empty() {
            return;
        }

        // Convert Script to Module if we have imports to add
        let module = match program {
            Program::Module(module) => {
                module
            }
            Program::Script(script) => {
                // Convert Script to Module
                let body = script.body.iter().map(|stmt| {
                    ModuleItem::Stmt(stmt.clone())
                }).collect();

                *program = Program::Module(Module {
                    span: script.span,
                    body,
                    shebang: script.shebang.clone(),
                });

                match program {
                    Program::Module(m) => m,
                    _ => unreachable!(),
                }
            }
        };

        // Collect already imported identifiers from the module
        let mut existing_imports: HashMap<String, HashSet<String>> = HashMap::new();
        for item in &module.body {
            if let ModuleItem::ModuleDecl(ModuleDecl::Import(import_decl)) = item {
                let src = import_decl.src.value.as_str().unwrap_or("").to_string();
                for spec in &import_decl.specifiers {
                    if let ImportSpecifier::Named(named) = spec {
                        let local_name = named.local.sym.as_str().to_string();
                        existing_imports.entry(src.clone()).or_insert_with(HashSet::new).insert(local_name);
                    }
                }
            }
        }

        // Add imports only if they don't already exist
        let mut new_imports: Vec<ModuleItem> = vec![];

        self.imports.iter().for_each(|import| {
            let source = import.0;
            let symbols = import.1;

            // Filter out symbols that are already imported from this source
            let new_symbols: Vec<String> = if let Some(existing) = existing_imports.get(source) {
                symbols.iter().filter(|s| !existing.contains(*s)).cloned().collect()
            } else {
                symbols.iter().cloned().collect()
            };

            if new_symbols.is_empty() {
                return;
            }
            let new_item = ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                span: DUMMY_SP,
                specifiers: new_symbols
                    .iter()
                    .map(|i| {
                        ImportSpecifier::Named(ImportNamedSpecifier {
                            span: DUMMY_SP,
                            local: Ident {
                                span: DUMMY_SP,
                                sym: i.to_owned().into(),
                                optional: false,
                                ctxt: SyntaxContext::empty(),
                            },
                            imported: None,
                            is_type_only: false,
                        })
                    })
                    .collect::<Vec<_>>(),
                src: Box::new(Str::from(source.to_owned())),
                type_only: false,
                with: None,
                phase: ImportPhase::Evaluation,
            }));
            new_imports.push(new_item);
        });

        // Sort imports by source path for consistent ordering
        new_imports.sort_by(|a, b| {
            let a_src = if let ModuleItem::ModuleDecl(ModuleDecl::Import(decl)) = a {
                decl.src.value.as_str().unwrap_or("")
            } else {
                ""
            };
            let b_src = if let ModuleItem::ModuleDecl(ModuleDecl::Import(decl)) = b {
                decl.src.value.as_str().unwrap_or("")
            } else {
                ""
            };
            a_src.cmp(b_src)
        });

        // Insert all new imports at the end of existing imports
        if !new_imports.is_empty() {
            let insert_pos = module.body.iter().rposition(|item| {
                matches!(item, ModuleItem::ModuleDecl(ModuleDecl::Import(_)))
            }).map(|pos| pos + 1).unwrap_or(0);

            for (i, new_import) in new_imports.into_iter().enumerate() {
                module.body.insert(insert_pos + i, new_import);
            }
        }
    }

    fn visit_mut_jsx_element(&mut self, el: &mut JSXElement) {
        if let JSXElementName::Ident(ident) = &mut el.opening.name {
            let tag_name = ident.sym.to_string();
            if tag_name == "cx" || tag_name == "Cx" {
                let tr = self
                    .transform_cx_element(&mut Expr::JSXElement(Box::new(el.to_owned())))
                    .jsx_element();

                if tr.is_some() {
                    *el = *tr.unwrap();
                }
            }
        }

        el.visit_mut_children_with(self);
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        if let Expr::Arrow(arrow_fn_expr) = expr {
            if let BlockStmtOrExpr::Expr(body_expr) = *arrow_fn_expr.to_owned().body {
                if body_expr.is_paren() {
                    let internal_expr = body_expr.to_owned().paren().unwrap().expr;
                    if internal_expr.is_jsx_element() {
                        let jsx_el = internal_expr.jsx_element().unwrap();
                        if let JSXElementName::Ident(ident) = jsx_el.opening.name.to_owned() {
                            let tag_name = ident.sym.to_string();
                            if tag_name == "cx" || tag_name == "Cx" {
                                let old_expr = arrow_fn_expr;
                                old_expr.body = Box::new(BlockStmtOrExpr::Expr(Box::new(
                                    self.transform_cx_element(&mut Expr::JSXElement(jsx_el)),
                                )));
                                *expr = Expr::Call(CallExpr {
                                    span: DUMMY_SP,
                                    callee: swc_core::ecma::ast::Callee::Expr(Box::new(
                                        Expr::Ident(Ident {
                                            span: DUMMY_SP,
                                            sym: "createFunctionalComponent".into(),
                                            optional: false,
                                            ctxt: SyntaxContext::empty(),
                                        }),
                                    )),
                                    ctxt: SyntaxContext::empty(),
                                    args: vec![ExprOrSpread {
                                        expr: Box::new(Expr::Arrow(old_expr.to_owned())),
                                        spread: None,
                                    }],
                                    type_args: None,
                                });

                                self.insert_import(
                                    "cx/ui",
                                    "createFunctionalComponent",
                                );
                            }
                        }
                    }
                }
            }
        }

        expr.visit_mut_children_with(self);

        if let Expr::JSXElement(jsx_el) = expr {
            if let JSXElementName::Ident(ident) = &mut jsx_el.opening.name {
                let tag_name = ident.sym.to_string();
                if tag_name == "cx" || tag_name == "Cx" {
                    *expr = self.transform_cx_element(expr)
                }
            }
        }
    }

    fn visit_mut_call_expr(&mut self, expr: &mut CallExpr) {
        match expr.callee.to_owned() {
            Callee::Expr(callee_expr) => {
                if let Expr::Ident(identifier_option) = *callee_expr {
                    if identifier_option.sym.as_str() == "createFunctionalComponent" {
                        if expr.args.len() == 1 && expr.args[0].expr.is_arrow() {
                            let arrow_expr = expr.args[0].expr.as_arrow().unwrap();

                            match *arrow_expr.body.to_owned() {
                                BlockStmtOrExpr::Expr(internal_expr) => {
                                    match *internal_expr.to_owned() {
                                        Expr::Paren(paren_expr) => match *paren_expr.expr {
                                            Expr::JSXElement(ref jsx_el) => {
                                                if let JSXElementName::Ident(ident) =
                                                    jsx_el.to_owned().opening.name
                                                {
                                                    let tag_name = ident.sym.to_string();
                                                    if tag_name == "cx" || tag_name == "Cx" {
                                                        let transformed_create_func_component =
                                                            self.transform_cx_element(
                                                                &mut Expr::from(jsx_el.to_owned()),
                                                            );

                                                        let mut new_arrow_expr = arrow_expr.clone();

                                                        new_arrow_expr.body = Box::new(
                                                            BlockStmtOrExpr::Expr(Box::new(
                                                                transformed_create_func_component,
                                                            )),
                                                        );

                                                        let mut new_call_ex = expr.clone();
                                                        new_call_ex.args = vec![ExprOrSpread {
                                                            spread: None,
                                                            expr: Box::new(Expr::Arrow(
                                                                new_arrow_expr,
                                                            )),
                                                        }];

                                                        *expr = CallExpr::from(new_call_ex);
                                                    }
                                                }
                                            }
                                            _ => {}
                                        },
                                        _ => {}
                                    }
                                }
                                _ => {}
                            }
                        }
                    }
                }
            }
            _ => {}
        }

        expr.visit_mut_children_with(self);
    }


    fn visit_mut_import_decl(&mut self, import_decl: &mut ImportDecl) {
        import_decl.visit_mut_children_with(self);

        if let Some(src_str) = import_decl.src.value.as_str() {
            if src_str.ends_with("..") {
                let mut new_src = src_str.to_string();
                new_src.push('/');

                import_decl.src = Box::new(Str::from(new_src));
            }
            // . imports do not work so we add the /index
            else if src_str.ends_with(".") {
                let mut new_src = src_str.to_string();
                new_src.insert_str(new_src.len(), "/index");

                import_decl.src = Box::new(Str::from(new_src));
            }
        }
    }
}

#[plugin_transform]
pub fn process_transform(
    mut program: Program,
    _metadata: TransformPluginProgramMetadata,
) -> Program {
    program.visit_mut_with(&mut visit_mut_pass(TransformVisitor {
        imports: HashMap::new(),
    }));

    program
}

#[cfg(test)]
#[testing::fixture("tests/**/input.js")]
#[testing::fixture("tests/**/input.tsx")]
fn exec(input: std::path::PathBuf) {
    use swc_core::ecma::parser::{Syntax, TsSyntax};
    use swc_core::common::Mark;

    let output = input.with_file_name("output.js");
    swc_core::ecma::transforms::testing::test_fixture(
        Syntax::Typescript(TsSyntax {
            tsx: true,
            ..Default::default()
        }),
        &|_| {
            (
                swc_core::ecma::transforms::base::resolver(
                    Mark::new(),
                    Mark::new(),
                    true,
                ),
                visit_mut_pass(TransformVisitor {
                    imports: HashMap::new(),
                }),
            )
        },
        &input,
        &output,
        Default::default(),
    )
}
