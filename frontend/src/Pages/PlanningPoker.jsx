import React, { useState } from 'react'
import { Box, Typography, TextField, Button, Paper } from '@mui/material'

const PlanningPoker = () => {
  const [userStory, setUserStory] = useState('')
  const [description, setDescription] = useState('')
  const [notes, setNotes] = useState('')
  const [storyPoints, setStoryPoints] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle the submission of the form data
    console.log({ userStory, description, notes, storyPoints })
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={2} sx={{ padding: 4, width: '50%', maxWidth: '500px' }}>
        <Typography variant="h5" align="center" mb={4}>Planning Poker</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="User Story (x)"
            fullWidth
            margin="normal"
            value={userStory}
            onChange={(e) => setUserStory(e.target.value)}
          />
          <TextField
            label="Story Description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label="Notes"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <TextField
            label="Enter Story Point Value:"
            fullWidth
            margin="normal"
            value={storyPoints}
            onChange={(e) => setStoryPoints(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ display: 'block', margin: 'auto', mt: 3 }}>
            Submit
          </Button>
        </form>
      </Paper>
    </Box>
  )
}

export default PlanningPoker
