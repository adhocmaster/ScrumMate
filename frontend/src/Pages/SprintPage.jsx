import React,{useState,useEffect} from 'react';
import {
  AppBar,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider
} from '@mui/material';
import { useLocation } from "react-router-dom"
import CreateSprints from '../Components/CreateSprints';
import Modal from '@mui/material/Modal';
import PlanningPoker from '../Components/PlanningPoker'; // Import the PlanningPoker component



const SprintPage = () => {
  const location = useLocation()
  const [project,setProject] = useState(location.state.currentProject)
  const [showCreateSprints, setShowCreateSprints] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedSprintIndex, setSelectedSprintIndex] = useState(0);
  const [showPlanningPoker, setShowPlanningPoker] = useState(false);

  // Create sprint form
  const toggleCreateSprints = () => {
    setShowCreateSprints(!showCreateSprints);
    setShowPlanningPoker(false); 
  };

  // Open planning poker UI
  const openPlanningPoker = () => {
    setShowPlanningPoker(true);
    setShowCreateSprints(false); 
  };

  // Fetch project data
  useEffect(()=>{
    console.log(project._id)
    const options = {
      method:"GET",
      url:`http://localhost:3001/projects/${project._id}`,
      credentials:'include'
    }
    fetch(`http://localhost:3001/projects/${project._id}`,options).then((result)=>{
      result.json().then((response)=>{
        console.log(response)
        setProject(response)

      })
    })
    if(formSubmitted){
      setFormSubmitted(false);
    }
  },[formSubmitted])

  // Display sprints in a list
  function displaySprintBar() {
    return (
      <Box sx={{ maxHeight: '500px', overflowY: 'auto' }}>
        <List component="nav" aria-label="sprint folders">
          <ListItem button onClick={openPlanningPoker}>
            <ListItemText primary="Planning Poker" />
          </ListItem>
          <Divider />
          {project.sprints && project.sprints.length > 0 ? (
            project.sprints.map((sprint, index) => (
              <React.Fragment key={index}>
                <ListItem button onClick={() => {
                  setSelectedSprintIndex(index);
                  setShowPlanningPoker(false); // Close Planning Poker if another sprint is clicked
                }}>
                  <ListItemText primary={`Sprint ${index + 1}`} />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          ) : (
            // No sprints created yet
            <ListItem button disabled>
              <ListItemText primary="There Are No Sprints For This Project Yet" />
            </ListItem>
          )}
        </List>
      </Box>
    );
  }

  // Display respective sprint data 
  function displaySprintData() {
    if (project.sprints && project.sprints.length > 0) {
        const selectedSprint = project.sprints[selectedSprintIndex];

        if (selectedSprint) {
            return (
                <List>
                    {/* Display spikes */}
                    <ListItem>
                        <ListItemText 
                            primary="Spikes"
                            secondary={selectedSprint.spikes && selectedSprint.spikes.length > 0 ? selectedSprint.spikes.join(', ') : 'No spikes'}
                        />
                    </ListItem>

                    {/* Display user stories */}
                    {selectedSprint.stories && selectedSprint.stories.map((story, storyIndex) => (
                        <React.Fragment key={storyIndex}>
                            <ListItem button sx={{ pl: 4 }}>
                                <ListItemText primary={`User Story ${storyIndex + 1}: ${story.description}`} />
                            </ListItem>
                            <ListItem sx={{ pl: 4 }}>
                                <ListItemText secondary={`Notes: ${story.notes}`} />
                            </ListItem>
                            <ListItem sx={{ pl: 4 }}>
                                <ListItemText secondary={`Story Points: ${story.points}`} />
                            </ListItem>
                            {story.tasks && story.tasks.map((task, taskIndex) => (
                                <ListItem button key={taskIndex} sx={{ pl: 8 }}>
                                    <ListItemText primary={`${task.name} (${task.completed ? 'Completed' : 'Pending'})`} />
                                </ListItem>
                            ))}
                        </React.Fragment>
                    ))}
                </List>
            );
        } else {
            return <Typography sx={{ padding: 2 }}>No user stories in this sprint.</Typography>;
        }
    } else {
        return <Typography sx={{ padding: 2 }}>There are no sprints for this project yet.</Typography>;
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box display="flex" justifyContent="center" p={7}>
        {/* Display list of sprints */}
        <Box width="20%" mr={2}>
          <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: 2 }}>
            Sprints
          </Typography>
            {displaySprintBar()}
        </Box>

        <Paper elevation={3} sx={{ width: '60%', padding: 2 }}>

          {/* Display sprint data */}
          <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: 2 }}>
            Sprint {selectedSprintIndex + 1}
          </Typography>
          {/* Conditionally render the PlanningPoker component */}
          {showPlanningPoker && <PlanningPoker />}
          {displaySprintData()}
        </Paper>
      </Box>
      <Modal
        open = {showCreateSprints}
        sx = {{
          overflow:'scroll',
          width:"100%"
        }}
      >
        <Box
          justifyContent="center"
        >
          <Paper>
            <CreateSprints projectId={project._id} onFormSubmit = {()=>{
              setFormSubmitted(true)
              setShowCreateSprints(false)
            }
          }/>
          </Paper>
      </Box>
      </Modal>
      <Box display="flex" justifyContent="flex-end" p={2}>
        {/* Buttons to open create sprint form & end of sprint report */}
        <Button variant="contained" color="primary" onClick={() => toggleCreateSprints()} sx={{ marginBottom: 2, marginRight: 2 }}>
          Add Sprints
        </Button>
        <Button variant="contained" color="primary" sx={{ marginBottom: 2 }}>
          End of Sprint Report
        </Button>
      </Box>
    </Box>
  );
};

export default SprintPage;
