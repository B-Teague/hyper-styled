import {serialize, compile, stringify} from 'stylis';

let _id = 1;
const cache = {};

const _STYLE_ID = "_hyper";
const ssr_sheet = {data: ''};
function getSheet() {
    if (typeof document === 'object') {
        // Querying the existing target for a previously defined <style> tag
        // We're doing a querySelector because the <head> element doesn't implemented the getElementById api
        return (
            (window[_STYLE_ID]) ||
            Object.assign(document.head.appendChild(document.createElement('style')), {
                innerHTML: ' ',
                id: _STYLE_ID
            })
        ).firstChild;
    }

    return ssr_sheet;
};

const process = (key, id, global, keyframes) => {
  const selector = global ? '' : keyframes ? `@keyframes ${id}` : `.${id}`;
  const prepend = global || keyframes;
  const rules = (cache[key] = {
    id,
    rules: serialize(compile(global ? key : `${selector}{${key}}`), stringify), //version 4
  }).rules;
  const sheet = getSheet();

  sheet.data = prepend ? rules + sheet.data : sheet.data + rules;
};

function css(strings, ...values) {
  const ctx = this || {};

  let key = "";
  for (const [i, string] of strings.entries()) {
    key += string + (values[i] == null ? "" : values[i]);
  }

  if (cache[key]) return cache[key].id;

  const className = "hyper-" + _id++;
  process(key, className, ctx.g, ctx.k);

  return className;
}

function extractCss() {
  return getSheet().data;
}

const keyframes = css.bind({ k: 1 });
const globalCss = css.bind({ g: 1 });

export { css, extractCss, globalCss, keyframes };
