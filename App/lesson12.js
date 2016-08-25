import React from 'react';
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      val: 0
    };
  }
  componentWillReceiveProps(nextProps) {
    console.log(this.state.val);
    this.setState({
      val: this.state.val + 1
    })
    console.log('componentWillReceiveProps:', nextProps.data.bar);
    console.log(this.state.val);
  }
  render() {
    let v = this.state.val;
    console.log('render..', v);
    return <div>
             Bar
             { this.props.data.bar }!
           </div>;
  }
}
export default App