const Task = require('data.task')
const fs = require('fs')

const readFile = (name, enc) =>
  new Task((rej, res) =>
    fs.readFile(name, enc, (err, contents) =>
      err ? rej(err) : res(contents)))

const writeFile = (name, enc) =>
  new Task(rej =>
    fs.writeFile(name, enc, err => err && rej(err)))

const app = () =>
  readFile('config.son', 'utf-8')
    .map(c => c.replace(/8/g, '6'))
    .chain(c => writeFile('config1.json', c))
    .fork(console.error, () => console.log('success!'))

app()
