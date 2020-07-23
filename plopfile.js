const baseAppFiles = [
    {
        type: 'add',
        path: 'src/apps/{{app}}/index.ts',
        templateFile: 'app-templates/apps/index.ts.hbs',
    },
    {
        type: 'add',
        path: 'src/apps/{{app}}/routes/index.ts',
        templateFile: 'app-templates/routes/index.ts.hbs',
        data: { route: 'base' },
    },
    {
        type: 'add',
        path: 'src/apps/{{app}}/routes/base/index.ts',
        templateFile: 'app-templates/routes/route/index.ts.hbs',
        data: { route: '' },
    },
    {
        type: 'add',
        path: 'src/apps/{{app}}/routes/base/swagger.ts',
        templateFile: 'app-templates/routes/route/swagger.ts.hbs',
    },
]

const routeFiles = [
    {
        type: 'add',
        path: 'src/apps/{{app}}/routes/{{route}}/index.ts',
        templateFile: 'app-templates/routes/route/index.ts.hbs',
    },
    {
        type: 'add',
        path: 'src/apps/{{app}}/routes/{{route}}/swagger.ts',
        templateFile: 'app-templates/routes/route/swagger.ts.hbs',
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
        const importString = `export * as ${toCamelCase(answers.app)} from './${
            answers.app
        }'\n`
        fs.appendFileSync('./src/apps/index.ts', importString)
        return 0
    })
    plop.setActionType('append-app-to-app-loader', function (answers, config, plop) {
        const importString = `export * as ${toCamelCase(answers.route)} from './${
            answers.app
        }-routes_${answers.route}'\n`
        fs.appendFileSync(`./src/apps/${answers.app}/routes/index.ts`, importString)
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
                type: 'append-app-to-main-loader',
            }
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
            }
        ]
    })
}
