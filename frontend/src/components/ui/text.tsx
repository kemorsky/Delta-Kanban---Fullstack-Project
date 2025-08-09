  import { TextStyleKit } from '@tiptap/extension-text-style'
  import type { Editor } from '@tiptap/react'
  import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
  import Underline from '@tiptap/extension-underline'
  import StarterKit from '@tiptap/starter-kit'
  import React from 'react'
  import { ButtonTextFormat } from './button'
  import { Bold, Heading1, Heading2, Heading3, ItalicIcon, ListCheck, ListOrdered, Strikethrough, UnderlineIcon, Undo, Redo, Code, RulerDimensionLine } from 'lucide-react'
  import { ListItem, BulletList, OrderedList } from '@tiptap/extension-list'

  const extensions = [TextStyleKit, 
                      StarterKit.configure({
                        bulletList: false, // disable StarterKit's default so I can add my own
                        orderedList: false,
                        listItem: false}), 
                      ListItem,
                      BulletList,
                      OrderedList,
                      Underline]

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
          isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
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
                    <Heading1 />
                </span>
            </ButtonTextFormat>
            <ButtonTextFormat
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editorState.isHeading2 ? 'is-active' : ''}
            >
                <span className="flex items-center justify-center">
                    <Heading2 />
                </span>
            </ButtonTextFormat>
            <ButtonTextFormat
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={editorState.isHeading3 ? 'is-active' : ''}
            >
                <span className="flex items-center justify-center">
                    <Heading3 />
                </span>
            </ButtonTextFormat>
          </section>
          <section className="px-2 flex gap-1 border-r border-gray-300">
            <ButtonTextFormat
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editorState.canBold}
              className={editorState.isBold ? 'is-active' : ''}>
                <span className="flex items-center justify-center">
                    <Bold/>
                </span>
            </ButtonTextFormat>
            <ButtonTextFormat 
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editorState.canItalic}
              className={editorState.isItalic ? 'is-active' : ''}>                
                <span className="flex items-center justify-center">
                    <ItalicIcon/>
                </span>
            </ButtonTextFormat>
            <ButtonTextFormat onClick={() => editor.chain().focus().toggleUnderline().run()}>               
                <span className="flex items-center justify-center">
                    <UnderlineIcon/>
                </span>
            </ButtonTextFormat>
            <ButtonTextFormat
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editorState.canStrike}
              className={editorState.isStrike ? 'is-active' : ''}>          
                <span className="flex items-center justify-center">
                    <Strikethrough/>
                </span>
            </ButtonTextFormat>
        </section>
        <section className="px-2 flex gap-1 border-r border-gray-300">
          <ButtonTextFormat
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'is-active' : ''}
          >
            <span className="flex items-center justify-center">
              <ListCheck/>
            </span>
          </ButtonTextFormat>
          <ButtonTextFormat
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('orderedList') ? 'is-active' : ''}
          >
            <span className="flex items-center justify-center">
              <ListOrdered/>
            </span>
          </ButtonTextFormat>
          <ButtonTextFormat
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editorState.isCodeBlock ? 'is-active' : ''}
          >
            <span className="flex items-center justify-center">
              <Code/>
            </span>            
          </ButtonTextFormat>
          <ButtonTextFormat onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            <span className="flex items-center justify-center">
              <RulerDimensionLine/>
            </span>
          </ButtonTextFormat>
        </section>
        <section className="px-2 flex gap-1">
          <ButtonTextFormat onClick={() => editor.chain().focus().undo().run()} disabled={!editorState.canUndo}>
            <span className="flex items-center justify-center">
              <Undo/>
            </span>
          </ButtonTextFormat>
          <ButtonTextFormat onClick={() => editor.chain().focus().redo().run()} disabled={!editorState.canRedo}>
            <span className="flex items-center justify-center">
              <Redo/>
            </span>
          </ButtonTextFormat>
        </section>
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