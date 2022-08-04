// Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

// Icon
import { IconContext } from "react-icons";
import { BsFillXCircleFill, BsCheckCircleFill } from 'react-icons/bs';
import ApiService from '../../../services/Api.service';

//Context
import { useUser } from '../../../contexts/user';
import BookingInfo from './BookingInfo';

const OpenBookingItem = (props) => {
    //Context
    const user = useUser()

    const declineRequest = () => {
        ApiService.httpDelete(`farmer/dashboard/agritourism/${user._id}/${props.booking._id}`, user.token)
          .then(res => {
            props.setSortedRequests(res.data.bookingRequests)
          })
          .catch(err => {
            console.error(err)
          })
    }

    const acceptRequest = () => {
        ApiService.httpPut(`farmer/dashboard/agritourism/${user._id}/${props.booking._id}`, {}, user.token)
          .then(res => {
            props.setSortedRequests(res.data.bookingRequests)
          })
          .catch(err => {
            console.error(err)
          })
    }

    return (
        <Container className='border-bottom pb-4 mt-4'>
            <Row className="align-items-center">
                <BookingInfo booking={props.booking}/>
                <Col lg="1" className="dashboard__agritourism-accept">
                    <Button onClick={acceptRequest}>
                        <IconContext.Provider value={{ size: "1.5rem" }}>
                            <BsCheckCircleFill/>
                        </IconContext.Provider>
                    </Button>
                </Col>
                <Col lg="1" className="dashboard__agritourism-decline">
                    <Button onClick={declineRequest}  variant="danger">
                        <IconContext.Provider value={{ size: "1.5rem" }}>
                            <BsFillXCircleFill/>
                        </IconContext.Provider>
                    </Button>
                </Col>
            </Row>
        </Container>
    )
}

export default OpenBookingItem;