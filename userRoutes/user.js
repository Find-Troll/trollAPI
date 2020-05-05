var express = require('express');
var mysql = require('../mysql');
var router = express.Router();

module.exports = router;

router.get('/league',async (req,res) =>{
    var summonerName = req.query.summonerName;
    try{
        var select = `SELECT league FROM user WHERE JSON_EXTRACT(summoner,'$.name') = ?`;
        var result = await mysql.do(select,[summonerName]);
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        res.setHeader("Access-Control-Allow-Origin", "*");

        if(result.length==0)
            return res.status(401).json({message: '등록된 유저가 없습니다.'});
        return res.json(result[0].league);

    }catch(e){
        return res.status(400).json({message: '잠시 후 다시 시도해주세요.'});
    }
})

router.get('/summoner',async (req,res) =>{
    var summonerName = req.query.summonerName;
    try{
        var select = `SELECT summoner FROM user WHERE JSON_EXTRACT(summoner,'$.name') = ?`;
        var result = await mysql.do(select,[summonerName]);
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        res.setHeader("Access-Control-Allow-Origin", "*");

        if(result.length ==0)
            return res.status(401).json({message: '등록된 유저가 없습니다.'});
        
        res = res.json(result[0].summoner);
    }catch(e){
        return res.status(400).json({message: '잠시 후 다시 시도해주세요.'});
    }
})