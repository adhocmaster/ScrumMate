import React, { useState } from 'react';

function ScrollBoxSmall() {
  // State to handle hover style
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  // Define normal and hover styles
  const normalStyle = {
    color: 'white',
    cursor: 'pointer', // Change the cursor to indicate the text is interactive
  };

  const hoverStyle = {
    color: 'gold', // Change the text color to gold on hover
    cursor: 'pointer',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div
        style={{
          width: '225px',
          height: '500px',
          overflowY: 'scroll',
          marginRight: '2.5rem',
          marginTop: '-50rem',
          border: '1px solid black',
          backgroundColor: 'rgb(34, 19, 170)',
        }}
      >
        {/* Long content here to enable scrolling */}
        {Array(100)
          .fill()
          .map((_, i) => (
            <p
              key={i}
              style={i === hoveredIndex ? hoverStyle : normalStyle}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(-1)}
            >
              Scrollable content line {i + 1}
            </p>
          ))}
      </div>
    </div>
  );
}

export default ScrollBoxSmall;
