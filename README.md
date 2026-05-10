# mikser-io-render-markdown

Markdown helpers for [Mikser](https://github.com/almero-digital-marketing/mikser-io). Adds two functions to the render runtime — `markdown` (render to HTML via [markdown-it](https://github.com/markdown-it/markdown-it)) and `removeMarkdown` (strip markdown via [remove-markdown](https://github.com/stiang/remove-markdown)).

## Install

```bash
npm install mikser-io-render-markdown
```

## Usage

```js
// mikser.config.js
import markdownItAnchor from 'markdown-it-anchor'

export default {
  plugins: ['render-markdown'],
  'render-markdown': {
    options: { html: true, breaks: true, linkify: true },
    plugins: [
      { plugin: markdownItAnchor, options: { permalink: true } }
    ]
  }
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
