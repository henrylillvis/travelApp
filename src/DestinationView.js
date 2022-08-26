import { useState, useEffect, useContext } from "react";
import { Button, Spinner, Alert, Toast } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ItemView, ItemList, ErrorAlert } from './utils/itemHandle';
import './destinationView.css';
import { toFormData } from './utils/dataHandler';
import { DataContext } from './TravelApp';

export const DestinationView = () => {
    const dl = useContext(DataContext);

    // refresh käytetään, että saadaan haettua matkakohteet uudestaan listaan operaatioiden yhteydessä
    const [refreshDestinations, setrefreshDestinations] = useState(0);

    const [destination, setDestination] = useState([]);
    const [destinations, setDestinations] = useState();
    const [destinationName, setdestinationName] = useState("");
    const [destinationCountry, setdestinationCountry] = useState("");
    const [destinationCity, setdestinationCity] = useState("");
    const [destinationDescription, setdestinationDescription] = useState("");
    const [destinationImage, setdestinationImage] = useState(null);
    // Lisää, Poista, Muokkaa -muuttujat

    const [destinationIDToBeModified, setDestinationIDToBeModified] = useState(null);

    const [destinationToBeInserted, setDestinationToBeInserted] = useState(null);

    const [destinationToBeDeleted, setDestinationToBeDeleted] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const [destinationToBeEdited, setDestinationToBeEdited] = useState(null);
    const [confirmEdit, setConfirmEdit] = useState(false);
    const [alert, setAlert] = useState();

    // Sellaista matkakohdetta, johon liittyy joku matkakertomus, ei saa poistaa tai päivittää <- tähän joku be?

    useEffect(() => {
        // Haetaan matkakohteet
        const fetchDestinations = async () => {
            let response = await fetch('http://localhost:3004/destinations');
            let place = await response.json();
            console.log(place);
            setDestination(place.data);
        }
        fetchDestinations();
    }, [refreshDestinations]);





    const handleClick = (destination) => {
        // Napataan id ja muuttujat talteen poistamista / muokkaamista varten
        setdestinationName(destination.kohdenimi);
        setdestinationCountry(destination.maa);
        setdestinationCity(destination.paikkakunta);
        setdestinationDescription(destination.kuvausteksti);
        setAlert(null);

        var capturedID = destination.idmatkakohde;
        setDestinationIDToBeModified(capturedID);
        console.log("destination:", destination);

        // Kortti näkyviin
        setDestinations(<ItemView data={destination} datatype={"destination"} funktio={HandleDeleteClick} />);
    }

    const renderView = () => {
        // Komponentti joka näyttää listana matkakohteet
        return <div className="d-flex justify-content-space-between d-inline-block">
            <div className="col-sm-3 px-4 overflow-auto ">
                <ItemList handleClick={handleClick} datatype={"destination"} data={destination} />
            </div>
            <div className="col-sm-3 px-4">
                {destinations}
            </div>
        </div>
    }
    const HandleAddClick = () => {
        setDestinationToBeInserted({
            kohdenimi: destinationName,
            maa: destinationCountry,
            paikkakunta: destinationCity,
            kuvausteksti: destinationDescription,
            kuva: destinationImage
        });
    }
    useEffect(async () => {
        // Lisätään matkakohde tietokantaan
        // Tarkistus tyhjille kentille ? Tänne tai BE '' / " " tarkistus myös
        const insertDestination = async () => {
            console.log("Effectin sisällä", destinationToBeInserted);
            let data = toFormData(destinationToBeInserted);
            const r = await fetch('http://localhost:3004/destinations', {
                method: 'POST',
                headers: {
                    'authorization': 'bearer ' + dl.user.token
                },
                body: data,
                redirect: 'follow'
            }); return r.json();

        }; let status;
        if (destinationToBeInserted != null) {
            status = await insertDestination();
            setrefreshDestinations(refreshDestinations + 1);
            setDestinationToBeInserted(null);
            setAlert(status);
        }
    }, [destinationToBeInserted]);



    const HandleEditClick = () => {
        setDestinationToBeEdited({
            kohdenimi: destinationName,
            maa: destinationCountry,
            paikkakunta: destinationCity,
            kuvausteksti: destinationDescription,
            kuva: destinationImage
        });
        setConfirmEdit(true);
    }
    useEffect(async () => {
        const editDestination = async () => {
            console.log("MUOKKAA MATKAKOHDETTA:", destinationToBeEdited)
            let data = toFormData(destinationToBeEdited);
            console.log("DATA", data);
            const r = await fetch("http://localhost:3004/destinations/" + destinationIDToBeModified, {
                method: "PUT",
                headers: {
                    'authorization': 'bearer ' + dl.user.token
                },
                body: data,
            }); return r.json();

        };
        let status;
        if (destinationToBeEdited != null && confirmEdit == true) {
            status = await editDestination();
            setrefreshDestinations(refreshDestinations + 1);
            setDestinationToBeEdited(null);
            setConfirmEdit(false);
            setAlert(status);
        }
    }, [destinationToBeEdited]);




    const HandleDeleteClick = (id) => {
        console.log(destinationIDToBeModified);
        setDestinationToBeDeleted(destinationIDToBeModified);
        setConfirmDelete(true);
    }
    useEffect(async () => {
        const deleteDestination = async () => {
            // Toimii, virheilmoitus jos kohdetta ei voi poistaa tarvitaan
            const r = await fetch("http://localhost:3004/destinations/" + destinationToBeDeleted,
                {
                    method: "DELETE",
                    headers: {
                        'authorization': 'bearer ' + dl.user.token
                    }
                }
            ); return r.json();

        };
        let status;
        if (destinationToBeDeleted != null && confirmDelete == true) {
            status = await deleteDestination();
            setrefreshDestinations(refreshDestinations + 1);
            setDestinationToBeDeleted(null);
            setConfirmDelete(false);
            setAlert(status);
            console.log(status);
        }
    }, [destinationToBeDeleted]);

    return (
        <div className="DestContainer">
            <div className="child-1">
                {dl.loggedIn ? <div>
                    <h4>Matkakohde</h4>
                    <label>Kohde<br></br>
                        <input
                            placeholder="Matkakohteen nimi"
                            type="text"
                            value={destinationName}
                            onChange={(e) => setdestinationName(e.target.value)} />
                    </label><br></br>
                    <label>Maa<br></br>
                        <input
                            placeholder="Valtion nimi"
                            type="text"
                            value={destinationCountry}
                            onChange={(e) => setdestinationCountry(e.target.value)} />
                    </label><br></br>
                    <label>Paikkakunta<br></br>
                        <input
                            placeholder="Matkakohteen paikkakunta"
                            type="text"
                            value={destinationCity}
                            onChange={(e) => setdestinationCity(e.target.value)} />
                    </label><br></br>
                    <label>Kuvaus<br></br>
                        <input
                            maxLength="500"
                            placeholder="Kuvausteksti"
                            type="text"
                            value={destinationDescription}
                            onChange={(e) => setdestinationDescription(e.target.value)} />
                    </label>
                    <label>Kuva<br></br>
                        <input
                            placeholder="Lataa kuva"
                            type="file"
                            name='kuva'
                            onChange={(e) => setdestinationImage(e.target.files[0])} />
                    </label>
                    <br></br><br></br>
                    <Button className="btn" onClick={HandleAddClick}>Lisää</Button>
                    <Button className="btn btn-secondary" onClick={HandleEditClick}>Muokkaa</Button>
                    <Button className="btn btn-danger" onClick={HandleDeleteClick}>Poista</Button><br></br>
                    <br></br>
                    {(alert) ? <ErrorAlert status={alert} /> : null}
                </div> : null}
            </div>
            <div className="child-2">{renderView()}</div>
        </div>
    );
}
