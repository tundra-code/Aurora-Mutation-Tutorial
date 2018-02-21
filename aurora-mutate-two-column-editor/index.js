import React from "react";
import { deSerialize, serialize, serPreview } from "./util";
import { Editor } from "draft-js";
import "./style.css";

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

    onFocus = () => {
      if (this.props.onFocusEx) {
        this.props.onFocusEx();
      }
    };

    render() {
      if (
        this.props.note &&
        this.props.note.mutationName === "TwoColumnEditor"
      ) {
        return (
          <div>
            <div className="editor left-editor">
              <Editor
                className="Editor1"
                editorState={this.props.ourEditorState.left}
                onChange={this.onChangeLeft}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                placeholder={"Change me!"}
                handleKeyCommand={this.props.handleKeyCommand}
                keyBindingFn={this.props.keyBindingFn}
              />
            </div>
            <div className="editor right-editor">
              <Editor
                className="Editor2"
                editorState={this.props.ourEditorState.right}
                onChange={this.onChangeRight}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                placeholder={"Write Something!"}
                handleKeyCommand={this.props.handleKeyCommand}
                keyBindingFn={this.props.keyBindingFn}
              />
            </div>
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
