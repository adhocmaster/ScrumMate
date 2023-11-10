import React, { useState } from 'react';
import Box from '@mui/material/Box';

function ScrollBoxSmall() {
  // State to handle hover style
  const [hoveredIndex, setHoveredIndex] = useState(-1);

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
          width: '300px',
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
            color: 'white', 
            cursor: 'pointer', 
            '&:hover': {
              color: 'gold', // Change text color on hover
            },
          },
        }}
      >
        {/* Long content here to enable scrolling */}
        {Array.from({ length: 100 }, (_, i) => (
          <Box
            key={i}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(-1)}
            sx={{
              p: 1, // Padding inside each p for better readability
              color: i === hoveredIndex ? 'gold' : 'white', // Dynamic color change
              cursor: 'pointer',
            }}
          >
            Clickable content {i + 1}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default ScrollBoxSmall;
