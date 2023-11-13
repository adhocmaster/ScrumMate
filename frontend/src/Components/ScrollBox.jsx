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
        width: '100%',
        padding: '0 25px',
      }}
    >
      <Box
        sx={{
          width: 'calc(100%)', // Scale box with window size
          height: '713px',
          overflowY: 'scroll',
          border: 1,
          borderColor: 'black',
          bgcolor: 'rgb(34, 19, 170)',
          color: 'white',
          position: 'relative',
          top: '288px',
          boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.7)',
          '&::-webkit-scrollbar': {
            width: '0.5em'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255,255,255,0.5)',
            outline: '1px solid slategrey'
          },
          '& p': {
            my: 1,
            textAlign: 'left',
            pl: '50px',
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
