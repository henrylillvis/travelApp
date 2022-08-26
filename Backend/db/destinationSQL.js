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

module.exports = {
    fetchDestinations: () => {
        let sql = 'SELECT * FROM matkakohde';
        return executeSQL(sql, null);
    },
    insertDestination: (data) => {
        let sql = "INSERT INTO matkakohde (KOHDENIMI, MAA, PAIKKAKUNTA, KUVAUSTEKSTI, KUVA) VALUES (?, ?, ?, ?, ?)";
        return executeSQL(sql, data);
    },
    deleteDestination: (data) => {
        let sql = "DELETE FROM matkakohde where idmatkakohde = ? ";
        return executeSQL(sql, data)
    },
    editDestination: (data) => {
        let sql = "UPDATE matkakohde SET kohdenimi=?, maa=?, paikkakunta=?, kuvausteksti=?, kuva=? WHERE idmatkakohde=?"
        return executeSQL(sql, data)
    },
    fetchAvailableDestinations: (data) => {
        let sql = `SELECT * FROM matkakohde WHERE idmatkakohde NOT IN (SELECT idmatkakohde FROM tarina WHERE idmatka = ?)`;
        return executeSQL(sql, data);
    },
    fetchDestinationsStories: (data) => {
        let sql = `SELECT * FROM tarina WHERE idmatkakohde = ?`;
        return executeSQL(sql, data);
    },
    fetchDestination: (data) => {
        let sql = 'SELECT * FROM matkakohde WHERE idmatkakohde = ?';
        return executeSQL(sql, data);
    }

}