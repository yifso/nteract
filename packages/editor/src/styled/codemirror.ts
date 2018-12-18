import styled from "styled-components";

import codeMirrorCSS from "../vendored/codemirror";
import showHintCSS from "../vendored/show-hint";

export const CodeMirrorContainer = styled.div`
  ${codeMirrorCSS}
  ${showHintCSS}

    /* completions styles */
    .CodeMirror {
    height: 100%;
  }

  .CodeMirror-hint {
    padding-left: 0;
    border-bottom: none;
  }

  .completion-type {
    background: transparent;
    border: transparent 1px solid;
    width: 17px;
    height: 17px;
    margin: 0;
    padding: 0;
    display: inline-block;
    margin-right: 5px;
    top: 18px;
  }

  .completion-type:before {
    content: "?";
    bottom: 1px;
    left: 4px;
    position: relative;
  }
  /* color and content for each type of completion */
  .completion-type-keyword:before {
    content: "K";
  }
  .completion-type-keyword {
    background-color: darkred;
  }

  .completion-type-class:before {
    content: "C";
  }
  .completion-type-class {
    background-color: blueviolet;
  }

  .completion-type-module:before {
    content: "M";
  }
  .completion-type-module {
    background-color: chocolate;
  }

  .completion-type-statement:before {
    content: "S";
  }
  .completion-type-statement {
    background-color: forestgreen;
  }

  .completion-type-function:before {
    content: "ƒ";
  }
  .completion-type-function {
    background-color: yellowgreen;
  }

  .completion-type-instance:before {
    content: "I";
  }
  .completion-type-instance {
    background-color: teal;
  }

  .completion-type-null:before {
    content: "ø";
  }
  .completion-type-null {
    background-color: black;
  }

  /* end completion type color and content */

  /*
    Codemirror
 */

  .CodeMirror {
    font-family: "Source Code Pro";
    font-size: 14px;
    line-height: 20px;

    height: auto;

    background: none;
  }

  .CodeMirror-cursor {
    border-left-width: 1px;
    border-left-style: solid;
    border-left-color: var(--cm-color, black);
  }

  .CodeMirror-scroll {
    overflow-x: auto !important;
    overflow-y: hidden !important;
    width: 100%;
  }

  .CodeMirror-lines {
    padding: 0.4em;
  }

  .CodeMirror-linenumber {
    padding: 0 8px 0 4px;
  }

  .CodeMirror-gutters {
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }

  .cm-s-composition.CodeMirror {
    font-family: "Source Code Pro", monospace;
    letter-spacing: 0.3px;
    word-spacing: 0px;
    background: var(--cm-background, #fafafa);
    color: var(--cm-color, black);
  }
  .cm-s-composition .CodeMirror-lines {
    padding: 10px;
  }
  .cm-s-composition .CodeMirror-gutters {
    background-color: var(--cm-gutter-bg, white);
    padding-right: 10px;
    z-index: 3;
    border: none;
  }

  .cm-s-composition span.cm-comment {
    color: var(--cm-comment, #a86);
  }
  .cm-s-composition span.cm-keyword {
    line-height: 1em;
    font-weight: bold;
    color: var(--cm-keyword, blue);
  }
  .cm-s-composition span.cm-string {
    color: var(--cm-string, #a22);
  }
  .cm-s-composition span.cm-builtin {
    line-height: 1em;
    font-weight: bold;
    color: var(--cm-builtin, #077);
  }
  .cm-s-composition span.cm-special {
    line-height: 1em;
    font-weight: bold;
    color: var(--cm-special, #0aa);
  }
  .cm-s-composition span.cm-variable {
    color: var(--cm-variable, black);
  }
  .cm-s-composition span.cm-number,
  .cm-s-composition span.cm-atom {
    color: var(--cm-number, #3a3);
  }
  .cm-s-composition span.cm-meta {
    color: var(--cm-meta, #555);
  }
  .cm-s-composition span.cm-link {
    color: var(--cm-link, #3a3);
  }
  .cm-s-composition span.cm-operator {
    color: var(--cm-operator, black);
  }
  .cm-s-composition span.cm-def {
    color: var(--cm-def, black);
  }
  .cm-s-composition .CodeMirror-activeline-background {
    background: var(--cm-activeline-bg, #e8f2ff);
  }
  .cm-s-composition .CodeMirror-matchingbracket {
    border-bottom: 1px solid var(--cm-matchingbracket-outline, grey);
    color: var(--cm-matchingbracket-color, black) !important;
  }

  /* Overwrite some of the hint Styling */

  .CodeMirror-hints {
    -webkit-box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.2);
    box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.2);
    border-radius: 0px;
    border: none;
    padding: 0;

    background: var(--cm-hint-bg, white);
    font-size: 90%;
    font-family: "Source Code Pro", monospace;

    z-index: 9001;

    overflow-y: auto;
  }

  .CodeMirror-hint {
    border-radius: 0px;
    white-space: pre;
    cursor: pointer;
    color: var(--cm-hint-color, black);
  }

  li.CodeMirror-hint-active {
    background: var(--cm-hint-bg-active, #abd1ff);
    color: var(--cm-hint-color-active, black);
  }

  .initialTextAreaForCodeMirror {
    font-family: "Source Code Pro", "Monaco", monospace;
    font-size: 14px;
    line-height: 20px;

    height: inherit;

    background: none;

    border: none;
    overflow: hidden;

    -webkit-scrollbar: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    width: 100%;
    resize: none;
    padding: 10px 0 5px 10px;
    letter-spacing: 0.3px;
    word-spacing: 0px;
  }

  .initialTextAreaForCodeMirror:focus {
    outline: none;
    border: none;
  }
`;
