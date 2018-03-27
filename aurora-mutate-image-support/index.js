import createImagePlugin from "draft-js-image-plugin";
import React from "react";
import { getDefaultKeyBinding, KeyBindingUtil } from "draft-js";

const { hasCommandModifier } = KeyBindingUtil;

const imagePlugin = createImagePlugin();

function Images(Editor) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleKeyCommand = this.handleKeyCommand.bind(this);
      this.keyBinding = this.keyBinding.bind(this);
    }

    componentDidUpdate(prevProps) {
      const simulatedKeyCommand =
        prevProps.simulatedKeyCommand === null &&
        this.props.simulatedKeyCommand !== null;
      if (simulatedKeyCommand) {
        this.handleKeyCommand(
          this.props.simulatedKeyCommand,
          this.props.ourEditorState
        );
      }
    }

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

    render() {
      let plugins = [];
      if (this.props.plugins) {
        plugins = this.props.plugins;
      }
      plugins.push(imagePlugin);

      const {
        handleKeyCommand,
        keyBindingFn,
        simulatedKeyCommand,
        ...props
      } = this.props;
      return (
        <Editor
          plugins={plugins}
          handleKeyCommand={this.handleKeyCommand}
          keyBindingFn={this.keyBinding}
          {...props}
        />
      );
    }
  };
}

window.toolbar.buttons.push({
  icon: "🖼️",
  command: "insert-image",
  hint: "Insert image in place of selected URL/filepath"
});

module.exports.mutations = {
  BaseEditor: Images
};
