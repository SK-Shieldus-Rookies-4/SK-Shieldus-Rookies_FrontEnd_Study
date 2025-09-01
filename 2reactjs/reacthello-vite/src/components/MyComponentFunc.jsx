import React, { useState } from 'react';

const MyComponentFunc = ({ name, children }) => {
    //useState() 함수사용
    const [value, setValue] = useState(0);
    const [inputs, setInputs] = useState({
        message: '',
        username: ''
    });

    const { message, username } = inputs;

    //event handlers
    const handleChange = (e) => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        });
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
            <input name="message" value={message} onChange={handleChange} />
            <p>상태변수 username = {username}</p>
            <input name="username" value={username} onChange={handleChange} />
        </div>
    );
};

export default MyComponentFunc;