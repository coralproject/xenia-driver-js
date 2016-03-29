var XeniaDriver = require('../../dist')
var Plotly = require('plotly.js')

var xenia = XeniaDriver('http://10.0.1.84:4000/1.0', 'Basic NmQ3MmU2ZGQtOTNkMC00NDEzLTliNGMtODU0NmQ0ZDM1MTRlOlBDeVgvTFRHWjhOdGZWOGVReXZObkpydm4xc2loQk9uQW5TNFpGZGNFdnc9')



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

topContributorsChart()
trolls()
