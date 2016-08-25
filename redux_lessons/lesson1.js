import React from 'react';
import ReactDOM from 'react-dom';


import {createStore} from 'redux';

var container = document.getElementById('app_jerry');

class TodoApp extends React.Component {
    constructor(props) {
        super(props);
        this.onIncrement = this.onIncrement.bind(this);
        this.onDecrement = this.onDecrement.bind(this);
    }
    onIncrement() {
        store.dispatch({
            type: 'INCREMENT'
        });
    }

    onDecrement() {
        store.dispatch({
            type: 'DECREMENT'
        });
    }


    render() {
        return (
            <div>
                <h1>{this.props.value}</h1>
                <input ref/>
                <button onClick = {this.onIncrement}>+</button>
                <button onClick = {this.onDecrement}>-</button>
            </div>
        );
    }
}
const counter = (state = 0, action) => {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
}
function render() {
    ReactDOM.render(<TodoApp value={store.getState() } />, container);
}
var store = createStore(counter);
store.subscribe(render);
render();






