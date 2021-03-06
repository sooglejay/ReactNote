import React from 'react';
import ReactDOM from 'react-dom';
import {Provider, connect} from 'react-redux';
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

let nextTodoId = 0;
const addTodo = (text) => {
    return {
        type: 'ADD_TODO',
        text,
        id: nextTodoId++
    }
}

const setVisibleFilter = (filter) => {
    return {
        type: 'SET_VISIBILITY_FILTER',
        filter
    }
}
const toggleTodo = (id) => {
    return {
        type: 'TOGGLE_TODO',
        id
    }
}

let AddTodoComponent = ({dispatch}) => {
    let input = '';
    return (
        <div>
            <input ref ={(node) => {
                input = node;
            } }/>
            <button onClick = {
                () => {
                    dispatch(addTodo(input.value));
                    input.value = '';
                    input.focus();
                }
            }>
                Add Todo
            </button>
        </div>
    );
}
AddTodoComponent = connect()(AddTodoComponent);


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

const mapStateToProps1212 = (state) => {
    return {
        todos: getVisibleTodos(
            state.todos,
            state.visibilityFilter)
    };
}
const mapDispatchToProps1212 = (dispatch) => {
    return {
        onTodoClick:
        (id) => {
            dispatch(toggleTodo(id));
        }
    };
}
//函数的签名是不一样的
const VisibleTodoList = connect(mapStateToProps1212, mapDispatchToProps1212)(TodoListComponent);




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
const mapStateToLinkProps = (state, ownProps) => {
    return {
        active: ownProps.filter === state.visibilityFilter
    }
}
const mapDispatchToLinkProps = (dispatch, ownProps) => {
    return {
        onClick: () => {
            dispatch(setVisibleFilter(ownProps.filter));

        }
    }
}
const FilterLink = connect(mapStateToLinkProps, mapDispatchToLinkProps)(Link);
const FooterComponent = () =>
    <p>
        Show
        {'  '}
        <FilterLink  filter='SHOW_ALL'>ALL</FilterLink>

        {'  '}
        <FilterLink  filter='SHOW_ACTIVE'>Active</FilterLink>

        {'  '}
        <FilterLink  filter='SHOW_COMPLETED'>Completed</FilterLink>

    </p>




const TodoApp = () =>
    <div>
        <AddTodoComponent/>
        <VisibleTodoList/>
        <FooterComponent />
    </div>



const todoApp = combineReducers({
    todos,
    visibilityFilter
});
ReactDOM.render(
    <Provider store = {createStore(todoApp) }>
        <TodoApp />
    </Provider>,
    document.getElementById('app_jerry'));
