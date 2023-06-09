const express = require('express');
const bodyParser = require('body-parser');
const mysql = require("mysql2/promise");

const app = express();
const PORT = 5000;

const executeQuery = async (userQuery) => {
	const connection = await mysql.createPool({
		host:"172.17.0.2",
		user:"root",
		password:"1571438",
		database:"first",
		port:3306,
		connectionLimit:10
	});

	try{
		console.log(userQuery);
		return await connection.query(userQuery);

	}catch(e){
		console.log(e);
	}
}

/*const connection = await mysql.createConnection({
	host:"sql9.freesqldatabase.com",
	user:"sql9608702",
	password:"eUTumMNUNP",
	database:"sql9608702",
	port:3306,

});*/

app.use(bodyParser.json())
app.get('/hello', (req, res) => {
    res.send({msg: "hello"});
});



app.post('/getUsers', async (req, res) => {
    console.log("Got query request: " + req.body.query);
    const result = await executeQuery(req.body.query);
	console.log("sending result: "+result);
    res.send({result: result});
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`)); 


