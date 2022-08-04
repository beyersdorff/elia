import React from 'react';
import xIcon from '../../../assets/icons/x-white.svg';

// bootstrap components
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//Context
import { useUser, useUserUpdate } from '../../../contexts/user';


const ReviewsList = (props) => {
    const reviews = props.reviews
    const setReviews = props.setReviews
    const user = useUser()

    const removeReview = (review) => {
        let filteredArr = reviews.filter((el) => el._id !== review._id);
        setReviews(filteredArr);
      };

    return(
        <>
        <ul className="list-group">
          <div className="Gruppe">  <h5 className="card-title">All Reviews</h5></div>
          {reviews.map((review) =>{
            const {stars, author, description} = review;
            return(
              <>
                <li className="list-group-item">
                  <Row className="mb-4">
                    <Col>
                      <Form.Control  className = {""} placeholder="" type="text" value = {stars} disabled/>
                    </Col>
                    <Col>
                      <Form.Control requird className = {""} placeholder="" type="text" value = {author} disabled/>
                    </Col>
                  </Row>
                  <Row className="mb-4">
                    <Col>
                      <Form.Control className = {""} placeholder="" type="text" value = {description} disabled/>
                    </Col>
                  </Row>
                  {user.role ==="admin" &&
                    <Row className="mb-1 align-items-center">
                      <Col className = "col-10 text-end">
                        <div className="shopping-cart__item-label">
                        Delete Review
                        </div>
                      </Col>
                      <Col className = "col-2 ">
                        <Button  variant="danger" onClick = {() => removeReview(review)}>
                          <img src={xIcon} alt="Remove icon" width="20" height="20" />
                        </Button>
                      </Col>
                    </Row>
                  }
                </li>
              </>
            )
          })}
        </ul>
    </>)
}

export default ReviewsList;