import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Slider } from '@mui/material';

const PlanningPoker = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedSprintIndex, setSelectedSprintIndex] = useState(0);
  const [storyPoints, setStoryPoints] = useState(20); // Initialize the story points with a default value

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleSprintSelect = (index) => {
    setSelectedSprintIndex(index);
    toggleForm();
  };

  const handleSliderChange = (event, newValue) => {
    setStoryPoints(newValue);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Planning Poker
      </Typography>

      {/* Display a list of sprints */}
      {/* Replace this section with your actual list of sprints */}
      <Box>
        <Button
            variant="contained"
            color="primary"
            onClick={() =>
                showForm ? toggleForm() : handleSprintSelect(0)
            }
            >
            {showForm ? 'Close' : 'Play'}
        </Button>
        {/* Add more buttons for other sprints */}
      </Box>

      {showForm && (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Assign story points
          </Typography>

          {/* Add your planning poker form components here */}
          {/* For example, you can use TextFields or other form elements */}
          <Typography variant="h6">Story Points: {storyPoints}</Typography>
          <Slider
            aria-label="Story Points"
            defaultValue={storyPoints}
            getAriaValueText={(value) => `${value}`}
            step={1}
            marks
            min={0}
            max={100}
            valueLabelDisplay="auto"
            onChange={handleSliderChange}
          />

          {/* Add more form elements as needed */}
          <Button variant="contained" color="primary" onClick={toggleForm}>
            Save
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default PlanningPoker;
