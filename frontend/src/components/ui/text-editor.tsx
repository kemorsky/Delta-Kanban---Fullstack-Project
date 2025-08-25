import type { Editor } from '@tiptap/react'
import { useEditorState } from '@tiptap/react'
import { ButtonTextFormat } from './button'
import { Bold, Heading1, Heading2, Heading3, ItalicIcon, ListCheck, ListOrdered, Strikethrough, UnderlineIcon, Undo, Redo, Code, RulerDimensionLine } from 'lucide-react'
import { ButtonTextFormatIcon, ButtonTextFormatTipTop } from './button-text-format-icon'

export default function TextEditor({ editor }: { editor: Editor }) {
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
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      }
    },
  })

  return (
    <div className="control-group bg-primary border border-[#1F2937] border-b-gray-300 rounded-t p-2 flex flex-wrap items-center justify-start">
        <section className="pr-2 flex gap-1 border-r border-gray-300">
          <ButtonTextFormat
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={editorState.isHeading1 ? 'is-active' : ''}>
              <ButtonTextFormatIcon>
                <ButtonTextFormatTipTop className='w-[5rem]'>Heading 1</ButtonTextFormatTipTop >
                <Heading1 />
              </ButtonTextFormatIcon>
          </ButtonTextFormat>
          <ButtonTextFormat
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editorState.isHeading2 ? 'is-active' : ''}>
              <ButtonTextFormatIcon>
                <ButtonTextFormatTipTop className='w-[5rem]'>Heading 2</ButtonTextFormatTipTop >
                <Heading2 />
              </ButtonTextFormatIcon>
          </ButtonTextFormat>
          <ButtonTextFormat
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={editorState.isHeading3 ? 'is-active' : ''}>
              <ButtonTextFormatIcon>
                <ButtonTextFormatTipTop className='w-[5rem]'>Heading 3</ButtonTextFormatTipTop >
                <Heading3 />
              </ButtonTextFormatIcon>
          </ButtonTextFormat>
        </section>
        <section className="px-2 flex gap-1 border-r border-gray-300">
          <ButtonTextFormat
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editorState.canBold}
            className={editorState.isBold ? 'is-active' : ''}>
              <ButtonTextFormatIcon>
                <ButtonTextFormatTipTop>Bold</ButtonTextFormatTipTop >
                <Bold />
              </ButtonTextFormatIcon>
          </ButtonTextFormat>
          <ButtonTextFormat 
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editorState.canItalic}
            className={editorState.isItalic ? 'is-active' : ''}>                
              <ButtonTextFormatIcon>
                <ButtonTextFormatTipTop>Italic</ButtonTextFormatTipTop >
                <ItalicIcon />
              </ButtonTextFormatIcon>
          </ButtonTextFormat>
          <ButtonTextFormat onClick={() => editor.chain().focus().toggleUnderline().run()}>               
              <ButtonTextFormatIcon>
                <ButtonTextFormatTipTop>Underline</ButtonTextFormatTipTop >
                <UnderlineIcon />
              </ButtonTextFormatIcon>
          </ButtonTextFormat>
          <ButtonTextFormat
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editorState.canStrike}
            className={editorState.isStrike ? 'is-active' : ''}>          
              <ButtonTextFormatIcon>
                <ButtonTextFormatTipTop>Strikethrough</ButtonTextFormatTipTop >
                <Strikethrough />
              </ButtonTextFormatIcon>
          </ButtonTextFormat>
          <ButtonTextFormat onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <ButtonTextFormatIcon>
            <ButtonTextFormatTipTop>Line</ButtonTextFormatTipTop >
            <RulerDimensionLine />
          </ButtonTextFormatIcon>
        </ButtonTextFormat>
      </section>
      <section className="px-2 flex gap-1 border-r border-gray-300">
        <ButtonTextFormat
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editorState.isBulletList ? 'is-active' : ''}>
          <ButtonTextFormatIcon>
            <ButtonTextFormatTipTop className='w-[5rem]'>Bullet List</ButtonTextFormatTipTop >
            <ListCheck />
          </ButtonTextFormatIcon>
        </ButtonTextFormat>
        <ButtonTextFormat
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editorState.isOrderedList ? 'is-active' : ''}>
          <ButtonTextFormatIcon>
            <ButtonTextFormatTipTop className='w-[6rem]'>Ordered List</ButtonTextFormatTipTop >
            <ListOrdered />
          </ButtonTextFormatIcon>
        </ButtonTextFormat>
        <ButtonTextFormat
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editorState.isCodeBlock ? 'is-active' : ''}>
          <ButtonTextFormatIcon>
            <ButtonTextFormatTipTop>Code</ButtonTextFormatTipTop >
            <Code />
          </ButtonTextFormatIcon>           
        </ButtonTextFormat>
      </section>
      <section className="pl-2 flex gap-1">
        <ButtonTextFormat onClick={() => editor.chain().focus().undo().run()}>
          <ButtonTextFormatIcon>
            <ButtonTextFormatTipTop>Undo</ButtonTextFormatTipTop >
            <Undo />
          </ButtonTextFormatIcon>
        </ButtonTextFormat>
        <ButtonTextFormat onClick={() => editor.chain().focus().redo().run()}>
          <ButtonTextFormatIcon>
            <ButtonTextFormatTipTop>Redo</ButtonTextFormatTipTop >
            <Redo />
          </ButtonTextFormatIcon>
        </ButtonTextFormat>
      </section>
    </div>
  )
}