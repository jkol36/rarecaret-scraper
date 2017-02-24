import { expect } from 'chai'
import {
  getAllDiamondsAsHtml
} from './helpers'


describe('rare caret scraper', () => {
  it('should return html', done => {
    getAllDiamondsAsHtml()
    .then(results => {
      expect(results).to.not.be.null
      done()
    })
  })
})