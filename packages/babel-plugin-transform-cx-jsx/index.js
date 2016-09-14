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
         for (var i = 0; i < child.properties.length; i++)
            child.properties[i].value = processChild(t, child.properties[i].value, root);
         break;

      case 'ArrayExpression':
         for (var i = 0; i < child.elements.length; i++)
            child.elements[i] = processChild(t, child.elements[i], root);
         break;
   }

   return child;
}

function processElement(t, element, root) {
   if (element.type === "JSXElement") {
      if (element.openingElement) {
         var tagName = elementName(element.openingElement.name);
         if (tagName != "cx" && tagName != "Cx" && root.root)
            return false;

         var children;

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

         var attrs = [];

         var dotIndex = tagName.indexOf('.');
         if (dotIndex != -1)
            attrs.push(t.objectProperty(t.stringLiteral('$type'), t.memberExpression(
               t.identifier(tagName.substr(0, dotIndex)), t.identifier(tagName.substring(dotIndex + 1)))));
         else if (tagName[0].toLowerCase() == tagName[0]) {
            attrs.push(t.objectProperty(t.stringLiteral('$type'), t.identifier('HtmlElement')));
            attrs.push(t.objectProperty(t.stringLiteral('tag'), t.stringLiteral(tagName)));
         } else
            attrs.push(t.objectProperty(t.stringLiteral('$type'), t.identifier(tagName)));

         var attrNames = [];

         var spread = [];

         if (element.openingElement.attributes && element.openingElement.attributes.length) {
            for (var i = 0; i < element.openingElement.attributes.length; i++) {
               if (t.isJSXSpreadAttribute(element.openingElement.attributes[i])) {
                  spread.push(element.openingElement.attributes[i].argument);
               }
               else {
                  var a = processAttribute(t, element.openingElement.attributes[i]);
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
            for (var i = 0; i < element.children.length; i++) {
               var c = processChild(t, element.children[i], root);
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
   var t = options.types;

   return {
      visitor: {
         JSXElement: {
            enter: function(path, scope) {
               var opts = scope.opts;
               var node = path.node;

               if (node.root) {
                  return;
               }

               var root = {
                  root: true
               };

               var config = processElement(t, node, root, null);

               if (config) {
                  path.replaceWith(config);
                  node.root = true;
               }
            }
         }
      },
      inherits: require("babel-plugin-syntax-jsx")
   }
};
