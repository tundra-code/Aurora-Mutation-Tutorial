# Aurora-mutate-rich-styling
Mutation that adds rich styling to the base editor.

## Mutating BaseEditor
To mutate `BaseEditor`, we put at the end of the file:
```
module.exports.mutations = {
  BaseEditor: RichStyling
};
```
Where `RichStyling` corresponds to the mutating function.

## Mutation function
The beginning of the mutation function matches the above mutation declaration.
```
function RichStyling(Editor) {
  return class extends React.Component {
```
The `Editor` parameter is the `BaseEditor` we are mutating. We will use it in this new component.

The `render()` function simply returns our original editor but with an additional function.
```
render() {
  const { handleKeyCommand, ...props } = this.props;
  return (
    <Editor handleKeyCommand={this.handleKeyCommand} {...props}>
      {this.props.children}
    </Editor>
  );
}
```
We pass in an additional prop for `handleKeyCommand`, which we will write to include rich styling.
Note the line:
```
const { handleKeyCommand, ...props } = this.props;
```
This extracts the `handleKeyCommand` prop from all props, if it exists.
We do this because we do not want the original `handleKeyCommand` function to be called.
We are writing our own version of this function.

Next, we write our `handleKeyCommand` function.
```
handleKeyCommand(command, editorState) {
  const newState = RichUtils.handleKeyCommand(editorState, command);
  if (newState) {
    this.props.onChangeEx(newState);
    return "handled";
  }
  if (this.props.handleKeyCommand) {
    return this.props.handleKeyCommand(command, editorState);
  }
  return "not-handled";
}
```
This function takes in the command and current editor state and modifies it using
the `draftjs` `RichUtils`. With the new state, we can pass it into `this.props.onChangeEx`.
For editors, we call this function when the editors state changes. It also takes the additional parameters
of updated `serializedContent`, `serializedPreview`, and `searchableText`. But in our case, changing
the styling does not affect any of these items, so we can omit them.

If our rich styling does not handle the key command, we want to make sure that the original
`handleKeyCommand` function of the editor we mutated has a chance to handle it. This allows for
multiple mutations of `BaseEditor` to handle different key commands and be layered. We achieve this by:
```
if (this.props.handleKeyCommand) {
  return this.props.handleKeyCommand(command, editorState);
}
```
In general, anytime you replace a prop function, inside your new function, you should
check to see if that function exists and execute it if it makes sense. This is how
functionality can be layered between mutations.

Finally, don't forget to bind the function!
```
this.handleKeyCommand = this.handleKeyCommand.bind(this);
```
