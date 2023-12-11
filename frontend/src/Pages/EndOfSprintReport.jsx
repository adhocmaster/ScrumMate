import React from 'react';
import { Box, Typography, Paper, TextField, Button } from '@mui/material';

const EndOfSprintReport = () => {
  return (
    <Box p={2}>

      {/* Main Content Area */}
      <Box display="flex" justifyContent="space-between">
        {/* Left Column */}
        <Box width="40%" mr={2}>
          <Typography variant="h4" gutterBottom>End Of Sprint Report</Typography>
          <Paper elevation={2} sx={{ mb: 2, p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Completed User Stories</Typography>
            {/* List out completed user stories */}
            
            <Typography variant="h6" sx={{ mb: 2 }}>Incomplete User Stories</Typography>
            {/* List out incomplete user stories */}
            
            <Typography variant="h6" sx={{ mb: 2 }}>Completed Tasks</Typography>
            {/* List out completed tasks */}
            
            <Typography variant="h6" sx={{ mb: 2 }}>Incomplete Tasks</Typography>
            {/* List out incomplete tasks */}
          </Paper>
        </Box>

        {/* Right Column */}
        <Box width="58%">
          <Paper elevation={2} sx={{ height: '50%', mb: 2, p: 2 }}>
            <Typography variant="h6">Pie Graph of Completed Tasks vs Incomplete</Typography>
            {/* Placeholder for Pie Chart */}
          </Paper>
          <Paper elevation={2} sx={{ height: '50%', mb: 2, p: 2 }}>
            <Typography variant="h6">Insert Burn Up Chart</Typography>
            {/* Placeholder for Burn Up Chart */}
          </Paper>
          <TextField
            label="Input box for Team Member to Add Comments"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" sx={{ float: 'right' }}>
            End of Sprint Report
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EndOfSprintReport;
