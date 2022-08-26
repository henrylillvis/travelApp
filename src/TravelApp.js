
import React, { useState, useEffect,useContext } from "react";
import { NavLink, Routes, Route, BrowserRouter as Router, useNavigate, useLocation, Navigate, useParams } from 'react-router-dom'
import { Nav, NavDropdown, Navbar, Container, Image } from 'react-bootstrap';
import image from './puijontorni.jpeg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { UsersControl} from './userControl.js';
import { StoryView } from './tripView.js';
import { UserEdit } from "./userEdit";
import {DestinationView} from './DestinationView.js';
import { UserRegistration, UserLogin, TermsOfUse} from './LogAndRegView.js';
import image2 from './vanhakuva.jpg';
export const DataContext = React.createContext({});

export const TravelApp = () => {
    const loggedOutUser = {idmatkaaja: 0 ,nimimerkki:"", token: ""};
    const initState = {user : loggedOutUser, loggedIn: false}
    const [storedData, setStoredData] = useState(initState);
    const navigate = useNavigate();
    const loginDone = (loggedUser) => { 
        console.log(loggedUser);               
        setStoredData({user: loggedUser, loggedIn:true});
     }
    const logoutDone = () => { 
        setStoredData({user: loggedOutUser, loggedIn:false});
        navigate("/login");
    }
    const changeNickname = (nickName) => { 
        setStoredData({...storedData, user: {...storedData.user,nimimerkki: nickName}});
        console.log({...storedData, user: {...storedData.user,nimimerkki: nickName}})
        navigate("/login");
    }

    //Näistä voisi tehdä oman komponentin--------------
    const useAuth = () => {        
        return storedData.loggedIn;
    }
    
    const ProtectedRoutesUndUser = (element) => {
        const location = useLocation();
        const isAuth = useAuth();
        return isAuth ? element: <Navigate to="/login" replace state={{ from: location}}/>
    }
    
    const ProtectedRoutesUser = (element) => {
        const location = useLocation();
        const isAuth = useAuth();
        return isAuth ? <Navigate to="/" /> : element
    }
    //---------------------------------------------------------
    console.log("Logged in: " + storedData.loggedIn);
    
    return (
            <div className="travelAppBody">
                <DataContext.Provider value={{...storedData, loginDone, logoutDone, changeNickname}}>
                {storedData.loggedIn ? <LoggedInNavBar user={storedData.user} onLogout={() => logoutDone()} /> : <LogInNavBar />}
                <div className="Main">
                    <Routes>
                        <Route path="/" element={storedData.user.loggedIn ? <UserHome /> : <Home />} />
                        <Route path="*" element={<PathError />} />
                        <Route path="/users" element={ProtectedRoutesUndUser(<UsersControl />)} />
                        <Route path="/userstories" element={ProtectedRoutesUndUser(<StoryView />)} />
                        <Route path="/myinfo" element={ProtectedRoutesUndUser(<UserEdit />)}/>                    
                        <Route path="/destinations" element={<DestinationView />} />                       
                        <Route path="/login" element={ProtectedRoutesUser(<UserLogin />)} />
                        <Route path="/logout" element={<LogOutInfo />} />
                        <Route path="/register" element={ProtectedRoutesUser(<UserRegistration />)} />
                        <Route path="/loginsucceed" element={ProtectedRoutesUndUser(<LoggedUserView  />)} />
                    </Routes>
                </div>
                <Footer />
                </DataContext.Provider>
            </div>
    );
}

//Sisäänkirjautuneen navigointinäkymä
export const LoggedInNavBar = (props) => {
    const dl = useContext(DataContext);
    const logOut = () => {
        dl.logoutDone();
    }

    return (
        <Navbar className="navbar" variant="dark" bg="dark" expand="lg">
            <Container fluid>

                <Navbar.Brand to="/"><Image roundedCircle src={image} className="navbarImage"></Image>{' '}Kuopion Kulkijat</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-dark" />
                <Navbar.Collapse id="navbar-dark">
                    <Nav className="px-3">
                        <NavLink className="nav-item nav-link" to="/">Koti</NavLink>
                        <NavLink className="nav-item nav-link" to="/users">Jäsenet</NavLink>
                        <NavLink className="nav-item nav-link" to="/destinations">Matkakohteet</NavLink>
                        <NavLink className="nav-item nav-link" to="/userstories">Matkatarinat</NavLink>

                    </Nav>
                    <Nav className="ms-auto">
                        <NavDropdown
                            id="nav-dropdown-dark-example"
                            title={dl.user.nimimerkki}
                            menuVariant="dark"
                            drop="start"
                        >
                            <NavLink className="nav-item nav-link" to="/myinfo">Omat tiedot</NavLink>
                            <NavDropdown.Divider />
                            <NavLink className="nav-item nav-link" to="#" onClick={() => logOut()}>Kirjaudu ulos</NavLink>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

//Ei kirjautuneen navigointinäkymä
export const LogInNavBar = () => {

    return (
        <Navbar className="navbar" variant="dark" bg="dark" expand="lg">
            <Container fluid>
                <Navbar.Brand to="/"><Image roundedCircle src={image} className="navbarImage"></Image>{' '}Kuopion Kulkijat</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-dark-example" />
                <Navbar.Collapse id="navbar-dark-example">
                    <Nav>
                        <NavLink className="nav-item nav-link" to="/">Koti</NavLink>
                        <NavLink className="nav-item nav-link" to="/destinations">Matkakohteet</NavLink>
                    </Nav>
                    <Nav className="ms-auto">
                        <NavLink className="nav-item nav-link" to="/login">Kirjaudu</NavLink>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export const Footer = () => {

    return (
        <div className="Footer">
            <h6>Matkasovellus v0.3</h6>
            <p>© Group S</p>
        </div>
    );
}
// Tämä on kotinäkymä, jossa tervehdys ja kuva
export const Home = () => {

    return (
        <div>
            <h1 className="homeHeader">Tervetuloa Kuopion kulkijoiden sivuille!</h1>
            <Image roundedCircle src={image} className="homeImage"></Image>
        </div>
    );
}
// Laitoin eri kotinäkymän kirjautuneelle, tässä voisi olla muuta tietoa käyttäjälle
export const UserHome = () => {

    return (
        <div>
            <h1>Tämä on kirjautuneen käyttäjän kotinäkymä</h1>
        </div>
    );
}
//Tämä näkyy vain kirjautumisen jälkeen
export const LoggedUserView = () => {
    const dl = useContext(DataContext);
    return (
        <div className="loginSucceed">
            <h1>Kirjautuminen onnistui!</h1>
            <h3>Tervetuloa {dl.user.nimimerkki}</h3>
            <h3>Voit nyt selata muiden matkatarinoita, tai kertoa omista matkoistasi!</h3>
            <Image roundedCircle src={image2} className="oldImage"></Image>
        </div>
    );
}
//Kirjautumisnäkymä
export const UserLogIn = (props) => {
    const dl = useContext(DataContext);
    const navigate = useNavigate();
    const handleClick = () => {
        dl.loginDone({idmatkaaja: 0 ,nimimerkki:"Demo123", token: "", loggedIn: true});
        navigate("/loginsucceed");
    }

    return (
        <div>
            <h1>Tämä on kirjautumisnäkymä</h1>
            <button onClick={() => handleClick()}>Kirjaudu Demokäyttäjänä</button>
        </div>
    );
}
// Kokeilu, tämä ei toimi. Uloskirjautuminen pitää toteuttaa toisella tavalla.
export const LogOutInfo = () => {
     
    return (
        <div>
            <h1>Olet kirjautunut ulos</h1>
        </div>
    );    
}



// Tässä vielä ongelmia
export const PathError = (props) => {
    return (
        <div>
            <h1>Hups! Tapahtui virhe. </h1>
        </div>
    );
}



