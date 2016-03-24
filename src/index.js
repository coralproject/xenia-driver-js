
/**
 * Module dependencies
 */

import axios from 'axios'

/**
 * Module constants
 */

 const dataSchema = {
  name: 'my_query',
  desc: 'made with xenia driver',
  params: [],
  queries: [],
  enabled: true
}

const querySchema = {
  name: 'my_query',
  type: 'pipeline',
  collection: 'user_statistics',
  commands: [],
  return: true
}

/**
 * Driver Class
 * @class
 */

class XeniaDriver {

  /**
   * Initialize the driver
   * @constructor
   * @param {string} base url - Xenia base url
   * @param {object} Auth - Xenia basic authentication credentials
   *   @param {}
   * @param {object} parameters - Query parameters; optional
   */
  constructor(baseURL, auth, params={}) {
    if ('string' !== typeof baseURL) {
      throw new Error('A base url is needed for the Xenia Driver to work.')
    }

    if ('object' !== typeof auth) {
      throw new Error('An authorization object ({username, password}) is needed for the Xenia Driver to work.')
    }

    this._baseURL = baseURL
    this._auth = auth
    this._params = params

    // Initialize the request instance
    this._request = axios.create({
      baseURL,
      auth,
      timeout: 10000
    });

    // Initialize the query
    this._data = Object.assign({}, dataSchema)
    this.addQuery(params)

    return this
  }

  /**
   * Commit the current query
   * @private
   */

  _commitQuery () {
    if (this._query) {
      this._query.commands = this._commands
      this._data.queries.push(this._query)
    }

    return this
  }

  /**
   * Initialize a query
   * @param {object} query object - optional
   */

  addQuery (queryData = {}) {
    this._commitQuery()
    this._query = Object.assign({}, querySchema, queryData)
    this._commands = []

    return this
  }

  /**
   * Set the collection for the current query
   * @param {string} collection name
   */
  collection ( name = 'user_statistics' ) {
    this._query.collection = name
    return this
  }

  /**
   * Executes the request
   * @param {object} query data - optional
   */

   exec () {
     this._commitQuery()
     return this._request.post('/exec', this._data)
   }

  /**
   * Limit the amount of retrieved documents
   * @param {number} limit - default: 20
   */

  limit (n = 20) {
    this._commands.push({'$limit': n})
    return this
  }


  /**
   * Skip the first n documents
   * @param {number} skip - default: 0
   */

  skip (n = 0) {
    this._commands.push({'$skip': n})
    return this
  }

  /**
   * Return a document sample from the collection
   * @param {number} size - default: 20
   */

  sample (size = 20) {
    this._commands.push({ '$sample': { size } })
    return this
  }

  /**
   * Include and exclude fields from the result
   * @param {object} fields
   */

  project ( fields = {} ) {
    this._commands.push({ '$project': fields })
    return this
  }

  /**
   * Whitelist retrieved fields
   * @param {array} fields
   */

  include ( fields = [] ) {
    this._commands.push({ '$project': fields.map(field => ({[field]: true})) })
    return this
  }

  /**
   * Blacklist retrieved fields
   * @param {array} fields
   */

  exclude ( fields = [] ) {
    this._commands.push({ '$project': fields.map(field => ({[field]: false})) })
    return this
  }

  /**
   * Performs a match command
   * @param {object} match
   */

  match ( query = {} ) {
    this._commands.push({ '$match': query })
    return this
  }


  /**
   * Performs a redact command
   * @param {object} match
   */

  redact ( query = {} ) {
    this._commands.push({ '$redact': query })
    return this
  }

  /**
   * Deconstructs an array field from the input documents to
   * output a document for each element
   * @param {string} path
   * @param {string} include array index - optional
   * @param {boolean} preserve null and empty arrays - optional
   */

  unwind ( path = {}, includeArrayIndex, preserveNullAndEmptyArrays ) {
    this._commands.push({ '$unwind': { path, includeArrayIndex, preserveNullAndEmptyArrays} })
    return this
  }

  /**
   * Group documents
   * @param {object} group
   */

  group ( groups = {} ) {
    this._commands.push({ '$group': groups })
    return this
  }

  /**
   * Sort documents
   * @param {object|array} sorting data
   */

  sort ( order = {} ) {
    if(Array.isArray(order)) {
      this._commands.push({ '$sort': { [order[0]]: order[1] } })
    } else {
      this._commands.push({ '$sort': order })
    }
    return this
  }

}

/**
 * Expose a function that just create a new XeniaDriver instance
 * so you don't need to use the `new` keyword ¯\_(ツ)_/¯
 */

 module.exports = function (url, auth, params) {
   return new XeniaDriver(url, auth, params)
 }
