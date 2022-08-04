import React, { useState } from "react";
import ReactStars from "react-rating-stars-component";
import moment from 'moment';

// service
import ApiService from '../../services/Api.service'

// assets
import star from '../../assets/icons/star.svg';
import starFilled from '../../assets/icons/star-filled.svg';
import blankProfile from '../../assets/images/blank-profile.png';

// bootstrap components
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const initialFormState = {
  author: '',
  stars: '',
  message: '',
  picture: null
};

const mountedStyle = {
  animation: "inFormAnimation 500ms ease-in"
};
const unmountedStyle = {
  animation: "outFormAnimation 500ms ease-out",
  animationFillMode: "forwards"
};

const Reviews = ({id, reviews, setReviews}) => {
  const productID = id;
  const [reviewFormValidated, setReviewFormValidated] = useState(false);
  const [formIsOpen, setFormOpen] = useState(false);
  const [formIsSent, setFormIsSent] = useState(false);
  const [reviewValues, setReviewValues] = useState({
    ...initialFormState
  });

  const openForm = () => {
    setFormOpen(true);
    // const anchor = document.querySelector('#reviewAnchor');
    // anchor.scrollIntoView( { behavior: 'smooth', block: 'start' } );
  }

  const handleAuthorInputChange = (event) => {
    event.persist();
    setReviewValues((reviewValues) => ({
      ...reviewValues,
      author: event.target.value,
    }));
  };

  const handleRatingChange = (rating) => {
    setReviewValues((reviewValues) => ({
      ...reviewValues,
      stars: rating,
    }));
  };

  const handleMessageInputChange = (event) => {
    event.persist();
    setReviewValues((reviewValues) => ({
      ...reviewValues,
      message: event.target.value,
    }));
  };

  const handleFileChange = (event) => {
    event.persist();
    setReviewValues((reviewValues) => ({
      ...reviewValues,
      picture: event.target.files[0],
    }));
  }

  const handleCreateReview = () => {
    const review = {
      author: reviewValues.author,
      stars: reviewValues.stars,
      description: reviewValues.message,
      picture: reviewValues.picture ? reviewValues.picture.name : ""
    }

    ApiService.httpPost(`product/${productID}/reviews`, review)
    .then(res => {
      if (res.data.success){
        setReviewValues(initialFormState)
        setReviewFormValidated(false)
        setReviews([...reviews, review])
        setFormOpen(false)
        setFormIsSent(true)
      }
    })
    .catch(err => {
      console.error(err)
    })
  }

  const handleReviewSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      if (reviewValues.picture) {
        let formData = new FormData()
        formData.append('file', reviewValues.picture)

        ApiService.httpPostFile('upload', formData)
        .then(res => {
          handleCreateReview()
        })
        .catch(err => {
          console.error(err)
        })
      } else {
        handleCreateReview()
      }
    }
    setReviewFormValidated(true);
  };

  return (
    <div id="reviewAnchor">
      <div className="product__review">
        <h2 className="product__review-title pt-5">Reviews</h2>
        {
          reviews.map((item, key) => (
            <Row className="align-items-center mb-3" key={key}>
              <Col className="col-auto">
                <div className="product__review-image">
                  {item.picture
                    ? <img src={"http://localhost:4200/uploads/"+item.picture} alt="User Image" />
                    : <img src={blankProfile} alt="Blank Profile" />
                  }
                </div>
              </Col>
              <Col>
                <div className="product__review-reating">
                  <ReactStars
                    value={item.stars}
                    size={24}
                    isHalf={true}
                    activeColor="#BBCC44"
                    edit={false}
                  />
                </div>
                <div className="product__review-date">
                  { moment(item.createdAt).format("MMMM, YYYY") }
                </div>
                <div className="product__review-text">
                  { item.description }
                </div>
              </Col>
            </Row>
          ))
        }
      </div>

      { reviews.length == 0 &&
        <div className="mb-2">
          No reviews have been written yet. Be the first
        </div>
      }

      { !formIsOpen && !formIsSent &&
      <div className="product__review-toggle" onClick={ openForm }>
        Write a review
      </div>
      }
      { formIsSent &&
      <div className="text-success fw-bold">
        Thank you for your review.
      </div>
      }
      { formIsOpen &&
        <Form noValidate validated={reviewFormValidated} onSubmit={handleReviewSubmit} className="mt-4" style={formIsOpen ? mountedStyle : unmountedStyle}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control required type="text" onChange={handleAuthorInputChange} value={reviewValues.author} name="author" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} name="picture" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Rating</Form.Label>
            <ReactStars
              count={5}
              onChange={handleRatingChange}
              isHalf={true}
              size={24}
              emptyIcon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#BBCC44" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>}
              fullIcon={starFilled}
              activeColor="#BBCC44"
            />
          </Form.Group>
          <Form.Group className="mt-3 mb-3">
            <Form.Label>Message</Form.Label>
            <Form.Control
              required
              name="message"
              as="textarea"
              onChange={handleMessageInputChange}
              value={reviewValues.message}
              style={{ height: '100px' }}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit rating
          </Button>
        </Form>
      }
    </div>
  )
}

export default Reviews;