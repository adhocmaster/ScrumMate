import express from 'express';
import { Database } from "../db/database";
import { verifyParameters } from './utils/verifyParams';
import { ParameterError } from '../helpers/errors';

export const createStory = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { sprintId } = req.params;
	const {
		userTypes,
		functionalityDescription,
		reasoning,
		acceptanceCriteria,
		storyPoints,
		priority,
	} = req.body;
	verifyParameters(userTypes, functionalityDescription, reasoning, acceptanceCriteria, storyPoints, priority);
	const newStory = await db.getBacklogItemRepository.createNewSprintStory(parseInt(sprintId), userTypes, functionalityDescription, reasoning, acceptanceCriteria, storyPoints, priority);
	return res.json(newStory);
}

export const createNewBacklogStory = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { releaseId } = req.params;
	const {
		userTypes,
		functionalityDescription,
		reasoning,
		acceptanceCriteria,
		storyPoints,
		priority,
	} = req.body;
	verifyParameters(userTypes, functionalityDescription, reasoning, acceptanceCriteria, storyPoints, priority);
	const newStory = await db.getBacklogItemRepository.createNewBacklogStory(parseInt(releaseId), userTypes, functionalityDescription, reasoning, acceptanceCriteria, storyPoints, priority);
	return res.json(newStory);
}

export const editStory = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance()
	const { storyId } = req.params
	const {
		userTypes,
		functionalityDescription,
		reasoning,
		acceptanceCriteria,
		storyPoints,
		priority,
		rank,
	} = req.body
	const story = await db.getBacklogItemRepository.updateStory(parseInt(storyId), userTypes, functionalityDescription, reasoning, acceptanceCriteria, storyPoints, priority, parseInt(rank))
	return res.json(story)
};

export const moveBacklog = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { sourceId, destinationId } = req.params;
	const {
		sourceType,
		sourceRank,
		destinationType,
		destinationRank,
	} = req.body;
	verifyParameters(sourceType, destinationType);
	if ((sourceType !== "sprint" && sourceType !== "backlog") || (destinationType !== "sprint" && destinationType !== "backlog")) {
		throw new ParameterError("destinationType or sourceType are invalid")
	}
	return res.json(await db.getBacklogItemRepository.reorderBacklog(parseInt(sourceId), sourceType, parseInt(sourceRank), parseInt(destinationId), destinationType, parseInt(destinationRank)));
}

export const deleteBacklogItem = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { backlogItemId } = req.params;
	verifyParameters(backlogItemId);
	return res.json(await db.getBacklogItemRepository.deleteBacklogItem(parseInt(backlogItemId)));
}

export const getBacklogItemPoker = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { backlogItemId } = req.params;
	verifyParameters(backlogItemId);
	return res.json(await db.getBacklogItemRepository.getBacklogItemPoker(parseInt(backlogItemId), req.userId));
}