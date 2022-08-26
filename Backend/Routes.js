//TÄNNE KAIKKI REITIT JOTKA KUTSUVAT FUNKTIOITA, MITKÄ SIJAITSEVAT OMISSA TIEDOSTOISSAAN NÄIN SAADAAN SELKEÄMPI JÄSENNYS JA JOKAINEN VOI TYÖSTÄÄ OMAA TIEDOSTOAAN.
var express = require('express');
var routes = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
const cors = require("cors");

var upload = require('./imageUpload');

routes.use(bodyParser.json());
/* 
var cors = function (req, res, next)
{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type','Authorization');
    next();  
}
//routes.use(cors);
*/
const whitelist = ["http://localhost:3000"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
routes.use(cors(corsOptions))
routes.use(express.static('static'));

let con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: 'root',
    database: 'matkasovellus', //sama mikä db.sql tiedostossa
    dateStrings: true
});

var userApi = require('./controllers/userController');
var tripApi = require('./controllers/tripController');
var destApi = require('./controllers/destinationController.js');
var auth = require('./middleware/auth');  
// REITIT TÄNNE ---------

//Julkiset reitit
//Haetaan käyttäjät tietokannasta

routes.get('/myinfo', (req, res) => userApi.fetchUserInfo(req, res));

routes.get('/destinations', (req, res) => destApi.fetchDestinations(req, res));



routes.post('/login', (req, res) => userApi.authenticateLogIn(req, res));
routes.post('/registration', (req, res) => userApi.addUser(req, res));






//Autentikoitavat reitit.
//Tästä alaspäin reitit tarvitsevat autentikoinnin--------------Siirtäkää autentikoitavat reitit tänne, kun olette saaneet tokenit säädettyä clientin päässä
routes.use(auth.authenticateToken);
//Lisätään käyttäjä tietokantaan
routes.delete('/myinfo/:id', (req, res) => userApi.deleteUser(req, res));
//Omien tietojen muokkaus
routes.put('/myinfo/:id', upload.user.single('kuva'), (req, res) => userApi.editUser(req, res));

routes.get('/users', (req, res) => userApi.fetchUsers(req, res));
routes.get('/publicstories', (req, res) => tripApi.getPublicStories(req, res));
routes.get('/ownstories', (req, res) => tripApi.getOwnStories(req, res));
routes.get('/story', (req, res) => tripApi.getStory(req, res));
routes.get('/trips', (req, res) => tripApi.getOwnTrips(req, res));
routes.get('/availabledestinations/:id', (req, res) => destApi.fetchAvailableDestinations(req, res));

routes.post('/story', upload.story.single('kuva'), (req, res) => tripApi.addStory(req, res));
routes.put('/story', upload.story.single('kuva'), (req, res) => tripApi.editStory(req, res)); //idmatka & idmatkakohde

routes.post('/destinations', upload.place.single('kuva'), (req, res) => destApi.insertDestination(req, res));
routes.put('/destinations/:id', upload.place.single('kuva'), (req, res) => destApi.editDestination(req, res));

routes.post('/trip', (req, res) => tripApi.addTrip(req, res));
routes.put('/trip/:id', (req, res) => tripApi.editTrip(req, res));

routes.delete('/story', (req, res) => tripApi.deleteStory(req, res)); //idmatka & idmatkakohde
routes.delete('/trip/:id', (req, res) => tripApi.deleteTrip(req, res));
routes.delete('/destinations/:id', (req, res) => destApi.deleteDestination(req, res));
//---------------------------


module.exports = routes;