# API Documentation

## Contents
 - [Project](#project) 
 - [Release](#release)
 - [User](#user)
 - [Sprint](#sprint)
 - [BacklogItem](#backlogitem)
 - [Role](#role)

## Project
  ### Create Project
  
  POST: /project
  
    Body: { userId: number, name: string}


  ### Join Project
  POST: /project/:userId/joinProject/:projectId

    Body: {}


  ### Edit Project
  PATCH: /project/:projectId

    Body: {name: string}

  ### Get Project Releases
  GET: /project/:projectId/releases

    Body: {}


  ### Get Recent Project Release
  GET: /project/:projectId/recentRelease

    Body: {}

  ### Get Project Name
  GET: /project/:projectId/getName
  
    Body: {}
    
## Release

  ### Create Release
  POST: /project/:projectId/release

    Body: {
     revision?: number,
     revisionDate?: Date,
     problemStatement?: string,
     goalStatement?: string,
    }
    
  ### Edit Release
  POST: /release/:releaseId/edit

    Body: {
     revisionDate?: Date,
     problemStatement?: string,
     goalStatement?: string
    }

  ### Copy Release
  POST: /release/:releaseId/copy

    Body: {}

  ### Get Release
  GET: /release/:releaseId

    Body: {}

  ### Get Release Backlog
  GET: /release/:releaseId/backlog

    Body: {}

## User

  ### Create User
  POST: /user/create

    Body: {
      username: string,
      email: string, 
      password: string
    }

  ### Login
  POST: /user/login

    Body: {
     email: string, 
     password: string
    }

  ### Edit User Credentials
  POST: /user/edit

    Body: {
     Todo
    }

  ### Get User Projects
  GET: /user/projects
  
    Body: {}

## Sprint

  ### Create Sprint
  POST: /release/:releaseId/sprint

    Body: {
      sprintNumber: number,
      startDate: Date,
      endDate: Date,
      goal: string
    }
    
  ### Edit Sprint
  POST: /sprint/:sprintId/edit
  
    Body: {
        sprintNumber?: number,
        startDate?: Date,
        endDate?: Date,
        goal?: string
      }
      
 ### Get Release Sprints
  GET: /release/:releaseId/sprints

    Body: {}

  ### Get Sprint
  GET: /sprint/:sprintId

    Body: {}

  ### Reorder Sprints
  POST: /release/:releaseId/reorder
  
    Body: {
      sprintStartIndex: number,
      sprintEndIndex: number
    }

  ### Delete Sprints
  DELETE: /sprint/:sprintId

    Body: {}

## BacklogItem

  ### Create Backlog Item
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

  ### Edit Backlog Item
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

  ### Create User Role
  POST: /user/:userId/sprint/:sprintId
  
    Body: {
      role: string
    }
  
  ### Edit User Role
  POST: /role/:roleId/edit/:userId
  
    Body: {
       role?: string
     }
