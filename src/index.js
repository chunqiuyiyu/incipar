const utils = require('./utils')
const chalk = require('chalk')
const exec = require('child_process').exec
const fs = require('fs')
const path = require('path')

const setup = (templatePath, src) => {
  const { logErr, exists, copy, shell, install } = utils

  if (typeof src === 'object') {
    logErr('Please enter the project name!')
    return
  }

  if (fs.existsSync(src)) {
    console.log(
      `The directory ${chalk.green(src)} already exists, please try another name.`
    )
    return
  }

  global.projectName = src
  const projectPath = path.resolve(global.projectName)

  console.log(
    `Creating ${chalk.cyan(src)} in ${chalk.green(projectPath)}.`
  )
  console.log('')

  exists(templatePath, src, copy)

  // Check parcel is installed or not
  exec('parcel -V', err => {
    if (err) {
      console.log(
        `Installing ${chalk.cyan('parcel-bundler')}...`
      )

      shell('npm i parcel-bundler -g', () => {
        install()
      })
    } else {
      // Install react and react-dom directly
      install()
    }
  })
}

module.exports = {
  setup
}
