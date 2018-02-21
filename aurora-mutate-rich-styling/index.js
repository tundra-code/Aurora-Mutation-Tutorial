import React from "react";
import styled from "styled-components";
import { RichUtils } from "draft-js";

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
        this.props.onChangeEx(newState);
        return "handled";
      }
      if (this.props.handleKeyCommand) {
        return this.props.handleKeyCommand(command, editorState);
      }
      return "not-handled";
    }

    render() {
      const { handleKeyCommand, ...props } = this.props;
      return (
        <Editor handleKeyCommand={this.handleKeyCommand} {...props}>
          {this.props.children}
        </Editor>
      );
    }
  };
}

module.exports.mutations = {
  BaseEditor: RichStyling
};
