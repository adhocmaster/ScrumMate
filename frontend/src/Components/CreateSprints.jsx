import React, { useState } from 'react'
import { Box, Button, TextareaAutosize, Typography, Paper } from '@mui/material'
import Slider from '@mui/material/Slider'
const marks = [
  {
    value: 0,
    label: '0'
  },
  {
    value: 10,
    label: '10'
  },
  {
    value: 20,
    label: '20'
  },
  {
    value: 30,
    label: '30'
  },
  {
    value: 40,
    label: '40'
  },
  {
    value: 50,
    label: '50'
  },
  {
    value: 60,
    label: '60'
  },
  {
    value: 70,
    label: '70'
  },
  {
    value: 80,
    label: '80'
  },
  {
    value: 90,
    label: '90'
  },
  {
    value: 100,
    label: '100'
  }
]
const CreateSprints = ({ projectId, onFormSubmit }) => {
  const [userStories, setUserStories] = useState([{ description: '', notes: '', points: 20 }]) // Array of user stories
  const [spikes, setSpikes] = useState(['']) // Array of goals
  const handleUserStoryChange = (index, field, value) => {
    console.log(index, field, value)
    const updatedStories = userStories.map((story, idx) => {
      if (idx === index) {
        return { ...story, [field]: value }
      }
      return story
    })
    setUserStories(updatedStories)
  }

  const addNewStory = () => {
    setUserStories([...userStories, { description: '', notes: '', points: 20 }])
  }

  function valuetext (value) {
    return `${value}`
  }

  const handleSpikeChange = (index, event) => {
    const newSpikes = [...spikes]
    newSpikes[index] = event.target.value
    setSpikes(newSpikes)
  }

  const addNewSpike = () => {
    setSpikes([...spikes, '']) // Add a new empty goal
  }
  const handleSaveDocument = () => {
    console.log(projectId, spikes, userStories)
    // create Fetch here
    const SprintData = {
      spikes,
      user_stories: userStories
    }

    const options = {
      url: `http://localhost:3001/projects/${projectId}/sprint/`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(SprintData)
    }
    fetch(`http://localhost:3001/projects/${projectId}/sprint/`, options).then((result) => {
      console.log(result)
      if (result.status === 200) {
        console.log(result)
        onFormSubmit()
      }
    })
    onFormSubmit()
  }
  return (
        <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          margin: 2,
          marginLeft: 'auto',
          padding: 2
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: 2, marginTop: 2 }}>
          Create Sprint Document
        </Typography>

        <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2 }}>
          Spikes
        </Typography>
        {spikes.map((goal, index) => (
          <TextareaAutosize
            key={index}
            minRows={3}
            placeholder="Enter Spike..."
            style={{ width: '95%', padding: '10px', marginBottom: '10px' }}
            value={goal}
            onChange={(e) => handleSpikeChange(index, e)}
          />
        ))}
        <Button
          variant="contained"
          sx={{ marginTop: 2, alignSelf: 'start' }}
          onClick={addNewSpike}
        >
          Add New Spike
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
              style={{ width: '95%', padding: '10px', marginBottom: '10px' }}
              value={story.description}
              onChange={(e) => handleUserStoryChange(index, 'description', e.target.value)}
            />
            <TextareaAutosize
              minRows={3}
              placeholder="Enter notes..."
              style={{ width: '95%', padding: '10px', marginBottom: '10px' }}
              value={story.notes}
              onChange={(e) => handleUserStoryChange(index, 'notes', e.target.value)}
            />

            <Typography variant="h6">Story Points</Typography>
            <Slider
              aria-label="Always visible"
              defaultValue={20}
              getAriaValueText={valuetext}
              step={1}
              marks={marks}
              valueLabelDisplay="on"
              onChange = {(e, val) => handleUserStoryChange(index, 'points', val)}
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
          sx={{ marginTop: 2, marginBottom: 2, alignSelf: 'center' }}
          onClick={handleSaveDocument}
        >
          Save Sprint
        </Button>
      </Box>
  )
}

export default CreateSprints
