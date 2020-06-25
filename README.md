# inspector-f

inspector-F assists stock and ETF traders with market research and analysis, by allowing them to inspect market prices and statistics relative to provided date ranges.

## Installing the repo

First time clone and install.
```sh
git clone https://github.com/surelybrackets/inspector-f.git
npm run init
```

## Provided commands

#### Building the server files

The sources files for this express server are written in typescript and will need to be transpiled to javascript before being deployed to any server. To generate necessary javascript files, run:
```sh
npm run build
```
Javascript files will be stored in the `./dist` directory.

#### Running the server

To serve a static build of the server, run:
```sh
npm run start
```

To run a hot reloading development server, run:
```sh
npm run start:dev
```

To run the server in a detach docker container, run (this requires docker and docker-compose to be installed):
```sh
npm run start:prod
```

#### Tests

Unit test are written with jest and can be run with:
```sh
npm run test
```
Unit tests must pass before code is pushed to remote.

Linting has been configured to maintain code consistency. To check changes against rules, run:
```sh
npm run lint
```
Linting is running on the pre-commit hook. To view rules, refer to the `.eslintrc.js` configuration file.

#### Creating new apps and routes

To facilitate development and to maintain code consistency, automatic code generators are provided for the creation of new api apps and routes. Use the following command to initialize new projects:
```sh
npm run create-app
```
You will be prompted to choose a generator. The following generators are available:

##### Create App

This generator will create a new app within the api (an app is a collection related routes). After completion, several files will be created in the base directory. This includes the `package.json .gitignore .npmignore, tsconfig.json` and any other admininstration files, a boilerplate swagger doc and index.ts (which hooks the app into the api). A base route is also created, meaning a route named (`inspector-f/<app-name>/:id`). This route can be deleted if not needed.

##### Add route

This generator will add a new route to an existing app. You will be prompted to select the target app. After completion, several files will be created in the base directory. This includes the `package.json .gitignore .npmignore, tsconfig.json` and any other admininstration files, a boilerplate swagger doc and index.ts (which hooks the app into the api). This will create a route named (`inspector-f/<app-name>/<route-name>/:id`).
