import React from 'react';
import { useCurrentEditor } from '@tiptap/react';

const fontFamilies = [
  'Monospace',
  'Wingdings',
  'Times New Roman'
];

const fontSizes = Array.from({ length: 10 }, (_, i) => `${Math.pow(i, 2)}px`);
fontSizes.splice(6, 0, '28px');

const colors = [
  {
    label: 'Defualt',
    value: 'None'
  }, {
    label: 'Black',
    value: '#000'
  }, {
    label: 'Gray',
    value: '#777'
  }, {
    label: 'White',
    value: '#fff'
  }, {
    label: 'Red',
    value: '#f00'
  }, {
    label: 'Green',
    value: '#0f0'
  }, {
    label: 'Blue',
    value: '#00f'
  }
];

interface ToolBarProps {
  allowBold?: boolean,
  allowItalic?: boolean,
  allowStrikeThrough?: boolean,
  allowUnderline?: boolean,
  allowFontFamily?: boolean,
  allowFontSize?: boolean,
  allowTextColor?: boolean,
  allowHiglightColor?: boolean
}

const ToolBar: React.FC<ToolBarProps> = (props) => {
  const editor = useCurrentEditor().editor;

  const handleFontFamilyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    editor?.chain().focus().setFontFamily(event.target.value).run();
  };

  const handleFontSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    editor?.chain().focus().setFontSize(event.target.value).run();
  };

  const handleTextColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    value === 'None' ?
    editor?.chain().focus().unsetColor().run() :
    editor?.chain().focus().setColor(value).run();
  };

  const handleHighlightColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    value === 'None' ?
    editor?.chain().focus().unsetColor().run() :
    editor?.chain().focus().setBackgroundColor(event.target.value).run();
  };

  return Object.values(props).some(value => value) && (
    <div className="toolbar" aria-hidden>
      {props.allowBold && <button
        onClick={() => editor?.chain().focus().toggleBold().run()}
        className={editor?.isActive('bold') ? 'active' : ''}
      >
        Bold
      </button>}

      {props.allowItalic && <button
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        className={editor?.isActive('italic') ? 'active' : ''}
      >
        Italic
      </button>}

      {props.allowStrikeThrough && <button
        onClick={() => editor?.chain().focus().toggleStrike().run()}
        className={editor?.isActive('strike') ? 'active' : ''}
      >
        Strike Through
      </button>}

      {props.allowUnderline && <button
        onClick={() => editor?.chain().focus().toggleUnderline().run()}
        className={editor?.isActive('underline') ? 'active' : ''}
      >
        Underline
      </button>}

      {props.allowFontFamily && <select value={0} onChange={handleFontFamilyChange}>
        <option hidden>Font Family</option>
        {fontFamilies.map(family => (
          <option key={family} value={family}>
            {family}
          </option>
        ))}
      </select>}

      {props.allowFontSize && <select value={0} onChange={handleFontSizeChange}>
        <option hidden>Font Size</option>
        {fontSizes.map(size => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>}

      {props.allowTextColor && <select value={0} onChange={handleTextColorChange}>
        <option hidden>Text Color</option>
        {colors.map(color => (
          <option key={color.value} value={color.value}>
            {color.label}
          </option>
        ))}
      </select>}

      {props.allowHiglightColor && <select value={0} onChange={handleHighlightColorChange}>
        <option hidden>Highlight Color</option>
        {colors.map(color => (
          <option key={color.value} value={color.value}>
            {color.label}
          </option>
        ))}
      </select>}
    </div>
  );
};

export default ToolBar;
