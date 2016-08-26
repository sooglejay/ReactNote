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
const FilterLinkComponent = ({
    filter,
    current,
    children,
    onClick
}) => {
    if (current === filter) {
        return (<span>{children}</span>);
    }
    return (
        <a href='#' onClick={ e => {
            e.preventDefault();
            onClick(filter);
        } }>{children}</a>
    );
}

const TodoComponent = ({onClick, completed, text}) =>
    <li
        onClick={onClick}
        style={{ textDecoration: completed ? 'line-through' : 'none' }}>
        {text}
    </li>

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

const AddTodoComponent = ({onAddClick}) => {
    let input = '';
    return <div>
        <input ref ={(node) => {
            input = node;
        } }/>
        <button onClick = {
            () => {
                onAddClick(input.value)
                input.value = ''
                input.focus();
            }
        }>
            Add Todo
        </button>
    </div>
}

const FooterComponent = ({visibilityFilter, onFilterClick}) =>
    <p>
        Show
        {'  '}
        <FilterLinkComponent onClick ={onFilterClick } current={visibilityFilter} filter='SHOW_ALL'>ALL</FilterLinkComponent>

        {'  '}
        <FilterLinkComponent onClick ={onFilterClick }  current={visibilityFilter} filter='SHOW_ACTIVE'>Active</FilterLinkComponent>

        {'  '}
        <FilterLinkComponent onClick ={onFilterClick }  current={visibilityFilter} filter='SHOW_COMPLETED'>Completed</FilterLinkComponent>

    </p>

const TodoApp = ({todos, visibilityFilter}) =>
    <div>
        <AddTodoComponent onAddClick={text => {
            store.dispatch({
                type: 'ADD_TODO',
                text,
                id: nextTodoId++
            });
            //这里面是js 的语法，可以正确引用input
        } }/>
        <TodoListComponent todos={getVisibleTodos(todos, visibilityFilter) }
            onTodoClick = {
                (id) => {
                    store.dispatch({
                        type: 'TOGGLE_TODO',
                        id
                    });
                }
            }/>
        <FooterComponent onFilterClick={(filter) => {
            store.dispatch({
                filter,
                type: 'SET_VISIBILITY_FILTER'
            });

        } } visibilityFilter={visibilityFilter}/>
    </div>

const render = () => {
    ReactDOM.render(<TodoApp {...store.getState() }/>, document.getElementById('app_jerry'));
}
store.subscribe(render);
render();