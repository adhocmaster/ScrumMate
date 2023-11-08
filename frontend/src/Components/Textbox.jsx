import React from 'react';

function TextBox({ text }) {
  return (
    <div
      style={{
        width: '100%', // Full width
        height: '10%',
        padding: '10px',
        paddingLeft: '5.5rem', // Move text 2 rem to the right
        backgroundColor: 'rgb(175,175,175)', // Set background color
        color: 'White', // Set text color to white
        textAlign: 'left', // Keep text aligned to the left
        fontWeight: 'bold', // Make text bold
        fontSize: '24px', // Set font size to 24px for larger text
        textShadow: ' -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000', // Black text outline
      }}
    >
      {text}
    </div>
  );
}

export default TextBox;
