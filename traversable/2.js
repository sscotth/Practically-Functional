const fs = require('fs')
const Task = require('data.task')
const { List, Map } = require('immutable-ext')

const httpGet = (path, params) =>
  Task.of(`${path}: result`)

const getUser = x => httpGet('/user', {id: x})
const getTimeline = x => httpGet(`/timeline/${x}`, {})
const getAds = () => httpGet('/ads', {})

Map({
  current_user: getUser(2),
  timeline: getTimeline(3),
  ads: getAds()
}).traverse(Task.of, t => t)

List
  .of(getUser, getTimeline, getAds)
  .traverse(Task.of, f => f(2))
  .fork(console.error, console.log)
