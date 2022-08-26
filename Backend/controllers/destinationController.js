const sql = require('../db/destinationSQL');
const utils = require('../BEutils');

module.exports = {
  fetchDestinations: async (req, res) => {
    // Matkakohteiden hakeminen
    try {
      let c = [];
      c = await sql.fetchDestinations();
      res.statusCode = 200;
      res.json({ status: "OK", data: c });
    }
    catch (err) {
      console.log("Error in server")
      res.statusCode = 400;
      res.json({ status: "NOT OK", msg: err });
    }
  },
  insertDestination: async (req, res) => {
    console.log("MATKAKOHTEEN LISÄYS")
    var required = { kohdenimi: '1,45', maa: '1,45', paikkakunta: '1,45', kuvausteksti: '1,500' }
    var status = utils.checkBody(req.body, required);
    if (status) {
      res.statusCode = 400;
      res.json({ status: "NOT OK", msg: status });
      return;
    }

    var kohdenimi = req.body.kohdenimi;
    var maa = req.body.maa;
    var paikkakunta = req.body.paikkakunta;
    var kuvausteksti = req.body.kuvausteksti;
    var filename;

    if (req.file) {
      let dest = req.file.destination.split('static/')[1];
      filename = `${dest}/${req.file.filename}`;
    }
    else {
      filename = "place/placeholder.jpg"
    }
    var queryParams = [kohdenimi, maa, paikkakunta, kuvausteksti, filename];
    console.log(queryParams);
    console.log('req', req.file);

    try {
      let c = [];
      c = await sql.insertDestination(queryParams);
      res.statusCode = 200;
      res.json({ status: "OK", data: c, msg: "Lisääminen onnistui" });
    }
    catch (err) {
      console.log("Error in server")
      res.statusCode = 400;
      res.json({ status: "NOT OK", msg: err });
    }
  },
  deleteDestination: async (req, res) => {
    console.log("MATKAKOHTEEN POISTAMINEN");
    let id = req.params.id || '';

    let stories = await sql.fetchDestinationsStories([id]);
    if(stories.length > 0){ //matkakohdetta ei voida muokata, jos siitä on kirjoitettu tarinoita
      res.statusCode = 400;
      res.json({ status: "NOT OK", msg: 'Poistaminen epäonnistui! Matkakohteesta on tehty tarinoita' });
      return;
    }
    if (id != '') { // Body tarkastus
      try {
        let c = await sql.deleteDestination(id);
        console.log(c);
        res.statusCode = 200;
        res.json({ status: "OK", msg: "Poistaminen onnistui!" });
      }
      catch (err) {
        console.log("Error in server: " + err);
        res.statusCode = 400;
        res.json({ status: "NOT OK", msg: "Poistaminen epäonnistui!" });
      }
    }
  },
  editDestination: async (req, res) => {
    console.log("MATKAKOHTEEN PÄIVITYS")
    try {
      var id = req.params.id || '';
      let stories = await sql.fetchDestinationsStories([id]);
      if(stories.length > 0){ //matkakohdetta ei voida muokata, jos siitä on kirjoitettu tarinoita
        res.statusCode = 400;
        res.json({ status: "NOT OK", msg: 'Muokkaaminen epäonnistui! Matkakohteesta on tehty tarinoita' });
        return;
      }

      console.log(stories.length);
      console.log("Tarkastetaan body-lohkot");
      //Body
      var required = { kohdenimi: '1,45', maa: '1,45', paikkakunta: '1,45', kuvausteksti: '1,500' }
      var status = utils.checkBody(req.body, required);
      if (status) {
        console.log(status);
        res.statusCode = 400;
        res.json({ status: "NOT OK", msg: status });
        return;
      }
      

      var kohdenimi = req.body.kohdenimi;
      var maa = req.body.maa;
      var paikkakunta = req.body.paikkakunta;
      var kuvausteksti = req.body.kuvausteksti;
      var filename;

      if (req.file) {
        let dest = req.file.destination.split('static/')[1];
        filename = `${dest}/${req.file.filename}`;
      }
      else {

        let dest = await sql.fetchDestination([id]);
        filename = dest[0].kuva;
        console.log(filename);
      }


      let data = [kohdenimi, maa, paikkakunta, kuvausteksti, filename, id];


      let c = await sql.editDestination(data);
      console.log(c);
      res.statusCode = 200;
      res.json({ status: "OK", msg: "Muokkaaminen onnistui!" });
    }
    catch (err) {
      console.log(err)
      res.statusCode = 400;
      res.json({ status: "NOT OK", msg: "Muokkaaminen epäonnistui! Tekninen ongelma, yritä myöhemmin uudestaan." });
    }
  },
  fetchAvailableDestinations: async (req, res) => {
    let idmatka = req.params.id;

    let IDCheck = true;
    if (!idmatka.match(/^-?\d+$/)) {
      IDCheck = false;
      res.statusCode = 400;
      res.json({ status: "NOT OK", msg: "Virheellinen ID" });
      return;
    }
    else {
      try {
        let c = [];
        c = await sql.fetchAvailableDestinations([idmatka]);
        res.statusCode = 200;
        res.json({ status: "OK", data: c });
      }
      catch (err) {
        console.log("Error in server")
        res.statusCode = 400;
        res.json({ status: "NOT OK", msg: err });
      }
    }
  }
}

