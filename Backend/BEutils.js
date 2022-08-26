
//Käsittelee kaikki väärät get reitit
function handleWrongGetRoute(req, res){
    res.statusCode = 404;
    res.json({message:"Osoite oli virheellinen:" + req.path});
}

//tarkista requestin user tiedon id ja palauta se, palauta virhe jos sitä ei löydy
const checkUserID = (req, res) => {
  let idmatkaaja = req.user.id; //hae tokenista idmatkaaja
  if (!idmatkaaja){
      res.statusCode = 400;
      res.json({ status: "NOT OK", msg: 'Matkaajan id:tä ei löytynyt, kirjaudu uudelleen & tarkista token.'});
      return;
  } else
    return idmatkaaja;
}

//tarkista annettu body rakenne vertailukohteeseen ja palauta vastaava virhe message
//required oltava javascript olio, jossa avain-arvot: avain:'min,max'
//min ja max arvot ovat numeroita, jotka määrittävät alueen kokonaisluvun numeraalisen arvolle, merkkijonon pituudelle tai päivämäärälle
const checkBody = (body, required) => {
    let missing = Object.keys(required).filter((x) =>!Object.keys(body).includes(x));
    if(missing.length > 0){
      return "Pakollisia tietoja puuttuu: " + missing.join(',');
    }
    const toDate = (dateStr) => { //päivämäärä yyyy-mm-dd
      const [year, month, day] = dateStr.split("-").map(x => parseInt(x));
      return new Date(year, month-1, day);
    }
  
   //palauta virheelliset kentät listaan
    let reqFails = Object.keys(required).filter(v => {
      if(required[v] === 'boolean')
        return;
      if(!required[v].includes('-')){ //viiva ainoastaan päivämäärissä
        let [min,max] = required[v].split(',').map(x => parseInt(x));
        if(typeof body[v] === 'string'){ //vertaillaanko merkkijonoa
          if(body[v].length < min || body[v].length > max)
            return true;
          } else if(body[v] < min || body[v] > max) //vertaillaan kokonaislukua
            return true;
      } else {
          let [min,max] = required[v].split(',').map(x => toDate(x));
          if (toDate(body[v]) < min || toDate(body[v]) > max)
            return true;
      }
    });
  
    if(reqFails.length > 0){
      let failsRanges = reqFails.map(r => r + '(' + required[r] + ')');
      return "Seuraavat tiedot ovat virheellisiä (suluissa hyväksytyt arvot): " + failsRanges.join(',');
    }
      return;
  }


module.exports = { checkBody, checkUserID, handleWrongGetRoute };