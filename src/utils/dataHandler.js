// metodeja datan käsittelyyn, yhdistämiseen ja mappaamiseen

//serialisoi javascript objekti formdataksi
export const toFormData = (obj) => {
    let formData = new FormData();
    Object.keys(obj).forEach(key => formData.append(key, obj[key]));
    return formData;
}

// map metodit pohjautuvat alla oleviin datankäsittely/yhdistämis metodien palauttamaan formaattin
// voivat myös pohjautua myöhemmin toteutettavan rajapinnan palauttamaan formaattiin
export const briefStoryMap = (source) => {
  let briefStory = {};
  briefStory.ids = {};
  briefStory.data = {};
  briefStory.ids.matkakohde = source.idmatkakohde;
  briefStory.ids.matka = source.idmatka;
  briefStory.data.kohdenimi = source.kohdenimi;
  briefStory.data.maa = source.maa;
  briefStory.data.pvm = source.pvm;
  briefStory.data.kuva = 'http://localhost:3004/' + source.kuva;
  briefStory.data.nimimerkki = source.nimimerkki;
  briefStory.data.yksityinen = source.yksityinen;
  return briefStory;
}

export const briefPlaceMap = (source) => {
  let briefPlace = {};
  briefPlace.ids = {};
  briefPlace.data = {};
  briefPlace.ids.matkakohde = source.idmatkakohde;
  briefPlace.data.kohdenimi = source.kohdenimi;
  briefPlace.data.maa = source.maa;
  briefPlace.data.paikkakunta = source.paikkakunta;
  briefPlace.data.kuva = 'http://localhost:3004/' + source.kuva;
  return briefPlace;
}

export const briefTripMap = (source) => {
  let briefTrip = {};
  briefTrip.ids = {};
  briefTrip.data = {};
  briefTrip.ids.matka = source.idmatka;
  briefTrip.ids.matkaaja = source.idmatkaaja;
  briefTrip.data.yksityinen = source.yksityinen;
  briefTrip.data.alkupvm = source.alkupvm;
  briefTrip.data.loppupvm = source.loppupvm;
  briefTrip.data.nimimerkki = source.nimimerkki;
  briefTrip.data.etunimi = source.etunimi;
  briefTrip.data.sukunimi = source.sukunimi;

  return briefTrip;
}

export const briefPersonMap = (source) => {
  let briefPerson = {};
  briefPerson.ids = {};
  briefPerson.data = {};
  briefPerson.ids.matkaaja = source.idmatkaaja;
  briefPerson.data.etunimi = source.etunimi;
  briefPerson.data.sukunimi = source.sukunimi;
  briefPerson.data.nimimerkki = source.nimimerkki;

  return briefPerson;
}

//source kattaa matkat, niiden tarinat ja tarinoissa olevat matkakohteet
//source 2 kattaa matkaan kuuluvat henkilöt
export const wholeStoryMap = (source) => {
  let wholeStory = {};
  wholeStory.ids = {};
  wholeStory.data = {};
  wholeStory.ids.matkakohde = source.idmatkakohde;
  wholeStory.ids.matka = source.idmatka;
  wholeStory.ids.matkaaja = source.idmatkaaja;
  wholeStory.data.teksti = source.teksti;
  wholeStory.data.pvm = source.pvm;
  wholeStory.data.alkupvm = source.alkupvm; 
  wholeStory.data.loppupvm = source.loppupvm;
  wholeStory.data.maa = source.maa;
  wholeStory.data.paikkakunta = source.paikkakunta;
  wholeStory.data.kohdenimi = source.kohdenimi;
  wholeStory.data.kuva = 'http://localhost:3004/' + source.kuva;
  wholeStory.data.etunimi = source.etunimi;
  wholeStory.data.sukunimi = source.sukunimi;
  wholeStory.data.nimimerkki = source.nimimerkki;
  wholeStory.data.yksityinen = source.yksityinen;
  return wholeStory;
}

export const combineStoryData = (storyJson, placeJson, tripJson) => {
  let sp = storysPlace(storyJson, placeJson);
  sp = tripsStories(sp, tripJson);
  let combined = sp.map((s) => {
    return Object.assign(s, tripJson.filter((value) => {
        return value.idmatka === s.idmatka;
      }));
  });
  return combined;
}

export const tripsPersons = (tripJson, personJson) => {
  //apu objekti kasaamaan matkaajien id:t, matka id:n taakse
  let tp = {};
  tripJson.forEach((t) => {
    let id = t.idmatkaaja;
    if (!tp[t.idmatka]){
      tp[t.idmatka] = Object.assign(t, {'idmatkaaja':[]});
    }
    tp[t.idmatka].idmatkaaja.push(id);
  });
  let tpArray = []; //muuta apu objekti vielä listaksi, ennen käsittelyä
  Object.keys(tp).forEach(key => tpArray.push(
    tp[key]
  ));
  //jokaisen listan objektin idmatkaaja lista sisältämään vastaavasti matkaajan tiedot
  //esim. idmatkaaja: [1, 2] -> matkaajat: [{idmatkaaja:1, nimi...},{idmatkaaja:2, nimi...}]
  let combine = tpArray.map((t) => {
    return Object.assign(t, {'matkaajat': t.idmatkaaja.map((m) => {
      return personJson.filter((value) => {
        return value.idmatkaaja === m;
      })[0];
  })})});
  return combine;
}

const storysPlace = (storyJson, placeJson) => {
  let combined = storyJson.map((s) => {
    let tmp = Object.assign(s, placeJson.filter((value) => {
      return value.idmatkakohde === s.idmatkakohde;
    }));
    tmp.matkakohde = tmp['0'];
    delete tmp['0'];
    return tmp;
  });
  return combined;
}

const tripsStories = (storyJson, tripJson) => {
  let combined = storyJson.map((s) => {
    let tmp = Object.assign(s, tripJson.filter((value) => {
      return value.idmatka === s.idmatka;
    }));
    return tmp;
  });
  return combined;
}
