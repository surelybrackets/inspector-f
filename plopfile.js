const baseAppFiles = [
    {
        type: 'add',
        path: 'src/apps/{{app}}/index.ts',
        templateFile: 'app-templates/apps/index.ts.hbs',
    },
    {
        type: 'add',
        path: 'src/apps/{{app}}/.gitignore',
        templateFile: 'app-templates/apps/.gitignore.hbs',
    },
    {
        type: 'add',
        path: 'src/apps/{{app}}/.npmignore',
        templateFile: 'app-templates/apps/.npmignore.hbs',
    },
    {
        type: 'add',
        path: 'src/apps/{{app}}/package.json',
        templateFile: 'app-templates/apps/package.json.hbs',
    },
    {
        type: 'add',
        path: 'src/apps/{{app}}/tsconfig.json',
        templateFile: 'app-templates/apps/tsconfig.json.hbs',
    },
    {
        type: 'add',
        path: 'src/apps/{{app}}/routes/index.ts',
        templateFile: 'app-templates/routes/index.ts.hbs',
        data: { route: 'base' },
    },
    {
        type: 'add',
        path: 'src/apps/{{app}}/routes/base/.gitignore',
        templateFile: 'app-templates/routes/route/.gitignore.hbs',
    },
    {
        type: 'add',
        path: 'src/apps/{{app}}/routes/base/.npmignore',
        templateFile: 'app-templates/routes/route/.npmignore.hbs',
    },
    {
        type: 'add',
        path: 'src/apps/{{app}}/routes/base/index.ts',
        templateFile: 'app-templates/routes/route/index.ts.hbs',
        data: { route: '' },
    },
    {
        type: 'add',
        path: 'src/apps/{{app}}/routes/base/package.json',
        templateFile: 'app-templates/routes/route/package.json.hbs',
        data: {
            route: 'base',
            route_description: 'Base route for the {{app}} app.',
        },
    },
    {
        type: 'add',
        path: 'src/apps/{{app}}/routes/base/swagger.ts',
        templateFile: 'app-templates/routes/route/swagger.ts.hbs',
    },
    {
        type: 'add',
        path: 'src/apps/{{app}}/routes/base/tsconfig.json',
        templateFile: 'app-templates/routes/route/tsconfig.json.hbs',
    },
]

const routeFiles = [
    {
        type: 'add',
        path: 'src/apps/{{app}}/routes/{{route}}/.gitignore',
        templateFile: 'app-templates/routes/route/.gitignore.hbs',
    },
    {
        type: 'add',
        path: 'src/apps/{{app}}/routes/{{route}}/.npmignore',
        templateFile: 'app-templates/routes/route/.npmignore.hbs',
    },
    {
        type: 'add',
        path: 'src/apps/{{app}}/routes/{{route}}/index.ts',
        templateFile: 'app-templates/routes/route/index.ts.hbs',
    },
    {
        type: 'add',
        path: 'src/apps/{{app}}/routes/{{route}}/package.json',
        templateFile: 'app-templates/routes/route/package.json.hbs',
    },
    {
        type: 'add',
        path: 'src/apps/{{app}}/routes/{{route}}/swagger.ts',
        templateFile: 'app-templates/routes/route/swagger.ts.hbs',
    },
    {
        type: 'add',
        path: 'src/apps/{{app}}/routes/{{route}}/tsconfig.json',
        templateFile: 'app-templates/routes/route/tsconfig.json.hbs',
    },
]

const fs = require('fs')

/**
 * returns list of existing apps
 */
const getCurrentApps = () => {
    let apps = fs.readdirSync('./src/apps')
    apps.splice(apps.indexOf('index.ts'), 1)
    return apps
}

/**
 * Converts kabab-case strings to camelCase
 * @param {string} kabab A kabab style string
 */
const toCamelCase = (kabab) => {
    kabab = kabab.toLowerCase()
    const stringParts = kabab.split('-')
    let res = stringParts[0]
    for (let i = 1; i < stringParts.length; i++) {
        res += stringParts[i].charAt(0).toUpperCase() + stringParts[i].substr(1)
    }
    return res
}

module.exports = function (plop) {
    plop.setActionType('append-app-to-main-loader', function (answers, config, plop) {
        const importString = `export * as ${toCamelCase(answers.app)} from '@surelybrackets/inspector-f-apps_${
            answers.app
        }'\n`
        fs.appendFileSync('./src/apps/index.ts', importString)
        return 0
    })
    plop.setActionType('add-dependency-to-main-package', function (answers, config, plop) {
        const package = require('./package.json')
        package.dependencies[`@surelybrackets/inspector-f-apps_${answers.app}`] = `./src/apps/${answers.app}`
        fs.writeFileSync('./package.json', JSON.stringify(package))
        return 0
    })
    plop.setActionType('append-app-to-app-loader', function (answers, config, plop) {
        const importString = `export * as ${toCamelCase(answers.route)} from '@surelybrackets/inspector-f-apps_${
            answers.app
        }-routes_${answers.route}'\n`
        fs.appendFileSync(`./src/apps/${answers.app}/routes/index.ts`, importString)
        return 0
    })
    plop.setActionType('add-dependency-to-app-package', function (answers, config, plop) {
        const package = require(`./src/apps/${answers.app}/package.json`)
        package.dependencies[`@surelybrackets/inspector-f-apps_${answers.app}-routes_${answers.route}`] = `./routes/${answers.route}`
        fs.writeFileSync(`./src/apps/${answers.app}/package.json`, JSON.stringify(package))
        return 0
    })
    plop.setGenerator('Create App', {
        description: 'Create a new app within f-inspector',
        prompts: [
            {
                type: 'input',
                name: 'app',
                message: 'Enter the name of the new app...',
            },
            {
                type: 'input',
                name: 'app_description',
                message: 'Enter a short description for the new app...',
            },
        ],
        actions: [
            ...baseAppFiles,
            {
                type: 'append-app-to-loader',
            },
            {
                type: 'add-dependency-to-main-package',
            },
        ],
    })
    plop.setGenerator('Add route', {
        description: 'Add a new route to an existing app',
        prompts: [
            {
                type: 'list',
                name: 'app',
                choices: getCurrentApps(),
                message: 'Select the app to add a route for...',
            },
            {
                type: 'input',
                name: 'route',
                message: 'Enter the name of the new route...',
            },
            {
                type: 'input',
                name: 'route_description',
                message: 'Enter a short description for the new app...',
            },
        ],
        actions:[
            ...routeFiles,
            {
                type: 'append-app-to-app-loader',
            },
            {
                type: 'add-dependency-to-app-package'
            }
        ]
    })
}
