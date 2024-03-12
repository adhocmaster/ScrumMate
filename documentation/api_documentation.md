# API Documentation

## Contents
 - [Project](#project) 
 - [Release](#release)


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

  POST: /user/edit

  GET: /user/projects
