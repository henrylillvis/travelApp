
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
        console.log("params: " + params);
        console.log("query:" + query);
        con.query(query, params, function (error, results, fields) {
            error ? reject(error) : resolve(results);
        });
    })
}

const buildAndGet = (etunimi, sukunimi) => {
    let query = [];
    let data = [];    
    if(etunimi != '') {        
        data.push(etunimi + "%");
        query.push(`etunimi LIKE ?`);        
    }       
    if(sukunimi != '') {
        data.push(sukunimi + "%");
        query.push(`sukunimi LIKE ?`);
    }
    let sql = `SELECT idmatkaaja, etunimi, sukunimi, nimimerkki, paikkakunta, esittely, kuva from matkaaja WHERE ` + query.join(" AND ");
    return executeSQL(sql, data);
}

module.exports = {
    
    insertUser: (data) => {
        let sql = "INSERT INTO matkaaja (ETUNIMI, SUKUNIMI, NIMIMERKKI, PAIKKAKUNTA, ESITTELY, KUVA, EMAIL, PASSWORD) VALUES (?, ?, ?, ?, ?, ? , ? , ?) ";
        return executeSQL(sql, data);
    },
    updateUser: (data) => {
        let sql = "UPDATE matkaaja SET ETUNIMI=?, SUKUNIMI=?, NIMIMERKKI=?, PAIKKAKUNTA=?, ESITTELY=?, KUVA=? where IDMATKAAJA = ?";
        return executeSQL(sql, data);
    },
    getUsers: () => { //Älä valitse kaikkia, koska ei saa mennä sähköposti ja salasana
        let sql = "SELECT idmatkaaja, etunimi, sukunimi, nimimerkki, paikkakunta, esittely, kuva from matkaaja WHERE 1=1";
        return executeSQL(sql, null);
    },
    getUsersByName: (etunimi, sukunimi) => {
        return buildAndGet(etunimi, sukunimi);
    },
    getIdByUsername: (nimimerkki) => {
        let sql = `SELECT idmatkaaja from matkaaja WHERE nimimerkki=?`;
        return executeSQL(sql, [nimimerkki]);
    },
    getUserByID: (id) => {
        let sql = `SELECT idmatkaaja, etunimi, sukunimi, nimimerkki, paikkakunta, esittely from matkaaja where IDMATKAAJA=?`;
        return executeSQL(sql, [id]);
    },
    getUsername: (nimimerkki) => {
        let sql = `SELECT nimimerkki FROM matkaaja WHERE nimimerkki=?`;
        return executeSQL(sql, [nimimerkki]); 
    },
    getEmail: (email) => {
        let sql = `SELECT email FROM matkaaja WHERE email=?`;
        return executeSQL(sql, [email]);
    },
    getEmailAndPassword: (email) => {
        let sql = 'SELECT email, password from matkaaja WHERE email=?';
        return executeSQL(sql, [email]);
    },
    getUserByEmail: (email) => {
        let sql = 'SELECT idmatkaaja, nimimerkki, email from matkaaja WHERE email=?';
        return executeSQL(sql, [email]);
    },
    deleteByID: (id) => {
        let sql = "DELETE FROM matkaaja WHERE idmatkaaja = ?";
        return executeSQL(sql, [id]);
    },
    getUsernameAndID: (nimimerkki) => {
        let sql = `SELECT nimimerkki, idmatkaaja FROM matkaaja WHERE nimimerkki=?`;
        return executeSQL(sql, [nimimerkki]); 
    },
    getUserPicture: (id) => {
        let sql = `SELECT kuva FROM matkaaja WHERE idmatkaaja=?`;
        return executeSQL(sql, [id]); 
    }
               
}