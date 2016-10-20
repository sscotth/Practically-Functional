const { Right, Left } = require('../either')
const Box = require('../box')
const Task = require('data.task')

// nt(a.map(f)) == nt(a).map(f)
const eitherToTask = e =>
  e.fold(Task.rejected, Task.of)

const fake = id =>
  ({id: id, name: 'user1', best_friend_id: id + 1})

const Db = ({
  find: id =>
    new Task((rej, res) =>
      setTimeout(() =>
        res(id > 2 ? Right(fake(id)) : Left('not found')),
        100))
})

const send = (code, json) =>
  console.log(`sending ${code}: ${JSON.stringify(json)}`)

Db.find(1)  // Task(Either(user || null))
  // .chain(eu => eu.map(u => Db.find(u.best_friend_id))) // Either(Task(Either(user || null))
  .chain(eu => eu.traverse(Task.of, u => Db.find(u.best_friend_id))) // Task(Either(Either(user || null))
  .chain(eeu => eeu.chain(x => x)) // Task(Either(user || null))
  .chain(eitherToTask) // Task(user || null)
  .fork(error => send(500, { error }), u => send(200, u))
  // downside: 404 vs 500 is gone
