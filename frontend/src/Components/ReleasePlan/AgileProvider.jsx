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

  const reorderBacklogItems = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const startIndex = source.index;
    const endIndex = destination.index;

    setBacklogItems((items) => {
        const newItems = [...items];
        const [movedItem] = newItems.splice(startIndex, 1);
        newItems.splice(endIndex, 0, movedItem);
        return newItems;
    });
  };

  function reorderStories(result) {
		const startIndex = result.source.index;
		const endIndex = result.destination.index;

		setStories((stories) => {
			const nums = [...stories];
			const [removed] = nums.splice(startIndex, 1);
			nums.splice(endIndex, 0, removed);
			return nums;
		})
	}


  const onDragEnd = (result) => {
    const { source, destination } = result;
    console.log(result);

    if (!destination) return;
    if (source.droppableId === "backlogDroppable" && destination.droppableId === "backlogDroppable") {
        reorderBacklogItems(result);
        return;
    } 
    if (source.droppableId === "userstoryDroppable" && destination.droppableId === "userstoryDroppable") {
        reorderStories(result);
        return;
    }
  };

  return (
    <AgileContext.Provider value={{ backlogItems, setBacklogItems, stories, setStories, onDragEnd }}>
      {children}
    </AgileContext.Provider>
  );
};

export const useAgile = () => useContext(AgileContext);
