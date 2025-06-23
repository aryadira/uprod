import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <Routes>
        <Route path='/' element={"Test"} />
      </Routes>
    </main>
  );
}

export default App;
