superagent = require('superagent')

describe('admin page', function() {
    it('should load', function () {
	superagent
	    .get('http://localhost:3000/admin')
	    .end(function(res){
        expect(res.status).to.equal(200)
	    })
    })
})
