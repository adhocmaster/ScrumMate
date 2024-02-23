import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom"
import { AppBar, Typography, Button, Box, Paper } from '@mui/material';
import { List, ListItem, ListItemText } from '@mui/material';
import CreateReleasePlan from '../Components/CreateReleasePlan'; // Adjust the import path as necessary
import { Grid } from '@mui/material';
import Sidebar from '../Components/Sidebar';
import ButtonGroup from '@mui/material/ButtonGroup';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';

const ReleasePlan = () => {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Grid
      container
      spacing={2}
    >
      <Grid 
        item
        xs={open ? 2 : 'auto'}
      >
        <Sidebar open={open} toggleDrawer={toggleDrawer} />
      </Grid>

      <Grid item xs>
        {/* TODO: update Sprint Number */}
        <Typography
          variant="h6"
          marginTop={8}
          marginBottom={2}
          marginLeft={1}
          textAlign={'left'}
          sx={{
            fontWeight: 'bold',
            fontSize: 32,
          }}
        >
          Sprint 3:
        </Typography>
        <Box
          display="flex"
          justifyContent={'flex-start'}
        >
          <ButtonGroup 
            fullWidth
            variant="contained" 
            sx={{
              margin: '5px 10px',
              height: '60px',
            }}
          >
            {/* TODO: Handle button clicks */}
            <Button
              onClick={() => console.log('Clicked Sprint Plan')}
            >
              <Typography
                fontWeight="bold"
              >
                Sprint Plan
              </Typography>
              
            </Button>

            <Button
              onClick={() => console.log('Clicked Scrum Board')}
            >
              <Typography
                fontWeight="bold"
              >
                Scrum Board
              </Typography>
            </Button>

            <Button
              onClick={() => console.log('Clicked Burnup Chart')}
            >
              <Typography
                fontWeight="bold"
              >
                Burnup Chart
              </Typography>
            </Button>

            <Button
              onClick={() => console.log('Clicked All Sprints')}
            >
              <Typography
                fontWeight="bold"
              >
                All Sprints
              </Typography>
            </Button>
          </ButtonGroup>
        </Box>
        
        <Divider 
          sx={{
            margin: '20px 0px', 
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            height: '1.5px'
          }}
        />

        <Typography
          variant="h6"
          marginBottom={2}
          marginLeft={1}
          textAlign={'left'}
          fontWeight="bold"
          fontSize={32}
        >
          Release Plan:
        </Typography>

        {/* TODO: Change version number */}
        <Typography
          textAlign="left"
          marginLeft={2}
          marginBottom={2}
        >
          v1.0.0
        </Typography>
        

        {/* Problem Statement */}
        <Typography
          variant="h6"
          marginBottom={2}
          marginLeft={2}
          textAlign={'left'}
          fontWeight="bold"
          fontSize={18}
          
        >
          Problem Statement
        </Typography>

        <Card
          sx={{
            minHeight: 100,
            maxWidth: '95%',
            marginLeft: 2,
            marginBottom: 2,
            backgroundColor: 'lightgray',
            borderRadius: 5,
          }}
        >
          <CardContent>
            <Typography textAlign='left'>
              {/* TODO: Add problem statement */}
              We noticed that there are currently no good websites for Professor Jullig to run CSE 115 on. 
              All the existing ones are lacking in functionality or have high cost.
            </Typography>
          </CardContent>
        </Card>

        {/* High Level Goals */}
        <Typography
          variant="h6"
          marginBottom={2}
          marginLeft={2}
          textAlign={'left'}
          fontWeight="bold"
          fontSize={18}
        >
          High Level Goals
        </Typography>

        <Card
          sx={{
            minHeight: 100,
            maxWidth: '95%',
            marginLeft: 2,
            marginBottom: 2,
            backgroundColor: 'lightgray',
            borderRadius: 5,
          }}
        >
          <CardContent>
            <Typography textAlign='left'>
              {/* TODO: Add high level goals */}
              In this release, we will implement the ability for students to join their class, join or create projects, create accounts, 
              and be able to reset their password. There will be users of different types and they will be able to interact with one 
              another in real time.
            </Typography>
          </CardContent>
        </Card>

        <Grid container spacing={2}>
          <Grid item xs={2.5}>
            <Typography
              variant="h6"
              marginLeft={2}
              textAlign={'left'}
              fontWeight="bold"
              fontSize={24}
              
            >
              Backlog
            </Typography>

            <Paper
              sx={{
                marginLeft: 2,
                backgroundColor: 'lightgray',
                borderRadius: 6,
              }}
            >
              {/* TODO: add Backlog items */}
              <List>
                <ListItem>
                  <Card
                    sx={{
                      marginBottom: 1,
                      borderRadius: 6,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        textAlign={'left'}
                        fontSize={16}
                      >
                        As a student I want to be able to reset my password in case I forget so that 
                        I do not lost access to all my account and data.
                      </Typography>
                    </CardContent>
                  </Card>
                </ListItem>
                <ListItem>
                  <Card
                    sx={{
                      marginBottom: 1,
                      borderRadius: 6,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        textAlign={'left'}
                        fontSize={16}
                      >
                        As a student I want to be able to reset my password in case I forget so that 
                        I do not lost access to all my account and data.
                      </Typography>
                    </CardContent>
                  </Card>
                </ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid item xs>
            <Typography
              variant="h6"
              marginLeft={2}
              textAlign={'left'}
              fontWeight="bold"
              fontSize={24}
              
            >
              Sprints
            </Typography>

            <Paper
              sx={{
                maxWidth: '95%',
                marginLeft: 2,
                backgroundColor: 'lightgray',
                borderRadius: 6,
              }}
            >
              {/* TODO: add Sprints */}
              <List>
                <ListItem>
                  <Card
                    sx={{
                      maxWidth: '25%',
                      marginBottom: 1,
                      borderRadius: 6,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        textAlign={'left'}
                        fontSize={16}
                      >
                        As a student I want to be able to reset my password in case I forget so that 
                        I do not lost access to all my account and data.
                      </Typography>
                    </CardContent>
                  </Card>
                </ListItem>
              </List>
            </Paper>
          </Grid>

        </Grid>

      </Grid>
    </Grid>
  );
};

export default ReleasePlan;
