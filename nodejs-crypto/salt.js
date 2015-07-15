//////////////////////////////
// salt算法
//////////////////////////////
var crypto = require('crypto');
if(!true){//动手加盐
  var md5 = crypto.createHash('md5');
  var txt = "123465";

  md5.update(txt);
  console.log(md5.digest('hex'));

  md5 = crypto.createHash('md5');
  var salt = "abcdefghijklmnopqrstuvwxyz";
  md5.update(txt+salt);
  console.log(md5.digest('hex'));
}

if(!true){//使用crypto.pbkdf2()函数，默认会调用hmac算法，用sha1的散列函数，并且可以设置迭代次数和密文长度
  var txt = "123465";
  var salt = "abcdefghijklmnopqrstuvwxyz";

  // 生成密文，默认HMAC函数是sha1算法
  crypto.pbkdf2(txt, salt, 4096, 256, function (err,hash) {
      if (err) { throw err; }
      console.log(hash.toString('hex'));
  })
}

if(true){//通过伪随机码生成salt，进行加密
  var txt = "123465";
  crypto.randomBytes(128, function (err, salt) {
      if (err) { throw err;}
      salt = salt.toString('hex');
      console.log(salt); //生成salt

      crypto.pbkdf2(txt, salt, 4096, 256, function (err,hash) {
          if (err) { throw err; }
          hash = hash.toString('hex');
          console.log(hash);//生成密文
      })
  })
}