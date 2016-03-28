
# Xenia Driver

Perform queries to [xenia](https://github.com/coralproject/xenia) from the browser and node.js

## Installation (coming soon)

    $ npm install --save coralproject/xenia-driver-js

## Usage

    import XeniaDriver from 'xenia-driver'
  
    // Configure your instance
    const xenia = XeniaDriver(baseUrl, {username: 'user', password: 'pass'})

    // Use the driver
    xenia()
      .match({ 'category': 'sports' })
      .include(['comments', 'name'])
      .limit(14)
      .skip(8)
    .join('my_collection')
    .exec().then(res => console.log(res.data.results))

## API

// Add documentation

## Development

    $ npm start

## Test

    $ npm test
