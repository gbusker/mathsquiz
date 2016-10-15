// team.js
//

function Team(name) {
  this.name = name;
};

Team.prototype.save = function (callback) {
  callback();
};

module.exports = Team;
