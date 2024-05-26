import './App.css';
import { EditorProvider } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import BackgroundColor from './extensions/BackgroundColor';
import FontFamily from '@tiptap/extension-font-family';
import Underline from '@tiptap/extension-underline';
import Color from '@tiptap/extension-color';
import FontSize from './extensions/TextSize';
import ToolBar from './components/ToolBar';
import { useState } from 'react';
import Rules from './components/Rules';

const App = () => {
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [strikeThrough, setStrikeThrough] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [fontFamily, setFontFamily] = useState(false);
  const [fontSize, setFontSize] = useState(false);
  const [textColor, setTextColor] = useState(false);
  const [higlightColor, setHiglightColor] = useState(false);

  const extensions = [
    StarterKit,
    TextStyle,
    FontSize,
    Underline,
    FontFamily,
    Color,
    BackgroundColor
  ];

  const props = {
    attributes: {
      style: 'font-family: Monospace; font-size: 28px;'
    }
  }

  return (
    <>
      <div className="editor" spellCheck="false" onPaste={(e) => {e.preventDefault()}}>
        <EditorProvider
          slotAfter={
            <>
            <ToolBar
              allowBold={bold}
              allowItalic={italic}
              allowStrikeThrough={strikeThrough}
              allowUnderline={underline}
              allowFontFamily={fontFamily}
              allowFontSize={fontSize}
              allowTextColor={textColor}
              allowHiglightColor={higlightColor}
            />
            <Rules />
            </>
          }
          extensions={extensions}
          editorProps={props}
        />
      </div>
    </>
  )
}

export default App
