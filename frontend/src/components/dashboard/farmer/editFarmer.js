import React, { useState,useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Menu from "../menu"
import Tourism from "./Tourism"
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
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';

//Context
import { useUser } from '../../../contexts/user';

//functions
const EditFarmer= () => {

  //Navigate
  const navigate = useNavigate();

  // Validation
  const [validated, setValidated] = useState(false);

  // Context
  const user = useUser()

  //use State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [profilePicture, setProfilePicture] = useState("none");
  const [pictures, setPictures] = useState([]);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [tourism, setTourism] = useState(null);
  const [invalidFormMessage, setInvalidFormMessage] = useState("");
  const [requestPending, setRequestPending] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [show, setModalShow] = useState(false);
  const handleModalClose = () => setModalShow(false);
  const handleModalShow = () => setModalShow(true);

  const { id } = useParams();

  useEffect(() => {
    if(id !== "newFarmer"){
      ApiService.httpGet(`farmer/dashboard/${id}`, user.token)
      .then(res => {
        setName(res.data.data.name)
        setDescription(res.data.data.description)
        setProfilePicture(res.data.data.profile_picture)
        setPictures(res.data.data.pictures)
        setEmail(res.data.data.email)
        setTourism(res.data.data.tourism)
      })
      .catch(err => {
        console.error(err);
        navigate("/dashboard");
      })
    }
  }, []);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
        event.stopPropagation();
    } else {
        setRequestPending(true);
        let farmerPromise;
        if(id !== "newFarmer"){
          farmerPromise = ApiService.httpPut(`farmer/dashboard/${id}`, {
            name: name,
            description: description,
            profile_picture: profilePicture,
            pictures: pictures,
            email: email,
            tourism: tourism
          }, user.token)
        }else{
          farmerPromise =  ApiService.httpPost(`farmer/dashboard`, {
            name: name,
            description: description,
            profile_picture: profilePicture,
            pictures: pictures,
            email: email,
            password: password,
            tourism: tourism
          }, user.token)
        }
        farmerPromise.then(res => {
              if (res.data.success){
                  let nrFilesToUpload = filesToUpload.length
                  while (nrFilesToUpload > 0) {
                    let formData = new FormData()
                    formData.append('file', filesToUpload[nrFilesToUpload-1])
                    nrFilesToUpload--
                    ApiService.httpPostFile('upload', formData)
                    .then(_res => {})
                    .catch(err => {
                      console.error(err)
                    })
                  }
                  console.error(res);
                  setRequestId(res.data.id);
              }
              else {
                  setInvalidFormMessage(`Ungültiges Formular: ${res.data.message}`);
              }
          })
          .catch(err => {
              console.error(err)
              setInvalidFormMessage(`Fehler beim Updaten/Erstellen des Produktes: ${err}`);
          })
          .finally(() => {
              setRequestPending(false)
          })
      }
      setValidated(true);
  }

  const deleteFarmer = () => {
    if(id==="newFarmer") navigate("/dashboard");
    ApiService.httpDelete(`farmer/dashboard/${id}`, user.token)
    .then(res => {
      navigate("/dashboard", {state: {selectedCollection: "farmers", alert: "Farmer deleted!"}})
      window.scrollTo(0, 0)
    })
    .catch(err => {
      //there is an error in the backend when deleting returning false even if the farmer is deleted
      console.error(err);
      navigate("/dashboard", {state: {selectedCollection: "farmers", alert: "Farmer deleted!"}});
      window.scrollTo(0, 0)
    })
  }


  const uploadImageHandler = (input, kind) => {
    if(typeof input.target.files[0] === "undefined"){
      if(kind === "profielPicture") setProfilePicture(profilePicture)
      else setPictures(pictures)
    }else{
      if(kind === "profilePicture"){
        setProfilePicture(input.target.files[0].name)
        setFilesToUpload(prevState =>
           [...prevState, input.target.files[0]]
        )
      }else{
        let counter = 0
        const pictureHelper = []
        const pictureNames = []
        while(input.target.files[counter]){
          pictureHelper.push(input.target.files[counter])
          pictureNames.push(input.target.files[counter].name)
          counter++
        }
        setPictures(pictureNames)
        setFilesToUpload(prevState =>
           [...prevState, ...pictureHelper]
        )
      }
    }
  }

  const getImageNames = (picArray) =>{
    return(
      picArray.map((pic, i, arr) => {
        if(i+1===arr.length) return (pic)
        return(pic+", ")
    })
    )
  }

  if (requestId !== "") {
    navigate("/dashboard", {state: {selectedCollection: "farmers", alert: "Farmer updated/created!"}})
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
                <h3>{id === 'newFarmer'? "New Farmer": "Edit Farmer"}</h3>
                <Form className="dashboard__form" noValidate validated={validated} onSubmit={handleSubmit}>
                  <Row className="mb-4">
                    <Col>
                        <Form.Label className="dashboard__form-label">Farmer Name </Form.Label>
                        <Form.Control className={""} required type="text" value={name} onChange={(event) => setName(event.target.value)} />
                        <Form.Control.Feedback type="invalid">Please enter the name of the product!</Form.Control.Feedback>
                    </Col>
                    <Col>
                        <Form.Label className="dashboard__form-label">Email Adress</Form.Label>
                        <Form.Control required type="email" value={email} onChange={event => setEmail(event.target.value)} />
                        <Form.Control.Feedback type="invalid">Please enter a valid email!</Form.Control.Feedback>
                    </Col>
                    {id=== "newFarmer" &&
                      <Col>
                        <Form.Label className="dashboard__form-label">Password</Form.Label>
                        <Form.Control required type="password"  value={password} onChange={event => setPassword(event.target.value)} />
                        <Form.Control.Feedback type="invalid">Please enter a password</Form.Control.Feedback>
                      </Col>
                    }
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
                        <Form.Label className="dashboard__form-label">Profile Picture</Form.Label>
                         Currently selected image: {profilePicture}
                        <Form.Control type="file" required= {profilePicture==="none"} onChange={(e) => uploadImageHandler(e, "profilePicture")}/>
                      </Col>
                  </Row>
                  <Row className="mb-4">
                      <Col>
                      <Form.Label className="dashboard__form-label">Pictures of your Farm</Form.Label>
                      Currently selected images: {getImageNames(pictures)}
                      <Form.Control type="file" multiple required = {pictures.length<1} onChange={(e) => uploadImageHandler(e, "multipelPictures")}/>
                      </Col>
                  </Row>
                  <Row className="mb-4">
                      <Col>
                        <h5>Tourism Information</h5>
                      </Col>
                  </Row>
                  <Row className="mb-4">
                      <Col>
                        <Tourism tourism = {tourism} setTourism={setTourism} setFilesToUpload={setFilesToUpload}/>
                      </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Button type="submit" className="d-block w-100" disabled={requestPending}>
                        {id === 'newFarmer'? "Create New Farmer": "Update Farmer"}
                      </Button>
                    </Col>
                    {user.role !== "farmer"&&
                    <Col>
                      <Button className="d-block w-100" variant="danger" onClick={handleModalShow}>
                        {id === 'newFarmer'? "Abort": "Delete Farmer"}
                      </Button>
                    </Col>
                    }
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
            <Modal.Body>{(id==="newFarmer") ? "Are you sure you want to abort? Your entered information will not be safed" :"Are you sure you want to delete this farmer?"} </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() =>deleteFarmer()}>
                {(id==="newFarmer") ? "Abort" : "Delete"}
              </Button>
            </Modal.Footer>
          </Modal>
         </div>
      )
  }

export default EditFarmer;