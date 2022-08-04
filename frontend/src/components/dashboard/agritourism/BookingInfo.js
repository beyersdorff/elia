import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const BookingInfo = (props) => {
    const startDate = new Date(props.booking.startDate)
    const endDate = new Date(props.booking.endDate)

    return (
        <Col>
            <Row>
                <Col>
                    <h4>{startDate.getDate()}.{startDate.getMonth() + 1}.{startDate.getFullYear()} - {endDate.getDate()}.{endDate.getMonth() + 1}.{endDate.getFullYear()}</h4>
                </Col>
            </Row>
            <Row>
                <Col>
                    <b>Name:</b> {props.booking.firstName} {props.booking.lastName}
                </Col>
            </Row>
            <Row>
                <Col>
                    <b>E-Mail:</b> {props.booking.email}
                </Col>
            </Row>
            <Row>
                <Col>
                    <b>Rooms:</b> {props.booking.numberRooms}
                </Col>
                <Col>
                    <b>Persons:</b> {props.booking.numberPeople}
                </Col>
            </Row>
            <Row>
                <Col>
                    <b>Intro-Text:</b> {props.booking.introText}
                </Col>
            </Row>
        </Col>
    )
}

export default BookingInfo;