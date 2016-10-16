var mongoose = require("../app/models/db.js")
var expect    = require("chai").expect;

describe('Mongoose', function() {

  it ('should have a connection', function() {
    expect(mongoose.connection).to.not.be.null
  })

})
