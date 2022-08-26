import React, { useState, useContext } from "react";
import { Button, Form, Row, Col, InputGroup, Spinner } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, NavLink } from "react-router-dom";
import './LogAndReg.css'
import { DataContext } from "./TravelApp.js";
// Rekisteröitymis komponentti
export const UserRegistration = (props) => {

  const [infoBar, setInfoBar] = useState(null);
  const [validated, setValidated] = useState(false);
  const [etunimi, setEtunimi] = useState("");
  const [sukunimi, setSukunimi] = useState("");
  const [nimimerkki, setNimimerkki] = useState("");
  const [paikkakunta, setPaikkakunta] = useState("");
  const [email, setEmail] = useState("");
  const [esittely, setEsittely] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const addUser = async (user) => {
    setShow(false);
    setLoading(true);
    try { // Ei tarvetta hashata salasanaa servulle päin, koska kommunikointi on jo cryptattu
      let response = await fetch('http://localhost:3004/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user),
        redirect: 'follow'
      });
      let c = await response.json();
      console.log(c);
      if (c.status === "NOT OK") {
        setInfoBar(<div className="alert alert-danger" role="alert">{"Reksiteröityminen epäonnistui! " + c.message}</div>);
        setShow(true);
        setLoading(false);
      }
      else {
        setInfoBar(<div className="alert alert-success" role="alert">Rekisteröityminen onnistui! Siirrytään automaattisesti kirjautumiseen...</div>);
        setShow(true);
        console.log("Tyhjää");
        setValidated(false);
        clearFields();
        await new Promise((resolve, reject) => setTimeout(resolve, 3000));
        setLoading(false);
        console.log("Nyt siirrtyään kirjautumiskomponenttiin")
        navigate("/login");
      }
    } catch (err) {
      setInfoBar(<div className="alert alert-danger" role="alert">Tekninen ongelma! Rekisteröityminen epäonnistui, yritä myöhemmin uudestaan.</div>); // Jos node server alhaalla
      setShow(true);
      setLoading(false);
    }

  }

  const clearFields = () => {
    setEtunimi("");
    setSukunimi("");
    setNimimerkki("");
    setPaikkakunta("");
    setEmail("");
    setEsittely("");
    setPassword("");
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    else {
      let user = { etunimi, sukunimi, nimimerkki, paikkakunta, esittely, email, password }
      console.log(user);
      addUser(user);
    }
    setValidated(true);
  };


  return (
    <div className="RegForm">
      <div className="MessageBox">
        {loading ? <Spinner animation="border"></Spinner> : <h4 className="display-6">Tervetuloa uudeksi matkaajaksi!</h4>}
        {show ? infoBar : null}
      </div>
      <Form className="border border-light-lg rounded p-4" style={{ backgroundColor: "whitesmoke" }} method="POST" action='/registration' noValidate validated={validated} onSubmit={handleSubmit}>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="validationCustom01">
            <Form.Label>Etunimi</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Etunimi"
              value={etunimi}
              onChange={(e) => setEtunimi(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Anna etunimi.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="validationCustom02">
            <Form.Label>Sukunimi</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Sukunimi"
              value={sukunimi}
              onChange={(e) => setSukunimi(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Anna sukunimi.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="validationCustomUsername">
            <Form.Label>Käyttäjänimi</Form.Label>
            <InputGroup hasValidation>

              <Form.Control
                type="text"
                placeholder="Käyttäjänimi"
                aria-describedby="inputGroupPrepend"
                required
                value={nimimerkki}
                onChange={(e) => setNimimerkki(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Valitse käyttäjänimi.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group as={Col} controlId="validationCustom03">
            <Form.Label>Paikkakunta</Form.Label>
            <Form.Control
              type="text"
              placeholder="Paikkakunta"
              value={paikkakunta}
              onChange={(e) => setPaikkakunta(e.target.value)}
            />
            <Form.Control.Feedback type="valid">
              Tämän tiedon voi lisätä myöhemmin omat tiedot osiossa
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="validationCustom04">
            <Form.Label>Sähköposti</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Sähköposti"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputGroup.Text id="basic-addon2">@esimerkki.com</InputGroup.Text>
              <Form.Control.Feedback type="invalid">
                Anna sähköposti.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="validationCustom06">
            <Form.Label>Salasana</Form.Label>
            <InputGroup>
              <Form.Control
                type="password"
                placeholder="Salasana"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Anna salasana.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="validationCustom05">
            <Form.Label>Esittely</Form.Label>
            <InputGroup>
              <Form.Control
                as="textarea"
                rows={4}
                maxLength="500"
                type="text"
                placeholder="Esittely"
                value={esittely}
                onChange={(e) => setEsittely(e.target.value)}
              />
              <Form.Control.Feedback type="valid">
                Tämän tiedon voi lisätä myöhemmin omat tiedot osiossa
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
        <Button type="submit">Rekisteröidy</Button>
        <NavLink className="p-3" to="/login">Takaisin kirjautumiseen</NavLink>

      </Form>
    </div>
  );
}

//Kirjautumis komponentti
export const UserLogin = (props) => {

  const [show, setShow] = useState(false);
  const [infoText, setInfoText] = useState("");
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  
  const navigate = useNavigate();
  const dl = useContext(DataContext);

  const authenticateUser = async (user) => {
    try {
      setError(false);
      setLoading(true);
      let response = await fetch('http://localhost:3004/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user),
        redirect: 'follow'
      });
      let c = await response.json();
      console.log(c);
      if (c.status === "NOT OK") {
        setError(true);
        setInfoText(c.msg);
        setShow(true);
        setLoading(false);
      }
      else {
        console.log(c.user);
        dl.loginDone(c.user);
        navigate("/loginsucceed");
      }
    } catch (err) {
      console.log(err);
      setError(true);
      setInfoText("Tekninen ongelma! Kirjautuminen epäonnistui, yritä myöhemmin uudestaan."); // Jos node server alhaalla
      setShow(true);
      setLoading(false);
    }
  }

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    else{
      authenticateUser({ email, password });
    } 
    setValidated(true);
  };

  return (
    <div className="LoginForm">
      <div className="MessageBox">
        {loading ? <Spinner animation="border"></Spinner> : show ? error ? <div className="alert alert-danger" role="alert">{infoText}</div> : <div className="alert alert-success" role="alert">{infoText}</div> : null}
      </div>
      <Form className="border border-light-lg rounded p-4 my-4" style={{ backgroundColor: "whitesmoke" }} noValidate validated={validated} onSubmit={handleSubmit}>
        <h4 className="display-6">Kirjaudu sisään</h4>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="validationCustom01">
            <Form.Label>Sähköposti</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Sähköposti"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Anna sähköposti
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="validationCustom02">
            <Form.Label>Salasana</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Salasana"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Anna salasana
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Button type="submit" disabled={loading}>Kirjaudu</Button>
        <p>Etkö ole vielä rekisteröitynyt? Rekisteröidy <NavLink to="/register">tästä</NavLink></p>
      </Form>
    </div>
  );
}
