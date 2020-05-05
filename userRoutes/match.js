var express = require('express');
var mysql = require('../mysql');
var router = express.Router();

module.exports = router;

router.get('/matchlist',async (req,res) =>{
    var summonerName = req.query.summonerName;
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
 
router.get('/matches',async (req,res) =>{
    var gameId = req.query.gameId;
    try{
        var select = "SELECT matches FROM `match` WHERE gameId = ?";
        var result = await mysql.do(select,[gameId]);
        
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res = res.json(result[0].matches);
    }catch(e){
        return res.status(400).json({message: '잠시 후 다시 시도해주세요.'});
    }
})

router.get('/timelines',async (req,res) =>{
    var gameId = req.query.gameId;
    try{
        var select = "SELECT timelines FROM `match` WHERE gameId = ?"
        var result = await mysql.do(select,[gameId]);
        
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res = res.json(result[0].timelines);
    }catch(e){
        return res.status(400).json({message: '잠시 후 다시 시도해주세요.'});
    }
})