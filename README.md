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

To run the server in a detach docker container, run (this requires docker to be installed):
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
