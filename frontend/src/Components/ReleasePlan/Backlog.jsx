import { useState } from 'react';
import {
  Card,
  CardContent,
  Input,
  List,
  ListItem,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Box
} from '@mui/material';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddIcon from '@mui/icons-material/Add';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Backlog = () => {

  const [backlogItems, setBacklogItems] = useState([
    { id: 'placeholder-1', type: 'story', description: 'Placeholder Item 1', isPlaceholder: true },
    { id: 'placeholder-2', type: 'spike', description: 'Placeholder Item 2', isPlaceholder: true }
  ]);

  const [backlogItemType, setBacklogItemType] = useState('story');
  const [role, setRole] = useState('');
  const [functionality, setFunctionality] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
  const [storyPoints, setStoryPoints] = useState(0);

  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialogForNewStory = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleAddBacklogItem = () => {
    const newBacklogItems = [...backlogItems, { type: backlogItemType, description: functionality, id: `item-${backlogItems.length}`, role, reasoning, acceptanceCriteria, storyPoints }];
    setBacklogItems(newBacklogItems);
    handleDialogClose();
  };


  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    const items = Array.from(backlogItems);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    setBacklogItems(items);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Typography
        variant="h6"
        marginLeft={2}
        textAlign={'left'}
        fontWeight="bold"
        fontSize={14}
      >
        Backlog
        <IconButton onClick={openDialogForNewStory} aria-label="add new story">
          <AddCircleOutlineIcon fontSize="small"/>
        </IconButton>
      </Typography>
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Story</DialogTitle>
        <DialogContent>
          <ToggleButtonGroup
            color="primary"
            value={backlogItemType}
            exclusive
            onChange={(e, newType) => setBacklogItemType(newType)}
            aria-label="User story type"
            fullWidth
            sx={{ marginBottom: 2 }}
          >
            <ToggleButton value="story">Story</ToggleButton>
            <ToggleButton value="spike">Spike</ToggleButton>
            <ToggleButton value="infrastructure">Infrastructure</ToggleButton>
          </ToggleButtonGroup>

          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Typography variant="body2" component="span">
              As a(n)
            </Typography>
            <TextField
              size="small"
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              fullWidth
            />
            <Typography variant="body2" component="span">
              I want to be able to
            </Typography>
          </Box>

          <TextField
            autoFocus
            margin="dense"
            id="functionality-description"
            label="Functionality Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={functionality}
            onChange={(e) => setFunctionality(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          <Typography variant="body2" component="span">
            so that
          </Typography>

          <TextField
            margin="dense"
            id="reasoning"
            label="Reasoning"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value)}
            sx={{ marginBottom: 2, marginTop: 2 }}
          />

          <TextField
            margin="dense"
            id="acceptance-criteria"
            label="Acceptance Criteria"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={acceptanceCriteria}
            onChange={(e) => setAcceptanceCriteria(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            margin="dense"
            id="story-points"
            label="Story Points"
            type="number"
            fullWidth
            variant="outlined"
            value={storyPoints}
            onChange={(e) => {
              if (!isNaN(e.target.value) && e.target.value.trim() !== '') {
                setStoryPoints(e.target.value);
              }
            }}
            InputProps={{
              inputProps: {
                min: 0 // Minimum value
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={() => {
            // add backlog item
            // const sprintId = items[index].id;
            // handleAddBacklogItem(sprintId);
          }}
            color="primary"
          >
            Create Story
          </Button>
        </DialogActions>
      </Dialog>

      <Droppable droppableId="backlogDroppable">
        {(provided) => (
          <Paper
            sx={{
              marginLeft: 2,
              backgroundColor: 'lightgray',
            }}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <List>
              {backlogItems.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Card
                        sx={{
                          marginBottom: 1,
                        }}
                      >
                        <CardContent>
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
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          </Paper>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Backlog;