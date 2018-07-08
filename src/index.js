const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')

const serve = require('webpack-serve')
const configSFC = require('./engine/webpack.config.js')

/**
 * Steps
 * 1. Run vsr on the CLI
 * 2. Shown a list of Vue files in the current directory
 * 3. Ask for props data
 * 4. Ask for container priming e.g. align, width
 * 5. Run the file in the browser
 */

async function run() {
    const availableFiles = fs.readdirSync(process.cwd()).filter(file => path.extname(file) === ".vue")

    const questions = await inquirer.prompt([
      {
        name: 'file',
        message: 'Please select a Vue Component',
        type: 'list',
        choices: availableFiles
      }
    ])

    const config = configSFC({
        cwd: process.cwd(),
        componentName: questions.file.replace(/([a-z](?=[A-Z]))/g, '$1-').split('.')[0].toLowerCase(),
        entry: `${process.cwd()}/${questions.file}`
    })
    serve({ config })
}

module.exports = run
