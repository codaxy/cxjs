import { rewriteImports } from './groupImports';
import assert from 'assert';

describe('findImports', () => {
   it('should group all imports', () => {
      const code = `
import { 
    X, Y 
} from "cx/widgets";

import { 
    X, Y 
} from "cx/widgets";
`;
      let result = rewriteImports(code);

      assert.equal(result, "import { X, Y } from 'cx/widgets';\n\n");
   });

   it('should sort imported names', () => {
      const code = `
import {  Y, X } from "cx/widgets";
`;
      let result = rewriteImports(code);

      assert.equal(result, "import { X, Y } from 'cx/widgets';\n\n");
   });
});
