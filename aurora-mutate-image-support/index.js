import createImagePlugin from "draft-js-image-plugin";
import React from "react";
import styled from "styled-components";

const imagePlugin = createImagePlugin();

function Images(BaseEditor) {
  const MyEditor = ({ editorState, onChange }) => (
    <BaseEditor
      editorState={editorState}
      onChange={onChange}
      plugins={[imagePlugin]}
    >
      {this.props.children}
    </BaseEditor>
  );
}

module.exports.mutations = {
  BaseEditor: Images
};
