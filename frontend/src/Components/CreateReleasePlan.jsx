import React, { useState } from 'react';
import { Box, Button, TextareaAutosize, Typography } from '@mui/material';

const CreateReleasePlan = () => {
  const [documentText, setDocumentText] = useState('');

  const handleTextChange = (event) => {
    setDocumentText(event.target.value);
  };

  const handleSaveDocument = () => {
    // For demonstration purposes, temporarily saving to localStorage until database is set up
    localStorage.setItem('releasePlanDocument', documentText);
    alert('Document saved!');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        margin: 2
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Create Release Plan Document
      </Typography>
      <TextareaAutosize
        minRows={10}
        placeholder="Enter your release plan..."
        style={{ width: '100%', padding: '10px' }}
        value={documentText}
        onChange={handleTextChange}
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: 2, alignSelf: 'start' }}
        onClick={handleSaveDocument}
      >
        Save Document
      </Button>
    </Box>
  );
};

export default CreateReleasePlan;
