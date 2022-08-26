require('dotenv').config();
const auth = require('../middleware/auth');
const sql = require('../db/userSQL');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const utils = require('../BEutils');



module.exports = {

    fetchUsers: async (req, res) => {
        console.log("Haetaan käyttäjiä...");
        try {
            let etunimi = req.query.etunimi || "";
            let sukunimi = req.query.sukunimi || "";

            let c = [];
            if (!etunimi && !sukunimi)
                c = await sql.getUsers();
            else
                c = await sql.getUsersByName(etunimi, sukunimi);
            console.log("done")
            res.statusCode = 200;
            res.json({ status: "OK", users: c });
        }
        catch (err) {
            console.log("Error in server: " + err);
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: "Tekninen virhe! Yritä myöhemmin uudestaan." });
        }
    },

    fetchUserInfo: async (req, res) => {
        console.log("Haetaan käyttäjätiedot...");
        try {
            let id = req.query.id || '';

            let c = [];
            if (id) {
                c = await sql.getUserByID(id);
                console.log("done")
                if (c.length == 1) {
                    res.statusCode = 200;
                    res.json({ status: "OK", user: c });
                }
                else {
                    res.statusCode = 400;
                    res.json({ status: "NOT OK", msg: "Käyttäjää ei löydy!" });
                }
            }
            else {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "Tekninen virhe! Yritä myöhemmin uudestaan.", message: "Väärä query!" }); //Väärä url-query, ei tarvitse kertoa käyttäjälle
            }
        }
        catch (err) {
            console.log("Error in server: " + err)
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: "Tekninen virhe! Yritä myöhemmin uudestaan." });
        }
    },
    addUser: async (req, res) => {
        console.log("Lisätään käyttäjä tietokantaan ...");
        try {
            console.log("Tarkastetaan body-lohkot");
            //Body
            let required = { 'etunimi': '1,45', 'sukunimi': '1,45', 'nimimerkki': '1,45', 'email': '1,45', 'password': '1,200', 'esittely': '0,500', 'paikkakunta': '0,45' };
            let checkStatus = utils.checkBody(req.body, required);
            if (checkStatus) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: checkStatus });
                console.log(checkStatus);
                return;
            }
            console.log("Tarkastetaan onko nimimerkki jo käytössä.");
            // Username
            let user = await sql.getUsername(req.body.nimimerkki);
            console.log(user);
            if (user.length > 0) {
                console.log("Ei lisätty, nimimerkki käytössä!")
                res.status(400).send({status:"NOT OK", message: "Nimimerkki on jo käytössä" });
                return;
            }
            console.log("Tarkastetaan onko sähköposti jo käytössä.");
            // Email
            let e = await sql.getEmail(req.body.email);
            if (e.length > 0) {
                console.log("Ei lisätty, email käytössä!")
                res.status(400).send({status:"NOT OK", message: "Sähköposti on jo käytössä!" });
                return;
            }
            let etunimi = req.body.etunimi;
            let sukunimi = req.body.sukunimi;
            let nimimerkki = req.body.nimimerkki;
            let paikkakunta = req.body.paikkakunta || '';
            let esittely = req.body.esittely || '';
            let kuva = 'user/placeholder.jpg';
            let email = req.body.email;
            let password = req.body.password;

            const salt = await bcrypt.genSalt();//Tehdään tunniste salasanan eteen, jos samoja salasanoja käyttäjillä, niin vaikeampi murtaa
            const hashedPassword = await bcrypt.hash(password, salt);//Hashataan salasana tietokantaan.
            let data = [etunimi, sukunimi, nimimerkki, paikkakunta, esittely, kuva, email, hashedPassword];
            console.log(data);
            
            await sql.insertUser(data);
            res.statusCode = 200;
            res.json({ status: "OK", msg: "Rekisteröityminen onnistui!" });
            return;

        }
        catch (err) {
            console.log("Error in server: " + err);
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: "Rekisteröityminen epäonnistui! Tekninen ongelma, yritä myöhemmin uudestaan" });
        }


    },

    editUser: async (req, res) => {
        console.log("Muokataan käyttäjätietoja...");
        try {
            let id = utils.checkUserID(req,res);
            console.log("Tarkastetaan body-lohkot");
            //Body
            let required = { 'etunimi': '1,45', 'sukunimi': '1,45', 'nimimerkki': '1,45', 'esittely': '0,500', 'paikkakunta': '0,45' };
            let checkStatus = utils.checkBody(req.body, required);
            if (checkStatus) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: checkStatus });
                console.log(checkStatus);
                return;
            }
            console.log("Tarkastetaan onko nimimerkki jo käytössä.");
            // Username
            let user = await sql.getUsernameAndID(req.body.nimimerkki);
            let parsedUser = JSON.parse(JSON.stringify(user));
            parsedUser = parsedUser[0];
            console.log(user);
            if(user)console.log("Tänne mentiin")
            if (user.length > 0 && id != parsedUser.idmatkaaja) {
                res.status(400).send({status:"NOT OK", msg: "Nimimerkki on jo käytössä" });
                return;
            }            
            
            let etunimi = req.body.etunimi;
            let sukunimi = req.body.sukunimi;
            let nimimerkki = req.body.nimimerkki;
            let paikkakunta = req.body.paikkakunta;
            let esittely = req.body.esittely;
            let kuva = '';

            if(req.file){  //Vai olisiko kuvan lisääminen täysin pakollista?
                let dest = req.file.destination.split('static/')[1];
                kuva = `${dest}/${req.file.filename}`;
            }
            else{
                console.log("Kuvaa ei lisätty")
                console.log("Haetaan kuvapolku.")
                let c = await sql.getUserPicture(id);
                let parsedKuva = JSON.parse(JSON.stringify(c));
                parsedKuva = parsedKuva[0]
                console.log(parsedKuva);
                kuva = parsedKuva.kuva;
            }
            let data = [etunimi, sukunimi, nimimerkki, paikkakunta, esittely, kuva, id];
            let c = await sql.updateUser(data);
            console.log(c);
            let u = await sql.getUserByID(id);
            res.statusCode = 200;
            res.json({ status: "OK", msg: "Muokkaaminen onnistui!", user: u });
        }
        catch (err) {
            console.log(err)
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: "Muokkaaminen epäonnistui! Tekninen ongelma, yritä myöhemmin uudestaan." });
        }

    },

    deleteUser: async (req, res) => {
        
        console.log("Poistetaan käyttäjä...");
        let id = req.params.id || '';
        if (id != '') { // Body tarkastus
            try {
                let c = await sql.deleteByID(id);
                console.log(c);
                res.statusCode = 200;
                res.json({ status: "OK", msg: "Poistaminen onnistui!" });
            }
            catch (err) {
                console.log("Error in server: " + err);
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "Poistaminen epäonnistui! Tekninen ongelma, yritä myöhemmin uudestaan." });
            }
        }
    },
    authenticateLogIn: async (req, res) => {
        try {
            console.log("Täällä ollaan!")
            let email = req.body.email;
            console.log(req.body);
            
            if (email) {
                let user = await sql.getEmailAndPassword(email);
                console.log(user);
                if (user.length != 0) {
                    let u = JSON.parse(JSON.stringify(user));
                    user = u[0];
                    console.log(user.password);
                    console.log("Aloitetaan salasanojen vertailu:");
                    if (await bcrypt.compare(req.body.password, user.password)) {
                        console.log("Salasana ok:");
                        let c = await sql.getUserByEmail(req.body.email);
                        console.log(c)
                        let parsedUser = JSON.parse(JSON.stringify(c));
                        parsedUser = parsedUser[0];
                        console.log(parsedUser);
                        let signUser = { email: parsedUser.email, id: parsedUser.idmatkaaja };
                        console.log(signUser);
                        const accessToken = jwt.sign(signUser, process.env.ACCESS_TOKEN_SECRET); //Laitetaan token mukaan
                        let loginDetails = { idmatkaaja: parsedUser.idmatkaaja, nimimerkki: parsedUser.nimimerkki, token: accessToken };
                        console.log(loginDetails);
                        res.statusCode = 200;
                        res.json({ status: "OK", msg: "Kirjautuminen onnistui!", user: loginDetails });
                    } else {
                        console.log("Väärä salasana!");
                        res.statusCode = 400;
                        res.json({ status: "NOT OK", msg: "Väärä salasana." }); //Salasanat ei samat
                    }
                } else {
                    console.log("Väärä sähköpostiosoite!")
                    res.statusCode = 400;
                    res.json({ status: "NOT OK", msg: "Väärä sähköpostiosoite." });
                    return;
                }
            } else {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "Sähköposti puuttuu." });
                return;
            }
        }
        catch (err) {
            console.log("Error in server: " + err);
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: "Kirjautuminen epäonnistui! Tekninen ongelma, yritä myöhemmin uudestaan" });
            return;
        }

    }

}

