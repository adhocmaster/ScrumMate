import React, { createContext, useContext, useState } from 'react';

const AgileContext = createContext();

export const AgileProvider = ({ children }) => {
    const [backlogItems, setBacklogItems] = useState([
		{ id: 'placeholder-1', type: 'story', description: 'Placeholder Item 1', isPlaceholder: true },
		{ id: 'placeholder-2', type: 'spike', description: 'Placeholder Item 2', isPlaceholder: true }
	  ]);

  const [stories, setStories] = useState([
    { id: '1', description: 'User Story 1', storyPoints: '5' },
    { id: '2', description: 'User Story 2', storyPoints: '8' }
  ]);

  const [sprints, setSprints] = useState([]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    // Determine if the operation is within the backlog or sprints
    const isSourceBacklog = source.droppableId === 'backlog';
    const isDestinationBacklog = destination.droppableId === 'backlog';

    let sourceItems = isSourceBacklog ? [...backlogItems] : [...sprints[parseInt(source.droppableId.replace('sprint-', ''), 10)].items];
    let destinationItems = isDestinationBacklog ? [...backlogItems] : [...sprints[parseInt(destination.droppableId.replace('sprint-', ''), 10)].items];

    // Remove the item from the source
    const [movedItem] = sourceItems.splice(source.index, 1);

    // If the destination is the same, use modified sourceItems
    if (source.droppableId === destination.droppableId) {
        sourceItems.splice(destination.index, 0, movedItem);
    } else {
        // Otherwise, add to the destinationItems
        destinationItems.splice(destination.index, 0, movedItem);
    }

    // Update states accordingly
    if (isSourceBacklog) {
        setBacklogItems(sourceItems);
    } else {
        const updatedSprints = [...sprints];
        updatedSprints[parseInt(source.droppableId.replace('sprint-', ''), 10)].items = sourceItems;
        setSprints(updatedSprints);
    }

    if (!isDestinationBacklog && source.droppableId !== destination.droppableId) {
        const updatedSprints = [...sprints];
        updatedSprints[parseInt(destination.droppableId.replace('sprint-', ''), 10)].items = destinationItems;
        setSprints(updatedSprints);
    } else if (isDestinationBacklog && source.droppableId !== destination.droppableId) {
        setBacklogItems(destinationItems);
    }
  };

  return (
    <AgileContext.Provider value={{ backlogItems, setBacklogItems, stories, setStories, onDragEnd }}>
      {children}
    </AgileContext.Provider>
  );
};

export const useAgile = () => useContext(AgileContext);
