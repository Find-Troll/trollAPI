var express = require("express");
var mysql = require("../mysql");
const axios = require("axios");
const cheerio = require("cheerio");

var router = express.Router();
const request = require("request-promise");
const RIOT_API_KEY = "RGAPI-c5c7eaa5-0cd3-401d-a9e0-8f3b564d4a9a";
const riotUrl = "https://kr.api.riotgames.com";

module.exports = router;

router.get("/opMost7Pick", async (req, res) => {
  const summonerName = req.query.summonerName;
  const arr = [];
  const getInfo = (data) => {
    info = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i] !== "") {
        const temp = data[i].split("\t");
        if (
          temp[temp.length - 1] !== "" &&
          temp[temp.length - 1] !== "/" &&
          temp[temp.length - 1] !== "KDA"
        )
          info.push(temp[temp.length - 1]);
      }
    }
    return info;
  };
  const getData = (champName, champMinionKill, personalKDA, played) => {
    const arr = [];
    for (let i = 0; i < champName.length; i++) {
      const obj = {
        champName: champName[i],
        cs: champMinionKill[i],
        KDA: personalKDA[4 * i],
        kills: personalKDA[4 * i + 1],
        deaths: personalKDA[4 * i + 2],
        assists: personalKDA[4 * i + 3],
        winRate: played[2 * i],
        played: played[2 * i + 1],
      };
      arr.push(obj);
    }
    return arr;
  };
  try {
    const data = await axios
      .get(`https://www.op.gg/summoner/userName=${encodeURI(summonerName)}`)
      .then((html) => {
        const $ = cheerio.load(html.data);
        const $bodyList = $(`div.MostChampionContent`);
        let champName = $bodyList.find("div.ChampionName").text().split("\n");
        let champMinionKill = $bodyList
          .find("div.ChampionMinionKill")
          .text()
          .split("\n");
        let personalKDA = $bodyList.find("div.PersonalKDA").text().split("\n");
        let played = $bodyList.find("div.Played").text().split("\n");
        champName = getInfo(champName);
        champMinionKill = getInfo(champMinionKill);
        personalKDA = getInfo(personalKDA);
        played = getInfo(played);
        const data = getData(champName, champMinionKill, personalKDA, played);
        return data;
      });

    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log(data);
    return res.send(data);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "잠시 후 다시 시도해주세요." });
  }
});

router.get("/riotSummoner", async (req, res) => {
  var summonerName = req.query.summonerName;
  console.log(summonerName);
  try {
    const url = `${riotUrl}/lol/summoner/v4/summoners/by-name/${encodeURI(
      summonerName
    )}?api_key=${RIOT_API_KEY}`;
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    res.setHeader("Access-Control-Allow-Origin", "*");

    const result = await request(url);
    return res.json(result);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "잠시 후 다시 시도해주세요." });
  }
});

router.get("/summoner", async (req, res) => {
  var summonerName = req.query.summonerName;
  try {
    var select = `SELECT summoner FROM users WHERE JSON_EXTRACT(summoner,'$.name') = ?`;
    var result = await mysql.do(select, [summonerName]);
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    res.setHeader("Access-Control-Allow-Origin", "*");

    if (result.length == 0)
      return res.status(201).json({ message: "등록된 소환사가 없습니다." });

    res = res.json(result[0].summoner);
  } catch (e) {
    return res.status(400).json({ message: "잠시 후 다시 시도해주세요." });
  }
});

router.get("/riotLeague", async (req, res) => {
  var id = req.query.id;
  try {
    const url = `${riotUrl}/lol/league/v4/entries/by-summoner/${id}?api_key=${RIOT_API_KEY}`;
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    res.setHeader("Access-Control-Allow-Origin", "*");

    const result = await request(url);
    return res.json(result);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "잠시 후 다시 시도해주세요." });
  }
});

router.get("/riotLeagues", async (req, res) => {
  const leagueId = req.query.leagueId;
  try {
    //"https://kr.api.riotgames.com/lol/league/v4/leagues/54fb7852-29f5-44ac-8454-7a45a0b787d3"
    const url = `${riotUrl}/lol/league/v4/leagues/${leagueId}?api_key=${RIOT_API_KEY}`;
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    res.setHeader("Access-Control-Allow-Origin", "*");

    const result = await request(url);
    return res.json(result);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "잠시 후 다시 시도해주세요." });
  }
});

router.get("/riotSummoner", async (req, res) => {
  var summonerName = req.query.summonerName;
  try {
    const url = `${riotUrl}/lol/summoner/v4/summoners/by-name/${encodeURI(
      summonerName
    )}?api_key=${RIOT_API_KEY}`;
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    res.setHeader("Access-Control-Allow-Origin", "*");

    const result = await request(url);
    return res.json(result);
  } catch (e) {
    return res.status(400).json({ message: "잠시 후 다시 시도해주세요." });
  }
});

router.get("/matchlist", async (req, res) => {
  var summonerName = req.query.summonerName;
  try {
    var select = `SELECT accountId FROM users WHERE JSON_EXTRACT(summoner,'$.name') = ?`;
    var result = await mysql.do(select, [summonerName]);
    accountId = result[0].accountId;

    select = "select matchlist from user WHERE accountId = ? ";
    result = await mysql.do(select, [accountId]);

    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.json(result[0].matchlist);
  } catch (e) {
    return res.status(400).json({ message: "잠시 후 다시 시도해주세요." });
  }
});

router.get("/riotMatchlist", async (req, res) => {
  var accountId = req.query.accountId;
  var queue = parseInt(req.query.queue);
  var season = parseInt(req.query.season);
  var beginIndex = parseInt(req.query.beginIndex);
  var endIndex = parseInt(req.query.endIndex);
  try {
    const url =
      `${riotUrl}/lol/match/v4/matchlists/by-account/${accountId}?queue=${queue}&season=${season}&beginIndex=${beginIndex}` +
      `&endIndex=${endIndex}&api_key=${RIOT_API_KEY}`;
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    res.setHeader("Access-Control-Allow-Origin", "*");

    const result = await request(url);
    return res.json(result);
  } catch (e) {
    return res.status(400).json({ message: "잠시 후 다시 시도해주세요." });
  }
});

router.get("/trollScore", async (req, res) => {
  const summonerName = req.query.summonerName;
  try {
    const select = "SELECT trollScore from win_rate WHERE summonerName = ?";
    result = await mysql.do(select, [summonerName]);
    console.log(result);
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (result.length != 0) return res.json(parseInt(result[0].trollScore));
    else {
      if (result[0].trollScore === null)
        console.log("소환사 점수 없음", result);
      return null;
    }
  } catch (e) {
    return res
      .status(400)
      .json({ message: "소환사의 모든 데이터가 없습니다." });
  }
});

router.get("/statistics", async (req, res) => {
  try {
    const select = "select * from tiers";
    result = await mysql.do(select);
    console.log(result);
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(result);
  } catch (e) {
    return res.status(400).json({ message: "정보가 없습니다." });
  }
});
