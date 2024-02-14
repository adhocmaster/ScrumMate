import React, { useState, useEffect } from 'react';
import { Box, Button, TextareaAutosize, Typography, TextField, Paper} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Slider from '@mui/material/Slider';
import dayjs from 'dayjs'; 


const CreateReleasePlan = ({ projectId,onFormSubmit, releasePlanDetails}) => {
  console.log(releasePlanDetails);
  const [nameText, setDocumentText] = useState(releasePlanDetails.name);
  const [releaseDateText, setReleaseDateText] = useState(dayjs()); // Initialize with a Day.js object
  const [userStoriesText, setUserStoriesText] = useState('');
  const [highLevelGoalsText, sethighLevelGoalsText] = useState('');
  const [finalizedDateText, setFinalizedDateText] = useState('');
  const [highLevelGoals, setHighLevelGoals] = useState(releasePlanDetails.high_level_goals); // Array of goals
  const [userStories, setUserStories] = useState(releasePlanDetails.stories); //Array of user stories


  //Code for the sliders
  const marks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 10,
      label: '10',
    },
    {
      value: 20,
      label: '20',
    },
    {
      value: 30,
      label: '30',
    },
    {
      value: 40,
      label: '40',
    },
    {
      value: 50,
      label: '50',
    },
    {
      value: 60,
      label: '60',
    },
    {
      value: 70,
      label: '70',
    },
    {
      value: 80,
      label: '80',
    },
    {
      value: 90,
      label: '90',
    },
    {
      value: 100,
      label: '100',
    },
  ]

  function valuetext(value) {
    return `${value}`;
  }
  const handleNameChange = (event) => {
    setDocumentText(event.target.value);
  };

  const handleReleaseDateChange = (newValue) => {
    // Ensure newValue is a Day.js object
    setReleaseDateText(dayjs(newValue));
  };

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
    console.log(index,field,value)
    const updatedStories = userStories.map((story, idx) => {
      if (idx === index) {
        return { ...story, [field]: value };
      }
      return story;
    });
    setUserStories(updatedStories);
  };

  const addNewStory = () => {
    setUserStories([...userStories, { description: '', notes: '', points: 20 }]);
  };



  //New function to handle backend
  const handleSaveDocument = () => {
    console.log(projectId);
    const today = new Date(releaseDateText);
    // Filter out empty strings from highLevelGoals and userStories
    const filteredHighLevelGoals = highLevelGoals.filter(goal => goal.trim() !== '');
    console.log(userStories)
    // const filteredUserStories = userStories.filter(story => story.trim() !== '').map(story => story.description.trim());
    
    const releasePlanData = {
      name: nameText,
      high_level_goals: filteredHighLevelGoals,
      user_stories: userStories,
      status: "incomplete",
      dateFinalized: today
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
        onFormSubmit()
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
      {/* Release plan data text fields */}
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Create Release Plan Document
      </Typography>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Release Name
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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
	  	<DatePicker />
      </LocalizationProvider>
      
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
      {/* Button to add more goals */}
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
          <Typography variant="h6">User Story {index + 1}</Typography>
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
          {/* <TextareaAutosize
            minRows={1}
            placeholder="Enter story points..."
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            value={story.points}
            onChange={(e) => handleUserStoryChange(index, 'points', e.target.value)}
          /> */}
          {/* Slider for story points */}
          Story Points
          <Slider
            aria-label="Always visible"
            defaultValue={story.points}
            getAriaValueText={valuetext}
            step={1}
            marks={marks}
            valueLabelDisplay="on"
            onChange = {(e,val)=>handleUserStoryChange(index,'points',val)}
          />

        </Paper>
      ))}

      {/* Button to add more user stories */}
      <Button
        variant="contained"
        sx={{ marginTop: 2, alignSelf: 'start' }}
        onClick={addNewStory}
      >
        Add New User Story
      </Button>
      {/* Button to save document  */}
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
