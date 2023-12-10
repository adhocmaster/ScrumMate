import React,{useState,useEffect} from 'react';
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
import { useLocation } from "react-router-dom"
import CreateSprints from '../Components/CreateSprints';
import Modal from '@mui/material/Modal';


const SprintPage = () => {
  const location = useLocation()
  const [project,setProject] = useState(location.state.currentProject)
  const [showCreateSprints, setShowCreateSprints] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false);

  console.log(project)

  const toggleCreateSprints = () => {
    setShowCreateSprints(!showCreateSprints);
  };
  useEffect(()=>{
    console.log(project._id)
    if(formSubmitted){
      //add fetch here
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
      console.log("ITS SUBMITTED")
      setFormSubmitted(false);
    }

  },[formSubmitted])
  function displaySprintBar(){
    if(project.sprints.length>0){
      console.log("nothing")
      return(
      <List component="nav" aria-label="sprint folders">
      {/* Map through your sprint list or hard code as below */}
        <ListItem button>
          <ListItemText primary="Planning Poker" />
        </ListItem>
      </List>
      )
    }else{
      return(
        <List component="nav" aria-label="sprint folders">
            {/* Map through your sprint list or hard code as below */}
            <ListItem button>
              <ListItemText primary="Planning Poker" />
            </ListItem>
            <Divider />

            <ListItem button disabled>
              <ListItemText primary="There Are No Sprints For This Project Yet" />
            </ListItem>
            {/* Repeat for other sprints */}
          </List>
      )
    }
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: 'navy', marginBottom: 4 }}>
      </AppBar>

      <Box display="flex" justifyContent="center" p={2}>
        <Box width="20%" mr={2}>
          <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: 2 }}>
            Sprints
          </Typography>
            {displaySprintBar()}
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
        <Button variant="contained" color="primary" onClick= {()=>toggleCreateSprints()} sx={{ marginBottom: 2,marginRight:2 }}>
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

