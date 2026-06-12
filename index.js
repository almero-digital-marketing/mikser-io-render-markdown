import MarkdownIt from 'markdown-it'
import removeMarkdown from 'remove-markdown'

export function load({ runtime, config }) {
    const { options: mdOptions = {}, plugins = [] } = config ?? {}
    let markdown = new MarkdownIt({
        html: true,
        breaks: true,
        ...mdOptions,
    })
    plugins.forEach(({ plugin, options }) => {
        markdown.use(plugin, options)
    })
    runtime.markdown = source => markdown.render(source || '')
    runtime.removeMarkdown = (source, options = {}) => removeMarkdown(source || '', options)
}

// v9 factory — render-markdown is load-only (it augments the runtime
// with `markdown()` / `removeMarkdown()` for use from primary
// renderers like hbs); there's no `render` because it doesn't turn
// entities into output directly. The loader treats `load` as
// sufficient for renderer registration. ADR-0010.
export function renderMarkdown(options = {}) {
    return { name: options.name ?? 'markdown', options, load }
}