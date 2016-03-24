
# Xenia Driver

Perform queries to [xenia](https://github.com/coralproject/xenia) from the browser and node.js

## Installation (coming soon)

    $ npm install --save xenia-driver

## Usage

    import XeniaDriver from 'xenia-driver'

    xeniaDriver(baseUrl, {username: 'user', password: 'pass'})
      .match({ 'category': 'sports' })
      .include(['comments', 'name'])
      .limit(14)
      .skip(8)
    .exec().then(res => console.log(res.data.results))

## API

// Add documentation

## Development

    $ npm start

## Test

    $ npm test
