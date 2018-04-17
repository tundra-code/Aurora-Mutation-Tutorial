import createImagePlugin from "draft-js-image-plugin";
import React from "react";
import { getDefaultKeyBinding, KeyBindingUtil } from "draft-js";
import "draft-js-image-plugin/lib/plugin.css";
import { composeDecorators } from "draft-js-plugins-editor";
import createResizeablePlugin from "draft-js-resizeable-plugin";
import createFocusPlugin from "draft-js-focus-plugin";
import createAlignmentPlugin from "draft-js-alignment-plugin";
import createBlockDndPlugin from "draft-js-drag-n-drop-plugin";

const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const alignmentPlugin = createAlignmentPlugin();
const { AlignmentTool } = alignmentPlugin;

const decorator = composeDecorators(
  resizeablePlugin.decorator,
  alignmentPlugin.decorator,
  focusPlugin.decorator,
  blockDndPlugin.decorator
);
const imagePlugin = createImagePlugin({ decorator });

const { hasCommandModifier } = KeyBindingUtil;

function Images(Editor) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleKeyCommand = this.handleKeyCommand.bind(this);
      this.keyBinding = this.keyBinding.bind(this);
    }

    handleKeyCommand(command, editorState) {
      if (command === "insert-image") {
        const selectionState = editorState.getSelection();
        if (!selectionState.getHasFocus()) {
          return;
        }
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
      let plugs = [];
      if (this.props.plugins) {
        plugs = this.props.plugins;
      }
      plugs.push(imagePlugin);
      plugs.push(focusPlugin);
      plugs.push(resizeablePlugin);
      plugs.push(blockDndPlugin);
      plugs.push(alignmentPlugin);

      const { handleKeyCommand, keyBindingFn, plugins, ...props } = this.props;
      return (
        <div>
          <Editor
            plugins={plugs}
            handleKeyCommand={this.handleKeyCommand}
            keyBindingFn={this.keyBinding}
            {...props}
          />
        </div>
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
