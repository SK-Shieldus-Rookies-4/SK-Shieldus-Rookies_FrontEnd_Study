import React from 'react';
import PropTypes from 'prop-types';
import './Counter.css';

const Counter = ({ number, color, onIncrement, decrement, onSetColor }) => {
    return (
        <div
            className="Counter"
            onClick={onIncrement}
            onContextMenu={(e) => {
                e.preventDefault();
                decrement();
            }}
            onDoubleClick={onSetColor}
            style={{ backgroundColor: color }}>
            {number}
        </div>
    );
};
Counter.propTypes = {
    number: PropTypes.number,
    color: PropTypes.string,
    onIncrement: PropTypes.func,
    decrement: PropTypes.func,
    onSetColor: PropTypes.func
};
Counter.defaultProps = {
    number: 0,
    color: 'blue',
    onIncrement: () => console.warn('onIncrement not defined'),
    decrement: () => console.warn('decrement not defined'),
    onSetColor: () => console.warn('onSetColor not defined')
};
export default Counter;