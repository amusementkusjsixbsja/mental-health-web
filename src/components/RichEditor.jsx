import { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import '@wangeditor/editor/dist/css/style.css'

const toolbarConfig = {
  toolbarKeys: [
    'headerSelect',
    'bold',
    'italic',
    'underline',
    'through',
    'bulletedList',
    'numberedList',
    'blockquote',
    'insertLink',
    'insertImage',
    'clearStyle',
  ],
}

const editorConfig = {
  placeholder: '请输入文章内容...',
  maxLength: 5000,
}

const RichEditor = ({ onChange }) => {
  const [editor, setEditor] = useState(null)

  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  return (
    <div className="editor-wrapper">
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        style={{ borderBottom: '1px solid #d9d9d9' }}
      />
      <Editor
        defaultConfig={editorConfig}
        onCreated={setEditor}
        onChange={editor => onChange(editor.getHtml())}
        mode="default"
        style={{ height: 300, overflowY: 'hidden' }}
      />
    </div>
  )
}

export default RichEditor
