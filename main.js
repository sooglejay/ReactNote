import React from 'react';
import ReactDOM from 'react-dom';


import {createStore, combineReducers} from 'redux';
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
    todos,
    visibilityFilter
});

const store = createStore(todoApp);
let nextTodoId = 0;
let inputText = '';

//注意 参数只是正常的js语法
const getVisibleTodos = (todos, filter) => {
    switch (filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_ACTIVE':
            return todos.filter(
                t=>!t.completed
            );
        case 'SHOW_COMPLETED':
            return todos.filter(
                t=>t.completed
            );
    }
}

//注意参数是一个对象，是JSX语法的对象; 可以只写属性名，而不写属性的值
const FilterLink = ({
    filter,
    current,
    children
}) => {
    if(current===filter){
        return(<span>{children}</span>);
    }
    return (
        <a href='#' onClick={ e => {
            e.preventDefault();
            store.dispatch({
                type: 'SET_VISIBILITY_FILTER',
                filter
            });
        } }>{children}</a>
    );
}
class TodoApp extends React.Component {
    render() {
        const{todos,visibilityFilter}=this.props;
        const visibleTodos = getVisibleTodos(todos,visibilityFilter);
        return (
            <div>
                <input ref ={(node) => {
                    this.input = node;
                } }/>
                <button onClick = {
                    () => {
                        if (this.input != null) {
                            inputText = this.input.value
                            this.input.value = '';
                            this.input.focus();
                        }
                        store.dispatch({
                            type: 'ADD_TODO',
                            text: inputText,
                            id: nextTodoId++
                        });
                        //这里面是js 的语法，可以正确引用input
                    }
                }>
                    Add Todo
                </button>
                <ul>
                    {
                        visibleTodos.map(todo =>
                            <li key ={todo.id}
                                onClick={() => {
                                    store.dispatch({
                                        type: 'TOGGLE_TODO',
                                        id: todo.id
                                    });
                                } }
                                style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.text}</li>
                        )
                    }
                </ul>
                <p>

                    Show
                    {'  '}
                    <FilterLink current={visibilityFilter} filter='SHOW_ALL'>ALL</FilterLink>

                    {'  '}
                    <FilterLink current={visibilityFilter} filter='SHOW_ACTIVE'>Active</FilterLink>

                    {'  '}
                    <FilterLink current={visibilityFilter} filter='SHOW_COMPLETED'>Completed</FilterLink>

                </p>
            </div>
        );
    }
}
const render = () => {
    ReactDOM.render(<TodoApp {...store.getState()}/>, document.getElementById('app_jerry'));
}
store.subscribe(render);
render();