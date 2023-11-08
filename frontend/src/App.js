import React, { useState, useEffect } from 'react';
import Navbar from './Components/Navbar';
import TextBox from './Components/Textbox'; // Import TextBox
import DualScrollBoxes from './Components/DualScrollBoxes';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [textBoxText, setTextBoxText] = useState("Dashboard"); // State to hold text for TextBox

  useEffect(() => {
    fetch('/')
      .then((res) => res.json())
      .then((data) => {
        setData(data.message);
        setTextBoxText(data.message); // Update the text for TextBox when data is fetched
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="App">
      <Navbar />
      <TextBox text={textBoxText} /> {/* Pass textBoxText as the text prop to TextBox */}
      <header className="App-header">
        {data ? <p>{data}</p> : <p>Loading...</p>}
      </header>
      <DualScrollBoxes />
    </div>
  );
}

export default App;
