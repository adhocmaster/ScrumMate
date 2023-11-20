import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider
} from '@mui/material';

const SprintPage = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: 'navy', marginBottom: 4 }}>
      </AppBar>

      <Box display="flex" justifyContent="center" p={2}>
        <Box width="20%" mr={2}>
          <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: 2 }}>
            Sprints
          </Typography>
          <List component="nav" aria-label="sprint folders">
            {/* Map through your sprint list or hard code as below */}
            <ListItem button>
              <ListItemText primary="Planning Poker" />
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemText primary="Sprint 1" />
            </ListItem>
            {/* Repeat for other sprints */}
          </List>
        </Box>

        <Paper elevation={3} sx={{ width: '60%', padding: 2 }}>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Sprints
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Sprint 1:" />
            </ListItem>
            <List component="div" disablePadding>
              {/* Repeat this structure for each user story */}
              <ListItem button sx={{ pl: 4 }}>
                <ListItemText primary="User story 1 for sprint 1" />
              </ListItem>
              <List component="div" disablePadding sx={{ pl: 4 }}>
                {/* Repeat for tasks */}
                <ListItem button>
                  <ListItemText primary="Task for user story 1 (Completed)" />
                </ListItem>
                {/* Repeat for other tasks */}
              </List>
            </List>
            {/* Repeat structure for Sprint 2 and subsequent sprints */}
          </List>
        </Paper>
      </Box>
      <Box display="flex" justifyContent="flex-end" p={2}>
        <Button variant="contained" color="primary" sx={{ marginBottom: 2 }}>
          End of Sprint Report
        </Button>
      </Box>
    </Box>
  );
};

export default SprintPage;

