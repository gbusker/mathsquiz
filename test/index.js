superagent = require('superagent')
expect = require('chai').expect

describe('index page', function() {
    it('should load', function (done) {
	    superagent
	      .get('http://localhost:3000/')
	      .end(function(err, res){
          expect(err).to.be.null
		      expect(res.status).to.equal(200)
          done()
	    })
    })
    it('should accept team and name')
    it('should divert to /play')
})
