import React from 'react';

const MyComponentFunc = ({name, children}) => {
    return (
        <div>
            <h2>함수형 컴포넌트</h2>
            <h3>Hello! {name}</h3>
            {children}
        </div>
    );
};

export default MyComponentFunc;