import React, { useState, useEffect } from 'react';
import Navbar from './Components/Navbar'; // Make sure to import the Navbar component
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
    </div>
  );
}

export default App;
