
import './App.css';
import VisibleBoard from './containers/VisibleBoard'
import React from 'react';
import Editor from "./components/Editor";
import PowerUpEditor from "./components/PowerUpEditor"

function App() {
  return (
    <div className="App">
      <div className="container">
        <VisibleBoard />
        <div className="editors">
          <Editor />
          <PowerUpEditor />
        </div>
      </div>
    </div>
  );
}

export default App;
