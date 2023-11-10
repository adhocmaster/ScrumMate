import React from 'react';
import Box from '@mui/material/Box';

function ScrollBox() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100px',
      }}
    >
      <Box
        sx={{
          width: '1450px',
          height: '713px',
          overflowY: 'scroll',
          mr: '25px',
          border: 1,
          borderColor: 'black',
          bgcolor: 'rgb(34, 19, 170)',
          color: 'white',
          position: 'relative',
          top: '288px',
          boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.7)', // Shadow effect
          '&::-webkit-scrollbar': { // Scroll bar
            width: '0.5em'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255,255,255,0.5)',
            outline: '1px solid slategrey'
          },
          '& p': {
            my: 1,
            textAlign: 'left',
            pl: '50px', // Left padding for each paragraph
          },
        }}
      >
        {/* Long content here to enable scrolling */}
        {Array.from({ length: 100 }, (_, i) => (
          <p key={i}>Scrollable content text line {i + 1}</p>
        ))}
      </Box>
    </Box>
  );
}

export default ScrollBox;
