import { Card, CardImg, Image, ListGroup, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


// Listanäkymä käyttäjille ja matkakohteille. Datatyyppi=datatype annettava propsina, string: user/destination. Data=data
const addUrl = (path) => {
    return 'http://localhost:3004/' + path; //Lisää url backend url kuva
}

export const ItemList = (props) => {

    const data = props.data || [];
    let listGroupItems;
    if (props.datatype === "user") {
        listGroupItems = data.map((m, i) =>
            <ListGroup.Item key={i} action onClick={() => props.handleClick(m)}><Image src={addUrl(m.kuva)} width={50} height={50} roundedCircle={true}></Image>  {m.etunimi} {m.sukunimi}</ListGroup.Item>)
    }
    else { // destination
        listGroupItems = data.map((m, i) =>
            <ListGroup.Item key={i} action onClick={() => props.handleClick(m)}><Image src={addUrl(m.kuva)} width={50} height={50} roundedCircle={true}></Image>  {m.kohdenimi}</ListGroup.Item>)
    }
    return (
        <div className='overflow-auto' style={{ height: '730px'}}>
            <ListGroup>
                {listGroupItems}
            </ListGroup>
        </div>
    );
}

// Korttinäkymä käyttäjille ja matkakohteille. Datatyyppi=datatype annettava propsina, string: user/destination. Data=data
export const ItemView = (props) => {
    const data = props.data || {};
    let title;
    let subtitle;
    let text1;
    let text2;

    if (props.datatype === "user") {
        title = data.etunimi + " " + data.sukunimi
        subtitle = data.nimimerkki;
        text1 = "Paikkakunta: " + data.paikkakunta;
        text2 = "Esittely: " + data.esittely;
    }
    else { // destination
        title = data.kohdenimi;
        subtitle = data.maa;
        text1 = "Paikkakunta: " + data.paikkakunta;
        text2 = "Kuvausteksti: " + data.kuvausteksti;
    }
    return (
        <Card className="bg-light" style={{ color: "#000", width: '25rem' }}>
            <CardImg style={{ height: '15rem' }} variant="top" src={addUrl(data.kuva)} alt="Card image cap" />
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{subtitle}</Card.Subtitle>
                <Card.Text className="text-muted">{text1}</Card.Text>
                <Card.Text className="text-muted">{text2}</Card.Text>
            </Card.Body>
        </Card>
    );
}

export const ErrorAlert = (props) => {
    const {status} = props;
    const statusMap = {
    'INFO':'info',
    'NOT OK':'warning'
    }

    return(
        <Alert variant={statusMap[status.status]}>
        <Alert.Heading>{status.status}</Alert.Heading>
        <p>
            {(typeof status.msg === 'string') ? status.msg:
            (typeof status.msg === 'object') ? 'Tietokannan palauttama virhe: ' + status.msg.sqlMessage :
            'Tunnistamaton virhe.'} 
        </p>
        </Alert>
    )
}