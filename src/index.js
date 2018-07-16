const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const serve = require('webpack-serve')
const compiler = require('vue-template-compiler')
const Vue = require('vue')
const vueLoader = require('vue-loader')
const httpVueLoader = require('http-vue-loader')


const configSFC = require('./engine/webpack.config.js')

/**
 * Steps
 * 1. Run vsr on the CLI
 * 2. Shown a list of Vue files in the current directory
 * 3. Ask for props data
 * 4. Ask for container priming e.g. align, width
 * 5. Run the file in the browser
 */

async function propsDataQuestions (array) {
  const answer = await inquirer.prompt([
    {
      name: 'key',
      message: 'Enter the name of the key for the prop: ',
      type: 'input'
    }, {
      name: 'value',
      message: 'Enter the value of the key for the prop: ',
      type: 'input'
    }
  ])

  array.push({
    key: answer.key,
    value: answer.value,
    type: 'String'
  })

  const again = await inquirer.prompt([
    {
      name: 'check',
      message: 'Would you like to add another prop?',
      type: 'confirm'
    }
  ])

  if (again.check) propsDataQuestions(array)
}

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

    let propsData = []

    const vueFile = fs.readFileSync(`${process.cwd()}/${questions.file}`, 'utf8')
    const parsed = compiler.parseComponent(vueFile)
    const script = parsed.script ? parsed.script.content : ''

    if (script) {
      if (script.indexOf('props') > -1) {
        const propsWanted = await inquirer.prompt([
          {
            name: 'propsRequest',
            message: 'There appears to be props on this instance would you like to add? (Y/n)',
            type: 'confirm'
          }
        ])

        if (propsWanted.propsRequest) await propsDataQuestions(propsData)
      }
    }

    const config = configSFC({
        cwd: process.cwd(),
        componentName: questions.file.replace(/([a-z](?=[A-Z]))/g, '$1-').split('.')[0].toLowerCase(),
        entry: `${process.cwd()}/${questions.file}`,
        props: propsData
    })

    serve({ 
      config,
      devMiddleware: {
        logLevel: 'error',
        logTime: true,
        stats: {
          assets: false,
          chunks: false,
          modules: false
        }
      }
    })
}

module.exports = run
