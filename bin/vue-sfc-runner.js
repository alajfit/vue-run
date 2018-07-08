#!/usr/bin/env node
console.log('Running a Vue File')

/**
 * Steps
 * 1. Run vsr on the CLI
 * 2. Shown a list of Vue files in the current directory
 * 3. Ask for props data
 * 4. Run the file in the browser
 */

const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')

async function run() {
    const availableFiles = fs.readdirSync(process.cwd()).filter(file => path.extname(file) === ".vue")

    const questions = await inquirer.prompt([
      {
        name: 'files',
        message: 'Please select a Vue Component',
        type: 'list',
        choices: availableFiles
      }
    ])
}

run()
