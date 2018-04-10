import React from "react";
import { deSerialize, serialize, serPreview, getSearchableText } from "./util";
//import { Editor } from "draft-js";
import "./style.css";

function twoColumnContentView(ContentView, api) {
  return class extends React.Component {
    finishedLoadingContent = () => {
      this.props.note.getContent().then(content => {
        const editorState = deSerialize(content[this.props.note.mutationName]);
        this.props.onContentLoaded(editorState);
      });
    };

    onChangeRight = state => {
      const editorState = this.props.ourEditorState;
      editorState.right = state;
      const serializedContent = serialize(editorState);
      const serializedPreview = serPreview(editorState);
      const searchableText = getSearchableText(editorState);

      this.props.onChange(
        editorState,
        serializedContent,
        serializedPreview,
        searchableText
      );
    };

    onChangeLeft = state => {
      const editorState = this.props.ourEditorState;
      editorState.left = state;
      const serializedContent = serialize(editorState);
      const serializedPreview = serPreview(editorState);
      const searchableText = getSearchableText(editorState);

      this.props.onChange(
        editorState,
        serializedContent,
        serializedPreview,
        searchableText
      );
    };

    render() {
      if (
        this.props.note &&
        this.props.note.mutationName === "TwoColumnEditor"
      ) {
        const Editor = api().Editor;
        const { onChange, isLoadingContent, ...props } = this.props;
        return (
          <div className="two-column-editor">
            <div className="editor left-editor">
              <Editor
                className="Editor1"
                editorState={this.props.ourEditorState.left}
                onChange={this.onChangeLeft}
                placeholder={"Change me!"}
                isLoadingContent={isLoadingContent}
                finishedLoadingContent={this.finishedLoadingContent}
                {...props}
              />
            </div>
            <div className="editor right-editor">
              <Editor
                className="Editor2"
                editorState={this.props.ourEditorState.right}
                onChange={this.onChangeRight}
                placeholder={"Write Something!"}
                {...props}
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
