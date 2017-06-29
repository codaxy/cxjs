"use strict";

function property(t, name, value) {
   if (name.namespace && name.namespace.name) {
      return t.objectProperty(t.stringLiteral(name.namespace.name), t.objectExpression([
         t.objectProperty(t.stringLiteral(name.name.name), value)
      ]));
   }

   return t.objectProperty(t.stringLiteral(name.name), value);
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
         return property(t, attribute.name, t.booleanLiteral(true));

      return property(t, attribute.name, processChild(t, attribute.value, { root: false, scope: options.scope }));
   }

   return false;
}

function processChild(t, child, options) {

   if (!child)
      return child;

   switch (child.type) {
      case 'JSXElement':
         return processElement(t, child, options);

      case 'JSXText':
         return t.stringLiteral(child.value);

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
            attrs.push(t.objectProperty(t.stringLiteral('$type'), t.memberExpression(
               t.identifier(tagName.substr(0, dotIndex)), t.identifier(tagName.substring(dotIndex + 1)))));
         else if (tagName[0].toLowerCase() == tagName[0]) {
            attrs.push(t.objectProperty(t.stringLiteral('$type'), t.identifier('HtmlElement')));
            attrs.push(t.objectProperty(t.stringLiteral('tag'), t.stringLiteral(tagName)));
            if (!options.scope.opts || options.scope.opts.autoImportHtmlElement !== false)
               options.scope.$cx.addImport("HtmlElement", "cx/widgets");
         } else
            attrs.push(t.objectProperty(t.stringLiteral('$type'), t.identifier(tagName)));

         let attrNames = [];

         let spread = [];

         if (element.openingElement.attributes && element.openingElement.attributes.length) {
            for (let i = 0; i < element.openingElement.attributes.length; i++) {
               if (t.isJSXSpreadAttribute(element.openingElement.attributes[i])) {
                  spread.push(element.openingElement.attributes[i].argument);
               }
               else {
                  let a = processAttribute(t, element.openingElement.attributes[i], options);
                  if (a) {
                     attrs.push(a);
                     attrNames.push(a.key.value);
                  }
               }
            }
         }

         if (spread.length > 0)
            attrs.push(t.objectProperty(t.stringLiteral('jsxSpread'), t.arrayExpression(spread)));

         if (attrNames.length > 0)
            attrs.push(t.objectProperty(t.stringLiteral('jsxAttributes'), t.arrayExpression(attrNames.map(function (name) {
               return t.stringLiteral(name)
            }))));

         if (element.children != null && element.children.length) {
            children = [];
            for (let i = 0; i < element.children.length; i++) {
               let c = processChild(t, element.children[i], options);
               if (c)
                  children.push(c);
            }
            if (children.length)
               attrs.push(t.objectProperty(t.stringLiteral('children'), t.arrayExpression(children)));
         }

         return t.objectExpression(attrs);
      }
   }
}

module.exports = function(options) {
   let t = options.types;

   return {
      visitor: {
         Program: {
            enter: function(path, scope) {
               scope.$cx = {
                  imports: {},
                  addImport: function (name, importPath) {
                     if (scope.$cx.imports[name])
                        return;
                     let identifier = t.identifier(name);
                     let importDeclaration = t.importDeclaration([t.importSpecifier(identifier, identifier)], t.stringLiteral(importPath));
                     path.unshiftContainer("body", importDeclaration);
                     scope.$cx.imports[name] = true;
                  }
               }
            },
            exit: function (path, scope) {
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
               scope.$cx.imports[path.node.imported.name] = true;
            }
         }
      },
      inherits: require("babel-plugin-syntax-jsx")
   }
};
