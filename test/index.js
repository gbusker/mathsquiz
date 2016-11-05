superagent = require('superagent')
expect = require('chai').expect

describe('index page', function() {
    it('should load', function () {
	    superagent
	      .get('http://localhost:3000/')
	      .end(function(res){
		      expect(res.status).to.equal(200)
	    })
    })
    it('should accept team and name')
    it('should divert to /play')
})
