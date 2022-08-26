require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* FETCHIIN laitetaan Authorization: Bearer TOKEN lohko headersien sisään clientin päässä

esim.

fetch(url, {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Authorization': bearer + TOKEN , <------ Tokeni otetaan reduxista
            'Content-Type': 'application/json'
        }
    })

*/


// Tarkistaa tokenin ja päästää läpi, jos token löytyy.
module.exports = {
    
    //Olisi turvallisempaa laittaa expire date tokenille, ja käyttää refresh tokenia luomaan uusi token, mutta tässä projektissa ei välttämätön. Katsotaan, jos jää aikaa.
    authenticateToken: (req, res, next) => {
        const authHeader = req.headers['authorization'];
        console.log(authHeader);
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) return res.sendStatus(401);
        console.log(token);
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                console.log(err);
                return res.sendStatus(403);  
            }//Jos ei löydy tokenia.
            req.user = user;
            next(); //Siirrytään callback funktioon.
        });
    }
}
