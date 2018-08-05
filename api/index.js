const express = require('express')

// Create express instnace
const app = express()

// Require API routes
const lineBot = require('./routes/lineBot')
const person = require('./routes/person')

// Import API Routes
app.use(lineBot)
app.use(person)

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app
}
