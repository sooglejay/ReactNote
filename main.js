import React from 'react';

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


//注意 参数只是正常的js语法
const getVisibleTodos = (todos, filter) => {
    switch (filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_ACTIVE':
            return todos.filter(
                t => !t.completed
            );
        case 'SHOW_COMPLETED':
            return todos.filter(
                t => t.completed
            );
    }
}

//注意参数是一个对象，是JSX语法的对象; 可以只写属性名，而不写属性的值
const Link = ({
    active,
    children,
    onClick
}) => {
    if (active) {
        return (<span>{children}</span>);
    }
    return (
        <a href='#' onClick={ e => {
            e.preventDefault();
            onClick();
        } }>{children}</a>
    );
}

class FilterLink extends React.Component {
    componentDidMount() {
        const {store} = this.props;
        this.unsubscribe = store.subscribe(() => this.forceUpdate());
    }
    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const props = this.props;
        const {store} = props;
        const state = store.getState();
        return (
            <Link active ={
                props.filter === state.visibilityFilter
            }
                onClick ={
                    () => {
                        store.dispatch({
                            type: 'SET_VISIBILITY_FILTER',
                            filter: props.filter
                        });
                    }
                }>
                {props.children}
            </Link>);
    }
}
const TodoComponent = ({onClick, completed, text}) =>
    <li
        onClick={onClick}
        style={{ textDecoration: completed ? 'line-through' : 'none' }}>
        {text}
    </li>

class VisibleTodoList extends React.Component {
    componentDidMount() {
        const {store} = this.props;
        this.unsubscribe = store.subscribe(() => this.forceUpdate());
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    render() {
        const props = this.props;
        const {store} = props;
        const state = store.getState();
        return (
            <TodoListComponent
                todos={getVisibleTodos(
                    state.todos,
                    state.visibilityFilter) }
                onTodoClick = {
                    (id) => {
                        store.dispatch({
                            type: 'TOGGLE_TODO',
                            id
                        });
                    }
                } />);
    }
}
const TodoListComponent = ({todos, onTodoClick}) =>
    <ul>
        {
            todos.map(todo =>
                <TodoComponent
                    //每一个 遍历的元素都必须要有一个key
                    key={todo.id}
                    onClick={() => onTodoClick(todo.id) }
                    {...todo}

                    />)
        }
    </ul>


let nextTodoId = 0;

const AddTodoComponent = ({store}) => {
    let input = '';
    return (
        <div>
            <input ref ={(node) => {
                input = node;
            } }/>
            <button onClick = {
                () => {
                    store.dispatch({
                        type: 'ADD_TODO',
                        text: input.value,
                        id: nextTodoId++
                    });
                    input.value = '';
                    input.focus();
                }
            }>
                Add Todo
            </button>
        </div>
    );
}

const FooterComponent = ({store}) =>
    <p>
        Show
        {'  '}
        <FilterLink store={store} filter='SHOW_ALL'>ALL</FilterLink>

        {'  '}
        <FilterLink  store={store} filter='SHOW_ACTIVE'>Active</FilterLink>

        {'  '}
        <FilterLink store={store}  filter='SHOW_COMPLETED'>Completed</FilterLink>

    </p>

const TodoApp = ({store}) =>
    <div>
        <AddTodoComponent store={store}/>
        <VisibleTodoList store={store}/>
        <FooterComponent store={store}/>
    </div>

import {createStore, combineReducers} from 'redux';
const todoApp = combineReducers({
    todos,
    visibilityFilter
});

import ReactDOM from 'react-dom';
ReactDOM.render(<TodoApp store = {createStore(todoApp) }/>, document.getElementById('app_jerry'));
