const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const serve = require('webpack-serve')
const compiler = require('vue-template-compiler')
const Vue = require('vue')


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

    let propsData = []

    const vueFile = fs.readFileSync(`${process.cwd()}/${questions.file}`, 'utf8')
    const parsed = compiler.parseComponent(vueFile)
    const script = parsed.script ? parsed.script.content : ''

    if (script) {
      const scriptContents = script.split('export default ').pop()
        .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ')
        .replace(/('|`)/g, '"')
        .replace(/(?<![\S"])(\w+)(?![\S"])/g, '"$1"')

      const scriptObj = JSON.parse(scriptContents)
      const propsRequired = []

      if (scriptObj.props) {
        console.log(scriptObj.props)
        
        Object.keys(scriptObj.props).forEach(prop => { 
          propsRequired.push({
            name: `${prop}/${scriptObj.props[prop].type}`,
            message: `Please enter the prop data for "${prop}" of type "${scriptObj.props[prop].type}"`,
            type: 'input'
          })
        })

        const propsAnswers = await inquirer.prompt(propsRequired)
        Object.keys(propsAnswers).forEach(prop => {
          const keyType = prop.split('/')
          propsData.push({
            key: keyType[0],
            type: keyType[1],
            value: propsAnswers[prop]
          })
        })
      }
    }

    const config = configSFC({
        cwd: process.cwd(),
        componentName: questions.file.replace(/([a-z](?=[A-Z]))/g, '$1-').split('.')[0].toLowerCase(),
        entry: `${process.cwd()}/${questions.file}`,
        props: propsData
    })
    serve({ config })
}

module.exports = run
