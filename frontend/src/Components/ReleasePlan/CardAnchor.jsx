// import { useState } from "react";

// export default function CardAnchor({ }) {
// 	const [anchorOpen, setAnchorOpen] = useState(false);
// 	const [editDialogOpen, setEditDialogOpen] = useState(false);
// 	const [pokerDialogOpen, setPokerDialogOpen] = useState(false);
// 	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
// 	const [showAcceptanceCriteria, setShowAcceptanceCriteria] = useState(false);
// 	const [editActionDialogOpen, setEditActionDialogOpen] = useState(false);

// 	const handleMenuClick = (event) => {
// 		setAnchorOpen(event.currentTarget);
// 	};

// 	const handleMenuClose = () => {
// 		setAnchorOpen(false);
// 	};

// 	const handleToggleAcceptanceCriteria = () => {
// 		setShowAcceptanceCriteria(!showAcceptanceCriteria);
// 	}

// 	const handleEditDialogOpen = () => {
// 		setTempBacklogItemType(backlogItemType);
// 		setTempRole(role);
// 		setTempFunctionality(functionality);
// 		setTempReasoning(reasoning);
// 		setTempAcceptanceCriteria(acceptanceCriteria);
// 		setTempStoryPoints(storyPoints);
// 		setTempPriority(priority);
// 		setEditDialogOpen(true);
// 		handleMenuClose();
// 	};

// 	const handleEditDialogClose = () => {
// 		setEditDialogOpen(false);
// 	};

// 	const handleEditActionDialogOpen = () => {
// 		setTempActionType(actionType)
// 		setTempActionDescription(actionDescription)
// 		setTempActionPriority(actionPriority)
// 		setEditActionDialogOpen(true);
// 		handleMenuClose();
// 	};

// 	const handleEditActionDialogClose = () => {
// 		setEditActionDialogOpen(false);
// 	};

// 	const handlePokerDialogOpen = () => {
// 		setPokerID(storyObject.id)
// 		setTempBacklogItemType(backlogItemType);
// 		setTempRole(role);
// 		setTempFunctionality(functionality);
// 		setTempReasoning(reasoning);
// 		setTempAcceptanceCriteria(acceptanceCriteria);
// 		setTempStoryPoints(storyPoints);

// 		setPokerDialogOpen(true);
// 		handleMenuClose();
// 	};

// 	const handlePokerDialogClose = () => {
// 		setPokerIsOverBuffer(pokerIsOver);
// 		setPokerSprintNumberBuffer(sprintNumber);
// 		setStoryNumberBuffer(storyNumber);
// 		setPokerDialogOpen(false);
// 	};

// 	const handleDeleteDialogOpen = () => {
// 		handleMenuClose();
// 		setDeleteDialogOpen(true)
// 	}

// 	const handleDeleteDialogClose = () => {
// 		setDeleteDialogOpen(false)
// 	}

// }