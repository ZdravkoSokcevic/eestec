const mysql= require('mysql');
const env= require('custom-env').env('dev');

let connString={
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'eestec'
}


let connection= mysql.createConnection(connString);

connection.connect(err=> {
  if(err) {
			console.log(err);
			throw err;
	}
  console.log("Connected to db");
});

module.exports= connection;