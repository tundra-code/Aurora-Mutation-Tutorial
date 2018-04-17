'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draftJsButtons = require('draft-js-buttons');

var _alignmentToolStyles = {
  "alignmentTool": "draftJsEmojiPlugin__alignmentTool__2mkQr"
};

var _alignmentToolStyles2 = _interopRequireDefault(_alignmentToolStyles);

var _buttonStyles = {
  "buttonWrapper": "draftJsEmojiPlugin__buttonWrapper__1Dmqh",
  "button": "draftJsEmojiPlugin__button__qi1gf",
  "active": "draftJsEmojiPlugin__active__3qcpF"
};

var _buttonStyles2 = _interopRequireDefault(_buttonStyles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable react/no-array-index-key */


var getRelativeParent = function getRelativeParent(element) {
  if (!element) {
    return null;
  }

  var position = window.getComputedStyle(element).getPropertyValue('position');
  if (position !== 'static') {
    return element;
  }

  return getRelativeParent(element.parentElement);
};

var AlignmentTool = function (_React$Component) {
  _inherits(AlignmentTool, _React$Component);

  function AlignmentTool() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AlignmentTool);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AlignmentTool.__proto__ || Object.getPrototypeOf(AlignmentTool)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      position: {},
      alignment: null
    }, _this.onVisibilityChanged = function (visibleBlock) {
      setTimeout(function () {
        var position = void 0;
        var boundingRect = _this.props.store.getItem('boundingRect');
        if (visibleBlock) {
          var relativeParent = getRelativeParent(_this.toolbar.parentElement);
          var toolbarHeight = _this.toolbar.clientHeight;
          var relativeRect = relativeParent ? relativeParent.getBoundingClientRect() : document.body.getBoundingClientRect();
          position = {
            top: boundingRect.top - relativeRect.top - toolbarHeight,
            left: boundingRect.left - relativeRect.left + boundingRect.width / 2,
            transform: 'translate(-50%) scale(1)',
            transition: 'transform 0.15s cubic-bezier(.3,1.2,.2,1)'
          };
        } else {
          position = { transform: 'translate(-50%) scale(0)' };
        }
        var alignment = _this.props.store.getItem('alignment') || 'default';
        _this.setState({
          alignment: alignment,
          position: position
        });
      }, 0);
    }, _this.onAlignmentChange = function (alignment) {
      _this.setState({
        alignment: alignment
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AlignmentTool, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.props.store.subscribeToItem('visibleBlock', this.onVisibilityChanged);
      this.props.store.subscribeToItem('alignment', this.onAlignmentChange);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.store.unsubscribeFromItem('visibleBlock', this.onVisibilityChanged);
      this.props.store.unsubscribeFromItem('alignment', this.onAlignmentChange);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var defaultButtons = [_draftJsButtons.AlignBlockDefaultButton, _draftJsButtons.AlignBlockLeftButton, _draftJsButtons.AlignBlockCenterButton, _draftJsButtons.AlignBlockRightButton];
      return _react2.default.createElement(
        'div',
        {
          className: _alignmentToolStyles2.default.alignmentTool,
          style: this.state.position,
          ref: function ref(toolbar) {
            _this2.toolbar = toolbar;
          }
        },
        defaultButtons.map(function (Button, index) {
          return _react2.default.createElement(Button
          /* the index can be used here as the buttons list won't change */
          , { key: index,
            alignment: _this2.state.alignment,
            setAlignment: _this2.props.store.getItem('setAlignment'),
            theme: _buttonStyles2.default
          });
        })
      );
    }
  }]);

  return AlignmentTool;
}(_react2.default.Component);

exports.default = AlignmentTool;