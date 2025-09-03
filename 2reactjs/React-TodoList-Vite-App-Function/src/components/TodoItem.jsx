import { memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { removeTodo, toggleTodo } from '@/reducers/todoSlice';
import './TodoItem.css';

const TodoItem = ({ text, checked, id }) => {
  const dispatch = useDispatch();

  const handleRemove = useCallback((id) => {
    dispatch(removeTodo(id))
  },[dispatch]);

  const handleToggle = useCallback((todo) => {
      todo.checked = !todo.checked;
      dispatch(toggleTodo(todo))
  },[dispatch]);

  return (
    <div className="todo-item" onClick={() => handleToggle({ text, checked, id })}>
      <div 
        className="remove" 
        onClick={(e) => {
          e.stopPropagation(); // onToggle 이 실행되지 않도록 함
          handleRemove(id);
        }}
      >
        &times;
      </div>
      <div className={`todo-text ${checked && 'checked'}`}>
        <div>{text}</div>
      </div>
      {checked && (<div className="check-mark">✓</div>)}
    </div>
  );
};

TodoItem.propTypes = {
  text: PropTypes.string,
  checked: PropTypes.bool,
  id: PropTypes.number,
};

// memo를 사용하여 shouldComponentUpdate 대체
// checked가 변경될 때만 리렌더링
export default memo(
  TodoItem,
  (prevProps, nextProps) => prevProps.checked === nextProps.checked
);