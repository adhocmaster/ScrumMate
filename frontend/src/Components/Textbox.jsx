import React from 'react';

function TextBox({ text }) {
  return (
    <div
      style={{
        width: '100%', // Full width
        padding: '10px',
        backgroundColor: 'transparent', // Set background to transparent
        color: 'black', // Set text color
        // Removed the border property to have no border
      }}
    >
      {text}
    </div>
  );
}

export default TextBox;
