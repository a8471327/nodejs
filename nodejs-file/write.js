var fs = require('fs');


//异步写文件
if(!true){//往不存在的文件里写内容
	var noneExistFileName = ['async_create.', Date.now(), '.txt'].join('');
	fs.writeFile(noneExistFileName, '文件不存在，则创建', function(err){
		if(err) throw err;
		console.log(noneExistFileName+'不存在被创建了！');
	});
}

if(!true){//往存在的文件里写内容
	fs.writeFile('async_exists.txt', '文件已存在，则覆盖内容--' + Date.now(), function(err){
		if(err) throw err;
		console.log('async_exists.txt已存在，内容被覆盖！');
	});
}

if(!true){//往已经存在的文件里追加内容
	fs.writeFile('async_add.txt', '\n文件已存在，并追加内容--'+Date.now(),{
		flag: 'a'
	}, function(err){
		if(err) throw err;
		console.log('exists.txt已存在，内容被追加！')
	});
}

//同步写文件
if(!true){//往不存在的文件里写内容
	var noneExistFileName = ['sync_create.', Date.now(), '.txt'].join('');
	fs.writeFileSync(noneExistFileName, '文件不存在，则创建');
	console.log('文件不存在，则创建');
}

if(!true){//往存在的文件里写内容
	fs.writeFileSync('sync_exist.txt', '文件已存在，则覆盖内容--'+Date.now());
	console.log('文件已存在，则覆盖内容--'+Date.now());
}

if(!true){//往已经存在的文件里追加内容
	fs.writeFileSync('sync_add.txt', '\n文件已存在，并追加内容--'+Date.now(), {
		flag: 'a'
	});
	console.log('\n文件已存在，并追加内容--'+Date.now());
}