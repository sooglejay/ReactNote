import React from 'react';
import ReactDOM from 'react-dom';
class App extends React.Component{
    render() {
        let jj = this.props.jerry_text
       return (
        <div>
        <h1>Hello assa Jianweis</h1>
        <b>{jj}</b>
        </div>
        );
    }
}
App.propTypes = {
jerry_text:React.PropTypes.string,
cat:          React.PropTypes.number.isRequired
}
App.defaultProps = {
    jerry_text:"this is default value"
}

ReactDOM.render(
<App cat={50} />,
document.getElementById('app_jerry')
);
