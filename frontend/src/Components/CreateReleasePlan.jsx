import React, { useState } from 'react';
import { Box, Button, TextareaAutosize, Typography } from '@mui/material';

const CreateReleasePlan = ({projectId}) => {
  const [documentText, setDocumentText] = useState('');

  const handleTextChange = (event) => {
    setDocumentText(event.target.value);
  };

  const handleSaveDocument = () => {
    // For demonstration purposes, temporarily saving to localStorage until database is set up
    // localStorage.setItem('releasePlanDocument', documentText);
    console.log(projectId)
    try{
      var options = {
        url: `http://localhost:3001/projects/release/${projectId}`,
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({documentText}),
        credentials:'include'
      }
      // fetch(`http://localhost:3001/projects/release/${projectId}`,options).then((result)=>{
      //   console.log(result)
      //   if(result.status == 200){
      //     console.log(result)
      //   }
      //   result.json().then((response)=>{
      //     console.log(response)
      //     setProjectNames(response)
      //   })
      // })    
    
    alert('Document saved!');
    }catch(error){
      console.log(error)
    }
  }

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
