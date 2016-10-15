var MongoClient = require('mongodb').MongoClient
  , async = require('async')

var state = {
  db: null
}

var URI = 'mongodb://devuser:FireSkinMan@ds057806.mlab.com:57806/mathsquiz'

exports.connect = function(done) {
  if ( state.db ) return done();
  MongoClient.connect(URI, function(err, db) {
    if (err) return done(err)
    state.db = db
    done()
  })
}
