# Getting Started with Scrum Tools

This project was initially bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

This is a fork from [Scrum_Tool](https://github.com/SlugScrum/Scrum_Tool) by a previous team who worked on it as part of UCSC's CSE115d course.

It is now being worked on by a new team of students as part of UCSC's CSE115b/c courses.

## Postgres

To run the backend, you should download and install the [Postgres](https://www.postgresql.org/) database. We used v16.2, but other versions will likely work too. For development purposes, we expect there to be a database called `test` and a user with username and password `test` who has full permissions to access this database.

We have seen issues with the Docker container for Postgres and when running the project from WSL. One workaround to this is to download Postgres directly to your system and running the project your operating system's terminal (e.g. Powershell).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

Alternatively, you can run `npm start` in the frontend and backend directories separately.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`
![Node.js Cl](https://github.com/adhocmaster/ScrumMate/actions/workflows/node.js.yml/badge.svg)

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

Currently, there are only backend tests, located in the `backend/tests` directory.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## File structure

The project is separated into separate frontend and backend projects, located in the `frontend/` and `backend/` directories. Each directory is its own node project. They will each start their own servers. The frontend will make API calls to the backend, and the backend will host the API and respond to API calls. The root directory contains some packages used in both the frontend and backend, as well as some documentation and files for GitHub automated tests.

## More information

There are READMEs in both the fronend and backend directories which contain more information about their respective projects. Please see them for more information.

## Learn More About Create React App

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started), although the project has now been modified extensively from it.

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
