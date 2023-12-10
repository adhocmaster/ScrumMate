import React, { useState, useEffect } from 'react';
import { Box, Button, TextareaAutosize, Typography, TextField, Paper} from '@mui/material';

const CreateReleasePlan = ({ projectId }) => {
  const [nameText, setDocumentText] = useState('');
  const [releaseDateText, setReleaseDateText] = useState('');
  const [userStoriesText, setUserStoriesText] = useState('');
  const [highLevelGoalsText, sethighLevelGoalsText] = useState('');
  const [finalizedDateText, setFinalizedDateText] = useState('');
  const [highLevelGoals, setHighLevelGoals] = useState(['']); // Array of goals
  const [userStories, setUserStories] = useState([{ description: '', notes: '', storyPoints: '' }]); //Array of user stories



  const handleNameChange = (event) => {
    setDocumentText(event.target.value);
  };

  const handleReleaseDateChange = (event) => {
    setReleaseDateText(event.target.value);
  };

  // const handleHighLevelGoalsTextChange = (event) => {
  //   sethighLevelGoalsText(event.target.value);
  // };

  // const handleUserStoriesTextChange = (event) => {
  //   setUserStoriesText(event.target.value);
  // };

  //High level goal functions (new)
  const handleHighLevelGoalsChange = (index, event) => {
    const newGoals = [...highLevelGoals];
    newGoals[index] = event.target.value;
    setHighLevelGoals(newGoals);
  };

  const addNewGoal = () => {
    setHighLevelGoals([...highLevelGoals, '']); // Add a new empty goal
  };

  //User story functions (new)
  const handleUserStoryChange = (index, field, value) => {
    const updatedStories = userStories.map((story, idx) => {
      if (idx === index) {
        return { ...story, [field]: value };
      }
      return story;
    });
    setUserStories(updatedStories);
  };

  const addNewStory = () => {
    setUserStories([...userStories, { description: '', notes: '', storyPoints: '' }]);
  };

  // Old function to handle backend
  // const handleSaveDocument = () => {
  //   console.log(projectId);
  //   const today = new Date();
  //   const formattedToday = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

  //   setFinalizedDateText(formattedToday);
  //   var options = {
  //       url: `http://localhost:3001/projects/release/${projectId}`,
  //       method:'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       credentials:'include',
  //       body:JSON.stringify({high_level_goals:[highLevelGoalsText],status:"incomplete",dateFinalized:finalizedDateText,stories:[]})
  //   }
  //   fetch(`http://localhost:3001/projects/release/${projectId}`,options).then((result)=>{
  //     console.log(result)
  //     if(result.status == 200){
  //       console.log(result)
  //     }
  //   })
  // }

  //New function to handle backend
  const handleSaveDocument = () => {
    console.log(projectId);
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  
    // Filter out empty strings from highLevelGoals and userStories
    const filteredHighLevelGoals = highLevelGoals.filter(goal => goal.trim() !== '');
    const filteredUserStories = userStories.filter(story => story.trim() !== '');
  
    const releasePlanData = {
      high_level_goals: filteredHighLevelGoals,
      user_stories: filteredUserStories,
      status: "incomplete",
      dateFinalized: formattedToday
    };
  
    var options = {
      url: `http://localhost:3001/projects/release/${projectId}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(releasePlanData)
    }
  
    fetch(`http://localhost:3001/projects/release/${projectId}`, options).then((result) => {
      console.log(result)
      if (result.status === 200) {
        console.log(result)
      }
    })
  }
  

  useEffect(() => {
    if (finalizedDateText) {
      const combinedDocument = nameText + "\nRelease Date:\n" + releaseDateText + 
        "\n \nHigh Level Goals:\n" + highLevelGoals + 
        "\n \nUser Stories:\n" + userStories + 
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
      {highLevelGoals.map((goal, index) => (
        <TextareaAutosize
          key={index}
          minRows={3}
          placeholder="Enter high level goal..."
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          value={goal}
          onChange={(e) => handleHighLevelGoalsChange(index, e)}
        />
      ))}
      <Button
        variant="contained"
        sx={{ marginTop: 2, alignSelf: 'start' }}
        onClick={addNewGoal}
      >
        Add New Goal
      </Button>
      <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2 }}>
        User Stories
      </Typography>
      {userStories.map((story, index) => (
        <Paper key={index} elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
          <Typography variant="h6">Sprint {index + 1}</Typography>
          <TextareaAutosize
            minRows={3}
            placeholder="Enter description..."
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            value={story.description}
            onChange={(e) => handleUserStoryChange(index, 'description', e.target.value)}
          />
          <TextareaAutosize
            minRows={3}
            placeholder="Enter notes..."
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            value={story.notes}
            onChange={(e) => handleUserStoryChange(index, 'notes', e.target.value)}
          />
          <TextareaAutosize
            minRows={1}
            placeholder="Enter story points..."
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            value={story.storyPoints}
            onChange={(e) => handleUserStoryChange(index, 'storyPoints', e.target.value)}
          />
        </Paper>
      ))}

      <Button
        variant="contained"
        sx={{ marginTop: 2, alignSelf: 'start' }}
        onClick={addNewStory}
      >
        Add New User Story
      </Button>
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: 2, alignSelf: 'center' }}
        onClick={handleSaveDocument}
      >
        Save Document
      </Button>
    </Box>
  );
};


export default CreateReleasePlan;
