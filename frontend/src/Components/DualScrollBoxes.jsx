import React from 'react';
import ScrollBox from './ScrollBox'; 
import ScrollBoxSmall from './ScrollBoxSmall';

function DualScrollBoxes() {
  return (
    <div style={{ display: 'flex', padding: '20px' }}>
      <ScrollBoxSmall />  
      <ScrollBox />
    </div>
  );
}

export default DualScrollBoxes;
