import Redux from 'redux';

import ReactDOM from 'react-dom';


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
            return [...state, {
                id: action.id,
                text: action.text,
                completed: false
            }];
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

const toggleTodos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return todo(state, action);
        case 'TOGGLE_TODO':
            return state.map(t=>todo(t, action));
        default:
            return state;
    }
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


const{createStore} = Redux;

testToggleTodo();
console.log('All tests passed!');