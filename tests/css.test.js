import test from 'ava';
import { css, globalCss, keyframes, extractCss } from '../lib/css.js';
import { JSDOM } from 'jsdom';

test.before(() => {
  const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
  global.window = dom.window;
  global.document = dom.window.document;
});

test('css() returns className and injects styles', t => {
  const className = css`
    color: red;
  `;

  const style = extractCss();

  t.is(className, 'hyper-1');
  t.is(style, ' .hyper-1{color:red;}');
});

test('globalCss() injects global styles', t => {
  globalCss`
    body {
      margin: 0;
    }
  `;

  const style = extractCss();

  t.is(style, 'body{margin:0;} .hyper-1{color:red;}');
});

test('keyframes() injects animation styles', t => {
  const anim = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `;

  const style = extractCss();

  t.is(anim, 'hyper-3');
  t.true(style.includes(`@keyframes ${anim}`));
  t.true(style.includes('from{opacity:0;}to{opacity:1;}'));
});

test('css() injects styles into document', t => {

  const style = extractCss();

  t.is(style, '@keyframes hyper-3{from{opacity:0;}to{opacity:1;}}body{margin:0;} .hyper-1{color:red;}');

  const styleTag = document.getElementById('_hyper');
  t.truthy(styleTag);
  t.true(styleTag.textContent.includes('color:red'));
});

test('css() caches identical template strings and returns the same className', t => {
  const className1 = css`margin: ${'1rem'};`;
  const className2 = css`margin: ${'1rem'};`;

  t.is(className1, className2);
});