var Team = require("../lib/team.js");

describe('Team', function() {
  describe('#create', function() {
    it('should create a team', function(done) {
      var team = new Team('test team');
      team.save(done);
    });

  });

});
