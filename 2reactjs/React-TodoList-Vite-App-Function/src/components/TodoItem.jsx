import { memo } from 'react';
import PropTypes from 'prop-types';
import './TodoItem.css';

const TodoItem = ({ text, checked, id, onToggle, onRemove }) => {
  return (
    <div className="todo-item" onClick={() => onToggle(id)}>
      <div 
        className="remove" 
        onClick={(e) => {
          e.stopPropagation(); // onToggle 이 실행되지 않도록 함
          onRemove(id);
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
  onToggle: PropTypes.func,
  onRemove: PropTypes.func
};

// memo를 사용하여 shouldComponentUpdate 대체
// checked가 변경될 때만 리렌더링
export default memo(
  TodoItem,
  (prevProps, nextProps) => prevProps.checked === nextProps.checked
);