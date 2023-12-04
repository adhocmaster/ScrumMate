import React, { useState, useEffect } from 'react';
import { Box, Button, TextareaAutosize, Typography } from '@mui/material';

const CreateReleasePlan = ({ projectId }) => {
  const [nameText, setDocumentText] = useState('');
  const [releaseDateText, setReleaseDateText] = useState('');
  const [userStoriesText, setUserStoriesText] = useState('');
  const [highLevelGoalsText, sethighLevelGoalsText] = useState('');
  const [finalizedDateText, setFinalizedDateText] = useState('');

  const handleNameChange = (event) => {
    setDocumentText(event.target.value);
  };

  const handleReleaseDateChange = (event) => {
    setReleaseDateText(event.target.value);
  };

  const handleHighLevelGoalsTextChange = (event) => {
    sethighLevelGoalsText(event.target.value);
  };

  const handleUserStoriesTextChange = (event) => {
    setUserStoriesText(event.target.value);
  };

  const handleSaveDocument = () => {
    console.log(projectId);
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    setFinalizedDateText(formattedToday);
  }

  useEffect(() => {
    if (finalizedDateText) {
      const combinedDocument = nameText + "\nRelease Date:\n" + releaseDateText + 
        "\n \nHigh Level Goals:\n" + highLevelGoalsText + 
        "\n \nUser Stories:\n" + userStoriesText + 
        "\n \nDate Finalized:\n" + finalizedDateText;

      console.log(projectId)
      try {
        localStorage.setItem('releasePlanDocument', combinedDocument);
        // var options = {
        //   url: `http://localhost:3001/projects/release/${projectId}`,
        //   method:'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({documentText}),
        //   credentials:'include'
        // }
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
      } catch (error) {
        console.log(error);
      }
    }
  }, [projectId, nameText, releaseDateText, highLevelGoalsText, userStoriesText, finalizedDateText]);
  
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
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Project Name
      </Typography>
      <TextareaAutosize
        minRows={1}
        placeholder="Enter your release plan..."
        style={{ width: '100%', padding: '10px' }}
        value={nameText}
        onChange={handleNameChange}
      />
      <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2 }}>
        Proposed Release Date
      </Typography>
      <TextareaAutosize
        minRows={1}
        placeholder="Enter proposed release date..."
        style={{ width: '100%', padding: '10px' }}
        value={releaseDateText}
        onChange={handleReleaseDateChange}
      />
      <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2 }}>
        High Level Goals
      </Typography>
      <TextareaAutosize
        minRows={10}
        placeholder="Enter high level goals..."
        style={{ width: '100%', padding: '10px' }}
        value={highLevelGoalsText}
        onChange={handleHighLevelGoalsTextChange}
      />
      <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2 }}>
        User Stories
      </Typography>
      <TextareaAutosize
        minRows={10}
        placeholder="Enter user stories..."
        style={{ width: '100%', padding: '10px' }}
        value={userStoriesText}
        onChange={handleUserStoriesTextChange}
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
