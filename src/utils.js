const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec

const logErr = (txt) => {
  console.log(chalk.red(txt))
}

const logOk = (txt) => {
  console.log(chalk.green(txt))
}

const exists = (src, dst, callback) => {
  const exists = fs.existsSync(dst)
  if (exists) {
    callback(src, dst)
  } else {
    fs.mkdir(dst, err => {
      if (err) {
        logErr(err.message)
      }

      callback(src, dst)
    })
  }
}

// Change project name in new package.json
const customName = (name) => {
  const jsonPath = path.join(path.resolve(global.projectName), 'package.json')
  fs.readFile(jsonPath, (err, data) => {
    if (err) {
      logErr(err.message)
    }

    fs.writeFileSync(jsonPath, data.toString().replace('incipar', name))
  })
}

const copy = (src, dst) => {
  const paths = fs.readdirSync(src)

  let newSrc, newDst, readable, writable
  paths.forEach(item => {
    newSrc = path.join(src, item)
    newDst = path.join(dst, item)

    const st = fs.statSync(newSrc)

    if (st.isFile()) {
      readable = fs.createReadStream(newSrc)
      writable = fs.createWriteStream(newDst)
      readable.pipe(writable)

      if (item === 'package.json') {
        customName(global.projectName)
      }
    } else {
      exists(newSrc, newDst, copy)
    }
  })
}

const shell = (cmd, cb, param) => {
  exec(cmd, param, (err, stdout, stderr) => {
    if (err) {
      logErr(err.message)
    }

    cb()
  })
}

const install = () => {
  const projectPath = path.resolve(global.projectName)

  console.log(
    `Installing ${chalk.cyan('react, react-dom')}...`
  )

  shell('npm install --save react react-dom', () => {
    console.log('')

    console.log(
      `${chalk.green('Congratulations!')}`
    )

    console.log(
      `You have a new React project ${chalk.cyan(global.projectName)} at ${projectPath}.`
    )

    console.log('')
    console.log('Start new project by typing:')

    console.log('')
    console.log(
      `  ${chalk.cyan('cd')} ${global.projectName}`
    )
    console.log(
      `  ${chalk.cyan('npm start')}`
    )

    console.log('')
    console.log('Happy coding!')
  }, { cwd: projectPath })
}

module.exports = {
  logErr,
  logOk,
  exists,
  copy,
  shell,
  install
}
