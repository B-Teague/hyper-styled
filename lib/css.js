import { serialize, compile, stringify } from 'stylis';

let _id = 1;
let init = 1;
const cache = {};

const _STYLE_ID = '_hyper';
const ssr_sheet = { data: '' };
function getSheet() {
   if (typeof document === 'object') {
      // Querying the existing target for a previously defined <style> tag
      // We're doing a querySelector because the <head> element doesn't implemented the getElementById api
      return (
         window[_STYLE_ID] ||
         Object.assign(document.head.appendChild(document.createElement('style')), {
            innerHTML: ' ',
            id: _STYLE_ID
         })
      ).firstChild;
   }

   return ssr_sheet;
}

const process = (key, className, global, keyframes) => {
   const selector = global ? '' : keyframes ? `@keyframes ${className}` : `.${className}`;
   const prepend = global || keyframes;
   const rules = (cache[key] = {
      className,
      rules: serialize(compile(global ? key : `${selector}{${key}}`), stringify)
   }).rules;
   const sheet = getSheet();

   sheet.data = prepend ? rules + sheet.data : sheet.data + rules;
};

function initCache() {
   const sheet = getSheet().data;
   const cssData = compile(sheet);

   for (let i = 0; i < cssData.length; i++) {
      const className = cssData[i].props[0];
      const rule = serialize(cssData[i].children, stringify);
      const key =
         cssData[i].type === 'rule' && !className.startsWith('.hyper')
            ? `${className}{${rule}}`
            : rule;
      cache[key] = className;
   }
}

function css(strings, ...values) {
   const ctx = this || {};
   if (init) {
      init = 0;
      initCache();
   }

   let key = '';
   for (const [i, string] of strings.entries()) {
      key += string + (values[i] == null ? '' : values[i]);
   }
   key = key.replace(/\s+/g, ''); //Needs to match stylis

   if (cache[key]) return cache[key].className;

   const className = 'hyper-' + _id++;
   process(key, className, ctx.g, ctx.k);

   return className;
}

function extractCss() {
   return getSheet().data;
}

const keyframes = css.bind({ k: 1 });
const globalCss = css.bind({ g: 1 });

export { css, extractCss, globalCss, keyframes };
