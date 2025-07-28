import test from 'ava';
import { styled } from '../lib/styled.js';
import { renderToString } from 'hyperapp-render';
import { extractCss } from '../lib/css.js';

test('styled.button renders server-side HTML', t => {
  const Button = styled.button`
    background: blue;
  `;

  const vnode = Button({}, ['Click']);
  const html = renderToString(vnode);
  const style = extractCss();

  t.is(html, '<button class="hyper-1">Click</button>');
  t.is(style, '.hyper-1{background:blue;}');
});

test('styled.button merges existing class prop', t => {
  const Button = styled.button`
    background: green;
  `;

  const vnode = Button({ class: 'external' }, ['Submit']);
  const html = renderToString(vnode);
  const style = extractCss();

  t.is(html, '<button class="hyper-2 external">Submit</button>');
  t.true(style.includes('.hyper-2{background:green;}'));
});