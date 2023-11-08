import React from 'react';
import Box from '@mui/material/Box';

function ScrollBox() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          width: '70vw',
          height: '65vh',
          overflowY: 'scroll',
          border: 1,
          borderColor: 'black',
          bgcolor: 'rgb(34, 19, 170)',
          color: 'white',
          p: 2,
          position: 'relative', // Needed to adjust the position of the box
          top: '-118vh', // Moves the box up by 25% of the viewport height
          '&::-webkit-scrollbar': {
            width: '0.5em'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255,255,255,0.5)',
            outline: '1px solid slategrey'
          },
          '& p': {
            my: 1,
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
