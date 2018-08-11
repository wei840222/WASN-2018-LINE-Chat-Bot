const express = require('express')

// Create express instnace
const app = express()

// Require API routes
const lineBot = require('./routes/lineBot')
const person = require('./routes/person')
const config = require('./routes/config')

// Import API Routes
app.use(lineBot)
app.use(person)
app.use(config)

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app
}
