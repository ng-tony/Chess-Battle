
import './App.css';
import VisibleBoard from './containers/VisibleBoard'
import React from 'react';
import Editor from "./components/Editor";
import PowerUpEditor from "./components/PowerUpEditor"

function App() {
  return (
    <div className="App">
      <VisibleBoard />
      <Editor />
      <PowerUpEditor />
    </div>
  );
}

export default App;
