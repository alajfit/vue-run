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

    const comp = fs.readFileSync(`${process.cwd()}/${questions.file}`, 'utf8')
      .match(/(?<=(<script>))(\w|\d|\n|[().,\-:;@#$%^&*\[\]"'+–/\/®°⁰!?{}|`~]| )+?(?=(<\/script>))/m)

    let propsData = []

    if (comp.length) {
      const exportObj = comp[0]
        .split('export default ')
        .pop()

      const cleanObj = exportObj
        .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ')
        .replace(/'/g, '"')
        .replace(/(?<![\S"])(\w+)(?![\S"])/g, '"$1"')

      const workingObj = JSON.parse(cleanObj)

      const propsRequired = []

      if (workingObj.props) {
        Object.keys(workingObj.props).forEach(prop => { 
          propsRequired.push({
            name: `${prop}/${workingObj.props[prop].type}`,
            message: `Please enter the prop data for "${prop}" of type "${workingObj.props[prop].type}"`,
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
