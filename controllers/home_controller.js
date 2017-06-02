'strict';
module.exports = function(app){
	var home = {};
	home.index=function (req, res) {
	  res.type('application/json');
	  res.send({message: 'API service running'});
	};
	return home;
}

