import React, { useState, useEffect } from 'react';
import Navbar from './Components/Navbar'; 
import DualScrollBoxes from './Components/DualScrollBoxes';
import TextBox from './Components/Textbox'; // Make sure the import is correct
import './App.css';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/')
      .then((res) => res.json())
      .then((data) => setData(data.message))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="App">
      <Navbar />
      <header className="App-header">
        {data ? <p>{data}</p> : <p>Loading...</p>}
      </header>
      <DualScrollBoxes />
    </div>
  );
}

export default App;
