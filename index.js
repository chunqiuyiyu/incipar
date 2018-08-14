#!/usr/bin/env node
const clear = require('clear')
const figlet = require('figlet')
const path = require('path')
const program = require('commander')
const chalk = require('chalk')
const lib = require('./src')
const packageJson = require('./package.json')

// Init
program
  .description('Minimal starter for React app.')
  .version(packageJson.version)
  .usage('incipar <cmd> [input]')

// Setup
program
  .command('new')
  .description('create a new React app')
  .action(function (name) {
    const templatePath = path.join(__dirname, 'template')
    lib.setup(templatePath, name)
  })

if (!process.argv[2]) {
  clear()
  console.log(
    chalk.green(figlet.textSync('Incipar', { horizontalLayout: 'full' }))
  )
  program.help()
}

// Error on unknown commands
program.on('command:*', function () {
  console.error(
    'Invalid command: %s\nSee --help for a list of available commands.',
    program.args.join(' ')
  )
  process.exit(1)
})

program.parse(process.argv)
