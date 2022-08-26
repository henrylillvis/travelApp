var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
const multer = require('multer');
const uuid = require('uuid');

router.use(bodyParser.json());

var cors = function (req, res, next)
{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();  
}

router.use(cors);


//Tällä kustomoidaan kuinka tiedostot tallennetaan
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        cb(null, `${uuid()}-${originalname}`);
    }
});

const upload = multer({ dest: '../uploads'}); 



let userCTRL = require('../controllers/userController');

//Users----
router.route('/users').get(userCTRL.fetchUsers);

router.route('/registration').post(userCTRL.addUser);

router.route('/myinfo/:id').put(userCTRL.editUser);
//--------
router.get('/users', (req, res) => userCTRL.fetchUsers(req, res));

routes.get('/matkakertomukset',upload.single("avatar"), (req, res) => tripApi.getStories(req, res, con));
routes.get('/matkakertomus', (req, res) => tripApi.getStory(req, res, con));
routes.get('/matkat', (req, res) => tripApi.getTrips(req, res, con));



//Files 


// Julkaistaan ao. funktiot tämän js-filun ulkopuolelle
module.exports = router;