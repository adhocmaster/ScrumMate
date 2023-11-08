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
        height: '100vh',
      }}
    >
      <Box
        sx={{
          width: '30vh', // Corrected the unit for width
          height: '75vh',
          overflowY: 'scroll',
          mr: '2.5rem',
          border: 1,
          borderColor: 'black',
          bgcolor: 'rgb(34, 19, 170)',
          color: 'white',
          position: 'relative',
          top: '-108vh', // Position adjustment may need review based on your layout
          '&::-webkit-scrollbar': {
            width: '0.5em'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255,255,255,0.5)',
            outline: '1px solid slategrey'
          },
          '& p': {
            my: 1,
            color: 'white', // Default color
            cursor: 'pointer', // Cursor indicates interactive elements
            '&:hover': {
              color: 'gold', // Hover color
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
            Scrollable content line {i + 1}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default ScrollBoxSmall;
