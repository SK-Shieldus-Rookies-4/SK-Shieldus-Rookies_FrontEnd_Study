import Counter from '../components/Counter';
import * as actions from '../actions';
import { connect } from 'react-redux';

// store 안의 state 값을 props로 연결해줍니다.
const mapStateToProps = (state) => ({
color: state.color,
number: state.number
});

/* 액션 생성 함수를 사용하여 액션을 생성하고,해당 액션을 dispatch하는 함수를 만든 후, 이를 props로 연결해줍니다.*/
const mapDispatchToProps = (dispatch) => ({
onIncrement: () => dispatch(actions.increment()),
onDecrement: () => dispatch(actions.decrement()),
onSetColor: () => {
const color = 'black' // 임시 getRandomColor()를 작성하여 변경할 예정
dispatch(actions.setColor(color));
}
});
/*Counter 컴포넌트를 애플리케이션의 데이터 레이어와 묶는 역할을 합니다.*/
const CounterContainer = connect(
mapStateToProps,
mapDispatchToProps
)(Counter);

export default CounterContainer;