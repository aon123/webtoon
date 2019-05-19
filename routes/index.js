var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var router = express.Router();
var mysql      = require('mysql');
var client = require('cheerio-httpcli');
var passport = require('passport'),
    KakaoStrategy = require('passport-kakao').Strategy;

passport.use(new KakaoStrategy({
        clientID : 'bd2e610396fb7bbb84cf91a786b3cc72',
        callbackURL :'/auth/login/kakao/callback',
       clientSecret : 'eUtJGtlLoCZJufevp3LKfDP0KOtZUV7R'
    },
    function(accessToken, refreshToken,params, profile, done){
        //사용자 정보는 profile에
        loginByThirdparty(accessToken, refreshToken, profile);

        console.log("(!)로그인 : " + profile._json.id+"("+profile._json.properties.nickname +")");
        //return done(null,profile)
        return done(null, {
            'user_id': profile._json.id,
            'nickname': profile._json.properties.nickname
        });
    }
));

// kakao 로그인
router.get('/auth/login/kakao',
   // passport.authenticate('kakao',{state: "myStateValue"})
   passport.authenticate('kakao')
);

// kakao 로그인 연동 콜백
router.get('/auth/login/kakao/callback',
    passport.authenticate('kakao', {
        //session: false,
        successRedirect: '/mytoons',
        failureRedirect: '/'
    })
);

function loginByThirdparty(accessToken, refreshToken, profile) {
    //예전 코드는 MySQL 버젼이 맞지 않음
  //  var sql = 'INSERT INTO `user`(id) VALUES(?) ON DUPLICATE KEY(PRIMARY) UPDATE id=(?);'
    var sql = "INSERT INTO `user` (id) VALUES (?) ON DUPLICATE KEY UPDATE id=id";
    var kid=[profile._json.id];
    connection.query(sql,kid,function(err,result){
        if (err) {
            console.log("로그인 쿼리중 에러 : " + err);
        } else {
            console.log("로그인 DB처리 완료!");
        }
    });
}

router.get('/auth/logout/kakao',function (req,res) {
    req.logout();
    res.redirect('/');
})

allWebtoons = new Array();

function getLatestToon(titleid, day ,cb) {
}

function getAllToons() {
    allWebtoonList = new Array();
//월요일 다음 웹툰
     var mon='mon';
     var mon_name='MON';
     var daum = `http://webtoon.daum.net/data/pc/webtoon/list_serialized/${mon}?timeStamp=1515819276574`;
     var site = 'daum';
        client.fetch(daum, {}, function (err, $, res, body) {
            var data = JSON.parse(body);
            var list = data["data"];
            list.forEach(function (item, idx) {
                var webtoon_link = 'http://webtoon.daum.net/webtoon/view/' + item.nickname.toString();
                var webtoon = {
                    toon_index: item.id,
                    name: item.title,
                    thum_link: item.pcThumbnailImage.url,
                    webtoon_link: webtoon_link,
                    week :mon_name,
                    site: site,
                    latest: 0
                };
                allWebtoonList.push(webtoon);
            });

        });

//화요일 다음 웹툰
    var tue='tue';
    var tue_name='TUE';
    var daum1 = `http://webtoon.daum.net/data/pc/webtoon/list_serialized/${tue}?timeStamp=1515819276574`;
    client.fetch(daum1, {}, function (err, $, res, body) {
        var data = JSON.parse(body);
        var list = data["data"];
        list.forEach(function(item, idx){
            var webtoon_link='http://webtoon.daum.net/webtoon/view/'+item.nickname.toString();
            var webtoon= {
                toon_index: item.id,
                name : item.title,
                thum_link : item.pcThumbnailImage.url,
                webtoon_link : webtoon_link,
                week : tue_name,
                site : site,
                latest : 0
            };
            allWebtoonList.push(webtoon);
        });

    });

//수요일 다음 웹툰
    var wed='wed';
    var wed_name='WED';
    var daum2 = `http://webtoon.daum.net/data/pc/webtoon/list_serialized/${wed}?timeStamp=1515819276574`;

    client.fetch(daum2, {}, function (err, $, res, body) {
        var data = JSON.parse(body);
        var list = data["data"];

        list.forEach(function(item, idx){

            var webtoon_link='http://webtoon.daum.net/webtoon/view/'+item.nickname.toString();
            var webtoon= {
                toon_index: item.id,
                name : item.title,
                thum_link : item.pcThumbnailImage.url,
                webtoon_link : webtoon_link,
                week : wed_name,
                site : site,
                latest : 0
            };
            allWebtoonList.push(webtoon);
        });

    });

//목요일 다음 웹툰
    var thu='thu';
    var daum3 =`http://webtoon.daum.net/data/pc/webtoon/list_serialized/${thu}?timeStamp=1515819276574`;
    var thu_name='THU';
    client.fetch(daum3, {}, function (err, $, res, body) {
        var data = JSON.parse(body);
        var list = data["data"];
        list.forEach(function(item, idx){
            var webtoon_link='http://webtoon.daum.net/webtoon/view/'+item.nickname.toString();
            var webtoon= {
                toon_index: item.id,
                name : item.title,
                thum_link : item.pcThumbnailImage.url,
                webtoon_link : webtoon_link,
                week : thu_name,
                site : site,
                latest : 0
            };
            allWebtoonList.push(webtoon);
        });

    });

//금요일 다음 웹툰
    var fri='fri';
    var daum4 =`http://webtoon.daum.net/data/pc/webtoon/list_serialized/${fri}?timeStamp=1515819276574`;
    var fri_name='FRI';
    client.fetch(daum4, {}, function (err, $, res, body) {
        var data = JSON.parse(body);
        var list = data["data"];
        list.forEach(function(item, idx){
            var webtoon_link='http://webtoon.daum.net/webtoon/view/'+item.nickname.toString();
            var webtoon= {
                toon_index: item.id,
                name : item.title,
                thum_link : item.pcThumbnailImage.url,
                webtoon_link : webtoon_link,
                week : fri_name,
                site : site,
                latest : 0
            };
            allWebtoonList.push(webtoon);
        });

    });

//토요일 다음 웹툰
    var sat='sat';
    var daum5 =`http://webtoon.daum.net/data/pc/webtoon/list_serialized/${sat}?timeStamp=1515819276574`;
    var sat_name='SAT';
    client.fetch(daum5, {}, function (err, $, res, body) {
        var data = JSON.parse(body);
        var list = data["data"];
        list.forEach(function(item, idx){
            var webtoon_link='http://webtoon.daum.net/webtoon/view/'+item.nickname.toString();
            var webtoon= {
                toon_index: item.id,
                name : item.title,
                thum_link : item.pcThumbnailImage.url,
                webtoon_link : webtoon_link,
                week : sat_name,
                site : site,
                latest : 0
            };
            allWebtoonList.push(webtoon);
        });

    });

//일요일 다음 웹툰
    var sun='sun';
    var daum6 = `http://webtoon.daum.net/data/pc/webtoon/list_serialized/${sun}?timeStamp=1515819276574`;
    var sun_name='SUN';
    client.fetch(daum6, {}, function (err, $, res, body) {
        var data = JSON.parse(body);
        var list = data["data"];
        list.forEach(function(item, idx){
            //다음 웹툰 아이디, 제목, 요일
            var webtoon_link='http://webtoon.daum.net/webtoon/view/'+item.nickname.toString();
            var webtoon= {
                toon_index: item.id,
                name : item.title,
                thum_link : item.pcThumbnailImage.url,
                webtoon_link : webtoon_link,
                week : sun_name,
                site : site,
                latest : 0
            };
            allWebtoonList.push(webtoon);
        });
    });

//네이버 웹툰
    var allWeeklyToonsUrl = "http://comic.naver.com/webtoon/weekday.nhn";
    request(allWeeklyToonsUrl,function (err, res, html) {
        if(!err){
            var $ = cheerio.load(html);
            var p = Promise.resolve();
            var eachs = $(".thumb").each(function (i) {
                var week = $(this).parent().parent().prev().attr('class');
                var webtoon_link = "http://comic.naver.com" + $(this).children().first().attr('href');
                var thumb_link = $(this).children().first().children().first().attr('src');
                var name = $(this).next().text();
                var titleid = webtoon_link.split('?')[1].split('&')[0].split('=')[1];
                var site = 'naver';
                var webtoon= {
                    toon_index: titleid,
                    name : name,
                    thum_link : thumb_link,
                    webtoon_link : webtoon_link,
                    week : week,
                    site : site,
                    latest : 0
                };
                allWebtoonList.push(webtoon);
            });
            p.then(function() {
                i = 0;
                allWebtoonList.forEach(function (webtoon) {
                        var sql= "INSERT INTO `toon` (toon_index, name, thum_link, webtoon_link, week, site, latest) VALUES(?) ON DUPLICATE KEY UPDATE latest=latest";
                        var values=[webtoon.toon_index, webtoon.name, webtoon.thum_link, webtoon.webtoon_link,webtoon.week, webtoon.site, webtoon.latest];
                             connection.query(sql,[values],function(err,result){
                                 if (err) {
                                     console.log("웹툰 DB 에러 : " + err);
                                 } else {
                                    // console.log("웹툰 DB처리 완료!");
                                 }
                            });
                    //});
                })
            });
        }
    });
    allWebtoons = allWebtoonList;
};

getAllToons();
//처음 한번 수행
setInterval(getAllToons,5*60*1000);
//5분에 한번 수행

/* GET home page. */
router.get('/',
    function(req,res,next){
        if(req.isAuthenticated()){
            res.redirect('/mytoons');
            console.log("(!)이미 로그인");
        }else{
            console.log("(!)로그인세션 없음");
            res.render('index',{
                title: "니툰내툰",
                list: allWebtoons
            });
        }
    });

module.exports = router;
