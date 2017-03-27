//http://stackoverflow.com/questions/36428283/arrow-function-eval-preprocessor

export function expandFatArrows(code) {
   var arrowHeadRegex = RegExp(/(\((?:\w+,)*\w+\)|\(\)|\w+)[\r\t ]*=>\s*/);
   var arrowHeadMatch = arrowHeadRegex.exec(code);

   if (arrowHeadMatch) {//if no match return as it is
      var params = arrowHeadMatch[1];
      if (params.charAt(0) !== "(") {
         params = "(" + params + ")";
      }
      var index = arrowHeadMatch.index;
      var startCode = code.substring(0, index);

      var bodyAndNext = code.substring(index + arrowHeadMatch[0].length);

      var curlyCount = 0;
      var curlyPresent = false;
      var singleLineBodyEnd = 0;
      var bodyEnd = 0;

      for (var i = 0; i < bodyAndNext.length; i++) {
         var ch = bodyAndNext[i];
         if (ch === '{') {
            curlyPresent = true;
            curlyCount++;
         } else if (ch === '}') {
            curlyCount--;
         } else if (!curlyPresent) {
            //any character other than { or }
            singleLineBodyEnd = getSingeLineBodyEnd(bodyAndNext, i);
            break;
         }
         if (curlyPresent && curlyCount === 0) {
            bodyEnd = i;
            break;
         }
      }

      var body;

      if (curlyPresent) {
         if (curlyCount !== 0) {
            throw Error("Could not match curly braces for function at : " + index);
         }
         body = bodyAndNext.substring(0, bodyEnd + 1);

         var restCode = bodyAndNext.substring(bodyEnd + 1);
         var expandedFun = "(function " + params + body + ").bind(this)";
         code = startCode + expandedFun + restCode;
      } else {
         if (singleLineBodyEnd <= 0) {
            throw Error("could not get function body at : " + index);
         }

         body = bodyAndNext.substring(0, singleLineBodyEnd + 1);

         restCode = bodyAndNext.substring(singleLineBodyEnd + 1);
         expandedFun = "(function " + params + "{return " + body + "}).bind(this)";
         code = startCode + expandedFun + restCode;
      }

      return expandFatArrows(code);//recursive call
   }
   return code;
}

function getSingeLineBodyEnd(bodyCode, startI) {
   var braceCount = 0;
   var openingQuote = null;

   for (var i = startI; i < bodyCode.length; i++) {
      var ch = bodyCode[i];
      var lastCh = null;
      if (ch === '"' || ch === "'") {
         openingQuote = ch;
         i = skipQuotedString(bodyCode, openingQuote, i);
         ch = bodyCode[i];
      }

      if (i !== 0 && !bodyCode[i - 1].match(/[\t\r ]/)) {
         lastCh = bodyCode[i - 1];
      }

      if (ch === '{' || ch === '(') {
         braceCount++;
      } else if (ch === '}' || ch === ')') {
         braceCount--;
      }

      if (braceCount < 0 || (lastCh !== '.' && ch === '\n')) {
         return i - 1;
      }
   }

   return bodyCode.length;
}

function skipQuotedString(bodyAndNext, openingQuote, i) {
   var matchFound = false;//matching quote
   var openingQuoteI = i;
   i++;
   for (; i < bodyAndNext.length; i++) {
      var ch = bodyAndNext[i];
      var lastCh = (i !== 0) ? bodyAndNext[i - 1] : null;

      if (ch !== openingQuote || (ch === openingQuote && lastCh === '\\' )) {
         continue;//skip quoted string
      } else if (ch === openingQuote) {//matched closing quote
         matchFound = false;
         break;
      }
   }
   if (matchFound) {
      throw new Error("Could not find closing quote for quote at : " + openingQuoteI);
   }
   return i;
}
