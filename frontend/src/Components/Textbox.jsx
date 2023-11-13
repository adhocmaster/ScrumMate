import React from 'react';

function TextBox({ text }) {
  return (
    <div
      style={{
        width: '100%', 
        height: '10%',
        padding: '10px',
        paddingLeft: '130px',
        backgroundColor: 'Transparent',
        color: 'Gold',
        textAlign: 'left',
        fontWeight: 'bold',
        fontSize: '24px',
        marginTop: '3px',
        // Combining outline with shadow
        textShadow: `
          -1px -1px 0 #000, 
          1px -1px 0 #000, 
          -1px 1px 0 #000, 
          1px 1px 0 #000,
          5px 5px 5px rgba(0, 0, 0, 0.9)`, // Soft shadow with semi-transparent black
      }}
    >
      {text}
    </div>
  );
}

export default TextBox;
