

import React from 'react';
import ReactDOM from 'react-dom';


import {createStore} from 'redux';

var container = document.getElementById('app_jerry');

const Counter = ({value, onIncrement, onDecrement}) => (
    <div>
        <h1>{value}</h1>
        <button onClick={onIncrement}>+</button>
        <button onClick={onDecrement}>-</button>
    </div>
);

const counter = (state = 10, action) => {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
}
const render = () => {
    ReactDOM.render(
        <Counter
            value={store.getState() }
            onIncrement={() => {
                store.dispatch({
                    type: 'INCREMENT'
                });
            } }
            onDecrement={() => {
                store.dispatch({
                    type: 'DECREMENT'
                })
            } }
            />,
        container);
}
var store = createStore(counter);
store.subscribe(render);
render();


