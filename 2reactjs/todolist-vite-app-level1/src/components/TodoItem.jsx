import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

//import { removeTodo, toggleTodo } from '@/actions';
import { removeTodo, toggleTodo } from '@/reducers/todoSlice';
import '@components/TodoItem.css';

class TodoItem extends Component {
    /*
        true 리턴 (checked 변수에 변동이 있는 경우)이면 render() 함수가 호출됨
        false 리턴 (checked 변수에 변동이 없는 경우)이면 render() 함수가 호출되지 않음(렌더링 생략)
    */
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.checked !== nextProps.checked;
    }

    handleToggle = (todo) => {
        todo.checked = !todo.checked;
        this.props.toggleTodo(todo)
    }; //handleToggle

    handleRemove = (id) => {
        this.props.removeTodo(id);
    }; //handleRemove

    render() {
        const { text, checked, id } = this.props;
        const { handleToggle, handleRemove } = this;

        return (
            <div className="todo-item" onClick={() => handleToggle({ text, checked, id })}>
                <div className="remove" onClick={(e) => {
                    e.stopPropagation(); // onToggle 이 실행되지 않도록 함
                    handleRemove(id)
                }
                }>&times;</div>
                <div className={`todo-text ${checked && 'checked'}`}>
                    <div>{text}</div>
                </div>
                {
                    checked && (<div className="check-mark">✓</div>)
                }
            </div>
        );
    }
}

TodoItem.propTypes = {
    text: PropTypes.string,
    checked: PropTypes.bool,
    id: PropTypes.number,
    toggleTodo: PropTypes.func,
    removeTodo: PropTypes.func
};
export default connect(null,{ removeTodo, toggleTodo })(TodoItem)