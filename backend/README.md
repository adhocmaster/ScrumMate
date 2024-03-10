# Scrum Tools Backend 
This is the backend folder for the Scrum Project Management tool. The backend is written in Typescript and is divided among several directories. This README will describe what is in each

Before running the backend, run the command ` npm i ` to install all required libraries and packages. Also make sure you have Postgres installed, with a database named `test`, a user with username and password `test`, and make sure the user has permissions for the database `test`. You may have more difficulty if you do not install and run the database and node on your system directly (we have run into issues with Postgres docker container and WSL).

## `backend/`

There are some config files and package managing files here. You may need to update package.json as you add more packages. If you to, you should push your changes so others can install the dependencies.

We do not have a node_modules directory here because the packages can be installed on your system from the package.json file. We may add it at the end in case those modules are no longer available one day.

### `backend/src`

I will explain the directories in order from the lowest level of abstraction to the highest. That is, from the TypeORM methods to the Express routers.

The data-source file creates a connection from TypeORM to the `test` Postgres database using the same username and password we created before. If you ever add more data models or entities, you will have to add it to the list of entities here.

The index file is like the `main.c` file for node projects. Right now, it initializes some data for development purposes, but we will want to delete it when delivering the app. All it needs to do is start up the TypeORM connection and Express. API calls will handle the rest.

### `backend/src/entity`

This directory contains our "data models," or Entities as they are called in TypeORM. Each file contains a class with TypeORM decorators (the @ things) which mark the class as an entity, or a field as a column or a relation. These entities are the only objects you can save and fetch from TypeORM.

### `backend/src/db`

This directory contains the classes needed to create a singleton database class for all other classes to access. The database itself is in database.ts, but the code mostly resides in the `dataSourceWrappers/` and `repositories/` directories. Both are divided up by entity type. 

DataSourceWrappers are classes which bundle methods that interact directly with TypeOrm. These are typically finders/fetchers that get a specific thing, but which might vary a lot in implementation between ORMs. These were used in place of directly accessing TypeORM for dependency inversion. See the section at the bottom about Switching out the database for more information. Methods here will throw an error if things go wrong. See the helper section for more information about that. These wrappers are only accessible to repositories.

Repositories are classes which bundle methods that are needed by the API, but don't need to interact directly with the ORM. They might perform a fetch, and then modify information, and then some save operations. They have access to all the dataSourceWrappers and call them as needed. They also contain direct function calls to their corresponding type's dataSourceWrapper. This is done because sometimes, an API just needs to perform a find operation, which is at the dataSourceWrapper level. If you ever add new methods to a dataSourceWrapper which directly goes to an API call, then you will need to have the wrapper's corresponding repository call it. These repositories are fields of the database. Then when you need to access the database, you just access the relevant repository first.

### `backend/src/controllers`

If you are not familiar with Express, you can think of *routers* as the address which API calls go to, and *controllers* as the functions that actually execute when a router is used.

In this directory you will find the controllers for different entities. They are organized by the entity that you would call the controller from. For example, `getProjects` is a controller in the users file because you would want to access a user's projects, even though the returned object is a project. Maybe a better organization would be sorting them by return type, since this is a little ambiguous.

Controllers typically need to get an instance of the singleton database, parse the request body and/or parameters, verify the input, and call the corresponding database function. Then it might need to do a little bit of manipulation, but it should be relatively simple.

Here you will see return statuses as well. See the helper section for more information about that.

### `backend/src/middleware`

If you are not familiar with Express, you can think of *middleware* as code which is executed before or after a controller is executed. Here, we defin the type for a user and perform some verification steps before a controller is called so that users cannot make API calls to other user's data.

### `backend/src/helpers`

This directory is for helper methods that may span multiple directories.

The main file of interest here is the errors.ts file. Here, we define some new Errors for our dataSourceWrappers to throw. Then, we also have an errorWrapper function. If you are not familiar with Javascript or a functional language like Haskell, it is essentially taking in a function as input and will return a function as output, but doesnt actually run this output function yet. Instead, it returns a function where it can be called as a controller, and the function is placed into a try/catch statement.

The reason for this is because routers take a function as input. Without the errorWrapper, we would have to have error checking in every controller function. However, now we can pass the controller function as input, and if any errors are thrown, they are probably by the dataSourceWrapper by TypeORM. We then catch those in the dataSourceWrappers and throw our own errors afterwards so we can catch and interpret them in the wrapper. Each error contains a return code as well, so we can send the return status to the router rather than relying on the controller to.

### `backend/src/router`

Finally, the router directory contains the Express routers. The routers are organized exactly like the controllers, so you can find the controller more easily. Each router defines some type of request (post, get, etc), an endpoint (the url looking part), some middleware, and then the controller. Some routers have middleware from the `helpers` section to veryify users. Each controller is wrapped in an errorWrapper, which is explained in the `helpers` section.

In index.ts, we export the routers as together, and will import them in `backend/index.ts`. That file will also prepend an "api/" to all the router endpoints.

### `backend/tests`

These tests mirror the directories in `backend/src` and have about 70% coverage. It is recommended that you continue to add unit tests to this directory as you extend the backend.

These can be run **from the backend directory** by running `npm test`. You can choose a specific test by passing a third argument. For example, like `npm test router/user`.

Behind the scenes, this is running the `jest` command. You can modify this command in package.json under the `"scripts": "test"` field. You might want to do this if the tests change or if you ever want to generate a coverage report.

# Switching out the database

The team we inherited the project from built the backend using MongoDB. Unfortunately, they did not manage to refactor their backend to have dependency inversion, so when we were tasked with switching to a relational database, we decided to restart the backend from scratch. Fortunately, you will not have to suffer as we did.

If you need to switch out the database, you have a few options.

If it is a type of database supported by TypeORM (see their [website](https://typeorm.io/#installation) for a full list of supported database drivers), then you are in luck. You can probably just change the database type in data-source.ts and maybe make a few modifications to the Entities, depending on what is supported.

If it is not, then do not worry. You may need to change some type around in the backend files, but the bulk of the code should still work. If you can, try to repurpose the classes in the entities directory. You may need to remove the decorators. The bulk of your work will be rewriting the classes in src/db/dataSourceWrapper. Each class contains a handful of functions, most of which are trivial to rewrite with a different ORM. Beware the save function, which has some special behaviors, such as rejecting when some conditions (like nullable: false or unique: true) on columns in the entities are not met. It also creates a unique id if one is not given, among other things. This may be a little more finicky if your new ORM does not support these features, but most good ones should.
