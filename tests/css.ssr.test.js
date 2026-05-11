import test from 'ava';
import { css, globalCss, keyframes, extractCss } from '../lib/css.js';
import { JSDOM } from 'jsdom';

test.before(() => {
   const ssrDom = new JSDOM(
      `<!DOCTYPE html><html><head><style id="_hyper">@keyframes hyper-3{from{opacity:0;}to{opacity:1;}}body{margin:0;} .hyper-1{color:red;}</style></head><body></body></html>`
   );
   global.window = ssrDom.window;
   global.document = ssrDom.window.document;
});

test('first css call caches existing styles and extractCss() returns only existing styles', (t) => {
   //First call should initialize the cache, otherwise, these entries will be duplicated.
   css`
      color: red;
   `;

   globalCss`
    body {
      margin: 0;
    }
  `;

   //These should already be in the cache, so they shouldn't change what is extracted.
   keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `;

   const style = extractCss();

   t.is(
      style,
      '@keyframes hyper-3{from{opacity:0;}to{opacity:1;}}body{margin:0;} .hyper-1{color:red;}'
   );
});
