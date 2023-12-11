import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom"
import { AppBar, Typography, Button, Box, Paper } from '@mui/material';
import { List, ListItem, ListItemText } from '@mui/material';
import CreateReleasePlan from '../Components/CreateReleasePlan'; // Adjust the import path as necessary


const ReleasePlan = () => {
  const [showCreateReleasePlan, setShowCreateReleasePlan] = useState(false);
  const [showReleasePlan, setShowReleasePlan] = useState(false);
  const [releasePlanText, setReleasePlanText] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const location = useLocation()
  const [project,setProject] = useState(location.state.currentProject)
  console.log(project)

  // Fetch release plans on page open
  useEffect(() => {
    const options = {
      method: "GET",
      url: `http://localhost:3001/projects/${project._id}`,
      credentials: 'include'
    }
    fetch(`http://localhost:3001/projects/${project._id}`, options).then((result) => {
      result.json().then((response) => {
        console.log(response)
        setProject(response)
        setReleasePlanText(response.releases || []);
      })
    })
  }, [project._id]);
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
      setReleasePlanText(savedReleasePlans || 'No release plan found.');
    }

  },[formSubmitted]);
  function formatStories(stories){
    
    // Display stories
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

  // Show create release plan form
  const toggleCreateReleasePlan = () => {
    setShowCreateReleasePlan(!showCreateReleasePlan);
  };

  // Show release plan
  const toggleViewReleasePlan = () => {
    if (!showReleasePlan) {
      console.log(savedReleasePlans);
      setReleasePlanText(savedReleasePlans || 'No release plan found.');
    }
    setShowReleasePlan(!showReleasePlan);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box display="flex" justifyContent="center" p={7}>
        <Paper elevation={3} sx={{ width: '80%', padding: 2 }}>
          <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: 2 }}>
            Release Plans
          </Typography>
          <Box display="flex" justifyContent="space-between" marginBottom={2}>
            <Button variant="contained" color="primary" onClick={toggleCreateReleasePlan}>
              {showCreateReleasePlan ? 'Hide Create Form' : 'Create Release Plan'}
            </Button>
          </Box>

          {/* Conditionally render the CreateReleasePlan component */}
          {showCreateReleasePlan && <CreateReleasePlan projectId={project._id} onFormSubmit = {()=>setFormSubmitted(true)}/>}

          {/* Display Release Plans */}
          <Paper elevation={2} sx={{ backgroundColor: '#e0e0e0', padding: 2, marginTop: 2 }}>
            {releasePlanText.length > 0 ? (
              // If there are release plans, map and display them
              releasePlanText.map((line, index) => (
                <Paper key={index}>
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      textAlign: 'center',
                      marginTop: 2,
                      marginBottom: 2
                    }}
                  >
                    {line.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      textAlign: 'center'
                    }}
                  >
                    High Level Goals:
                  </Typography>
                  <List>
                    {line.high_level_goals.map((goal, goalIndex) => (
                      <ListItem key={goalIndex}>
                        <ListItemText primary={goal} />
                      </ListItem>
                    ))}
                  </List>
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      textAlign: 'center'
                    }}
                  >
                    Stories
                  </Typography>
                  {formatStories(line.stories)}
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      textAlign: 'center'
                    }}
                  >
                    Status: {line.status}
                  </Typography>
                </Paper>
              ))
            ) : (
              // If there are no release plans, display a message
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: 'pre-wrap',
                  textAlign: 'center',
                  marginTop: 2,
                  marginBottom: 2
                }}
              >
                No Release Plans to display
              </Typography>
            )}
          </Paper>
        </Paper>
      </Box>
    </Box>
  );
};

export default ReleasePlan;
