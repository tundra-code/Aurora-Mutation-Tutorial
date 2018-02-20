import createImagePlugin from "draft-js-image-plugin";
import React from "react";

const imagePlugin = createImagePlugin();

function Images(Editor) {
  return class extends React.Component {
    render() {
      let plugins = [];
      if (this.props.plugins) {
        plugins = this.props.plugins;
      }
      plugins.push(imagePlugin);
      return (
        <Editor plugins={plugins} {...this.props}>
          {this.props.children}
        </Editor>
      );
    }
  };
}

module.exports.mutations = {
  BaseEditor: Images
};
