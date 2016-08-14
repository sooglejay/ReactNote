import React from 'react';
import ReactDOM from 'react-dom';
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      increasing: false
    }
    this.update = this.update.bind(this);
  }
  update() {
    ReactDOM.render(
      <App val={ this.props.val + 1 } />,
      document.getElementById('app_jerry')
    )
  }
  render() {
    console.log('rendering!:', this.state.increasing);
    return (
      <button onClick={ this.update }>
        { this.props.val }
      </button>
      );
  }
  componentDidUpdate(prevProps, prevState) {
    console.log('here we go prevProps', prevProps);
  }
  componentWillReceiveProps(nextProps) {
    console.log("receive:this.props.val:", this.props.val, "this.nextProps.val", nextProps.val);
    this.setState({
      increasing: nextProps.val > this.props.val
    })
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.val % 5 === 0) {
      console.log('yes');
      return true;
    }
    console.log('no');
    return false;
  }
}
App.defaultProps = {
  val: 0
}
class Wrapper extends React.Component {
  constructor() {
    super();
  }
  mount() {
    ReactDOM.render(<App/>, document.getElementById('a'));
  }
  unmount() {
    ReactDOM.unmountComponentAtNode(document.getElementById('a'));
  }
  render() {
    return (
      <div>
        <button onClick={ this.mount.bind(this) }>
          Mountww
        </button>
        <button onClick={ this.unmount.bind(this) }>
          UnMount
        </button>
        <div id='a'></div>
      </div>
      );
  }
}
export default App