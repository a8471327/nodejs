var mysql = require('mysql');
var conn = mysql.createConnection({
	host: 'localhost',
	user: 'nodejs',
	password: 'nodejs',
	database: 'nodejs',
	port: 3306
});
conn.connect();

var insertSQL = 'insert into t_user(name) values("conan"), ("fens.me")';
var selectSQL = 'select * from t_user limit 10';
var deleteSQL = 'delete from t_user';
var updateSQL = 'update t_user set name="conan update" where name="conan"';

//delete
conn.query(deleteSQL, function(err0, res0){
	err0 && console.log(err0);
	console.log("DELETE Return ==>");
	console.log(res0);

	//insert
	conn.query(insertSQL, function(err1, res1){
		err1 && console.log(err1);
		console.log("INSERT Return ==>");
		console.log(res1);

		//query
		conn.query(selectSQL, function(err2, rows){
			err2 && console.log(err2);
			console.log("SELECT ==>");
			for(var i in rows){
				console.log(rows[i]);
			}

			//update
			conn.query(updateSQL, function(err3, res3){
				err3 && console.log(err3);
				console.log("UPDATE Return ==>");
				console.log(res3);

				//query
				conn.query(selectSQL, function(err4, rows2){
					err4 && console.log(err4);
					console.log("SELECT ==>");
					for(var i in rows2){
						console.log(rows2[i]);
					}
				});
			});
		});
	});
});

// conn.query('select 1 + 1 as solution', function(err, rows, fields){
// 	if(err){
// 		throw err;
// 	}
// 	console.log('The solution is', rows[0].solution);
// });
//conn.end();

