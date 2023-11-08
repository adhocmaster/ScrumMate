import React from 'react';
import ScrollBox from './ScrollBox'; // Adjust the import path as needed
import ScrollBoxSmall from './ScrollBoxSmall';

function DualScrollBoxes() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <ScrollBoxSmall />
      <ScrollBox />
    </div>
  );
}

export default DualScrollBoxes;
