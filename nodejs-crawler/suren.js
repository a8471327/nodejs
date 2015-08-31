var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var fs = require('fs');
var url = 'http://www.shiting5.com/tv/cn/hunan/';
request({url: url, encoding:null }, function (error, res, body) {
    if (!error && res.statusCode == 200) {
        body = iconv.decode(body, 'gb2312');
        var $ = cheerio.load(body);
        var a = $('li > a.vd');
        a.each(function (idx, ele) {
            var obj = $(this);
            var href = obj.attr('href');
            var title = obj.text();
            readChannel({
                href: href,
                title: title
            });
        });
    }
});

function readChannel(opt){
    var option = {
        url: opt.href,
        encoding:null
    }
    request(option, function (error, res, body) {
        if (!error && res.statusCode == 200) {
            body = iconv.decode(body, 'gb2312');
            var $ = cheerio.load(body);
            var script = $('.player > script').text();
            var arr = Number(script.split(',')[1]);
            var phpUrl = 'http://www.jisutiyu.com/plus/shiplay.php?aid='+Number(script.split(',')[1])+'&amp;play=1';
            getTVID({
                href: phpUrl,
                Referer: opt.href,
                title: opt.title
            });
        }
    });
}

function getTVID(opt){
    var option = {
        url: opt.href,
        headers : {
            'Referer': opt.Referer
        },
        encoding:null
    }
    request(option, function (error, res, body) {
        if (!error && res.statusCode == 200) {
            body = iconv.decode(body, 'gb2312');
            var $ = cheerio.load(body);
            var tvUrl = $('iframe').attr('src');
            var obj = {title: opt.title, id: tvUrl.split('http://pczhibo.imgo.tv/')[1]}
            console.log(obj);
        }
    });
}