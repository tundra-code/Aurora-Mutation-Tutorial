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
      return "not-handled";
    }

    render() {
      return (
        <Editor {...this.props} handleKeyCommand={this.handleKeyCommand}>
          {this.props.children}
        </Editor>
      );
    }
  };
}

module.exports.mutations = {
  BaseEditor: RichStyling
};
