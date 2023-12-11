# Scrum Tool Backend 
This is the backend folder for the Scrum Project Management tool. The backend is written mostly in typescript and is broken up into multiple parts: db, helpers, tests, controllers, the middleware, and the router. 
This README is a guide to what each file does, and where to find them. 

# Description 
db- The db folder consists of the following files: project.ts, release.ts, sprint.ts, story.ts, task.ts, and user.ts. Each of these are accompanied by their respective interfaces and schemas. 

controllers - The controllers' folder consists of the following files: project_controller.ts, user.ts, and authentication.ts. The project controller 
manages actions within a project, the user controller manages the creation and deletion of new users. Lastly, the authentication.ts file controls login functionality. 

helpers - This only has one file: index.ts.  The `random` function generates a random base64-encoded string to create a salt. The `authentication` function produces a hash by combining a secret string with a salt and password. 

middleware - The file contains Express.js middleware functions for user authentication and ownership verification.

router - All files in the folder route the data to their respective endpoints. 

tests - The tests folder is incomplete and needs to be expanded upon. 

# Dependencies 
Before running the backend, run the command ` npm i ` to install all required libraries and packages. 

