import React from 'react';

function ScrollBox() {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div
        style={{
          width: '825px',
          height: '500px',
          overflowY: 'scroll',
          marginRight: '0rem',
          marginTop: '-50rem',
          border: '1px solid black',
          backgroundColor: 'rgb(34, 19, 170)',
          color: 'white',
        }}
      >
        {/* Long content here to enable scrolling */}
        {Array(100)
          .fill()
          .map((_, i) => (
            <p key={i}>Scrollable content text line {i + 1}</p>
          ))}
      </div>
    </div>
  );
}

export default ScrollBox;
