const app = require('../Backend/Routes.js')

const supertest = require('supertest')

const request = supertest(app)

//Tämä rajapinta on testattu julkisena reittinä. Kirjautumisen tarvetta testi ei sisällä.

describe("Haetaan kaikki matkaajat", () => {

  test('Haetaan kaikki matkaajat', async () => {
    const response = await request.get("/users");
        
    // Status koodi pitää olla 200
    expect(response.status).toBe(200)

    const data = response.body;
    let matkaajat = data.users;
    expect(data.status).toBe("OK");
    
    // Täytyy palautua taulukko, jossa 10 alkiota.
    expect(matkaajat.length).toBe(10);

    const m = matkaajat[0];
    console.log("matkaaja:", m)

    // Tarkistetaan että 1. objektissa on vaaditut tiedot
    expect(m.idmatkaaja).toBe(1);
    expect(m.etunimi).toBe("Jari");
    expect(m.sukunimi).toBe("Partanen");
    expect(m.nimimerkki).toBe("Jape1");
    expect(m.paikkakunta).toBe("Kuopio");
    expect(m.esittely).toBe("Morjesta poytaan!");
  });
});

describe("Haetaan nimellä", () => {

  test('Haetaan etunimellä', async () => {
    const response = await request.get("/users?etunimi=K");

    // Status koodi pitää olla 200
    expect(response.status).toBe(200)

    const data = response.body;  
    let matkaajat = null;

    expect(data.status).toBe("OK");
    matkaajat = data.users;

    // Palautuu taulukko, jossa pitäisi olla yksi alkio
    expect(matkaajat.length).toBe(1);

    const m = matkaajat[0];
    console.log("matkaaja:", m)

    // Tarkistetaan että 1. objektissa on vaaditut tiedot
    expect(m.idmatkaaja).toBe(6);
    expect(m.etunimi).toBe("Katja");
    expect(m.sukunimi).toBe("Nissinen");
    expect(m.nimimerkki).toBe("Katju123");
    expect(m.paikkakunta).toBe("Leppavirta");
    expect(m.esittely).toBe("Morjesta poytaan!");

  });

  test('Haetaan sukunimellä', async () => {
    const response = await request.get("/users?sukunimi=K");

    // Status koodi pitää olla 200
    expect(response.status).toBe(200)

    const data = response.body;  
    let matkaajat = null;

    expect(data.status).toBe("OK");
    matkaajat = data.users;

    // Palautuu taulukko, jossa pitäisi olla yksi alkio
    expect(matkaajat.length).toBe(1);

    const m = matkaajat[0];
    console.log("matkaaja:", m)

    // Tarkistetaan että 1. objektissa on vaaditut tiedot
    expect(m.idmatkaaja).toBe(5);
    expect(m.etunimi).toBe("Jari");
    expect(m.sukunimi).toBe("Korhonen");
    expect(m.nimimerkki).toBe("korjari");
    expect(m.paikkakunta).toBe("Pielavesi");
    expect(m.esittely).toBe("Morjesta poytaan!");
  });

  test('Haetaan etu- ja sukunimellä', async () => {
    const response = await request.get("/users?etunimi=M&sukunimi=V");

   // Status koodi pitää olla 200
   expect(response.status).toBe(200)

   const data = response.body;  
   let matkaajat = null;

   expect(data.status).toBe("OK");
   matkaajat = data.users;

   // Palautuu taulukko, jossa pitäisi olla yksi alkio
   expect(matkaajat.length).toBe(1);

   const m = matkaajat[0];
   console.log("matkaaja:", m)

   // Tarkistetaan että 1. objektissa on vaaditut tiedot
   expect(m.idmatkaaja).toBe(4);
   expect(m.etunimi).toBe("Martti");
   expect(m.sukunimi).toBe("Virtanen");
   expect(m.nimimerkki).toBe("Virtis_Martti");
   expect(m.paikkakunta).toBe("Nivala");
   expect(m.esittely).toBe("Morjesta poytaan!");
  });

});

describe("Haetaan matkaaja, jota ei ole", () => {

  test('Haetaan olematonta matkaajaa', async () => {
    const response = await request.get("/users?etunimi=XXXXXXXX");

    // Status koodi pitää olla 200
    expect(response.status).toBe(200)

    const data = response.body;   
    let matkaajat = null;
    // Pitäisi palautua ok, mutta tyhjä users taulukko. 
    expect(data.status).toBe("OK");
    matkaajat = data.users;
    
    expect(matkaajat.length).toBe(0);
  });
});


