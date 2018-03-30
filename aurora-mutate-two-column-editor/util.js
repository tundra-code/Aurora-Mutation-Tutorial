/**
 * A collection of utilities for working with Draft-js and editors in general
 */
import {
  EditorState,
  ContentState,
  convertToRaw,
  convertFromRaw
} from "draft-js";

// ------------------- copied stuff ------------------------
//
const MAX_PREVIEW_LENGTH = 40;

function formatText(text) {
  const newText = text ? text : "New Note";
  const formattedText =
    newText.length > MAX_PREVIEW_LENGTH
      ? newText.substring(0, MAX_PREVIEW_LENGTH - 3) + "..."
      : newText;
  return formattedText;
}

function serializePreview(editorState) {
  if (editorState === null) {
    return { text: "No preview" };
  }
  const text = editorState.getCurrentContent().getFirstBlock().text;
  return { text: formatText(text) };
}

/**
 * Serializes "content" of this editor so it can be saved.
 */
function serializeContent(editorState) {
  return {
    contentState: convertToRaw(editorState.getCurrentContent())
  };
}

/**
 * Returns an EditorState with the text already typed out for you!
 */
const editorStateFromText = text =>
  EditorState.createWithContent(ContentState.createFromText(text));

function emptyEditorState() {
  return EditorState.createEmpty();
}

const emptySerializedEditorState = () => {
  return serializeContent(emptyEditorState());
};

/**
 * Deserializes "content" of this editor so it can be loaded in.
 */
function deSerializeContent(content) {
  const contentState = convertFromRaw(content.contentState);
  let editorState = EditorState.createWithContent(contentState);
  // Note that the "moveSelectionToEnd" is required to fix errors
  // that put the cursor in the front instead of at the end when clicked on.
  editorState = EditorState.moveSelectionToEnd(
    EditorState.createWithContent(editorState.getCurrentContent())
  );
  return editorState;
}

// ----------------- non copied stuff ------------------------

export function deSerialize(content) {
  return {
    left: deSerializeContent(content.left),
    right: deSerializeContent(content.right)
  };
}

export function serialize(state) {
  return {
    left: serializeContent(state.left),
    right: serializeContent(state.right)
  };
}

export function serPreview(state) {
  return serializePreview(state.left);
}

function emptyState() {
  return {
    left: emptyEditorState(),
    right: emptyEditorState()
  };
}

function emptySerializedState() {
  return serialize(emptyState());
}

export function getSearchableText(state) {
  return (
    state.left.getCurrentContent().getPlainText() +
    state.right.getCurrentContent().getPlainText()
  );
}

// Add this two column editor to global registry
window.editors.TwoColumnEditor = {
  emptyEditorState: emptyState(),
  newNoteContent: emptySerializedState(),
  screenName: "Two Column Note"
};
