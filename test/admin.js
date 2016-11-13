
var request = require('superagent')
var expect = require('chai').expect


describe('admin page', function() {
  it('should return auth required', function (done) {
	  request
	    .get('http://localhost:3000/admin')
	    .end(function(err, res){
        expect(err).to.not.be.null
        expect(res.status).to.equal(401)
        done()
	  })
  })
  it('should authenticate', function(done){
    request
      .get('http://localhost:3000/admin')
      .auth('username', 'password', {type: 'auto'})
      .end(function(err, res){
        expect(err).to.be.null
        expect(res.status).to.equal(200)
        done()
      })
    })
})
