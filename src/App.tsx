
import './App.css';
import VisibleBoard from './containers/VisibleBoard'
import React from 'react';
import Editor from "./components/Editor";
import PowerUpEditor from "./components/PowerUpEditor"
import UnReDoer from './containers/UnReDoer';
import About from './components/About';

function App() {
  return (
    <div className="App">
      <div className="container">
        <VisibleBoard />
        <div className="right">
          <div className="section buttons">
            <About />
          </div>
          <div className="section">
            <Editor />
          </div>
          <div className="section">
            <PowerUpEditor />
          </div>
        </div>
        
      </div>
      <UnReDoer />
      
    </div>
  );
}

export default App;
