# hyper-styled

Minimal CSS-in-JS library for [Hyperapp](https://github.com/jorgebucaran/hyperapp) with zero runtime and full server-side rendering support.

## Features

- ✨ `styled` components using template literals
- 🧠 Zero runtime dependency
- 🧪 Compatible with server-side rendering (SSR)
- 🎯 Extracts CSS via `extractCss()` for injection
- 🧩 `css`, `globalCss`, and `keyframes` utility functions
- 💚 Tiny and fast

## Installation

```sh
npm install hyper-styled
```

## Usage

### Styled Components

```js
import { styled } from 'hyper-styled';

const Button = styled.button`
  background: blue;
  color: white;
  padding: 0.5em 1em;
`;

const vnode = Button({}, ['Click me']);
```

### SSR with Hyperapp

```js
import { renderToString } from 'hyperapp-render';
import { styled, extractCss } from 'hyper-styled';

const Title = styled.h1`
  color: hotpink;
`;

const html = renderToString(Title({}, ['Hello']));
const css = extractCss();

console.log(`<style id="_hyper">${css}</style>${html}`);
```

### Global Styles and Keyframes

```js
import { globalCss, keyframes } from 'hyper-styled';

globalCss`
  body {
    margin: 0;
    font-family: sans-serif;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;
```

