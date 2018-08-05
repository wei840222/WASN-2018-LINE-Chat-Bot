import * as axios from 'axios'

let options = {}
// The server-side needs a full url to works
if (process.server) {
  options.baseURL = process.env.BASE_URL
}

export default axios.create(options)
