var express = require('express');
var mysql = require('../mysql');
var router = express.Router();
const request = require("request-promise");

const RIOT_API_KEY = 'RGAPI-c5c7eaa5-0cd3-401d-a9e0-8f3b564d4a9a'
const riotUrl = 'https://kr.api.riotgames.com'

module.exports = router;

router.get('/league',async (req,res) =>{
    var summonerName = req.query.summonerName
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

router.get('/riotSummoner',async (req,res) =>{
    var summonerName = req.query.summonerName;
    try{
        const url = `${riotUrl}/lol/summoner/v4/summoners/by-name/${encodeURI(summonerName)}?api_key=${RIOT_API_KEY}`;
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        res.setHeader("Access-Control-Allow-Origin", "*");

        const result = await request(url);
        return res.json(result);

        
    }catch(e){
        console.log(e)
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
            return res.status(201).json({message: '등록된 유저가 없습니다.'});
        
        res = res.json(result[0].summoner);
    }catch(e){
        return res.status(400).json({message: '잠시 후 다시 시도해주세요.'});
    }
})

router.get('/riotLeague',async (req,res) =>{
    var id = req.query.id;
    try{
        const url = `${riotUrl}/lol/league/v4/entries/by-summoner/${id}?api_key=${RIOT_API_KEY}`;
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        res.setHeader("Access-Control-Allow-Origin", "*");

        const result = await request(url);
        return res.json(result);

        
    }catch(e){
        console.log(e)
        return res.status(400).json({message: '잠시 후 다시 시도해주세요.'});
    }
})

router.get('/riotSummoner',async (req,res) =>{
    var summonerName = req.query.summonerName;
    try{
        const url = `${riotUrl}/lol/summoner/v4/summoners/by-name/${encodeURI(summonerName)}?api_key=${RIOT_API_KEY}`;
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        res.setHeader("Access-Control-Allow-Origin", "*");

        const result = await request(url);
        return res.json(result);
    }catch(e){
        return res.status(400).json({message: '잠시 후 다시 시도해주세요.'});
    }
})

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

router.get('/riotMatchlist',async (req,res) =>{
    var accountId = req.query.accountId;
    var queue = parseInt(req.query.queue);
    var season = parseInt(req.query.season);
    var beginIndex = parseInt(req.query.beginIndex);
    var endIndex = parseInt(req.query.endIndex);
    try{
        const url = `${riotUrl}/lol/match/v4/matchlists/by-account/${accountId}?queue=${queue}&season=${season}&beginIndex=${beginIndex}`+
        `&endIndex=${endIndex}&api_key=${RIOT_API_KEY}`;
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        res.setHeader("Access-Control-Allow-Origin", "*");

        const result = await request(url);
        return res.json(result);

    }catch(e){
        console.log("asd",e);
        return res.status(400).json({message: '잠시 후 다시 시도해주세요.'});
    }
})