var db = require("../lib/db.js")

describe('db', function() {

  it ('should connect', function(done) {
    var connection = db.connect(done);
  })

})
