import React from 'react';
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      txt: 'this is the state on lesson 2'
    };
    this.update = this.update.bind(this);
  }
  update(e) {
    this.setState({
      txt: e.target.value
    })
  }
  render() {
    return (
      <div>
        <input
               type='text'
               onChange={ this.update } />
        <h1>{ this.state.txt } haha</h1>
      </div>
    )
  }
}
export default App