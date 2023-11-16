import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, List, ListItem, ListItemText, Paper } from '@mui/material';

const ReleasePlan = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: 'navy', marginBottom: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ScrumMate
          </Typography>
          <Button color="inherit">Release Plan</Button>
          <Button color="inherit">Sprints</Button>
          <Button color="inherit">Log in</Button>
        </Toolbar>
      </AppBar>

      <Box display="flex" justifyContent="center" p={2}>
        <Paper elevation={3} sx={{ width: '80%', padding: 2 }}>
          <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: 2 }}>
            Release Plan
          </Typography>
          <Box display="flex" justifyContent="space-between" marginBottom={2}>
            <Button variant="contained" color="primary">
              Create Release Plan
            </Button>
            <Button variant="contained" color="primary">
              View Release Plan
            </Button>
          </Box>
          <Paper elevation={2} sx={{ backgroundColor: '#f0f0f0', padding: 2 }}>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
              Sprints
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Sprint 1:" />
              </ListItem>
              <Typography variant="body1" component="div">
                User story 1 for sprint 1
                <List sx={{ marginLeft: 4 }}>
                  <ListItem>
                    <ListItemText primary="Task for user story 1 (Completed)" />
                  </ListItem>
                  {/* Repeat for other tasks */}
                </List>
              </Typography>
              {/* Repeat for other user stories and sprints */}
            </List>
          </Paper>
        </Paper>
      </Box>
    </Box>
  );
};

export default ReleasePlan;

