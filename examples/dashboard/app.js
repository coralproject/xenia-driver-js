var XeniaDriver = require('../../')
var keys = require('./keys')
var Plotly = require('plotly.js')

var xenia = XeniaDriver(keys.baseURL, keys.auth)

const topContributorsChart = () =>
xenia()
  .include(['name', 'stats.comments'])
  .sort(['stats.comments', -1])
  .limit(20)
  .exec().then(res => {
    const x = res.results[0].Docs.map(user => user.name)
    const y = res.results[0].Docs.map(user => user.stats.comments)
    const data = [{ x, y, type: 'bar' }]
    Plotly.plot('top-contributors', data, {title: 'Top contributors'})
  })

const joinCollections = () =>
xenia()
  .collection('comments')
  .include(['body', 'asset_id'])
  .limit(5)
  .join('assets', '_id', 'asset_id', 'asset')
  .include(['section'])
  .exec().then(res => {
    console.log(res.results)
  })

const trolls = () =>
xenia()
  .include(['name', 'avatar', 'statistics.comments.all.ratios.SystemFlagged'])
  .sort(['statistics.comments.all.ratios.SystemFlagged', -1])
  .limit(5)
  .exec().then(res => {
    const html = res.results[0].Docs.map(({avatar, name}) =>
      `<div><img src="${avatar}" /><p>${name}</p></div>`
    ).join('')
    document.querySelector('#trolls').innerHTML = html
  })

joinCollections()
topContributorsChart()
trolls()
