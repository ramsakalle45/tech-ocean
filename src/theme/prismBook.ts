import type {PrismTheme} from 'prism-react-renderer';

/**
 * Syntax highlighting in the book's palette.
 *
 * The stock Prism themes fail WCAG AA against the parchment plate, and they
 * do not belong to this book. These two are written for it: warm, ink-dark
 * tones on paper, and lamplight tones on the candlelight plate.
 */

export const bookLight: PrismTheme = {
  plain: {
    color: '#3a2d20',
    backgroundColor: '#fbf6e8',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {color: '#6b6257', fontStyle: 'italic'},
    },
    {types: ['punctuation'], style: {color: '#6b6257'}},
    {
      types: ['property', 'tag', 'boolean', 'number', 'constant', 'symbol', 'deleted'],
      style: {color: '#1f5f8b'},
    },
    {
      types: ['selector', 'attr-name', 'string', 'char', 'builtin', 'inserted'],
      style: {color: '#4a5d23'},
    },
    {types: ['operator', 'entity', 'url'], style: {color: '#6b6257'}},
    {types: ['atrule', 'attr-value', 'keyword'], style: {color: '#9a3412'}},
    {types: ['function', 'class-name'], style: {color: '#6b3fa0'}},
    {types: ['regex', 'important', 'variable'], style: {color: '#8a5a00'}},
  ],
};

export const bookDark: PrismTheme = {
  plain: {
    color: '#e8dcc2',
    backgroundColor: '#241c15',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {color: '#9b8f7e', fontStyle: 'italic'},
    },
    {types: ['punctuation'], style: {color: '#b0a596'}},
    {
      types: ['property', 'tag', 'boolean', 'number', 'constant', 'symbol', 'deleted'],
      style: {color: '#f5c07a'},
    },
    {
      types: ['selector', 'attr-name', 'string', 'char', 'builtin', 'inserted'],
      style: {color: '#b8e994'},
    },
    {types: ['operator', 'entity', 'url'], style: {color: '#b0a596'}},
    {types: ['atrule', 'attr-value', 'keyword'], style: {color: '#ff9e64'}},
    {types: ['function', 'class-name'], style: {color: '#d7aefb'}},
    {types: ['regex', 'important', 'variable'], style: {color: '#f5c07a'}},
  ],
};
