var express = require('express');
var mysql = require('../mysql');
var router = express.Router();

module.exports = router;

router.get('/:summonerName/league',async (req,res) =>{
    var summonerName = req.params.summonerName
    console.log(summonerName)
    try{
        var select = `SELECT league FROM user WHERE JSON_EXTRACT(summoner,'$.name') = ?`;
        var result = await mysql.do(select,[summonerName]);
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.charset = 'utf-8'

        if(result.length==0)
            return res.status(401).json({message: '등록된 유저가 없습니다.'});
        return res.json(result[0].league);

    }catch(e){
        return res.status(400).json({message: '잠시 후 다시 시도해주세요.'});
    }
})

router.get('/:summonerName/summoner',async (req,res) =>{
    var summonerName = req.params.summonerName;
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

router.get('/:summonerName/matchlist',async (req,res) =>{
    var summonerName = req.params.summonerName;
    try{
        var select = `SELECT accountId FROM user WHERE JSON_EXTRACT(summoner,'$.name') = ?`;
        var result = await mysql.do(select,[summonerName]);
        accountId = result[0].accountId;
 
        select = "select matchlist from user WHERE accountId = ? ";
        result = await mysql.do(select,[accountId]);
       
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        res.setHeader("Access-Control-Allow-Origin", "*");
        return res.json(result[0].matchlist);
    }catch(e){
        return res.status(400).json({message: '잠시 후 다시 시도해주세요.'});
    }
})