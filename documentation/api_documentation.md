# API Documentation

## Contents
 - [Project](#project) 
 - [Release](#release)
 - [User](#user)
 - [Sprint](#sprint)
 - [Backlog Item](#backlog_item))
 - [Role](#role)

## Project
  POST: /project
  
    Body: { userId: number, name: string}

  POST: /project/:userId/joinProject/:projectId

    Body: {}

  PATCH: /project/:projectId

    Body: {name: string}
    
  GET: /project/:projectId/releases

    Body: {}
    
  GET: /project/:projectId/recentRelease

    Body: {}

  GET: /project/:projectId/getName
  
    Body: {}
    
## Release
  POST: /project/:projectId/release

    Body: {
     revision?: number,
     revisionDate?: Date,
     problemStatement?: string,
     goalStatement?: string,
    }

  POST: /release/:releaseId/edit

    Body: {
     revisionDate?: Date,
     problemStatement?: string,
     goalStatement?: string
    }

  POST: /release/:releaseId/copy

    Body: {}

  GET: /release/:releaseId

    Body: {}

  GET: /release/:releaseId/backlog

    Body: {}

## User
  POST: /user/create

    Body: {
      username: string,
      email: string, 
      password: string
    }

  POST: /user/login

    Body: {
     email: string, 
     password: string
    }
    
  POST: /user/edit

    Body: {
     Todo
    }
    
  GET: /user/projects
  
    Body: {}

## Sprint
  POST: /release/:releaseId/sprint

    Body: {
      sprintNumber: number,
      startDate: Date,
      endDate: Date,
      goal: string
    }

  POST: /sprint/:sprintId/edit
  
    Body: {
        sprintNumber?: number,
        startDate?: Date,
        endDate?: Date,
        goal?: string
      }

  GET: /release/:releaseId/sprints

    Body: {}
    
  GET: /sprint/:sprintId

    Body: {}
    
  POST: /release/:releaseId/reorder
  
    Body: {
      sprintStartIndex: number,
      sprintEndIndex: number
    }
    
  DELETE: /sprint/:sprintId

    Body: {}

## Backlog Item
  POST: /sprint/:sprintId
  
    Body: {
      sprintId: number,
      userTypes: string,
      functionalityDescription: string, 
      reasoning: string,
      acceptanceCriteria: string,
      storyPoints: number,
      priority: Priority
    }

  POST: /sprint/:sprintId/story/edit

  Body: {
      sprintId?: number,
      userTypes?: string,
      functionalityDescription?: string, 
      reasoning?: string,
      acceptanceCriteria?: string,
      storyPoints?: number,
      priority?: Priority
    }

## Role

POST: /user/:userId/sprint/:sprintId

  Body: {
    role: string
  }
  
POST: /role/:roleId/edit/:userId

 Body: {
    role?: string
  }
