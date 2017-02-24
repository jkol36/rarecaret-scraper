global.Promise = require('bluebird')
import {
  getAllDiamondsAsHtml
} from './helpers'


getAllDiamondsAsHtml()
.then(console.log)
.catch(console.log)