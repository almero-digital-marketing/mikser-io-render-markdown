// What this plugin puts on the runtime, and the two markdown-it defaults it
// deliberately overrides.
//
// It renders nothing itself — it augments the runtime with markdown() and
// removeMarkdown() for a primary renderer to call, so "does the plugin work"
// means "are those two functions there and do they behave as configured".
//
// The two overridden options are the load-bearing part. markdown-it ships
// html:false and breaks:false; this ships both true. A page written by an
// author who expects a single newline to be a line break, or who pastes an
// HTML snippet into a paragraph, gets a different document under the library
// defaults — silently, and only visible in the rendered output.

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { renderMarkdown, load } from '../index.js'

const runtimeWith = (config) => {
    const runtime = {}
    load({ runtime, config })
    return runtime
}

describe('what the plugin adds to the runtime', () => {
    it('provides markdown() and removeMarkdown()', () => {
        const runtime = runtimeWith()
        assert.equal(typeof runtime.markdown, 'function')
        assert.equal(typeof runtime.removeMarkdown, 'function')
    })

    it('renders markdown to html', () => {
        const { markdown } = runtimeWith()
        assert.match(markdown('# Title'), /<h1>Title<\/h1>/)
        assert.match(markdown('*em*'), /<em>em<\/em>/)
    })

    it('renders an absent source as empty rather than throwing', () => {
        // `source || ''`. A meta field that is simply not set reaches here as
        // undefined, and a template asking for it should get an empty string
        // rather than ending the render.
        const { markdown, removeMarkdown } = runtimeWith()
        assert.equal(markdown(undefined).trim(), '')
        assert.equal(markdown(null).trim(), '')
        assert.equal(removeMarkdown(undefined), '')
    })
})

describe('the defaults it overrides', () => {
    it('lets html through, which markdown-it does not by default', () => {
        // html:false would escape this into visible &lt;span&gt; text.
        const { markdown } = runtimeWith()
        assert.match(markdown('a <span class="x">b</span> c'), /<span class="x">b<\/span>/)
    })

    it('turns a single newline into a break, which markdown-it does not by default', () => {
        // breaks:false joins these into one line. Authors writing prose in a
        // CMS field expect the line they typed.
        const { markdown } = runtimeWith()
        assert.match(markdown('one\ntwo'), /<br\s*\/?>/)
    })

    it('lets config override either of them', () => {
        const { markdown } = runtimeWith({ options: { html: false, breaks: false } })
        assert.doesNotMatch(markdown('a <span>b</span>'), /<span>/, 'html should now be escaped')
        assert.doesNotMatch(markdown('one\ntwo'), /<br/, 'breaks should now be off')
    })
})

describe('markdown-it plugins', () => {
    it('applies each one, with its options', () => {
        // The plugin list is the extension point for anything markdown-it can
        // do that this package does not. If it were dropped, a project's
        // footnotes or anchors would simply not appear.
        let received
        const plugin = (md, options) => {
            received = options
            md.core.ruler.push('marker', (state) => { state.tokens.push(Object.assign(new state.Token('html_block', '', 0), { content: '<!--seen-->' })) })
        }
        const { markdown } = runtimeWith({ plugins: [{ plugin, options: { depth: 2 } }] })
        assert.match(markdown('x'), /<!--seen-->/, 'the plugin should have run')
        assert.deepEqual(received, { depth: 2 }, 'and been given its options')
    })
})

describe('removeMarkdown', () => {
    it('strips formatting down to the words', () => {
        const { removeMarkdown } = runtimeWith()
        assert.equal(removeMarkdown('# Title'), 'Title')
        assert.equal(removeMarkdown('**bold** and *em*'), 'bold and em')
    })
})

describe('the plugin descriptor', () => {
    it('registers under `markdown` and carries load', () => {
        const d = renderMarkdown()
        assert.equal(d.name, 'markdown')
        assert.equal(typeof d.load, 'function')
    })

    it('can be named something else, so two configs can coexist', () => {
        assert.equal(renderMarkdown({ name: 'md' }).name, 'md')
    })
})
