var request = require('superagent')
var expect = require('chai').expect

describe('stats page', function(){
  it('should load', function (done) {
    superagent
      .get('http://localhost:3000/stats')
      .end(function(err, res){
        expect(err).to.be.null
        expect(res.status).to.equal(200)
        done()
    })
  })
})
