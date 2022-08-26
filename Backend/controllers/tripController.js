const sql = require('../db/tripSQL');
const utils = require('../BEutils');

const toDate = (dateStr) => { //päivämäärä yyyy-mm-dd
    const [year, month, day] = dateStr.split("-").map(x => parseInt(x));
    return new Date(year, month-1, day);
}

const getDatePair = (minDate, maxDate) => {
  return [toDate(minDate), toDate(maxDate)];
}

module.exports = {
  //hae porukan tarinat ja niihin linkitetyt tiedot matkaajasta, matkasta ja matkakohteesta
  getPublicStories: async (req, res) => {
    console.log("getPublicStories()");
    try {
      let c = [];
      c = await sql.getPublicStories();
      res.statusCode = 200;
      res.json({ status: "OK", data : c });
    }
    catch (err) {
      console.log("Error in server")
      res.statusCode = 400;
      res.json({status : "NOT OK", msg : err});
    }
  },

  //hae omat tarinat ja niihin linkitetyt tiedot matkaajasta, matkasta ja matkakohteesta
  getOwnStories: async (req, res) => {
    console.log("getOwnStories()");
    let idmatkaaja = utils.checkUserID(req, res);
    try {
      let c = [];
      c = await sql.getOwnStories([idmatkaaja]);
      res.statusCode = 200;
      res.json({ status: "OK", data : c });
    }
    catch (err) {
      console.log("Error in server")
      res.statusCode = 400;
      res.json({status : "NOT OK", msg : err});
    }
  },
  //hae yksittäinen tarina matkan ja matkakohteen id:n perusteella
  getStory: async (req, res) => {
    console.log("getStory()");
    let idmatkaaja = utils.checkUserID(req, res);

    let idmatka = req.query.idmatka;
    let idmatkakohde = req.query.idmatkakohde;
    let queryParams = [idmatka, idmatkakohde, idmatkaaja];
    try {
      let c = {};
      c = await sql.getStory(queryParams);
      if (c.length > 0){
        res.statusCode = 200;
        res.json({ status: "OK", data : c[0] });
      } else {
        res.statusCode = 400;
        res.json({ status: "NOT OK", msg: 'Tarinaa ei löydy annetuilla id:illä, kirjaudu sisään uudelleen.'});
      }
    }
    catch (err) {
      console.log("Error in server")
      res.statusCode = 400;
      res.json({status : "NOT OK", msg : err});
    }
  },

  //hae matkat ja niiden matkaajat
  getOwnTrips: async (req, res) => {
    console.log("getTrips()");
    let idmatkaaja = utils.checkUserID(req, res);
    try {
      let c = [];
      c = await sql.getOwnTrips([idmatkaaja]);
      res.statusCode = 200;
      res.json({ status: "OK", data : c });
    }
    catch (err) {
      console.log("Error in server")
      res.statusCode = 400;
      res.json({status : "NOT OK", msg : err});
    }
  },

  addStory: async (req, res) => {
    console.log("addStory()");
    let idmatkaaja = utils.checkUserID(req, res);
    let idmatka = req.body.idmatka;
    let pvmRange; //luo annetun matkan id:n perusteella tarkasteltava päivämäärä range

    try{
      let trip = await sql.getTrip([idmatka, idmatkaaja]); //mikäli kirjautunut käyttäjä yrittää luoda toisten matkaan tarinaa, epäonnistuu rajapinnan suoritus tähän
      pvmRange = [trip[0].alkupvm, trip[0].loppupvm].join(',');
    }
    catch (err) {
      res.statusCode = 400;
      res.json({status : "NOT OK", msg : "Virheellinen matkan id"});
      return;
    }
    let required = {'idmatkakohde':'0', 'pvm':pvmRange, 'teksti':'1,500'};
    let checkStatus = utils.checkBody(req.body, required);
    if (checkStatus){
      res.statusCode = 400;
      res.json({status : "NOT OK", msg : checkStatus});
      console.log(checkStatus);
      return;
    }
  
    let pvm = req.body.pvm;
    let teksti = req.body.teksti;
    let idmatkakohde = req.body.idmatkakohde;
    let queryParams = [idmatkakohde, idmatka, pvm, teksti];
    let imageParams = [];

    if (req.file){ //kuvan lisääminen vaihtoehtoista, SAATTAA OLLA PAKOLLISTA <- TARKISTA SQL KYSELY LAUSE, KOSKA AINOASTAAN TARINAT JOISSA ON KUVA HAETAAN
      let dest = req.file.destination.split('static/')[1];
      let filename = `${dest}/${req.file.filename}`;
      imageParams = [filename, idmatkakohde, idmatka];
    }

    try{
      let c = [];
      c = await sql.addStory(queryParams);

      if(req.file){
        await sql.addStoryImage(imageParams);
      }
      res.statusCode = 200;
      res.json({ status: "OK", data : c });
    }
    catch (err) {
      console.log("Error in server")
      res.statusCode = 400;
      res.json({status : "NOT OK", msg : err});
    }
  },

  addTrip: async (req, res) => {
    console.log("addTrip()");
    let idmatkaaja = utils.checkUserID(req, res);

    let alkupvm = req.body.alkupvm;
    let loppupvm = req.body.loppupvm;
    let pvmRange;
    if (!(alkupvm && loppupvm)){
      res.statusCode = 400;
      res.json({status : "NOT OK", msg : "Päivämääriä ei annettu"});
      return;
    } else if(toDate(loppupvm) < toDate(alkupvm)) {
      res.statusCode = 400;
      res.json({status : "NOT OK", msg : "Loppu päivämäärä ei voi olla ennen alku päivämäärää"});
      return;
    } else {
      pvmRange = [alkupvm, loppupvm].join(',');
    }

    try{
      let compare = getDatePair(alkupvm, loppupvm);
      let trips = await sql.getOwnTrips([idmatkaaja]);
      trips.forEach(t => {
        let tmp = getDatePair(t.alkupvm, t.loppupvm);
        if(!(compare[0] > tmp[1] || compare[1] < tmp[0]))
          throw err;
      });
    }
    catch (err) {
      res.statusCode = 400;
      res.json({status : "NOT OK", msg : 'Annetuilla päivämäärillä on päällekkäisyys toisen matkasi kanssa'});
      return;
    }

    let required = {'alkupvm':pvmRange, 'loppupvm':pvmRange, 'yksityinen':'boolean'};
    let checkStatus = utils.checkBody(req.body, required);
    if (checkStatus){
      res.statusCode = 400;
      res.json({status : "NOT OK", msg : checkStatus});
      console.log(checkStatus);
      return;
    }
  
    let yksityinen = req.body.yksityinen;
    let queryParams = [idmatkaaja, alkupvm, loppupvm, yksityinen];
    try{

      
      let c = [];
      c = await sql.addTrip(queryParams);
      res.statusCode = 200;
      res.json({ status: "OK", data : c });
    }
    catch (err) {
      console.log("Error in server")
      res.statusCode = 400;
      res.json({status : "NOT OK", msg : err});
    }
  },

  editStory: async (req, res) => {
    console.log("editStory()");
    let idmatkaaja = utils.checkUserID(req, res);

    let idmatka = req.query.idmatka;
    let idmatkakohde = req.query.idmatkakohde;
    if (!idmatka || !idmatkakohde){
      res.statusCode = 400;
      res.json({status : "NOT OK", msg : "Parametri puuttuu"});
      return;
    }

    let pvmRange; //luo annetun matkan id:n perusteella tarkasteltava päivämäärä range
    try{
      let trip = await sql.getTrip([idmatka, idmatkaaja]); //mikäli kirjautunut käyttäjä yrittää muokata toisten matkaan tarinaa, epäonnistuu rajapinnan suoritus tähän
      pvmRange = [trip[0].alkupvm, trip[0].loppupvm].join(',');
    }
    catch (err) {
      res.statusCode = 400;
      res.json({status : "NOT OK", msg : "Virheellinen matkan id"});
      return;
    }

    let required = {'pvm':pvmRange, 'teksti':'1,500'};
    let checkStatus = utils.checkBody(req.body, required);
    if (checkStatus){
      res.statusCode = 400;
      res.json({status : "NOT OK", msg : checkStatus});
      console.log(checkStatus);
      return;
    }
  
    let pvm = req.body.pvm;
    let teksti = req.body.teksti;
    let queryParams = [pvm, teksti, idmatka, idmatkakohde];
    let imageParams;

    if (req.file){ //kuvan lisääminen vaihtoehtoista, SAATTAA OLLA PAKOLLISTA <- TARKISTA SQL KYSELY LAUSE, KOSKA AINOASTAAN TARINAT JOISSA ON KUVA HAETAAN
      let dest = req.file.destination.split('static/')[1];
      let filename = `${dest}/${req.file.filename}`;
      imageParams = [filename, idmatkakohde, idmatka];
    }

    try{
      let c = [];
      c = await sql.editStory(queryParams);
      if(req.file){
        await sql.editStoryImage(imageParams);
      }
      res.statusCode = 200;
      res.json({ status: "OK", data : c });
    }
    catch (err) {
      console.log("Error in server")
      res.statusCode = 400;
      res.json({status : "NOT OK", msg : err});
    }
  }, 

  editTrip: async (req, res) => {
    console.log("editTrip()");
    let idmatkaaja = utils.checkUserID(req, res);

    let idmatka = req.params.id;
    if (!idmatka){
      res.statusCode = 400;
      res.json({status : "NOT OK", msg : "Parametri puuttuu"});
      return;
    }

    let alkupvm = req.body.alkupvm;
    let loppupvm = req.body.loppupvm;
    let pvmRange;
    if (!(alkupvm && loppupvm)){
      res.statusCode = 400;
      res.json({status : "NOT OK", msg : "Päivämääriä ei annettu"});
      return;
    } else if(toDate(loppupvm) < toDate(alkupvm)) {
      res.statusCode = 400;
      res.json({status : "NOT OK", msg : "Loppu päivämäärä ei voi olla ennen alku päivämäärää"});
      return;
    } else {
      pvmRange = [alkupvm, loppupvm].join(',');
    }

    let compare = getDatePair(alkupvm, loppupvm);
    try{ //tarkista onko päällekkäisyyksiä omien matkojen kanssa
      let ownTrips = await sql.getOwnTrips([idmatkaaja]);
      ownTrips.forEach(t => {
        if(t.idmatka === parseInt(idmatka)){ //skippaa muokattavan matkan päivämäärien tarkistus
          return;
        }
        let tmp = getDatePair(t.alkupvm, t.loppupvm);
        if(!(compare[0] > tmp[1] || compare[1] < tmp[0]))
          throw err;
      });
    }
    catch (err) {
      res.statusCode = 400;
      res.json({status : "NOT OK", msg : 'Annetuilla päivämäärillä on päällekkäisyys toisen matkasi kanssa'});
      return;
    }

    try{ //tarkista onko tarinoiden päivämäärät uudella päivämäärä rangella
      let stories = await sql.getTripsStories([idmatka]);
      stories.forEach(s => {
        if(!(compare[0] <= toDate(s.pvm) && compare[1] >= toDate(s.pvm)))
          throw err;
      });
    }
    catch (err) {
      res.statusCode = 400;
      res.json({status : "NOT OK", msg : 'Annetut päivämäärät eivät täsmää kaikkien matkan tarinoiden kanssa'});
      return;
    }

    let required = {'alkupvm':pvmRange, 'loppupvm':pvmRange, 'yksityinen':'boolean'};
    let checkStatus = utils.checkBody(req.body, required);
    if (checkStatus){
      res.statusCode = 400;
      res.json({status : "NOT OK", msg : checkStatus});
      console.log(checkStatus);
      return;
    }
  
    let yksityinen = req.body.yksityinen;
    let queryParams = [alkupvm, loppupvm, yksityinen, idmatka, idmatkaaja];
    try{
      let c = [];
      c = await sql.editTrip(queryParams);
      res.statusCode = 200;
      res.json({ status: "OK", data : c });
    }
    catch (err) {
      console.log("Error in server")
      res.statusCode = 400;
      res.json({status : "NOT OK", msg : err});
    }
  },

  deleteStory: async (req, res) => {
    console.log("deleteStory()");
    let idmatkaaja = utils.checkUserID(req, res);
    let idmatka = req.query.idmatka;

    try{
      let trip = await sql.getTrip([idmatka, idmatkaaja]); //mikäli kirjautunut käyttäjä yrittää poistaa toisten tarinaa, epäonnistuu rajapinnan suoritus tähän
      if (trip.length <= 0)
        throw err;
    }
    catch (err) {
      res.statusCode = 400;
      res.json({status : "NOT OK", msg : "Virheellinen matkan id"});
      return;
    }
    let idmatkakohde = req.query.idmatkakohde;
    let queryParams = [idmatka, idmatkakohde];
    if (!queryParams.includes(undefined)) {
      try {
        let c = await sql.deleteStory(queryParams);
        console.log(c);
        res.statusCode = 200;
        res.json({ status: "OK", msg: "Poistaminen onnistui!" });
      }
      catch (err) {
        console.log("Error in server");
        res.statusCode = 400;
        res.json({ status: "NOT OK", msg: err });
      }
    } else {
      res.statusCode = 400;
      res.json({ status: "NOT OK", msg: "Tarkista syötetyt id:t"});
    }
  },

  deleteTrip: async (req, res) => {
    console.log("deleteTrip()");
    let idmatkaaja = utils.checkUserID(req, res);

    let idmatka = req.params.id;
    if (idmatka) {
      try {
        let c = await sql.deleteTrip([idmatka, idmatkaaja]);
        console.log(c);
        res.statusCode = 200;
        res.json({ status: "OK", msg: "Poistaminen onnistui!" });
      }
      catch (err) {
        console.log("Error in server");
        res.statusCode = 400;
        res.json({ status: "NOT OK", msg: err });
      }
    } else {
      res.statusCode = 400;
      res.json({ status: "NOT OK", msg: "Tarkista syötetty id"});
    }
  },
}