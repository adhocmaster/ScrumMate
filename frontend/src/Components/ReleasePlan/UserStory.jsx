import React, { useEffect, useState } from "react";
import { Card, CardContent, Box, Typography, IconButton, Menu } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { MenuItem } from '@mui/material';
import NextPlanOutlinedIcon from '@mui/icons-material/NextPlanOutlined';
import { saveActionItemAPI, saveBacklogItemAPI } from "../../API/backlogItem";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import PokerMenu from "./PokerMenu";
import CardEditDialog from "./CardEditDialog";

const UserStory = ({ storyObject, deleteFunction, sprints, setSprints, sprintNumber, backlog, setBacklogItems, lockPage }) => {
	const ActionTypeEnum = {
		BUG: 1,
		SYSTEMFEATURE: 2,
		SPIKE: 3,
		INFRASTRUCTURE: 4,
	}

	const [anchorOpen, setAnchorOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [showAcceptanceCriteria, setShowAcceptanceCriteria] = useState(false);
	const [editActionDialogOpen, setEditActionDialogOpen] = useState(false);

	const [actionType, setActionType] = useState(storyObject.actionType);
	const [actionDescription, setActionDescription] = useState(storyObject.description);
	const [actionPriority, setActionPriority] = useState(storyObject.priority);

	const [backlogItemType, setBacklogItemType] = useState("story");
	const [tempActionType, setTempActionType] = useState(storyObject.actionType);
	const [tempActionDescription, setTempActionDescription] = useState(storyObject.description);
	const [tempActionPriority, setTempActionPriority] = useState(false);

	const [role, setRole] = useState(storyObject.userTypes);
	const [functionality, setFunctionality] = useState(storyObject.functionalityDescription);
	const [reasoning, setReasoning] = useState(storyObject.reasoning);
	const [acceptanceCriteria, setAcceptanceCriteria] = useState(storyObject.acceptanceCriteria);
	const [storyPoints, setStoryPoints] = useState(storyObject.size);
	const [priority, setPriority] = useState(storyObject.priority)

	const [tempBacklogItemType, setTempBacklogItemType] = useState(backlogItemType);
	const [tempRole, setTempRole] = useState(role);
	const [tempFunctionality, setTempFunctionality] = useState(functionality);
	const [tempReasoning, setTempReasoning] = useState(reasoning);
	const [tempAcceptanceCriteria, setTempAcceptanceCriteria] = useState(acceptanceCriteria);
	const [tempStoryPoints, setTempStoryPoints] = useState(storyObject.size);
	const [tempPriority, setTempPriority] = useState(priority);

	useEffect(() => {
		setStoryPoints(storyObject.size)
	}, [sprints, backlog])

	const handleMenuClick = (event) => {
		setAnchorOpen(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorOpen(false);
	};

	const handleToggleAcceptanceCriteria = () => {
		setShowAcceptanceCriteria(!showAcceptanceCriteria);
	}

	const handleEditDialogOpen = () => {
		setTempBacklogItemType(backlogItemType);
		setTempRole(role);
		setTempFunctionality(functionality);
		setTempReasoning(reasoning);
		setTempAcceptanceCriteria(acceptanceCriteria);
		setTempStoryPoints(storyPoints);
		setTempPriority(priority);
		setEditDialogOpen(true);
		handleMenuClose();
	};

	const handleEditDialogClose = () => {
		setEditDialogOpen(false);
	};

	const handleEditActionDialogOpen = () => {
		setTempActionType(actionType)
		setTempActionDescription(actionDescription)
		setTempActionPriority(actionPriority)
		setEditActionDialogOpen(true);
		handleMenuClose();
	};

	const handleEditActionDialogClose = () => {
		setEditActionDialogOpen(false);
	};

	const handleActionSave = () => {
		setActionType(tempActionType)
		setActionDescription(tempActionDescription)
		setActionPriority(tempActionPriority)
		saveAction(storyObject.id);
		handleEditActionDialogClose();
		handleMenuClose();
	};

	const handleSave = () => {
		setBacklogItemType(tempBacklogItemType);
		setRole(tempRole);
		setFunctionality(tempFunctionality);
		setReasoning(tempReasoning);
		setAcceptanceCriteria(tempAcceptanceCriteria);
		setStoryPoints(tempStoryPoints);
		setPriority(tempPriority);

		saveEditedStory(storyObject.id);
		handleEditDialogClose();
		handleMenuClose();
	};

	const handleDeleteDialogOpen = () => {
		handleMenuClose();
		setDeleteDialogOpen(true)
	}

	const handleDeleteDialogClose = () => {
		setDeleteDialogOpen(false)
	}

	const handleDelete = () => {
		handleEditDialogClose();
		console.log(`deleting ${storyObject.id}`)
		deleteFunction(storyObject.id)
	};

	function saveEditedStory(storyId) {
		const newStoryObj = {
			userTypes: tempRole,
			functionalityDescription: tempFunctionality,
			reasoning: tempReasoning,
			acceptanceCriteria: tempAcceptanceCriteria,
			storyPoints: tempStoryPoints,
			priority: tempPriority,
		}
		const resultSuccessHandler = () => {
			if (sprints) {
				const sprintNumber = sprints.find(sprint => sprint.todos.some(todo => todo.id === storyId))?.sprintNumber;
				setStoryWrapper(newStoryObj, sprintNumber, storyId)
			}
		}
		saveBacklogItemAPI(
			storyId,
			tempRole,
			tempFunctionality,
			tempReasoning,
			tempAcceptanceCriteria,
			tempStoryPoints,
			tempPriority,
			resultSuccessHandler,
		);
	}

	function saveAction(storyId) {
		const newStoryObj = {
			actionType: tempActionType,
			description: tempActionDescription,
			priority: tempActionPriority,
		}
		const resultSuccessHandler = () => {
			if (sprints) {
				const sprintNumber = sprints.find(sprint => sprint.todos.some(todo => todo.id === storyId))?.sprintNumber;
				setStoryWrapper(newStoryObj, sprintNumber, storyId)
			}
		}
		saveActionItemAPI(storyId, tempActionType, tempActionDescription, tempActionPriority, resultSuccessHandler);
	}

	function setStoryWrapper(newStoryObj, sprintNumber, storyId) {
		const sprintsCopy = [...sprints];
		const sprintIndex = sprintsCopy.findIndex(sprint => sprint.sprintNumber === sprintNumber);
		const storyIndex = sprintsCopy[sprintIndex].todos.findIndex(story => story.id === storyId);
		sprintsCopy[sprintIndex].todos[storyIndex] = { ...sprintsCopy[sprintIndex].todos[storyIndex], ...newStoryObj };
		setSprints(sprintsCopy);
	}

	return (
		<>
			<Card
				sx={{
					marginBottom: 1,
					marginRight: 2,
					position: "relative",
					width: 150,
					height: 200,
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
				}}
			>
				<CardContent sx={{ minHeight: 128, maxWidth: 150, maxHeight: 200, overflowY: "auto" }}				>
					{
						lockPage ?
							<></>
							:
							<IconButton
								aria-label="settings"
								aria-controls="menu-userstory"
								aria-haspopup="true"
								onClick={handleMenuClick}
								size="large"
								sx={{ position: "absolute", bottom: -1, left: 0 }}
							>
								<MoreVertIcon />
							</IconButton>
					}

					{storyObject.name !== 'ActionItem' && (
						<IconButton
							aria-label="settings"
							aria-controls="menu-userstory"
							aria-haspopup="true"
							onClick={handleToggleAcceptanceCriteria}
							size="large"
							sx={{ position: "absolute", bottom: -1, left: 30 }}
						>
							<NextPlanOutlinedIcon />
						</IconButton>
					)}

					<Menu
						id="menu-userstory"
						anchorEl={anchorOpen}
						keepMounted
						open={anchorOpen}
						onClose={handleMenuClose}
					>
						{storyObject.name !== 'ActionItem' ? (
							<>
								<PokerMenu
									storyObject={storyObject}
									sprintNumber={sprintNumber}
									handleMenuClose={handleMenuClose}
									sprints={sprints}
									backlog={backlog}
									setSprints={setSprints}
									setBacklog={setBacklogItems}

									setTempBacklogItemType={setTempBacklogItemType}
									setTempRole={setTempRole}
									setTempFunctionality={setTempFunctionality}
									setTempReasoning={setTempReasoning}
									setTempAcceptanceCriteria={setTempAcceptanceCriteria}
									setTempStoryPoints={setTempStoryPoints}
									setStoryPoints={setStoryPoints}

									tempRole={tempRole}
									tempFunctionality={tempFunctionality}
									tempReasoning={tempReasoning}
									tempAcceptanceCriteria={tempAcceptanceCriteria}
									tempStoryPoints={tempStoryPoints}
									tempPriority={tempPriority}

									backlogItemType={backlogItemType}
									role={role}
									functionality={functionality}
									reasoning={reasoning}
									acceptanceCriteria={acceptanceCriteria}
									storyPoints={storyPoints}
								/>
								<MenuItem onClick={handleEditDialogOpen}>Edit</MenuItem>
								<CardEditDialog
									editDialogOpen={editDialogOpen}
									handleEditDialogClose={handleEditDialogClose}
									tempRole={tempRole}
									setTempRole={setTempRole}
									tempFunctionality={tempFunctionality}
									setTempFunctionality={setTempFunctionality}
									tempReasoning={tempReasoning}
									setTempReasoning={setTempReasoning}
									tempAcceptanceCriteria={tempAcceptanceCriteria}
									setTempAcceptanceCriteria={setTempAcceptanceCriteria}
									tempPriority={tempPriority}
									setTempPriority={setTempPriority}
									handleDeleteDialogOpen={handleDeleteDialogOpen}
									handleSave={handleSave}
									editActionDialogOpen={editActionDialogOpen}
									handleEditActionDialogClose={handleEditActionDialogClose}
									tempActionType={tempActionType}
									setTempActionType={setTempActionType}
									tempActionDescription={tempActionDescription}
									setTempActionDescription={setTempActionDescription}
									tempActionPriority={tempActionPriority}
									setTempActionPriority={setTempActionPriority}
									handleActionSave={handleActionSave}
								/>
							</>
						) : (
							<>
								<MenuItem onClick={handleEditActionDialogOpen}>Edit</MenuItem>
							</>
						)}
						<MenuItem onClick={handleDeleteDialogOpen} style={{ color: "red" }}>
							Delete
						</MenuItem>
						<DeleteConfirmationDialog
							open={deleteDialogOpen}
							handleClose={handleDeleteDialogClose}
							handleDelete={handleDelete}
							type={storyObject.name === 'ActionItem' ? 'Action Item' : 'Story'}
						/>
					</Menu>
					<Typography
						variant="body1"
						textAlign={"left"}
						fontSize={14}
						sx={{
							wordWrap: "break-word",
							overflowWrap: "break-word",
							maxHeight: 120,
							marginBottom: 1,
							hyphens: "auto",
						}}
					>
						{
							storyObject.name === 'ActionItem' ?
								<>
									<Box component="span" fontWeight="bold">
										{({ [ActionTypeEnum.BUG]: 'Bug', [ActionTypeEnum.SYSTEMFEATURE]: 'System Feature', [ActionTypeEnum.SPIKE]: 'Spike', [ActionTypeEnum.INFRASTRUCTURE]: 'Infrastructure' }[storyObject.actionType] || 'Unknown Type')}
									</Box>
									{`: ${storyObject.description}`}
								</> :
								(
									showAcceptanceCriteria ?
										<>
											<Box fontWeight='bold' display='inline'>
												Acceptance Criteria:
											</Box>
											{' '}
											{acceptanceCriteria}
										</>
										:
										`As a(n) ${role} I want to be able to ${functionality} so that ${reasoning}.`
								)
						}
					</Typography>

					{
						storyObject.name === 'ActionItem' ?
							<></>
							:
							<Typography
								variant="body1"
								textAlign={"right"}
								fontSize={14}
								sx={{ position: "absolute", bottom: 10, right: 12 }}
							>
								{storyPoints ?? '--'} SP
							</Typography>
					}

				</CardContent>
			</Card>
		</>
	);
};

export default UserStory;
