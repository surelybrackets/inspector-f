const baseAppFiles = [
    {
        type: 'add',
        path: 'src/apps/{{name}}/index.ts',
        templateFile: 'app-templates/apps/index.ts.hbs',
    },
    {
        type: 'add',
        path: 'src/apps/{{name}}/.gitignore',
        templateFile: 'app-templates/apps/.gitignore.hbs',
    },
    {
        type: 'add',
        path: 'src/apps/{{name}}/.npmignore',
        templateFile: 'app-templates/apps/.npmignore.hbs',
    },
    {
        type: 'add',
        path: 'src/apps/{{name}}/package.json',
        templateFile: 'app-templates/apps/package.json.hbs',
    },
    {
        type: 'add',
        path: 'src/apps/{{name}}/tsconfig.json',
        templateFile: 'app-templates/apps/tsconfig.json.hbs',
    },
    {
        type: 'add',
        path: 'src/apps/{{name}}/routes/index.ts',
        templateFile: 'app-templates/apps/routes/index.ts.hbs',
    },
    {
        type: 'add',
        path: 'src/apps/{{name}}/routes/base/.gitignore',
        templateFile: 'app-templates/apps/routes/base/.gitignore.hbs',
    },
    {
        type: 'add',
        path: 'src/apps/{{name}}/routes/base/.npmignore',
        templateFile: 'app-templates/apps/routes/base/.npmignore.hbs',
    },
    {
        type: 'add',
        path: 'src/apps/{{name}}/routes/base/index.ts',
        templateFile: 'app-templates/apps/routes/base/index.ts.hbs',
    },
    {
        type: 'add',
        path: 'src/apps/{{name}}/routes/base/package.json',
        templateFile: 'app-templates/apps/routes/base/package.json.hbs',
    },
    {
        type: 'add',
        path: 'src/apps/{{name}}/routes/base/swagger.ts',
        templateFile: 'app-templates/apps/routes/base/swagger.ts.hbs',
    },
    {
        type: 'add',
        path: 'src/apps/{{name}}/routes/base/tsconfig.json',
        templateFile: 'app-templates/apps/routes/base/tsconfig.json.hbs',
    }
]

const fs = require('fs')

/**
 * Converts kabab-case strings to camelCase
 * @param {string} kabab A kabab style string
 */
const toCamelCase = (kabab) => {
    kabab = kabab.toLowerCase()
    const stringParts = kabab.split('-')
    let res = stringParts[0]
    for(let i = 1; i < stringParts.length; i++) {
        res += stringParts[i].charAt(0).toUpperCase() + stringParts[i].substr(1)
    }
    return res
}

module.exports = function (plop) {
    plop.setActionType('append-app-to-loader', function (answers, config, plop) {
        const importString = `export * as ${toCamelCase(answers.name)} from '@surelybrackets/inspector-f-apps_${answers.name}'\n`
        fs.appendFileSync('./src/apps/index.ts', importString)
        return 0
    })
    plop.setActionType('add-dependency-to-package', function (answers, config, plop) {
        const package = require('./package.json')
        package.dependencies[`@surelybrackets/inspector-f-apps_${answers.name}`] = `./src/apps/${answers.name}`
        fs.writeFileSync('./package.json', JSON.stringify(package))
        var exec = require('child_process').exec
        exec('npm i')
        return 0
    })
    plop.setGenerator('Create App', {
        description: 'Create a new app within f-inspector',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Enter the name of the new app...',
            },
            {
                type: 'input',
                name: 'description',
                message: 'Enter a short description for the new app...',
            },
        ],
        actions: [
            ...baseAppFiles,
            {
                type: 'append-app-to-loader',
            },
            {
                type: 'add-dependency-to-package',
            }
        ],
    })
}
