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
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Backlog = () => {
  const [backlogItems, setBacklogItems] = useState([
    { id: 'placeholder-1', type: 'story', description: 'Placeholder Item 1', isPlaceholder: true },
    { id: 'placeholder-2', type: 'spike', description: 'Placeholder Item 2', isPlaceholder: true }
  ]);
  const [newBacklogType, setNewBacklogType] = useState('story');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newBacklogDescription, setNewBacklogDescription] = useState('');

  const handleAddBacklogItem = () => {
    const newBacklogItems = [...backlogItems, { type: newBacklogType, description: newBacklogDescription, id: `item-${backlogItems.length}` }];
    setBacklogItems(newBacklogItems);
    setDialogOpen(false); // Close the dialog
    setNewBacklogDescription(''); // Reset for the next item
    setNewBacklogType('story'); // Reset the type for the next item
  };

  const addBacklogItem = () => {
    setDialogOpen(true); // This triggers the dialog to open
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
      </Typography>

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
    </DragDropContext>
  );
};

export default Backlog;