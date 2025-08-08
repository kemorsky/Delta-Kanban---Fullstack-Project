import { TextStyleKit } from '@tiptap/extension-text-style'
import type { Editor } from '@tiptap/react'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import { ButtonTextFormat } from './button'
import { Bold, Heading1, Heading2, Heading3, Italic, Strikethrough, Underline } from 'lucide-react'

const extensions = [TextStyleKit, StarterKit]

export default function MenuBar({ editor }: { editor: Editor }) {
  // Read the current editor's state, and re-render the component when it changes
  const editorState = useEditorState({
    editor,
    selector: ctx => {
      return {
        isBold: ctx.editor.isActive('bold') ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive('strike') ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive('code') ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive('paragraph') ?? false,
        isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
        isBulletList: ctx.editor.isActive('bulletList') ?? false,
        isOrderedList: ctx.editor.isActive('orderedList') ?? false,
        isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
        isBlockquote: ctx.editor.isActive('blockquote') ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      }
    },
  })

  return (
    <div className="control-group bg-tertiary/80 border border-[#1F2937] rounded p-2 flex items-center justify-start">
        <section className="pr-2 flex gap-1 border-r border-gray-300">
            <ButtonTextFormat
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editorState.isHeading1 ? 'is-active' : ''}
            >
                <span className="flex items-center justify-center">
                    <Heading1 className="w-[1.5rem] h-[1.5rem]" />
                </span>
            </ButtonTextFormat>
            <ButtonTextFormat
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editorState.isHeading2 ? 'is-active' : ''}
            >
                <span className="flex items-center justify-center">
                    <Heading2 className="w-[1.5rem] h-[1.5rem]" />
                </span>
            </ButtonTextFormat>
            <ButtonTextFormat
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={editorState.isHeading3 ? 'is-active' : ''}
            >
                <span className="flex items-center justify-center">
                    <Heading3 className="w-[1.5rem] h-[1.5rem]" />
                </span>
            </ButtonTextFormat>
        </section>
        <section className="px-2 flex gap-1 border-r border-gray-300">
                <ButtonTextFormat
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editorState.canBold}
                    className={editorState.isBold ? 'is-active' : ''}>
                    <span className="flex items-center justify-center">
                        <Bold />
                    </span>
                </ButtonTextFormat>
                <ButtonTextFormat 
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editorState.canItalic}
                    className={editorState.isItalic ? 'is-active' : ''}>                
                    <span className="flex items-center justify-center">
                        <Italic />
                    </span>
                </ButtonTextFormat>
                <ButtonTextFormat >               
                    <span className="flex items-center justify-center">
                        <Underline />
                    </span>
                </ButtonTextFormat>
                <ButtonTextFormat>          
                    <span className="flex items-center justify-center">
                        <Strikethrough />
                    </span>
                </ButtonTextFormat>
            </section>
        <ButtonTextFormat
          
        >
          Bold
        </ButtonTextFormat>
        <ButtonTextFormat
          
        >
          Italic
        </ButtonTextFormat>
        <ButtonTextFormat
         
        >
          Strike
        </ButtonTextFormat>
        <ButtonTextFormat
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState.canCode}
          className={editorState.isCode ? 'is-active' : ''}
        >
          Code
        </ButtonTextFormat>
        <ButtonTextFormat onClick={() => editor.chain().focus().unsetAllMarks().run()}>Clear marks</ButtonTextFormat>
        <ButtonTextFormat onClick={() => editor.chain().focus().clearNodes().run()}>Clear nodes</ButtonTextFormat>
        <ButtonTextFormat
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editorState.isParagraph ? 'is-active' : ''}
        >
          Paragraph
        </ButtonTextFormat>
        
        <ButtonTextFormat
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editorState.isBulletList ? 'is-active' : ''}
        >
          Bullet list
        </ButtonTextFormat>
        <ButtonTextFormat
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editorState.isOrderedList ? 'is-active' : ''}
        >
          Ordered list
        </ButtonTextFormat>
        <ButtonTextFormat
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editorState.isCodeBlock ? 'is-active' : ''}
        >
          Code block
        </ButtonTextFormat>
        <ButtonTextFormat
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editorState.isBlockquote ? 'is-active' : ''}
        >
          Blockquote
        </ButtonTextFormat>
        <ButtonTextFormat onClick={() => editor.chain().focus().setHorizontalRule().run()}>Horizontal rule</ButtonTextFormat>
        <ButtonTextFormat onClick={() => editor.chain().focus().setHardBreak().run()}>Hard break</ButtonTextFormat>
        <ButtonTextFormat onClick={() => editor.chain().focus().undo().run()} disabled={!editorState.canUndo}>
          Undo
        </ButtonTextFormat>
        <ButtonTextFormat onClick={() => editor.chain().focus().redo().run()} disabled={!editorState.canRedo}>
          Redo
        </ButtonTextFormat>
    </div>
  )
}

export const TipTapEditor: React.FC = () => {
  const editor = useEditor({
    extensions,
    content: `
<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That’s a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
`,
  })
  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  )
}