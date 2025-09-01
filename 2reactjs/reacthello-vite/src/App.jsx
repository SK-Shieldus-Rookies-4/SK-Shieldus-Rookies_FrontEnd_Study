import MyComponent from "./components/MyComponent";
import MyComponentFunc from "./components/MyComponentFunc";

const App = () => {
  return (
    <>
      <MyComponent name="ReactJS" age={100} />
      <hr/>
      <MyComponentFunc name="함수형">
        <p>함수형 컴포넌트의 하위 엘리먼트</p>
      </MyComponentFunc>
    </>
  );
};

export default App;