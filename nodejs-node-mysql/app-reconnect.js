var mysql = require('mysql');
var conn;
function handleError(){
	conn = mysql.createConnection({
		host: 'localhost',
		user: 'nodejs',
		password: 'nodejs',
		database: 'nodejs',
		port: 3306
	});

	//连接超时，2秒重试
	conn.connect(function(err){
		if(err){
			console.log('error when connection to db:' + err);
			setTimeout(handleError, 2000);
		}
	});

	conn.on('error', function(err){
		console.log('db error', err);
		//如果是连接断开，自动重新连接
		if(err.code === 'PROTOCOL_CONNECTION_LOST'){
			handleError();
		}else{
			throw err;
		}
	});
}
handleError();

function query(){
	console.log(new Date());
	var sql = "show variables like 'wait_timeout'";
	conn.query(sql, function(err, res){
		console.log(res);
	});
}

query();
setInterval(query, 15*1000);