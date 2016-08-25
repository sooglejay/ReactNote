import React from 'react';
import ReactDOM from 'react-dom';


import {createStore,combineReducers} from 'redux';
import deepFreeze from 'deep-freeze';
import expect from 'expect';

const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [...state, {
                id: action.id,
                text: action.text,
                completed: false
            }];
        case 'TOGGLE_TODO':
            if (state.id !== action.id) {
                return state;
            }
            return Object.assign({}, state, {
                completed: !state.completed
            });
        default:
            return state;
    }
};

const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return todo(state, action);
        case 'TOGGLE_TODO':
            return state.map(t => todo(t, action));
        default:
            return state;
    }
};
const toggleTodos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return todo(state, action);
        case 'TOGGLE_TODO':
            return state.map(t => todo(t, action));
        default:
            return state;
    }
};
const testAddTodo = () => {
    const stateBefore = [];
    const action = {
        type: 'ADD_TODO',
        id: 0,
        text: "Learn Redux"
    };
    const stateAfter = [
        {
            id: 0,
            text: 'Learn Redux',
            completed: false
        }
    ];
    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(
        todos(stateBefore, action)
    ).toEqual(stateAfter);
};

const testToggleTodo = () => {
    const stateBefore = [
        {
            id: 0, text: 'Learn Redux', completed: false
        },
        {
            id: 1, text: 'Go Shopping', completed: false
        }
    ];
    const action = {
        type: 'TOGGLE_TODO',
        id: 1,
    };
    const stateAfter = [
        {
            id: 0, text: 'Learn Redux', completed: false
        },
        {
            id: 1, text: 'Go Shopping', completed: true
        }
    ];
    deepFreeze(stateBefore);
    deepFreeze(action);


    expect(
        toggleTodos(stateBefore, action)
    ).toEqual(stateAfter);

};


const visibilityFilter = (state = 'SHOW_ALL', action) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};

// const todoApp=(state={},action)=>{
//     return {
//         //每一个 reduxer都是独立运行的，在最后一个dispatch 中，只是 SET_VISIBILITY_FILTER ，但是 todos 并没有影响，保持不变
//         todos:todos(state.todos,action),
//         visibilityFilter:visibilityFilter(state.visibilityFilter,action)
//     };
// };

const todoApp = combineReducers({
    todos:todos,
    visibilityFilter:visibilityFilter
});
const store = createStore(todoApp);

console.log('Initial State');
console.log(store.getState());
console.log('-----------------');

console.log("Dispatching ADD_TODO.");
store.dispatch({
    type: 'ADD_TODO',
    id: 0,
    text: 'Learn Redux'
});
console.log('Current State:');
console.log(store.getState());
console.log('-----------------');


console.log("Dispatching ADD_TODO.");
store.dispatch({
    type: 'ADD_TODO',
    id: 1,
    text: 'Go shopping'
});
console.log('Current State:');
console.log(store.getState());
console.log('-----------------');



console.log("Dispatching TOGGLE_TODO.");
store.dispatch({
    type: 'TOGGLE_TODO',
    id: 0,
});
console.log('Current State:');
console.log(store.getState());
console.log('-----------------');




console.log("Dispatching SET_VISIBILITY_FILTER.");
store.dispatch({
    type: 'SET_VISIBILITY_FILTER',
    id: 0,
    filter:'SHOW_COMPLETED'
});
console.log('Current State:');
console.log(store.getState());
console.log('-----------------');



testToggleTodo();
console.log('All tests passed!');