const jsx = require("@babel/plugin-syntax-jsx").default;

"use strict";

const expandFatArrows = require('./expandFatArrows');

let dashRegex = /(.*)-(bind|tpl|expr)$/;

function objectKeyIdentifier(t, name) {
   if (name.indexOf('-') >= 0)
      return t.stringLiteral(name);

   return t.identifier(name);
}

function bindExprTplObject(t, instr, value, options) {
   if (instr == "expr") {
      if (value && value.type == 'StringLiteral' && options.scope.opts && options.scope.opts.expandFatArrows) {
         value = t.stringLiteral(expandFatArrows(value.value));
      }
   }
   return t.objectExpression([t.objectProperty(objectKeyIdentifier(t, instr), value)])
}

function property(t, name, value, options) {
   if (name.namespace && name.namespace.name) {
      return t.objectProperty(objectKeyIdentifier(t, name.namespace.name), bindExprTplObject(t, name.name.name, value, options));
   }

   let result = dashRegex.exec(name.name);
   if (result)
      return t.objectProperty(objectKeyIdentifier(t, result[1]), bindExprTplObject(t, result[2], value, options));

   return t.objectProperty(objectKeyIdentifier(t, name.name), value);
}

function elementName(name) {
   if (name.name)
      return name.name;
   if (name.object)
      return elementName(name.object) + '.' + elementName(name.property);
   throw new Error('Could not calculate name.');
}

function processAttribute(t, attribute, options) {
   if (attribute.type === 'JSXAttribute') {

      if (attribute.value == null)
         return property(t, attribute.name, t.booleanLiteral(true), options);

      return property(t, attribute.name, processChild(t, attribute.value, { root: false, scope: options.scope }), options);
   }

   return false;
}

function processChild(t, child, options, preserveWhitespace) {

   if (!child)
      return child;

   switch (child.type) {
      case 'JSXElement':
         return processElement(t, child, options);

      case "JSXEmptyExpression":
         return null;

      case 'JSXText':
         if (preserveWhitespace)
            return t.stringLiteral(child.value);
         let s = innerTextTrim(child.value);
         if (!s || s == ' ')
            return null;
         return t.stringLiteral(s);

      case 'JSXExpressionContainer':
         return processChild(t, child.expression, options);

      case 'ObjectExpression':
         for (let i = 0; i < child.properties.length; i++)
            child.properties[i].value = processChild(t, child.properties[i].value, options);
         break;

      case 'ArrayExpression':
         for (let i = 0; i < child.elements.length; i++)
            child.elements[i] = processChild(t, child.elements[i], options);
         break;
   }

   return child;
}

function processElement(t, element, options) {
   if (element.type === "JSXElement") {
      if (element.openingElement) {
         let tagName = elementName(element.openingElement.name);
         if (tagName != "cx" && tagName != "Cx" && options.root)
            return false;

         let children;

         if (options.root || tagName == 'cx' || tagName == 'Cx') {
            options.root = false;

            if (element.children != null)
               children = element.children
                                 .filter(function (c) {
                                    return c.type == "JSXElement"
                                 })
                                 .map(function (c) {
                                    return processElement(t, c, options)
                                 });

            if (tagName == 'Cx') {
               if (children && children.length > 0)
                  element.openingElement.attributes.push(t.jSXAttribute(t.jSXIdentifier('items'), t.jSXExpressionContainer(t.arrayExpression(children))));
               element.children = [];
               return element;
            }

            if (children && children.length > 1)
               return t.arrayExpression(children);

            if (children && children.length == 1)
               return children[0];

            return t.nullLiteral();
         }

         let attrs = [];

         let dotIndex = tagName.indexOf('.');
         if (dotIndex != -1)
            attrs.push(t.objectProperty(t.identifier('$type'), t.memberExpression(
               t.identifier(tagName.substr(0, dotIndex)), t.identifier(tagName.substring(dotIndex + 1)))));
         else if (tagName[0].toLowerCase() == tagName[0]) {
            attrs.push(t.objectProperty(t.identifier('$type'), t.identifier('HtmlElement')));
            attrs.push(t.objectProperty(t.identifier('tag'), t.stringLiteral(tagName)));
            if (!options.scope.opts || options.scope.opts.autoImportHtmlElement !== false)
               options.scope.$cx.addImport("HtmlElement", "cx/widgets");
         } else
            attrs.push(t.objectProperty(t.identifier('$type'), t.identifier(tagName)));

         let attrNames = [];
         let spread = [],
            preserveWhitespace = !options.scope.opts
               || !options.scope.opts.trimWhitespace
               || (options.scope.opts.trimWhitespaceExceptions && options.scope.opts.trimWhitespaceExceptions.indexOf(element.openingElement.name.name) != -1);

         if (element.openingElement.attributes && element.openingElement.attributes.length) {
            for (let i = 0; i < element.openingElement.attributes.length; i++) {
               if (t.isJSXSpreadAttribute(element.openingElement.attributes[i])) {
                  spread.push(element.openingElement.attributes[i].argument);
               }
               else {
                  let a = processAttribute(t, element.openingElement.attributes[i], options);
                  if (a) {
                     attrs.push(a);
                     let attrName = a.key.value || a.key.name;
                     attrNames.push(attrName);
                     switch (attrName) {
                        case "ws":
                        case "preserveWhitespace":
                           preserveWhitespace = true;
                           break;
                     }
                  }
               }
            }
         }

         if (spread.length > 0)
            attrs.push(t.objectProperty(t.identifier('jsxSpread'), t.arrayExpression(spread)));

         if (attrNames.length > 0) {
            attrs.push(t.objectProperty(t.identifier('jsxAttributes'), t.arrayExpression(attrNames.map(function (name) {
               return t.stringLiteral(name)
            }))));
         }

         if (element.children != null && element.children.length) {
            children = [];
            for (let i = 0; i < element.children.length; i++) {
               let c = processChild(t, element.children[i], options, preserveWhitespace);
               if (c)
                  children.push(c);
            }
            if (children.length)
               attrs.push(t.objectProperty(t.identifier('children'), t.arrayExpression(children)));
         }

         return t.objectExpression(attrs);
      }
   }
}

module.exports = function(options) {
   let t = options.types;

   return {
      name: 'babel-plugin-transform-cx-jsx',
      visitor: {
         Program: {
            enter: function (path, scope) {
               scope.$cx = {
                  imports: {},
                  addImport: function (name, importPath) {
                     if (!scope.$cx.imports[name])
                        scope.$cx.imports[name] = {status: 'missing', path: importPath};
                  }
               }
            },
            exit: function (path, scope) {
               if (scope.$cx) {
                  Object.keys(scope.$cx.imports).forEach(name => {
                     if (scope.$cx.imports[name].status != 'missing')
                        return;

                     let identifier = t.identifier(name);
                     let importDeclaration = t.importDeclaration([t.importSpecifier(identifier, identifier)], t.stringLiteral(scope.$cx.imports[name].path));
                     path.unshiftContainer("body", importDeclaration);
                  })
               }

               delete scope.$cx;
            }
         },

         JSXElement: function(path, scope) {
            let opts = scope.opts;
            let node = path.node;

            if (node.root) {
               return;
            }

            let options = {
               root: true,
               scope: scope
            };

            let config = processElement(t, node, options, null);

            if (config) {
               path.replaceWith(config);
               node.root = true;
            }
         },

         ArrowFunctionExpression: function (path, scope) {
            let node = path.node;
            //register cx functional components ({props} => <cx><div /></cx>)
            if (node.body.type === 'JSXElement' && node.body.openingElement.name.name === 'cx' && !node.markedAsFunctionalComponentType) {
               if (!scope.opts || scope.opts.transformFunctionalComponents !== false) {
                  scope.$cx.addImport("createFunctionalComponent", "cx/ui");
                  node.markedAsFunctionalComponentType = true;
                  path.replaceWith(t.callExpression(t.identifier("createFunctionalComponent"), [node]));
               }
            }
         },

         ImportSpecifier(path, scope) {
            if (path.node.imported && scope.$cx) {
               scope.$cx.imports[path.node.imported.name] = { status: 'valid' };
            }
         }
      },
      inherits: jsx
   }
};

function innerTextTrim(str) {
   return str.replace(/\s+/g, ' ');
}
