import React from "react";
import styled from "styled-components";

function RichStyling(Frame) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      window.styling = true;
    }

    render() {
      return <Frame>{this.props.children}</Frame>;
    }
  };
}

module.exports.mutations = {
  Frame: RichStyling
};
