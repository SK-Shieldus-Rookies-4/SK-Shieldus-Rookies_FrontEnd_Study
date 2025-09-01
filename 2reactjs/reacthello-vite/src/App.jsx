import MyComponent from "./components/MyComponent";

const App = () => {
  return (
    <>
      <MyComponent name="ReactJS" />
      <MyComponent age={100}/>
    </>
  );
};

export default App;