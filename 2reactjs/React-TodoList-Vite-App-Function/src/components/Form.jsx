import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import './Form.css';

const Form = () => {
  const [todo, setTodo] = useState('');
  const dispatch = useDispatch();

  //이벤트핸들러 함수 선언
  const handleChange = useCallback((e) => {
    //console.log('handleChange =' + e.target.value);
    setTodo(e.target.value);
  }, [setTodo]); //handleChange

  return (
    <div className="form">
      <input
        value={todo}
        onChange={handleChange}
      />
      <div className="create-button">
        추가
      </div>
    </div>
  );
};

Form.propTypes = {
  myEnter: PropTypes.func,
  myChange: PropTypes.func,
  myCreate: PropTypes.func
};

export default Form;