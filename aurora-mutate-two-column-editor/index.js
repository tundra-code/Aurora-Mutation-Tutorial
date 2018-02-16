import styled from "styled-components";
import React from "react";
import { deSerialize, serialize, serPreview } from "./util";
import { Editor } from "draft-js";

const EditorDiv = styled.div`
  display: inline-block;
  width: 50%;
  top: 0;
`;

function twoColumnContentView(ContentView, api) {
  return class extends React.Component {
    componentDidUpdate(prevProps) {
      const contentLoaded =
        prevProps.isLoadingContent === true &&
        this.props.isLoadingContent === false &&
        this.props.note.mutationName === "TwoColumnEditor";
      if (contentLoaded) {
        this.finishedLoadingContent();
      }
    }

    finishedLoadingContent = () => {
      this.props.note.getContent().then(content => {
        const editorState = deSerialize(content[this.props.note.mutationName]);
        if (this.props.onContentLoaded) {
          this.props.onContentLoaded(editorState);
        }
      });
    };

    onChangeRight = state => {
      const editorState = this.props.ourEditorState;
      editorState.right = state;
      const serializedContent = serialize(editorState);
      const serializedPreview = serPreview(editorState);

      if (this.props.onChangeEx) {
        this.props.onChangeEx(
          editorState,
          serializedContent,
          serializedPreview
        );
      }
    };

    onChangeLeft = state => {
      const editorState = this.props.ourEditorState;
      editorState.left = state;
      const serializedContent = serialize(editorState);
      const serializedPreview = serPreview(editorState);

      if (this.props.onChangeEx) {
        this.props.onChangeEx(
          editorState,
          serializedContent,
          serializedPreview
        );
      }
    };

    onBlur = () => {
      if (this.props.onBlurEx) {
        this.props.onBlurEx();
      }
    };

    render() {
      if (
        this.props.note &&
        this.props.note.mutationName === "TwoColumnEditor"
      ) {
        return (
          <div>
            <EditorDiv>
              <Editor
                className="Editor1"
                editorState={this.props.ourEditorState.left}
                onChange={this.onChangeLeft}
                onBlur={this.onBlur}
                placeholder={"Change me!"}
              />
            </EditorDiv>
            <EditorDiv>
              <Editor
                className="Editor2"
                editorState={this.props.ourEditorState.right}
                onChange={this.onChangeRight}
                onBlur={this.onBlur}
                placeholder={"Write Something!"}
              />
            </EditorDiv>
          </div>
        );
      }
      return <ContentView {...this.props} />;
    }
  };
}

module.exports.mutations = {
  ContentView: twoColumnContentView
};
