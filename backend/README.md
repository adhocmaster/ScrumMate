# Scrum Tools Backend - Developer Guide

This is the backend folder for the Scrum Project Management tool. The backend is written in Typescript and is divided among several directories. This README will describe a high level overview of what is in each directory, and offer some advice to future developers.

A video walkthrough is available [here](https://drive.google.com/file/d/11m9jsS4N0Vz7xaiTgbpU6GwBS-jTVDVu/view?usp=sharing).

The backend was totally redone in Winter/Spring 2024. Please reach out to the current sponsors and ask for Andrew H.'s email if you have any questions.

## Getting started

Before running the backend, run the command `npm i` to install all required libraries and packages. Also make sure you have Postgres installed, with a database named `test`, a user with username and password `test`, and make sure the user has permissions for the database `test` (or just give the user admin permissions). You may have more difficulty if you do not install and run the database and node on your system directly (we have run into issues with Postgres docker container and WSL).

## `backend/`

There are some config files and package managing files here. You may need to update package.json as you add more packages. If you to, you should push your changes so others can install the dependencies.

We do not have a node_modules directory in the repository because the packages can be installed on your system from the package.json file. We may add it at the end of the project in case those modules are no longer available one day.

The files here should be more or less fine as they are and should not need to be modified much during development.

### `backend/src`

This README will explain the directories in order from the lowest level of abstraction to the highest. That is, from the TypeORM methods to the Express routers.

The data-source file creates a connection from TypeORM to the `test` Postgres database using the same username and password we created before. If you ever add more data models or entities, you will have to add it to the list of entities here.

The index file is like the `main.c` file for node projects. Right now, it initializes some dummy data for development purposes, but we will want to delete it when delivering the app. All it needs to do is start up the TypeORM connection and Express. API calls will handle the rest.

Note that the index file may occassionally cause issues with the database. This is because it tries to save several objects with hardcoded fields. However, if you change the entities elsewhere in the backend, the save may not work and lead to a crash on startup. To fix this, it is suggested that you nuke the database (for Postgres, open up pgadmin and go to `Servers > PostgreSQL 16 > Databases > test > Schemas > public > Tables`, then go to `Properties`, select everything, and perform a cascade delete before rerunning the backend).

In every subdirectory, we split the files by entity type to keep them organized.

### `backend/src/entity`

This directory contains our "data models," or "Entities" as they are called in TypeORM. Each file contains a class with TypeORM decorators (the @ things) which mark the class as an entity, or a field as a column or a relation. These entities are the only objects you can save and fetch from TypeORM.

It is recommended that you watch a tutorial or get familiar with TypeORM. In particular, get to know how entities are written, column types, the different kinds of relationships between entities (one to one, one to many, etc...), how to save something, how to search for something, and how to delete something. Their website is a good resource and has good documentation as well. You might find a website called Gitbooks when looking for documentation, but I found it is sometimes out of date.

### `backend/src/db`

This directory contains the classes needed to create a singleton "database" class for the server to access. We use a repository pattern, meaning the functions that perform the operations are sorted into their own classes called "repositories." The "database" (more like a repository manager) itself is a singleton class that only needs to be initialized once with the TypeORM AppDataSource, and provides access to each of the repositories. It is in database.ts, but the code for this component mostly resides in the `dataSourceWrappers/` and `repositories/` directories. Both are divided up by entity type.

DataSourceWrappers are classes which bundle methods that interact directly with TypeORM. These are typically finders/fetchers that get a specific thing, but which might vary a lot in implementation between ORMs. These were used in place of directly accessing TypeORM for dependency inversion. See the section at the bottom about Switching out the database for more information. Methods here will throw an error if things go wrong. See the helper section for more information about that. These wrappers are initialized when the database class is initialized, since it will propagate the ORM's connection to the wrappers. It is only accessible to wrapper after that.Then, these wrappers are only accessible to the repositories.

Repositories are classes which bundle methods for the same entity type together. Their methods correspond with the API so that each API call just calls one function in one repository. Repositories don't interact directly with the ORM, but can use any ORM wrapper. This means they have access to all the dataSourceWrappers and can call them as needed. A repository method might be to perform a fetch, and then modify information, and then perform some save operations. They also sometimes contain direct function calls to their corresponding type's dataSourceWrapper. This is done because sometimes, an API just needs to perform a find operation, which is at the dataSourceWrapper level. If you ever add new methods to a dataSourceWrapper which directly goes to an API call, then you will need to have the wrapper's corresponding repository call it. These repositories are fields of the database. Then when you need to access the database, you just access the relevant repository first.

### `backend/src/controllers`

If you are not familiar with Express, you can think of _routers_ as the address which API calls go to, and _controllers_ as the functions that actually execute when a router is used.

In this directory you will find the controllers for different entities. They are organized by the entity that you would call the controller from. For example, `getProjects` is a controller in the users file because you would want to access a user's projects, even though the returned object is a project. Maybe a better organization would be sorting them by return type, since this is a little ambiguous.

Controllers typically need to get an instance of the singleton database, parse the request body and/or parameters, verify the input, and call the corresponding database function. It might need to do a little bit of manipulation, but it should be relatively simple (like only returning the first item in a list, or setting the return status depending on the result).

Here you will see return statuses as well. See the helper section for more information about that.

Note: technically you can put some more complex code in the controller and manipulate data after making some repository calls, but DO NOT DO THIS!! The controller's one purpose is to serve as the middleman from the API call to the function call. We do not want to put logic here or else it will scatter our logic into too many places.

### `backend/src/middleware`

If you are not familiar with Express, you can think of _middleware_ as code which is executed before or after a controller is executed. Here, we define the "type" for a user and perform some verification steps before a controller is called so that users cannot make API calls to other user's data.

### `backend/src/helpers`

This directory is for helper methods that may span multiple directories.

The main file of interest here is the errors.ts file. Here, we define some new Errors for our dataSourceWrappers to throw. Then, we also have an errorWrapper function. If you are not familiar with Javascript or a functional language like Haskell, it is essentially taking in a function as input and will return a function as output, but doesnt actually run this output function yet. Instead, it returns a function where it can be called as a controller, and the function is placed into a try/catch statement.

The reason for this is because routers take a function as input. Without the errorWrapper, we would have to have error checking in every controller function. However, now we can pass the controller function as input, and if any errors are thrown, they are probably by the dataSourceWrapper by TypeORM. We then catch those in the dataSourceWrappers and throw our own errors afterwards so we can catch and interpret them in the wrapper. Each error contains a return code as well, so we can send the return status to the router rather than relying on the controller to.

### `backend/src/router`

Finally, the router directory contains the Express routers. The routers are organized exactly like the controllers, so you can find the controller more easily. Each router defines some type of request (post, get, etc), an endpoint (the url looking part), some middleware, and then the controller. Some routers have middleware from the `helpers` section to veryify users. Each controller is wrapped in an errorWrapper, which is explained in the `helpers` section.

In index.ts, we export the routers together, and will import them in `backend/index.ts`. That file will also prepend an "api/" to all the router endpoints.

Documetation for the API can be found at `/documentation/api_documentation.md`.

### `backend/tests`

These tests mirror the directories in `backend/src` and have about 80%-90% coverage. It is strongly recommended that you continue to add unit tests to this directory as you extend the backend.

These can be run **from the backend directory** by running `npm test`. You can choose a specific test by passing a third argument. For example, like `npm test router/user`.

Behind the scenes, this is running the `jest` command. You can modify this command in package.json under the `"scripts": "test"` field. You might want to do this if the tests change or if you ever want to generate a coverage report.

# Switching out the database

The team we inherited the project from built the backend using MongoDB. Unfortunately, they did not manage to refactor their backend to have dependency inversion, so when we were tasked with switching to a relational database, we decided to restart the backend from scratch. Fortunately, you will not have to suffer this fate.

If you need to switch out the database, you have a few options.

If it is a type of database supported by TypeORM (see their [website](https://typeorm.io/#installation) for a full list of supported database drivers), then you are in luck. You can probably just change the database type in data-source.ts and maybe make a few modifications to the Entities, depending on what is supported.

If it is not, then do not worry. You may need to change some type around in the backend files, but the bulk of the code should still work. If you can, try to repurpose the classes in the entities directory. You may need to remove the decorators and change some parameters around. The bulk of your work will be rewriting the classes in src/db/dataSourceWrapper. Each class contains a handful of functions, most of which are trivial to rewrite with a different ORM. Beware the save function, which has some special behaviors, such as rejecting when some conditions (like nullable: false or unique: true) on columns in the entities are not met. It also creates a unique id if one is not given, among other things. This may be a little more finicky if your new ORM does not support these features, but most good ones should.
