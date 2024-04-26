import { useState } from "react";
import { Box, Divider, Typography, Paper, List } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import UserStory from "./UserStory";
import DeleteConfirmation from "./DeleteConfirmation";

const Sprint = ({ index, items, setItems, userStories }) => {
  const [stories, setStories] = useState(userStories);

  //Function to handle the reordering of stories (content within the cards).
  function reorderStories(result) {
    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    setStories((stories) => {
      const nums = [...stories];
      const [removed] = nums.splice(startIndex, 1);
      nums.splice(endIndex, 0, removed);
      return nums;
    });
  }

  const deleteSprint = (sprintId, index) => {
    fetch(`http://localhost:8080/api/sprint/${sprintId}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }).catch((error) => console.log("error deleting sprint:"));
    const updatedSprints = items.filter((_, i) => index !== i);
    setItems(updatedSprints);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newList = Array.from(userStories);
    const [removed] = newList.splice(result.source.index, 1);
    newList.splice(result.destination.index, 0, removed);
    setItems((prevItems) =>
      prevItems.map((item, idx) =>
        idx === index ? { ...item, userStories: newList } : item
      )
    );
  };

  return (
    <DragDropContext onDragEnd={reorderStories}>
      <Droppable droppableId={`droppable-${index}`} direction="horizontal">
        {(provided) => (
          <Box
            sx={{
              display: "flex",
              marginLeft: 2,
              marginBottom: 2,
              backgroundColor: "lightgray",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: "100%",
                  marginLeft: 2,
                }}
              >
                <Typography sx={{ marginTop: 2 }} fontSize={14}>
                  {index + 1}
                </Typography>
                <DeleteConfirmation
                  onDelete={() => {
                    const sprintId = items[index].id;
                    deleteSprint(sprintId, index);
                  }}
                />
                <Typography sx={{ marginBottom: 2 }} fontSize={14}>
                  8
                </Typography>
              </Box>
              <Box sx={{ height: "100%" }}>
                <Divider
                  orientation="vertical"
                  sx={{
                    marginTop: "10px",
                    marginLeft: "12px",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    width: "1.5px",
                    height: "88%",
                  }}
                />
              </Box>
            </Box>

            <Paper sx={{ backgroundColor: "lightgray", overflowX: "auto" }}>
              <List
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{ display: "flex", flexDirection: "row" }}
              >
                {stories.map((storyObj, idx) => (
                  <Draggable
                    key={storyObj.id}
                    draggableId={storyObj.id.toString()}
                    index={storyObj.rank}
                  >
                    {(provided) =>
                      console.log(storyObj) || (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{
                            minWidth: 200,
                            display: "inline-block",
                            padding: "8px 0px 8px 12px",
                          }}
                        >
                          <UserStory
                            storyObject={storyObj}
                            sprintId={items[index].id}
                          />
                        </div>
                      )
                    }
                  </Draggable>
                ))}

                {provided.placeholder}
              </List>
            </Paper>
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Sprint;
