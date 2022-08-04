import React, {  useState,useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Menu from "../menu"
import StocksList from "./stocksList"
import ReviewsList from "./reviewList"
import DashboardHeader from "../header"

// service
import ApiService from '../../../services/Api.service'

// bootstrap components
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

//Context
import { useUser } from '../../../contexts/user';

//functions

const EditProduct= () => {

  const { id } = useParams();
  const navigate = useNavigate();

  //useState
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [growth_height, setGrowth_Height] = useState("");
  const [filtration, setFiltration] = useState(false);
  const [harvesting_date, setHarvesting_date] = useState();
  const [picture, setPicture] = useState("none");
  const [reviews, setReviews] = useState([]);
  const [stocks, setStocks] = useState([{"size": 0,
  "available_bottles": 0,
  "shipping_details": {
      length: 0,
      width: 0,
      height: 0,
      weight: 0,
  },
  "price": 0,
  "listID": 0}]);
  const [variety, setVariety] = useState("");
  const [region, setRegion] = useState("");
  const [invalidFormMessage, setInvalidFormMessage] = useState("");
  const [requestPending, setRequestPending] = useState(false);
  const [farmerID, setFarmerID] = useState(0)
  const [farmerName, setFarmerName] = useState("")
  const [farmers, setFarmers] = useState([])
  const [requestId, setRequestId] = useState("");
  const [fileToUpload, setFileToUpload] = useState(null);
  //used for stocks to identify them inside the stocks array, _id is not available with new stocks that are not in the backend yet
  const [listID, setListID] = useState(1);
  const [originalImage, setOriginalImage] = useState("");
  const [show, setModalShow] = useState(false);
  const handleModalClose = () => setModalShow(false);
  const handleModalShow = () => setModalShow(true);


  // Validation
  const [validated, setValidated] = useState(false);

  // Context
  const user = useUser()

  useEffect(() => {
    let farmerIDLocal =""
    if(user.role === "farmer"){
      setFarmerID(user._id)
      setFarmerName(user.name)
      farmerIDLocal = user._id
    }

    if(id !== "newProduct"){
      ApiService.httpGet(`product/${id}`)
      .then(res => {
        setName(res.data.data.name)
        setDescription(res.data.data.description)
        setFiltration(res.data.data.filtration)
        setGrowth_Height(res.data.data.growth_height)
        const rightDate = res.data.data.harvesting_date.split("T")[0]
        setHarvesting_date(rightDate)
        setPicture(res.data.data.picture)
        setReviews(res.data.data.reviews)
        initializeStockListID(res)
        setVariety(res.data.data.variety)
        setRegion(res.data.data.region)
        setOriginalImage(res.data.data.picture)
        setFarmerID(res.data.data.farmerID)
        farmerIDLocal = res.data.data.farmerID
      })
      .catch(err => {
        console.error("err");
        navigate("/");
      })
    }
    ApiService.httpGet(`farmer`)
    .then(res => {
        setFarmers(res.data.data)
        let correspondingName = res.data.data.find(farmer => farmer._id === farmerIDLocal)
        if(correspondingName) setFarmerName(correspondingName.name)
    }).catch(err => {
        console.error(err);
    })
  }, []);

  const initializeStockListID = (res) => {
    let listIDCurrent= listID
    let newStocks = res.data.data.stocks.map((stock)=>{
      listIDCurrent++
      return(
        {...stock, listID: listIDCurrent}
      )
    })
    listIDCurrent++
    setStocks(newStocks)
    setListID(listIDCurrent)
  }

  const deleteProduct = () => {
    if(id==="newProduct") navigate("/dashboard");
    else{
      ApiService.httpDelete(`product/dashboard/${id}`, user.token)
        .then(_res => {
          navigate("/dashboard", {state: {alert: "Product deleted!"}})
          window.scrollTo(0, 0)
        })
        .catch(err => {
          //error: sometimes backend returnes false even if the product is deleted
          console.error(err);
          navigate("/dashboard", {state: {alert: "Product deleted!"}})
          window.scrollTo(0, 0)
        })
    }
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
        event.stopPropagation();
    }else if(stocks.length <1){
      setInvalidFormMessage('You have to provide at least one stock')
      event.stopPropagation();
    } else {
        setRequestPending(true);
        let promiseProduct;
        if(id !== "newProduct"){
          promiseProduct= ApiService.httpPut(`product/dashboard/${id}`, {
            name: name,
            description: description,
            region: region,
            growth_height: growth_height,
            filtration: filtration,
            harvesting_date: harvesting_date,
            picture: picture,
            reviews: reviews,
            stocks: stocks,
            variety: variety,
            farmerID: farmerID
          }, user.token)
        }else {
          promiseProduct= ApiService.httpPost(`product/dashboard`, {
            name: name,
            description: description,
            region: region,
            growth_height: growth_height,
            filtration: filtration,
            harvesting_date: harvesting_date,
            picture: picture,
            reviews: reviews,
            stocks: stocks,
            variety: variety,
            farmerID: farmerID
          }, user.token)
        }
        promiseProduct.then(res => {
              if (res.data.success){
                  if (fileToUpload) {
                    let formData = new FormData()
                    formData.append('file', fileToUpload)
                    ApiService.httpPostFile('upload', formData)
                    .then(_res => {})
                    .catch(err => {
                      console.error(err)
                    })
                  }
                  setRequestId(res.data.id);
              }
              else {
                  setInvalidFormMessage(`Invalid form: ${res.data.message}`);
              }
          })
          .catch(err => {
              console.error(err)
              setInvalidFormMessage(`Error when updating/creating the product: ${err}`);
          })
          .finally(() => {
              setRequestPending(false)
          })
      }
      setValidated(true);
  }

  const addStock= () => {
    setListID(listID+1)
    let newStock =
      {"size": 0,
      "available_bottles": 0,
      "shipping_details": {
          length: 0,
          width: 0,
          height: 0,
          weight: 0,
      },
      "price": 0,
      "listID": listID};
    setStocks(oldArray => [...oldArray, newStock]);
  };

  const listFarmerOptions = () => {
    if(user.role === "farmer"){
      return (<option value ={user._id} selected>{user.name}</option>)
    }
    return(
      <>
      {(farmerName === "") && <option value ={""} selected>Please Select a valid farmer</option> }
      {farmers.map(farmer => {
        if(farmer.name === farmerName){
          return(
          <option value={farmer._id} selected >{farmer.name}</option>
        )}else {
          return(
            <option value={farmer._id} >{farmer.name}</option>
          )
        }
      })}
      
      </>
    )
  }

  const listVarietyOption = () => {
    return(
      <>
        <option value="" selected = {variety === ""}>Selected a valid Variety Type</option>
        <option value="Mono" selected = {variety === "Mono"}>Monovariate</option>
        <option value="Multi" selected = {variety === "Multi"}>Multivariate</option>
        
      </>
    )
  }

  const listRegionOption = () => {
    if(["Crete", "Peloponnese", "Attica", "West- & Middle", "Thessaly", "Epirus", "Macedonia", "Thrace"].indexOf(region)>-1){
    return(
      <>
        <option value="Crete" selected={region === "Crete"}>Crete</option>
        <option value="Peloponnese" selected={region === "Peloponnese"}>Peloponnese </option>
        <option value="Attica"  selected={region === "Attica"}>Attica</option>
        <option value="West- & Middle" selected={region === "West- & Middle"}>West- & Middle</option>
        <option value="Thessaly" selected={region === "Thessaly"}>Thessaly</option>
        <option value="Epirus" selected={region === "Epirus"}>Epirus</option>
        <option value="Macedonia" selected={region === "Macedonia"}>Macedonia</option>
        <option value="Thrace" selected={region === "Thrace"}>Thrace</option>
      </>
    )}
    else{
      return(
        <>
          <option value="" selected>Select a valid Region</option>
          <option value="Crete" >Crete</option>
          <option value="Peloponnese"  >Peloponnese</option>
          <option value="Attica" >Attica</option>
          <option value="West- & Middle" >West- & Middle</option>
          <option value="Thessaly" >Thessaly</option>
          <option value="Epirus"  >Epirus</option>
          <option value="Macedonia" >Macedonia</option>
          <option value="Thrace">Thrace</option>
        </>
      )
    }
  }

  const uploadImageHandler = (input) => {
    if(typeof input.target.files[0] === "undefined"){
      setPicture(originalImage)
    }else{
      setPicture(input.target.files[0].name)
      setFileToUpload(input.target.files[0])
    }
  }

  const updateFarmer = (value) => {
    setFarmerID(value)
    setFarmerName((farmers.find(farmer =>value===farmer._id)).name)
  }

   //TODO einfach return Dashboard hauptseite mit info text "geupdatet" aber ist dann auch die URL angepasst? same3 as in editFarmer
  if (requestId !== "") {
    navigate("/dashboard", {state: {alert: "Product updated/created!"}})
    window.scrollTo(0, 0)
  }

    return (
      <div className="dashboard">
        <Container className="mb-5">
          <Row className="mb-3">
            <Col xs={12} lg={3}>
              <Menu/>
            </Col>
            <Col xs={12} lg={9}>
              <h3>{id === 'newProduct'? "New Product": "Edit Product"}</h3>
              <Form className="dashboard__form" noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-4">
                    <Col>
                        <Form.Label className="dashboard__form-label">Product Name</Form.Label>
                        <Form.Control className={""} required type="text" value={name} onChange={(event) => setName(event.target.value)} />
                        <Form.Control.Feedback type="invalid">Please enter the name of the product!</Form.Control.Feedback>
                    </Col>
                    <Col className='mr-0'>
                        <Form.Label className="dashboard__form-label">Farmer</Form.Label>
                        <Form.Select required aria-label="Default select example" onChange={event => updateFarmer(event.target.value)} >
                          {listFarmerOptions()}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">Please choose a farmer!</Form.Control.Feedback>
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col>
                    <Form.Label className="dashboard__form-label">Description</Form.Label>
                    <Form.Control required className={ ""} as="textarea" rows="4" value={description} onChange={event => setDescription(event.target.value)} />
                    <Form.Control.Feedback type="invalid">Please enter a description!</Form.Control.Feedback>
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col>
                        <Form.Label className="dashboard__form-label">Region</Form.Label>
                        <Form.Select className={""} required type="text" value={region} onChange={event => setRegion(event.target.value)} >
                            {listRegionOption()}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">Please choose a correct region!</Form.Control.Feedback>
                    </Col>
                    <Col>
                        <Form.Label className="dashboard__form-label">Growth Height</Form.Label>
                        <Form.Control required type="number"  value={growth_height} min= "0"  onChange={event => setGrowth_Height(event.target.value)} />
                        <Form.Control.Feedback type="invalid">Pleas provide an estimate of the grwoth height! Cannot be negative. </Form.Control.Feedback>
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col>
                        <Form.Label className="dashboard__form-label">Harvesting Date</Form.Label>
                        <Form.Control required defaultValue={harvesting_date} type="date" date={harvesting_date} onChange={event => setHarvesting_date(event.target.value)} />
                        <Form.Control.Feedback type="invalid">Pleas enter a date!</Form.Control.Feedback>
                    </Col>
                    <Col>
                        <Form.Label className="dashboard__form-label">Variety</Form.Label>
                        <Form.Select type="text" required onChange={event => setVariety(event.target.value)} >
                            {listVarietyOption()}
                        </Form.Select>
                    </Col>
                    <Col>
                        <Form.Label className="dashboard__form-label">Filtrated</Form.Label>
                        <Form.Check
                          type="switch"
                          size="lg"
                          checked = {filtration ? true : false}
                          onChange={event => setFiltration(() => event.target.checked ? true : false)}
                        />
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col>
                       Currently selected image: {picture}
                      <Form.Control required = {picture === "none"} type="file" onChange={(e) => uploadImageHandler(e)}/>
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col>
                        <Row className="mb-1">
                          <Col>
                            <StocksList stocks = {stocks} setStocks = {setStocks}/>
                          </Col>
                        </Row>
                        <Row className="mb-1">
                          <Col>
                            <Button className="btn btn-primary" onClick = {() => addStock()}>Add Stock</Button>
                          </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row className="mb-1">
                          <Col>
                            <ReviewsList reviews={reviews} setReviews={setReviews}/>
                          </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                  <Col>
                    <Button type="submit" className="d-block w-100" disabled={requestPending}>
                      {id === 'newProduct'? "Create New Product": "Update Product"}
                    </Button>
                  </Col>
                  <Col>
                    <Button className="d-block w-100" variant="danger" onClick={handleModalShow}>
                      {id === 'newProduct'? "Abort": "Delete Product"}
                    </Button>
                  </Col>
                </Row>
                <div className="mt-4 text-danger">
                    {invalidFormMessage != "" && <p>{invalidFormMessage}</p>}
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
        <Modal show={show} centered onHide={handleModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                <h4 className="mb-0">Remove item</h4>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>{(id==="newProduct") ? "Are you sure you want to abort? Your entered information will not be safed" :"Are you sure you want to delete this product?"} </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() =>deleteProduct()}>
                {(id==="newProduct") ? "Abort" : "Delete"}
              </Button>
            </Modal.Footer>
          </Modal>
       </div>
      )
  }

export default EditProduct;