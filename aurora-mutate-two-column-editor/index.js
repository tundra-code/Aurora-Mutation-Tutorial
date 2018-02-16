import styled from "styled-components";
import React from "react";
import { deSerialize, serialize, serPreview } from "./util";

function twoColumnContentView(ContentView, api) {
  return class extends React.Component {
    componentDidUpdate(prevProps) {
      const contentLoaded =
        prevProps.isLoadingContent === true &&
        this.props.isLoadingContent === false;
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
            <api.Editor
              className="Editor1"
              editorState={this.props.ourEditorState.left}
              onChange={this.onChangeLeft}
              onBlur={this.onBlur}
            />
            <api.Editor
              className="Editor2"
              editorState={this.props.ourEditorState.right}
              onChange={this.onChangeRight}
              onBlur={this.onBlur}
            />
          </div>
        );
      }
      return <ContentView>{this.props.children}</ContentView>;
    }
  };
}

module.exports.mutations = {
  ContentView: twoColumnContentView
};
