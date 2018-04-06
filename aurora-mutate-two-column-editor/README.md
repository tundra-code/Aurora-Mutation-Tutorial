# Aurora-mutate-two-column-editor
A mutation to have two column notes.

## Mutation declaration
In this mutation, we are mutating `ContentView`. Mutate `ContentView` anytime you want
to change the editor's appearance by including multiple editors or such. This will not change
the delete button, tags, or other parts of a note. `twoColumnContentView` refers to the
mutating function.
```
module.exports.mutations = {
  ContentView: twoColumnContentView
};
```

## Mutating function
This mutation is very similar to the original Aurora `ContentView` but basically splits
all the contents into a left and right and has two editors.

We'll start by looking at the `render` function:
```
render() {
  if (
    this.props.note &&
    this.props.note.mutationName === "TwoColumnEditor"
  ) {
    const { onChange, isLoadingContent, ...props } = this.props;
    return (
      <div className="two-column-editor">
        <div className="editor left-editor">
          <Editor
            className="Editor1"
            editorState={this.props.ourEditorState.left}
            onChange={this.onChangeLeft}
            placeholder={"Change me!"}
            {...props}
          />
        </div>
        <div className="editor right-editor">
          <Editor
            className="Editor2"
            editorState={this.props.ourEditorState.right}
            onChange={this.onChangeRight}
            placeholder={"Write Something!"}
            {...props}
          />
        </div>
      </div>
    );
  }
  return <ContentView {...this.props} />;
}
```
We first check to see if a note is selected and if it has our mutation name.
If not, then we just return the original `ContentView` letting other mutations take their
chance at rendering the note. This is how there can be multiple mutations of `ContentView`
and all still have the opportunity to render a note if it is indeed their type.

If the note is our mutation type, we return two editors. The `Editor` object should be taken
from the `api` variable. This ensures we are using the real `BaseEditor`, so we will get all
of its functionality and the functionality of any mutation that mutates `BaseEditor`.

Looking at the left editor specifically:
```
<Editor
  className="Editor1"
  editorState={this.props.ourEditorState.left}
  onChange={this.onChangeLeft}
  placeholder={"Change me!"}
  {...props}
/>
```
We pass in `...props`, which is all the props for this component minus `onChange` and `isLoadingContent`. We extract
`onChange` and `isLoadingContent` because we are modifying that behavior in our mutation.
```
const { onChange, isLoadingContent, ...props } = this.props;
```
This Editor's `editorState` is `this.props.ourEditorState.left` because we've designed editor state
for this mutation to be essentially a `JSON` object like such:
```
editorState = {
  left: draftjsEditorState,
  right: draftjsEditorState
}
```
You could design your mutation editor state to be whatever you like, you just have to be
consistent in your serialization and deSerialization and rendering of the states.
We also then have an `onChangeLeft` function for when this editor is changed.

We will now look at the `onChangeLeft` function:
```
onChangeLeft = state => {
  const editorState = this.props.ourEditorState;
  editorState.left = state;
  const serializedContent = serialize(editorState);
  const serializedPreview = serPreview(editorState);
  const searchableText = getSearchableText(editorState);

  this.props.onChange(
    editorState,
    serializedContent,
    serializedPreview,
    searchableText
  );
};
```
It takes in the new editor state of the left editor and thus updates `this.props.ourEditorState.left`.
We then pass this new state into our `serialize` functions (written in `util.js`, make sure to write these well!) to serialize content, preview, and searchable text.
Then we call the parent `this.props.onChange`, passing in the new values. This passes this data up the React hierarchy, allowing the Aurora app to handle the data changes.

We also need to have a function to handle the deserialization of content when a note is selected and loaded.
```
finishedLoadingContent = () => {
  this.props.note.getContent().then(content => {
    const editorState = deSerialize(content[this.props.note.mutationName]);
    this.props.onContentLoaded(editorState);
  });
};
```
This function just calls `note.getContent` and then deserializes it using our deserialization function.
Then it passes the new editor state in `this.props.onContentLoaded`, and Aurora takes care of the rest.

We also need to know when to call this `finishedLoadingContent` function, so we add:
```
componentDidUpdate(prevProps) {
  const contentLoaded =
    prevProps.isLoadingContent === true &&
    this.props.isLoadingContent === false &&
    this.props.note.mutationName === "TwoColumnEditor";
  if (contentLoaded) {
    this.finishedLoadingContent();
  }
}
```
Here, we just check if the previous state was loading content, we are no longer loading, and the selected
note has a mutation name that matches our mutation name. This is the conditions for `finishedLoadingContent`.

## Util.js
This file contains the serialization, deSerialize, preview, and searchable text functions. These functions are all pretty simple, but we'll look at a few for example.

`serialize` just serializes the left and right editor states separately and then joins them as a `JSON` object.
```
export function serialize(state) {
  return {
    left: serializeContent(state.left),
    right: serializeContent(state.right)
  };
}
```

`getSearchableText` just joins the raw text from the left and right editor states.
```
export function getSearchableText(state) {
  return (
    state.left.getCurrentContent().getPlainText() +
    state.right.getCurrentContent().getPlainText()
  );
}
```

### A note on css:
You must use regular `css`, no `styledComponents` in mutations. Not sure why, but it just doesn't work.
Regular old `css` for now.

## Editor Registry
If you are making a new type of editor/note (i.e. an editor you want to appear as an
option when creating a new note), then you must register this new editor with Aurora.
This is achieved by adding a new object to the `window.editors` object. Name this object
with your mutation name. It must have three objects:
1. `emptyEditorState`: this object is the editor state of an empty note of this type.
It will be rendered by the actual editor component. In our case, it is simply a json object
with two editor states (left and right) that are both editor states with no text.
2. `newNoteContent`: this object is the serialized form the content of a new note of this type.
It should be ready to be saved and then deserialized by the editor in `onContentLoaded`.
In our case, it is simply a serialized version of the left and right editor states.
3. `screenName`: what you want your editor to appear as in the options of new note types.

You must place this in code in the same file where the functions it calls exists.
In this example `emptyState` and `emptySerializedEditorState` exist in this function.
```
// Add this two column editor to global registry
window.editors.TwoColumnEditor = {
  emptyEditorState: emptyState(),
  newNoteContent: emptySerializedState(),
  screenName: "Two Column Note"
};
```

## Package.json Specifics
Note that when you create a new type of editor/note, you must include your editor name
in the `package.json` `keywords` section. This is the name that you used to register
with `window.editors`.
```
"keywords": [
  "aurora",
  "mutation",
  "TwoColumnEditor"
]
```
This is used when users are installing/uninstalling mutations so Aurora can alert them
if they might be removing a mutation that is used in one of their notes.
