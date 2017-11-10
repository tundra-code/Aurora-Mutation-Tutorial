import React from "react";
import styled from "styled-components";

const purple = `
  color: #8B008D;
`;

function purpleEditor(Editor) {
  return class extends React.Component {
    render() {
      return (
        <Editor>
          <purple />
          {this.props.children}
        </Editor>
      );
    }
  };
}

module.exports.mutations = {
  Editor: purpleEditor
};
