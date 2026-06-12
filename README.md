# mikser-io-render-markdown

Markdown helpers for [Mikser](https://github.com/almero-digital-marketing/mikser-io). Adds two functions to the render runtime — `markdown` (render to HTML via [markdown-it](https://www.npmjs.com/package/markdown-it)) and `removeMarkdown` (strip markdown via [remove-markdown](https://www.npmjs.com/package/remove-markdown)).

Markdown is the standard prose format for content sites. The helpers expose Markdown to every template engine you use — `.hbs`, `.eta`, `.liquid` — so the same Markdown body renders identically across layouts and the same plain-text version is available for search snippets, meta descriptions, and email plaintext alternatives.

## Install

```bash
npm install mikser-io-render-markdown
```

## Usage

```js
// mikser.config.js
import markdownItAnchor from 'markdown-it-anchor'
import { renderMarkdown } from 'mikser-io-render-markdown'

export default {
  plugins: [
    renderMarkdown({
      options: { html: true, breaks: true, linkify: true },
      plugins: [
        { plugin: markdownItAnchor, options: { permalink: true } }
      ]
    })
  ]
}
```

In any template:

```hbs
{{{markdown meta.body}}}
{{removeMarkdown meta.body}}
```

### Config

- `options` — passed to the `MarkdownIt` constructor. Defaults: `{ html: true, breaks: true }`.
- `plugins` — array of `{ plugin, options }` entries forwarded to `markdown.use(...)`.

## License

MIT
