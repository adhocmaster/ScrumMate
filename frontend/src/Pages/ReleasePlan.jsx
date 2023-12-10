import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom"
import { AppBar, Typography, Button, Box, Paper } from '@mui/material';
import { List, ListItem, ListItemText } from '@mui/material';
import CreateReleasePlan from '../Components/CreateReleasePlan'; // Adjust the import path as necessary


const ReleasePlan = () => {
  const [showCreateReleasePlan, setShowCreateReleasePlan] = useState(false);
  const [showReleasePlan, setShowReleasePlan] = useState(false);
  const [releasePlanText, setReleasePlanText] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const location = useLocation()
  const [project,setProject] = useState(location.state.currentProject)
  console.log(project)
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
      toggleCreateReleasePlan()
      toggleViewReleasePlan()
    }

  },[formSubmitted])
  function formatStories(stories){
    
    if (stories.length>0){
      return(
        <Paper>
          <List>

          {stories.map((story,index)=>(
            <div key = {index}>
            <ListItem>
              <Typography sx={{ textAlign: 'center', marginTop: 1, fontSize:16 }}>
                User Story {index+1}
              </Typography>
            </ListItem>
            <ListItem>

              <Typography sx={{ textAlign: 'left', fontSize:12 }}>
                Description: {story.description}                
              </Typography>
            </ListItem>
            <ListItem>
              <Typography sx={{ textAlign: 'left', fontSize:12 }}>
                  Notes: {story.notes}                
              </Typography>
            </ListItem>
            <ListItem>
              <Typography sx={{ textAlign: 'left', fontSize:12 }}>
                Points: {story.points}
              </Typography>
            </ListItem>

            </div> 
          ))}
        </List>
      </Paper>
      )
    }else{
      return(
        <Typography>
          No Stories Added Yet
        </Typography>
      )
    }

  }
  const savedReleasePlans = project.releases
  const toggleCreateReleasePlan = () => {
    setShowCreateReleasePlan(!showCreateReleasePlan);
  };

  const toggleViewReleasePlan = () => {
    if (!showReleasePlan) {
      // Retrieve the saved release plan from localStorage if we're going to show it
      
      console.log(savedReleasePlans)
      setReleasePlanText(savedReleasePlans || 'No release plan found.');
    }
    setShowReleasePlan(!showReleasePlan);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: 'navy', marginBottom: 4 }}>
        {/* AppBar content can go here */}
      </AppBar>

      <Box display="flex" justifyContent="center" p={2}>
        <Paper elevation={3} sx={{ width: '80%', padding: 2 }}>
          <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: 2 }}>
            Release Plan
          </Typography>
          <Box display="flex" justifyContent="space-between" marginBottom={2}>
            <Button variant="contained" color="primary" onClick={toggleCreateReleasePlan}>
              {showCreateReleasePlan ? 'Hide Create Form' : 'Create Release Plan'}
            </Button>
            <Button variant="contained" color="primary" onClick={toggleViewReleasePlan}>
              {showReleasePlan ? 'Hide Release Plan' : 'View Release Plan'}
            </Button>
          </Box>

          {/* Conditionally render the CreateReleasePlan component */}
          {showCreateReleasePlan && <CreateReleasePlan projectId={project._id} onFormSubmit = {()=>setFormSubmitted(true)}/>}

          {/* Conditionally render the release plan text */}
          {showReleasePlan && (
            <Paper elevation={2} sx={{ backgroundColor: '#e0e0e0', padding: 2, marginTop: 2 }}>
              {/* Split the text into lines and apply different styles to the first line and the rest */}
              {releasePlanText.map((line, index) => (
                

                <Paper key = {index}>
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      textAlign: 'center',  // Justify the first line, left-align the rest
                      marginTop:2,
                      marginBotttom:2
                    }}
                  >
                    {line.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      textAlign: 'center' // Justify the first line, left-align the rest
                    }}
                  >
                    High Level Goals: 
                  </Typography>
                  <List>
                    {line.high_level_goals.map((line,index)=>(
                      <ListItem key = {index}>
                        <ListItemText primary={line} />
                      </ListItem>
                    ))} 
                  </List>
                  <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    textAlign: 'center' // Justify the first line, left-align the rest
                  }}
                  >
                  Stories
                  </Typography>
                   {formatStories(line.stories)}


                  <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    textAlign: 'center' // Justify the first line, left-align the rest
                  }}
                  >
                    Status: {line.status}
                  </Typography>
                </Paper>



              ))}
            </Paper>
          )}

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
