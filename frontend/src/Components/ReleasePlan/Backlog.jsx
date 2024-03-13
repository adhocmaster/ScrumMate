import { useState } from 'react';
import { 
  Card,
  CardContent, 
  Input, List, 
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

const Backlog = () => {
  const [backlogItems, setBacklogItems] = useState([]);
  const [newBacklogType, setNewBacklogType] = useState('story');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newBacklogDescription, setNewBacklogDescription] = useState('');

  const handleAddBacklogItem = () => {
    const newBacklogItems = [...backlogItems, { type: newBacklogType, description: newBacklogDescription }];
    setBacklogItems(newBacklogItems);
    setDialogOpen(false); // Close the dialog
    setNewBacklogDescription(''); // Reset for the next item
    setNewBacklogType('story'); // Reset the type for the next item
  };

  const addBacklogItem = () => {
    setDialogOpen(true); // This triggers the dialog to open
  };

  return (
    <>
      <Typography
        variant="h6"
        marginLeft={2}
        textAlign={'left'}
        fontWeight="bold"
        fontSize={14}
      >
        Backlog
      </Typography>

      <Paper
        sx={{
          // maxWidth: '90%',
          marginLeft: 2,
          backgroundColor: 'lightgray',
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

      {/* Dialog to add new backlog item */}
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
    </>
  );
};

export default Backlog;
