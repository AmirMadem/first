const mysql = require("mysql2/promise");

const executeQuery = async (userQuery) => {
	// const connection = await mysql.createConnection({
	// 	host:"sql9.freesqldatabase.com",
	// 	user:"sql9608702",
	// 	password:"eUTumMNUNP",
	// 	database:"sql9608702",
	// 	port:3306,
	// });

	const connection = await mysql.createConnection({
		host:"172.17.0.2",
		user:"root",
		password:"1571438",
		database:"first",
		port:3306,
		connectionLimit:10
	});

	try{
		console.log(userQuery)
		await connection.query(
				userQuery
			)
				console.log("inserted");

	}catch(e){
		console.log(e);
	}

}
module.exports= executeQuery;
//export default executeQuery

