
require('babel-register')
var xeniaDriver = require('../src')
var auth = require('./keys.json')
var assert = require('assert')

const xenia = xeniaDriver('https://demo.coralproject.net/xenia_api/1.0', auth)

describe('Xenia Driver', function() {

   describe('Constructor', function() {
      it('should return a new Xenia Driver instance', function(){
         const xen = xenia('https://demo.coralproject.net/xenia_api/1.0', auth)
         assert(xen._baseURL === 'https://demo.coralproject.net/xenia_api/1.0')
         assert(xen._auth.username === auth.username && xen._auth.password === auth.password)
         assert('object' === typeof xen._request)
         assert('object' === typeof xen._data)
      })
   })

   describe('limit', function() {
      it('should add a limit command', function() {
         const x = xenia()
         x.limit(15)
         assert(x._commands[0].$limit === 15)
      })

      it('should default to 20', function() {
         const x = xenia()
         x.limit()
         assert(x._commands[0].$limit === 20)
      })
   })

   describe('exec', function() {
      it('should execute a query to xenia', function(done) {
         xenia()
           .sample(24)
           .limit(15)
           .skip(1)
         .exec().then(res => {
            assert(res.data.results.length)
            done()
         })
      })
   })

   describe('join', function() {
      it('should save the query and create a new one matching the field', function() {
         const x = xenia()
            .sample(10)
            .join('user_search', 'avatar')
            ._commitQuery() // just not to do exec for adding the second query

         assert(x._data.queries.length === 2)
         assert(x._data.queries[1].commands.length === 1)
         assert(x._data.queries[1].commands[0].$match.avatar.$in === '#data.*:list.avatar')
      })
   })
})
