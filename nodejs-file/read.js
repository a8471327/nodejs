var fs = require('fs');

// 文件同步读取
var bufferStr = fs.readFileSync('test.txt');
console.log(bufferStr);	//<Buffer ef bb bf 48 65 6c 6c 6f 20 77 6f 72 6c 64 21>

//声明了encoding，所以返回的是普通字符串
var str = fs.readFileSync('test.txt', {encoding: 'utf-8'});
console.log(str);	//﻿Hello world!


//文件读取异常处理：通过try、catch
try{
	var errStr = fs.readFileSync('noneExist.txt');
}catch(err){
	console.log(err.message);	//ENOENT, no such file or directory 'xxx\noneExist.txt'
}

//文件异步读取

//无声明encoding
fs.readFile('test.txt', function(err, data){
	if(err){
		console.log('文件读取失败！');
	}else{
		console.log(data);//<Buffer ef bb bf 48 65 6c 6c 6f 20 77 6f 72 6c 64 21>
	}
});

//声明了encoding
fs.readFile('test.txt', {encoding: 'utf-8'}, function(err, data){
	if(err){
		console.log('文件读取失败！');
	}else{
		console.log(data);//﻿Hello world!
	}
});

//异常处理
fs.readFile('noneExist', {encoding: 'utf-8'}, function(err, data){
	if(err){
		console.log('文件读取失败！');
	}else{
		console.log(data);
	}
});