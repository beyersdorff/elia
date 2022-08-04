import React from 'react';

// bootstrap components
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';


const Tourism = (props) => {

     //props setter
     const setFilesToUpload = props.setFilesToUpload
     const setTourism = props.setTourism

    //check if no tourism added yet
    if(!props.tourism){ 
        const addTourism = () => {
        let newTourism = {
            "description": "",
            "region_title": "",
            "region_description": "",
            "activity_description": "",
            "title_picture": "none",
            "region_pictures": [],
            "accomodation_pictures":  [],
            "activity_pictures": [],
            "roomCapacity": 0,
            "bookingRequests": []
        }
        setTourism(newTourism)
    }
        return(<>
        <Row className="mb-1">
            <Col>
                <Button className="btn btn-primary" onClick = {() => addTourism()}>Add Tourism</Button>
            </Col>
        </Row>
        </>)
    }

    const tourism = props.tourism
    const {
        description,
        region_title, 
        region_description, 
        activity_description,
        roomCapacity,
    } = tourism

    const setRegionTitle = (value) => {
        const newTourism = {...tourism, region_title: value}
        setTourism(newTourism)
    }

    const setDescirption = (value) => {
        const newTourism = {...tourism, description: value}
        setTourism(newTourism)
    }

    const setRegionDescription = (value) => {
        const newTourism = {...tourism, region_description: value}
        setTourism(newTourism)
    }

    const setActivityDescription = (value) => {
        const newTourism = {...tourism, activity_description: value}
        setTourism(newTourism)
    }

    const setRoomCapacity = (value) => {
        const newTourism = {...tourism, roomCapacity: value}
        setTourism(newTourism)
    }

    const getImageNames = (picArray) =>{
        return(
          picArray.map((pic, i, arr) => {
            if(i+1===arr.length) return (pic)
            return(pic+", ")
        })
        )
      }

    const uploadImageHandler = (input, kind) => {
        if(typeof input.target.files[0] === "undefined"){
            //if pictures have been selected before but now no pictures have been selected
            //we have to restore the old strings of the original entity
        }else{
          if(kind === "titlePicture"){
            const newTourism = {...tourism, title_picture: input.target.files[0].name }
            setTourism(newTourism)
            setFilesToUpload(prevState =>
               [...prevState, input.target.files[0]]
            )
          }else {
            let counter = 0
            const pictureHelper = []
            const newRegionPictures = []
            while(input.target.files[counter]){
              pictureHelper.push(input.target.files[counter])
              newRegionPictures.push(input.target.files[counter].name)
              counter++
            }
            let newTourism =[]
            if(kind === "regionPictures"){
                newTourism = {...tourism, region_pictures: newRegionPictures }
            }else if(kind === "accomondationPictures"){
                newTourism = {...tourism, accomodation_pictures: newRegionPictures }
            }else{
                newTourism = {...tourism, activity_pictures: newRegionPictures }
            }
            setTourism(newTourism)
            setFilesToUpload(prevState => 
               [...prevState, ...pictureHelper]
            )
          }
        }
      }

    return (
        <Container>
            <Row className="mb-4">
                <Col>
                    <Form.Label className="dashboard__form-label">Region Title </Form.Label>
                    <Form.Control required placeholder="Region Title" type="string" value={region_title} onChange={event => setRegionTitle(event.target.value)} />
                    <Form.Control.Feedback type="invalid">Please name a region!</Form.Control.Feedback>
                </Col>
                <Col>
                    <Form.Label className="dashboard__form-label">Room Capacity</Form.Label>
                    <Form.Control required placeholder="Room Capacity" type="number"  value={roomCapacity} onChange={event => setRoomCapacity(event.target.value)} />
                    <Form.Control.Feedback type="invalid">Please Descripe your tourism!</Form.Control.Feedback>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col>
                    <Form.Label className="dashboard__form-label">Description</Form.Label>
                    <Form.Control required placeholder="Description" as="textarea" rows="8" value={description} onChange={event => setDescirption(event.target.value)} />
                    <Form.Control.Feedback type="invalid">Please Descripe your tourism!</Form.Control.Feedback>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col>
                    <Form.Label className="dashboard__form-label">Region Description</Form.Label>
                    <Form.Control required placeholder="Region description" as="textarea" rows="8" value={region_description} onChange={event => setRegionDescription(event.target.value)} />
                    <Form.Control.Feedback type="invalid">Please Descripe your Region!</Form.Control.Feedback>
                </Col>
                <Col>
                    <Form.Label className="dashboard__form-label">Activity Description</Form.Label>
                    <Form.Control required placeholder="Activitiy description" as="textarea" rows="8" value={activity_description} onChange={event => setActivityDescription(event.target.value)} />
                    <Form.Control.Feedback type="invalid">Please Descripe your Activities!</Form.Control.Feedback>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col>
                    <Form.Label className="dashboard__form-label">Title Picture</Form.Label>
                    Currently selected image: {tourism.title_picture}
                    <Form.Control type="file" required={tourism.title_picture==="none"} onChange={(e) => uploadImageHandler(e, "titlePicture")}/>
                </Col>
                <Col>
                    <Form.Label className="dashboard__form-label">Region Pictures</Form.Label>
                    Currently selected images: {getImageNames(tourism.region_pictures)}
                    <Form.Control type="file" required = {tourism.region_pictures.length<1} multiple onChange={(e) => uploadImageHandler(e, "regionPictures")}/>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col>
                    <Form.Label className="dashboard__form-label">Accomondation Pictures</Form.Label>
                    Currently selected images: {getImageNames(tourism.accomodation_pictures)}
                    <Form.Control type="file" required = {tourism.accomodation_pictures.length<1} multiple onChange={(e) => uploadImageHandler(e, "accomondationPictures")}/>
                </Col>
                <Col>
                    <Form.Label className="dashboard__form-label">Activity Pictures </Form.Label>
                    Currently selected images: {getImageNames(tourism.activity_pictures)}
                    <Form.Control type="file" required = {tourism.activity_pictures.length<1} multiple onChange={(e) => uploadImageHandler(e, "activityPictures")}/>
                </Col>
            </Row>
        </Container>
    )
}

export default Tourism