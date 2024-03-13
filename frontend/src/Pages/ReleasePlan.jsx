import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, Paper } from '@mui/material';
import { List, ListItem } from '@mui/material';
import { Grid, Input, Divider, Card, CardContent } from '@mui/material';
import Sidebar from '../Components/Sidebar';
import ButtonBar from '../Components/ButtonBar';
import ContentBox from '../Components/ContentBox';
import Sprint from '../Components/Sprint';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import DragList from '../Components/DragList';

const ReleasePlan = () => {
  const [sprints, setSprints] = useState([]);
  const [open, setOpen] = useState(true);
  const [problemStatement, setProblem] = useState("");
  const [highLevelGoals, setGoals] = useState("");
  const [releaseId, setId] = useState(1);
  const [backlogItems, setBacklogItems] = useState([]);
  const [newBacklogType, setNewBacklogType] = useState('story');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newBacklogDescription, setNewBacklogDescription] = useState('');


	const projectId = 1;
	
	function fetchMostRecentRelease(projectId, setProblem, setGoals, setId) {
		console.log("about to most recent release")
		var options = {
			method:'get',
			credentials:'include'
		  }
		fetch(`http://localhost:8080/api/project/${projectId}/recentRelease`, options).then((result)=>{
			if(result.status === 200){
				console.log(result)
			}
			result.json().then((response)=>{
				console.log(response)
				setProblem(response.problemStatement)
				setGoals(response.goalStatement)
				setId(response.id)
			})
		})
	}

	function fetchRelease(releaseId, setProblem, setGoals) {
		console.log("about to fetch a release")
		var options = {
			method:'get',
			credentials:'include'
		  }
		fetch(`http://localhost:8080/api/release/${releaseId}`, options).then((result)=>{
			if(result.status === 200){
				console.log(result)
			}
			result.json().then((response)=>{
				console.log(response)
				setProblem(response.problemStatement)
				setGoals(response.goalStatement)
			})
		})
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

  useEffect(() => {
    fetchMostRecentRelease(1, setProblem, setGoals, setId);
  }, []);

  useEffect(() => {
    fetchRelease(releaseId, setProblem, setGoals);
    fetchSprints(releaseId)
  }, [releaseId]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const addBacklogItem = () => {
    setDialogOpen(true); // This triggers the dialog to open
  };

  const handleAddBacklogItem = () => {
    const newBacklogItems = [...backlogItems, { type: newBacklogType, description: newBacklogDescription }];
    setBacklogItems(newBacklogItems);
    setDialogOpen(false); // Close the dialog
    setNewBacklogDescription(''); // Reset for the next item
    setNewBacklogType('story'); // Reset the type for the next item
  };

  //data for sanity check
  const barData = [
    {pointsCompleted: 20 },
    {pointsCompleted: 30 },
    {pointsCompleted: 40 },
    {pointsCompleted: 35 },
    {pointsCompleted: 45 },
  ];

  // TODO: update Placeholder functions/variables with actual data
  const sprintPlanClick = () => console.log('Clicked Sprint Plan');
  const scrumBoardClick = () => console.log('Clicked Scrum Board');
  const burnupChartClick = () => console.log('Clicked Burnup Chart');
  const allSprintsClick = () => console.log('Clicked All Sprints');
  
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
          <ButtonBar
            text1={'Sprint Plan'}
            text2={'Scrum Board'}
            text3={'Burnup Chart'}
            text4={'All Sprints'}
            text1Click={sprintPlanClick}
            text2Click={scrumBoardClick}
            text3Click={burnupChartClick}
            text4Click={allSprintsClick}
          />
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
        {/* Problem Statement
        {/* TODO: replace problem statement */}
        {/* <ContentBox title={'Problem Statement'} content={problemStatement} /> */}

        {/* High Level Goals */}
        {/* TODO: high level goals */}
        {/* <ContentBox title={'High Level Goals'} content={highLevelGoals} /> */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ContentBox sx={{width: '100%'}} title={'Problem Statement'} content={problemStatement} />
          </Grid>
          <Grid item xs={12}>
            <ContentBox sx={{width: '100%'}} title={'High Level Goals'} content={highLevelGoals} />
          </Grid>
        </Grid>
        
        <Grid container spacing={2}>
          {/* Sprints */}
          <Grid item xs={9}>
            <Typography
              marginLeft={1}
              textAlign="left"
              fontWeight="bold"
              fontSize={14}
            >
              Sprints
            </Typography>

            <DragList items={sprints} setItems={setSprints} releaseId={releaseId}/>
            {/* {sprints != [] ? <DragList items={sprints} setItems={setSprints}/>: ''} */}
          </Grid>

          <Grid item xs={3}>
            <Typography
              variant="h6"
              // marginLeft={2}
              textAlign={'left'}
              fontWeight="bold"
              fontSize={14}
            >
              Backlog
            </Typography>

            <Paper
              sx={{
                // maxWidth: '90%',
                // marginLeft: 2,
                backgroundColor: 'lightgray',
                overflow: 'auto', // scrollable
              }}
            >
              <List>
                {backlogItems.map((item, index) => (
                  <ListItem key={index}>
                    <Card
                      sx={{
                        marginBottom: 1,
                      }}
                    >
                      <CardContent>
                        sx={{
                          display: 'flex',
                          alignItems: 'center', // alignment
                          justifyContent: 'space-between', // Adjust based on your layout needs
                        }}
                        <Typography
                          variant="body1"
                          fontSize={14}
                        >
                          <Input
                            type="text"
                            value={item.description}
                            onChange={(e) => {
                              const newBacklogItems = [...backlogItems];
                              newBacklogItems[index].description = e.target.value;
                              setBacklogItems(newBacklogItems);
                            }}
                            placeholder="Enter backlog item"
                            style={{ border: 'none', width: '100%', padding: '4px' }}
                          />
                        </Typography>
                      </CardContent>
                    </Card>
                  </ListItem>
                ))}
              </List>
              {/* Button to add new backlog item */}
              <Button
                variant="contained"
                onClick={addBacklogItem}
                sx={{
                  bgcolor: 'grey',
                    '&:hover': {
                      bgcolor: 'darkgrey', // Background color on hover
                    },
                  }}
                >
                Add Backlog Item +
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Sanity Checks */}
        <Typography variant="h5" fontWeight="bold" gutterBottom fontSize={14} textAlign="left" marginLeft={2}>
          Sanity Check
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} 
          // marginLeft={1}
          >
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' ,height: '200px' }}>
              <Box display="flex" flexDirection="column" alignItems="flex-start" marginLeft={2}>
                {barData.map((data, index) => (
                  <Box key={index} display="flex" alignItems="center" marginBottom={1} >
                    <Box width={data.pointsCompleted * 5} height={30} bgcolor="darkgrey" />
                    <Typography marginLeft={2} variant="body2">
                      {data.pointsCompleted}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={6}> 
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', backgroundColor: 'lightgray', height: '200px' }}>
              <Typography variant="body1" align="left">
                Yes we can do it because no sprint looks like too much work. Lorem ipsum dolor sit amet …
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Add New</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              value={newBacklogType}
              label="Type"
              onChange={(e) => setNewBacklogType(e.target.value)}
            >
              <MenuItem value="story">Story</MenuItem>
              <MenuItem value="spike">Spike</MenuItem>
              <MenuItem value="infrastructure">Infrastructure</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            id="description"
            label="As a user..."
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={newBacklogDescription}
            onChange={(e) => setNewBacklogDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddBacklogItem}>Add Item</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default ReleasePlan;
