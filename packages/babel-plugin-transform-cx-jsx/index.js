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

function processAttribute(t, attribute) {
   if (attribute.type === 'JSXAttribute') {

      if (attribute.value == null)
         return property(t, attribute.name, t.booleanLiteral(true));

      return property(t, attribute.name, processChild(t, attribute.value, { root: false }));
   }

   return false;
}

function processChild(t, child, root) {

   if (!child)
      return child;

   switch (child.type) {
      case 'JSXElement':
         return processElement(t, child, root);

      case 'JSXText':
         return t.stringLiteral(child.value);

      case 'JSXExpressionContainer':
         return processChild(t, child.expression, root);

      case 'ObjectExpression':
         for (let i = 0; i < child.properties.length; i++)
            child.properties[i].value = processChild(t, child.properties[i].value, root);
         break;

      case 'ArrayExpression':
         for (let i = 0; i < child.elements.length; i++)
            child.elements[i] = processChild(t, child.elements[i], root);
         break;
   }

   return child;
}

function processElement(t, element, root) {
   if (element.type === "JSXElement") {
      if (element.openingElement) {
         let tagName = elementName(element.openingElement.name);
         if (tagName != "cx" && tagName != "Cx" && root.root)
            return false;

         let children;

         if (root.root || tagName == 'cx' || tagName == 'Cx') {
            root.root = false;

            if (element.children != null)
               children = element.children
                  .filter(function (c) {
                     return c.type == "JSXElement"
                  })
                  .map(function (c) {
                     return processElement(t, c, root)
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
                  let a = processAttribute(t, element.openingElement.attributes[i]);
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
               let c = processChild(t, element.children[i], root);
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

function addImport(t, path, name, importPath) {
   let program = path.findParent(n => n.isProgram());

   let identifier = t.identifier(name);
   let importDeclaration = t.importDeclaration([t.importSpecifier(identifier, identifier)], t.stringLiteral(importPath));

   program.unshiftContainer("body", importDeclaration);
}

module.exports = function(options) {
   let t = options.types;

   return {
      visitor: {
         JSXElement: {
            enter: function(path, scope) {
               let opts = scope.opts;
               let node = path.node;

               if (node.root) {
                  return;
               }

               let root = {
                  root: true
               };

               let config = processElement(t, node, root, null);

               if (config) {
                  path.replaceWith(config);
                  node.root = true;
               }
            }
         },

         ArrowFunctionExpression: {
            enter: function (path, scope) {
               let child = path.node;
               //register cx functional components ({props} => <cx><div /></cx>)
               if (child.body.type === 'JSXElement' && child.body.openingElement.name.name === 'cx' && !child.markedAsFunctionalComponentType) {
                  addImport(t, path,"createFunctionalComponent", "cx/ui");
                  child.markedAsFunctionalComponentType = true;
                  path.replaceWith(t.callExpression(t.identifier("createFunctionalComponent"), [child]));
               }
            }
         }
      },
      inherits: require("babel-plugin-syntax-jsx")
   }
};
