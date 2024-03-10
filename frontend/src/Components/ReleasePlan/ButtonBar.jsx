import { Button, ButtonGroup, Typography } from '@mui/material';

const ButtonBar = () => {
    // TODO: update Placeholder functions with actual data
    const sprintPlanClick = () => console.log('Clicked Sprint Plan');
    const scrumBoardClick = () => console.log('Clicked Scrum Board');
    const burnupChartClick = () => console.log('Clicked Burnup Chart');
    const allSprintsClick = () => console.log('Clicked All Sprints');

  return (
    <ButtonGroup 
      fullWidth
      variant="contained" 
      sx={{
        margin: '5px 10px',
        height: '40px',
      }}
    >
      <Button
        onClick={sprintPlanClick}
      >
        <Typography fontWeight="bold">
          Sprint Plan
        </Typography>
        
      </Button>

      <Button
        onClick={scrumBoardClick}
      >
        <Typography fontWeight="bold">
          Scrum Board
        </Typography>
      </Button>

      <Button
        onClick={burnupChartClick}
      >
        <Typography fontWeight="bold">
          Burnup Chart
        </Typography>
      </Button>

      <Button
        onClick={allSprintsClick}
      >
        <Typography fontWeight="bold">
          All Sprints
        </Typography>
      </Button>
    </ButtonGroup>
  );
};

export default ButtonBar;
