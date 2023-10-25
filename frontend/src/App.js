import React, {useState, useEffect, useRef} from 'react';
import './App.css';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/')
      .then(res => res.json())
      .then(data => setData(data.message))
      .catch(error => console.error('Error fetching data:', error))
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {data ? <p>{data}</p> : <p>Loading...</p>}
      </header>
    </div>
  );
}

export default App;
