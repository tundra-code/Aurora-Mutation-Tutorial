import React from "react";
import styled from "styled-components";
import { RichUtils } from "draft-js";
import createInlineToolbarPlugin from "draft-js-inline-toolbar-plugin";
import "draft-js-inline-toolbar-plugin/lib/plugin.css";

// add inline toolbar for styling
const inlineToolbarPlugin = createInlineToolbarPlugin();
const { InlineToolbar } = inlineToolbarPlugin;

function RichStyling(Editor) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleKeyCommand = this.handleKeyCommand.bind(this);
    }

    // rich styling here
    handleKeyCommand(command, editorState) {
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        this.props.onChange(newState);
        return "handled";
      }
      // call original handleKeyCommand function if we don't handle it.
      if (this.props.handleKeyCommand) {
        return this.props.handleKeyCommand(command, editorState);
      }
      return "not-handled";
    }

    render() {
      // add our plugin to existing list of plugins
      let plugs = [];
      if (this.props.plugins) {
        plugs = this.props.plugins;
      }
      plugs.push(inlineToolbarPlugin);

      // extract handleKeyCommand prop because we want to replace it with our own.
      const { handleKeyCommand, plugins, ...props } = this.props;
      return (
        <div>
          <Editor
            handleKeyCommand={this.handleKeyCommand}
            plugins={plugs}
            {...props}
          />
          <InlineToolbar />
        </div>
      );
    }
  };
}

module.exports.mutations = {
  BaseEditor: RichStyling
};
