
const executeQuery = require('./server');

const manageUsers = {
	
	'saveNewUser':function(userID,userAffiliation){
		var query= 'INSERT INTO users (userID,affiliation) VALUES ("'+userID+'","'+userAffiliation+'")'
		return query;
	}
}

const firstQuery = manageUsers.saveNewUser("119","left");
console.log(firstQuery);
executeQuery(firstQuery);


module.exports= manageUsers;