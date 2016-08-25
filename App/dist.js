import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      input: '/* add your jsx here */',
      output: ' ',
      err: ' '
    };
    this.update = this.update.bind(this);
  }

  update(e) {
    let code = e.target.value;
    try {
      this.setState({
        output: babel.transform(code, {
          stage: 0,
          loose: 'all'
        }).code,
        err: ' '
      });
    } catch ( e ) {
      // statements
      console.log(e);
      this.setState({
        err: e.message
      });
    }
  }
  render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'header',
        null,
        this.state.err
      ),
      React.createElement(
        'div',
        {
          className: 'container'
        },
        React.createElement('textarea', {
          onChange: this.update,
          defaultValue: this.state.input
        }),
        React.createElement(
          'pre',
          null,
          this.state.output,
          ' ssa asa'
        )
      )
    );
  }
}

export default App;
