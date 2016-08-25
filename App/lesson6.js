import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      val: 0
    };
    this.update = this.update.bind(this);
  }

  update() {
    this.setState(function(state, props) {
      return {
        val: state.val + 1
      }
    });
  }
  render() {
    console.log('hello jiangwei is clicking ')
    return (<button onClick={ this.update }>
              { this.state.val }
            </button>)
  }
}
// class Button extends React.Component {
//     render() {
//         return <button> { this.props.children} </button>
//     }
// }
// const Heart = () => <span className="glyphicon glyphicon-heart"></span>
export default App