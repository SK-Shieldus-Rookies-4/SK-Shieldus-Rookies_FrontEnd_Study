import React, { useRef, useState } from 'react';
import './MyComponent.css';

const MyComponentFunc = ({ name, children }) => {
    //useState() 함수사용
    const [value, setValue] = useState(0);
    const [inputs, setInputs] = useState({
        message: '',
        username: ''
    });
    const [valid, setValid] = useState(false);
    const [messageArr, setMessageArr] = useState(['Angular', 'React', 'Vue', 'Ember']);
    const myUsername = useRef(null);

    const { message, username } = inputs;
    const messageList = messageArr.map(
        (msg, idx) => (<li key={idx}>{msg}</li>)
    );

    //event handlers
    const handleChange = (e) => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        });
    };
    const handleEnter = (e) => {
        if (e.keyCode === 13) {
            setValid(true);
            setMessageArr([...messageArr, message]);
            setInputs({
                ...inputs,
                message: ''
            });
            myUsername.current.focus();
        }//if
    };

    return (
        <div>
            <h2>함수형 컴포넌트</h2>
            <h3>Hello! {name}</h3>
            {children}
            <p>상태변수 value = {value}</p>
            <button onClick={() => (setValue(value + 1))}>증가</button>
            <button onClick={() => (setValue(value - 1))}>감소</button>
            <br />
            <p>상태변수 message = {message}</p>
            <input name="message" value={message} onChange={handleChange}
                onKeyDown={handleEnter}
            />
            <br />
            <ul>
                {messageList}
            </ul>
            <p>상태변수 username = {username}</p>
            <input name="username" value={username} onChange={handleChange}
                className={valid ? 'success' : 'failure'}
                ref={myUsername}
            />

        </div>
    );
};

export default MyComponentFunc;