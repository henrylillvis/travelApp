
var mysql = require('mysql');

let con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: 'root',
    database: 'matkasovellus', //sama mikä db.sql tiedostossa
    dateStrings: true
});

const executeSQL = (query, params) => {
    return new Promise((resolve, reject) => {
        console.log("query:" + query);
        con.query(query, params, function (error, results, fields) {
            error ? reject(error) : resolve(results);
        });
    })
}

module.exports = {//lähtökohtaisesti kaikki SQL lauseet vaativat idmatkaajan oikeellisuuden
    
    getPublicStories: () => { //ei vaadi idmatkaajan tarkistusta
      let sql = 'SELECT t.idmatkakohde, t.pvm, t.teksti, t.idmatka, mk.kohdenimi, mk.maa, mk.paikkakunta, m.idmatka, m.alkupvm, m.loppupvm, m.yksityinen, mj.etunimi, mj.sukunimi, mj.nimimerkki, k.kuva FROM tarina t INNER JOIN matkakohde mk ON t.idmatkakohde = mk.idmatkakohde INNER JOIN matka m ON m.idmatka = t.idmatka INNER JOIN matkaaja mj ON mj.idmatkaaja = m.idmatkaaja INNER JOIN kuva k ON k.tarina_idmatkakohde = t.idmatkakohde AND k.tarina_idmatka = t.idmatka WHERE m.idmatka AND m.yksityinen = 0';
      return executeSQL(sql, null);
    },
    getOwnStories: (data) => { 
      let sql = 'SELECT t.idmatkakohde, t.pvm, t.teksti, t.idmatka, mk.kohdenimi, mk.maa, mk.paikkakunta, m.idmatka, m.alkupvm, m.loppupvm, m.yksityinen, mj.etunimi, mj.sukunimi, mj.nimimerkki, k.kuva FROM tarina t INNER JOIN matkakohde mk ON t.idmatkakohde = mk.idmatkakohde INNER JOIN matka m ON m.idmatka = t.idmatka INNER JOIN matkaaja mj ON mj.idmatkaaja = m.idmatkaaja INNER JOIN kuva k ON k.tarina_idmatkakohde = t.idmatkakohde AND k.tarina_idmatka = t.idmatka WHERE m.idmatka AND mj.idmatkaaja = ?';
      return executeSQL(sql, data);
    },
    getStory: (data) => { //haetaan tarina vain jos hakija on tarinan tekijä tai tarinan matka on julkinen
      let sql = 'SELECT t.idmatkakohde, t.pvm, t.teksti, t.idmatka, mk.kohdenimi, mk.maa, mk.paikkakunta, m.idmatka, m.alkupvm, m.loppupvm, m.yksityinen, mj.etunimi, mj.sukunimi, mj.nimimerkki, k.kuva FROM tarina t INNER JOIN matkakohde mk ON t.idmatkakohde = mk.idmatkakohde INNER JOIN matka m ON m.idmatka = t.idmatka INNER JOIN matkaaja mj ON mj.idmatkaaja = m.idmatkaaja INNER JOIN kuva k ON k.tarina_idmatkakohde = t.idmatkakohde AND k.tarina_idmatka = t.idmatka WHERE m.idmatka = ? AND mk.idmatkakohde = ? AND (mj.idmatkaaja = ? OR m.yksityinen = 0)';
      return executeSQL(sql, data);
    },
    getOwnTrips: (data) => {
      let sql = 'SELECT * FROM matka m INNER JOIN matkaaja mj ON m.idmatkaaja = mj.idmatkaaja WHERE mj.idmatkaaja = ?';
      return executeSQL(sql, data);
    },
    getTrip: (data) => {
      let sql = 'SELECT * FROM matka WHERE idmatka = ? AND idmatkaaja = ?';
      return executeSQL(sql, data);
    },
    getTripsStories: (data) => {
      let sql = 'SELECT * FROM tarina WHERE idmatka = ?';
      return executeSQL(sql, data);
    },
    addStory: (data) => { //ei vaadi idmatkaajan tarkistusta, tarkistus getTrip ajon aikana
      let sql = "INSERT INTO tarina (idmatkakohde, idmatka, pvm, teksti) VALUES (?, ?, ?, ?)";
      return executeSQL(sql, data);
    },
    addStoryImage: (data) => { //ei vaadi idmatkaajan tarkistusta, tarkistus getTrip ajon aikana
      let sql = "INSERT INTO kuva (kuva, tarina_idmatkakohde, tarina_idmatka) VALUES (?, ?, ?)";
      return executeSQL(sql, data);
    },
    addTrip: (data) => {
      let sql = "INSERT INTO matka (idmatkaaja, alkupvm, loppupvm, yksityinen) VALUES (?, ?, ?, ?)";
      return executeSQL(sql, data);
    },
    deleteStory: (data) => { //ei vaadi idmatkaajan tarkistusta, tarkistus getTrip ajon aikana
      let sql = "DELETE from tarina WHERE idmatka = ? AND idmatkakohde = ?";
      return executeSQL(sql, data);
    },
    deleteTrip: (data) => {
      let sql = "DELETE from matka WHERE idmatka = ? AND idmatkaaja = ?";
      return executeSQL(sql, data);
    },
    editStory: (data) => { //ei vaadi idmatkaajan tarkistusta, tarkistus getTrip ajon aikana
      let sql = "UPDATE tarina set pvm = ?, teksti = ? WHERE idmatka = ? AND idmatkakohde = ?";
      return executeSQL(sql, data);
    },
    editStoryImage: (data) => { //ei vaadi idmatkaajan tarkistusta, tarkistus getTrip ajon aikana
      let sql = "UPDATE kuva set kuva = ? WHERE tarina_idmatkakohde = ? AND tarina_idmatka = ?";
      return executeSQL(sql, data);
    },
    editTrip: (data) => {
      let sql = "UPDATE matka set alkupvm = ?, loppupvm = ?, yksityinen = ? WHERE idmatka = ? AND idmatkaaja = ?";
      return executeSQL(sql, data);
    }
}