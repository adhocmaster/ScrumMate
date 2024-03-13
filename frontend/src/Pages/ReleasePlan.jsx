import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { Grid, Divider } from '@mui/material';
import {IconButton} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Sprint from '../Components/ReleasePlan/Sprint';
import Sidebar from '../Components/ReleasePlan/Sidebar';
import ButtonBar from '../Components/ReleasePlan/ButtonBar';
import ContentBox from '../Components/common/ContentBox';
import DragList from '../Components/ReleasePlan/DragList';
import Backlog from '../Components/ReleasePlan/Backlog';
import SanityCheckGraph from '../Components/ReleasePlan/SanityCheckGraph';
import SanityCheckText from '../Components/ReleasePlan/SanityCheckText';

const ReleasePlan = () => {


  const addSprints = (sprintsnum) =>{

    const sprintsNum = sprints.length+1;

    const newSprints = <Sprint
    sprintValue = {sprintsnum}
    value = {sprintNumber}
    onChange={(e) => setSprintNumber(e.target.value)} 
    key={sprints.length}/>
    
    
    setSprints(prevSprints => [...prevSprints, newSprints])
  }

  const [sprints, setSprints] = useState([]);
  const [open, setOpen] = useState(true);
  const [problemStatement, setProblem] = useState("");
  const [highLevelGoals, setGoals] = useState("");
  const [releaseId, setId] = useState(1);

	const projectId = 1;

	function fetchMostRecentRelease(projectId, setProblem, setGoals, setId) {
		console.log("about to most recent release");
		var options = {
			method:'get',
			credentials:'include'
    };
		fetch(`http://localhost:8080/api/project/${projectId}/recentRelease`, options).then((result)=>{
			if(result.status === 200){
				console.log(result);
			}
			result.json().then((response)=>{
				console.log(response);
				setProblem(response.problemStatement);
				setGoals(response.goalStatement);
				setId(response.id);
			})
		})
	}

	function fetchRelease(releaseId, setProblem, setGoals) {
		console.log("about to fetch a release");
		var options = {
			method:'get',
			credentials:'include'
    };
		fetch(`http://localhost:8080/api/release/${releaseId}`, options).then((result)=>{
			if(result.status === 200){
				console.log(result)
			}
			result.json().then((response)=>{
				console.log(response);
				setProblem(response.problemStatement);
				setGoals(response.goalStatement);
			});
		});
	}

  function fetchSprints(releaseId) {
		var options = {
			method:'get',
			credentials:'include'
    }
		fetch(`http://localhost:8080/api/release/${releaseId}/sprints`, options).then((result)=>{
			if(result.status === 200){
				result.json().then((response)=>{
					setSprints(response)});
			} else {
				setSprints([]);
			}
    });
  }

  function createNewSprints(e) {
    e.preventDefault();
    const sprintNum = sprintNumber
    addSprints(sprintNum);
    var options = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sprintNum) //sends value to the backend.
    };
  
    fetch(`http://localhost:8080/api/release/${releaseId}/sprint`, options)
      .then((result) => {
        if (result.status === 200) {
          console.log(result);
        }
        return result.json();
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const [sprintNumber, setSprintNumber] = useState("");


  useEffect(() => {
    fetchMostRecentRelease(1, setProblem, setGoals, setId);
  }, []);

  useEffect(() => {
    fetchRelease(releaseId, setProblem, setGoals);
    fetchSprints(releaseId);
  }, [releaseId]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const revisionsClick = (newReleaseId) => {
    setId(newReleaseId);
  };

  return (
    <Grid container spacing={2}>
      {/* Revision Sidebar */}
      <Grid item xs={open ? 2 : 'auto'}>
        <Sidebar
          open={open}
          toggleDrawer={toggleDrawer}
          title={'Revisions'}
          items={[]}
          itemClick={revisionsClick}
        />
      </Grid>

      <Grid item xs={open ? 10 : 11}>
        {/* Current Sprint */}
        {/* TODO: update Sprint Number */}
        <Typography
          variant="h6"
          marginTop={8}
          marginBottom={2}
          marginLeft={1}
          textAlign={'left'}
          sx={{
            fontWeight: 'bold',
          }}
        >
          Current Sprint (#3):
        </Typography>

        <Box
          display="flex"
          justifyContent={'flex-start'}
        >
          {/* TODO: Handle Button Clicks */}
          <ButtonBar />
        </Box>

        <Divider
          sx={{
            margin: '20px 0px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            height: '1.5px'
          }}
        />

        <Typography
          marginBottom={2}
          marginLeft={1}
          textAlign={'left'}
          fontWeight="bold"
          fontSize={14}
        >
          Release Plan:
        </Typography>

        {/* TODO: Change version number */}
        <Typography
          textAlign="left"
          marginLeft={2}
          marginBottom={2}
          fontSize={14}
        >
          v1.0.0
        </Typography>

        {/* Problem Statement */}
        <ContentBox title={'Problem Statement'} content={problemStatement} />

        {/* High Level Goals */}
        <ContentBox title={'High Level Goals'} content={highLevelGoals} />

        <Grid container spacing={2}>
          {/* Sprints */}
          <Grid item xs={9}>
            <Typography
              marginLeft={4}
              textAlign="left"
              fontWeight="bold"
              fontSize={14}
            >
              Sprints

              
              <IconButton 
              sx={{ 
              marginBottom: "3px" }}
              onClick={createNewSprints}>
                <AddCircleOutlineIcon fontSize="small"/>
              </IconButton>
            </Typography>


            
            {sprints.map((sprint, index) =>(
              <div key={index}>{sprint}</div>
            ))}
        



            <DragList marginLeft={2} items={sprints} setItems={setSprints} releaseId={releaseId}/>
            {/* {sprints != [] ? <DragList items={sprints} setItems={setSprints}/>: ''} */}
          </Grid>

          {/* Backlog */}
          <Grid item xs={3}>
            <Backlog />
          </Grid>
        </Grid>

        {/* Sanity Check */}
        <Typography 
          variant="h5"
          fontWeight="bold" 
          gutterBottom
          fontSize={14} 
          textAlign="left"
          marginLeft={2} 
          marginTop={2}
        >
          Sanity Check
        </Typography>

        <Grid container spacing={2}>
          {/* Sanity Check Graph */}
          <Grid item xs={6}>
            <SanityCheckGraph />
          </Grid>

          <Grid item xs={6}> 
            <SanityCheckText 
              text={'Yes we can do it because no sprint looks like too much work. Lorem ipsum dolor sit amet …'}
            />
          </Grid>
        </Grid>

      </Grid>
    </Grid>
  );
};

export default ReleasePlan;
