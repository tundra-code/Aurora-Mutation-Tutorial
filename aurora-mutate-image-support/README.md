# Aurora-mutate-image-support
Mutation that adds image support to editor.

## Mutating BaseEditor
To mutate `BaseEditor`, we put at the end of the file:
```
module.exports.mutations = {
  BaseEditor: Images
};
```
Where `Images` corresponds to the mutating function.

## Mutation function
The beginning of the mutation function matches the above mutation declaration.
```
function Images(Editor) {
  return class extends React.Component {
```
The `Editor` parameter is the `BaseEditor` we are mutating. We will use it in this new component.

The `render()` function returns the original `Editor` but with additional functionality
for handling key commands and key bindings. We also add the image plugin to the editor.
```
render() {
  let plugs = [];
  if (this.props.plugins) {
    plugs = this.props.plugins;
  }
  plugs.push(imagePlugin);

  const { handleKeyCommand, keyBindingFn, plugins, ...props } = this.props;
  return (
    <Editor
      plugins={plugs}
      handleKeyCommand={this.handleKeyCommand}
      keyBindingFn={this.keyBinding}
      {...props}
    />
  );
}
```
Note the line:
```
const { handleKeyCommand, keyBindingFn, ...props } = this.props;
```
This extracts the `handleKeyCommand` and `keyBindingFn` prop from all props.
We do this because we do not want the original `handleKeyCommand` an `keyBindingFn` functions to be called.
We are writing our own versions of these functions.

Next, let's look at our custom key binding:
```
keyBinding(e) {
  if (e.keyCode === 75 && hasCommandModifier(e)) {
    //command+k
    return "insert-image";
  }
  if (this.props.keyBindingFn) {
    return this.props.keyBindingFn(e);
  }
  return getDefaultKeyBinding(e);
}
```
We essentially check if `command+k` is pressed and return a string `insert-image` if so.
Otherwise, we run the key event through `this.props.keyBindingFn`, if it exists.
This allows there to be multiple mutations that add custom key bindings.

Now we can modify how we handle the key command.
```
handleKeyCommand(command, editorState) {
  if (command === "insert-image") {
    const selectionState = editorState.getSelection();
    const anchorKey = selectionState.getAnchorKey();
    const currentContent = editorState.getCurrentContent();
    const currentContentBlock = currentContent.getBlockForKey(anchorKey);
    const start = selectionState.getStartOffset();
    const end = selectionState.getEndOffset();
    const src = currentContentBlock.getText().slice(start, end);

    const newState = imagePlugin.addImage(editorState, src);
    this.props.onChange(newState);
    return "handled";
  }
  if (this.props.handleKeyCommand) {
    return this.props.handleKeyCommand(command, editorState);
  }
  return "not-handled";
}
```
If the command is `insert-image`, we extract the selected text (complicated, I know) and inserts an image
using the draftjs image plugin. It then calls `this.props.onChange` to pass in the new state.
Otherwise, we let `this.props.handleKeyCommand` handle it, if it exists.

### Toolbar
We want the functionality of `command+k` to be in the Aurora toolbar, so we register it:
```
window.toolbar.buttons.push({
  icon: "🖼️",
  command: "insert-image",
  hint: "Insert image in place of selected URL/filepath"
});
```
The `command` must match the command we use in `handleKeyCommand`.


### Other
Don't forget to bind functions in the constructor:
```
constructor(props) {
  super(props);
  this.handleKeyCommand = this.handleKeyCommand.bind(this);
  this.keyBinding = this.keyBinding.bind(this);
}
```
