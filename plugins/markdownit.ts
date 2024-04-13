import markdownit from "markdown-it";
import hljs from "highlight.js";
const md = markdownit({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          `<pre class="p-0"><div class="bg-[#2f2f2f] px-4 py-2">${lang}</div><div class="code"><code class="hljs">` +
          hljs.highlight(str, { language: lang, ignoreIllegals: false }).value +
          "</code></div></pre>"
        );
      } catch (__) {}
    }
    return (
      `<pre class="p-0"><div class="bg-[#2f2f2f] px-4 py-2">${lang}</div><div class="code"><code  class="hljs">` +
      md.utils.escapeHtml(str) +
      "</code></div></pre>"
    );
  },
});
export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      md,
    },
  };
});
