import React, { useState, useEffect } from "react";
import ReactStars from "react-rating-stars-component";
import { useNavigate } from "react-router-dom";

// assets
import geo from "../../assets/icons/geo-alt.svg";
import star from "../../assets/icons/star.svg";

// bootstrap components
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

// components
import Carousel from './carousel.js';
import Filter from './filter.js';

// service
import ApiService from "../../services/Api.service";

const initialFilterState = {
  filtrated: false,
  unfiltrated: false,
  mono: false,
  multi: false,
  october: false,
  november: false,
  december: false,
  january: false,
  low: false,
  middle: false,
  high: false,
  rest: false,
  available: false,
  unavailable: false,
};

const Home = () => {
  const [ShownData, setShownData] = useState([]); //das, was aktuell angezeigt wird
  const [BaseData, setBaseData] = useState([]); //BaseData, alles was in der DB ist, das was gefiltert wird wenn man 'von null' anfangen will

  // UseSates for the checkboxes, boolean value just describes if checked (true) or not (false)
  //... operator is destructing the array and feeding the elements
  const [filterState, setFilterState] = useState({...initialFilterState});

  //region
  const [region, setRegion] = useState(undefined);

  //Toggle
  const [clearFilterToggle, setClearFilterToggle] = useState(true);

  const navigate = useNavigate();

  //on Mount useEffect für BaseData
  useEffect(() => {
    ApiService.httpGet(`product/`)
      .then(res => {
        setBaseData(res.data.data);
        setShownData(res.data.data);
      })
      .catch(err => {
        console.error(err);
      })
  }, []);

  //FUNCTIONALITY:
  //1.: KLick auf Region ist DBFilter Call mit aktueller Checkbox auswahl //DONE
  //2.: Klick auf Anwenden ist derselbe Call //DONE
  //3.: ClearFilter cleart mur die Filter, nicht die region //DONE
  //4.: klick auf greece cleart implizit die region, führt filterDB aus mit region == undefined //DONE

  //useEffectHook für einen Change im als zweites Argument übergebenen parameter
  //dieser useffect wird aufgerufen wenn sich region ändert, d.h. wenn unten setRegion aufgerufen wird
  useEffect(() => {
    filterFromDB();
  }, [region, clearFilterToggle]);

  //if evaluates to true we are gonna keep the value
  const filterFromDB = () => {
    const result = BaseData.filter(checkRegion)
      .filter(checkFiltration)
      .filter(checkVariety)
      .filter(checkGrowthHeight)
      .filter(checkDate)
      .filter(checkStock);

    setShownData(result);
  };

  function checkRegion(product) {
    // default case for region = greece
    if (region === undefined) {
      return true;
    } else return product.region === region;
  }

  function checkFiltration(product) {
    if (filterState.filtrated === filterState.unfiltrated) {
      return true;
    } else {
      if (filterState.filtrated) {
        if (product.filtration === filterState.filtrated) {
          return true;
        } else {
          return false;
        }
      }
      if (filterState.unfiltrated) {
        if (product.filtration === false) {
          return true;
        } else {
          return false;
        }
      }
    }
  }

  function checkVariety(product) {
    if (filterState.mono === filterState.multi) {
      return true;
    } else {
      if (filterState.mono) {
        if (product.variety === "Multi") {
          return false;
        } else {
          return true;
        }
      }
      if (filterState.multi) {
        if (product.variety === "Multi") {
          return true;
        } else {
          return false;
        }
      }
    }
  }

  function checkGrowthHeight(product) {
    if (filterState.low === filterState.middle && filterState.low === filterState.high && filterState.low === filterState.rest) {
      return true;
    } else {
      if (filterState.low) {
        if (product.growth_height >= 0 && product.growth_height <= 500) {
          return true;
        }
      }
      if (filterState.middle) {
        if (product.growth_height >= 501 && product.growth_height <= 1000) {
          return true;
        }
      }
      if (filterState.high) {
        if (product.growth_height >= 1001 && product.growth_height <= 1500) {
          return true;
        }
      }
      if (filterState.rest) {
        if (product.growth_height > 1500) {
          return true;
        }
      }
      return false;
    }
  }

  function checkDate(product) {
    const date = new Date(product.harvesting_date);
    if (filterState.october === filterState.november && filterState.october === filterState.december && filterState.october === filterState.january) {
      return true;
    } else {
      if (filterState.october) {
        if (date.getMonth() === 9) {
          return true;
        }
      }
      if (filterState.november) {
        if (date.getMonth() === 10) {
          return true;
        }
      }
      if (filterState.december) {
        if (date.getMonth() === 11) {
          return true;
        }
      }
      if (filterState.january) {
        if (date.getMonth() === 0) {
          return true;
        }
      }
      return false;
    }
  }

  function checkStock(product) {
    const availableBottles = product.stocks.filter(checkAvailability);

    if (filterState.available === filterState.unavailable) {
      return true;
    } else {
      if (filterState.available) {
        if (availableBottles.length >= 1) {
          return true;
        } else {
          return false;
        }
      }
      if (filterState.unavailable) {
        if (availableBottles.length >= 1) {
          return false;
        } else {
          return true;
        }
      }
    }
  }

  function checkAvailability(bottle) {
    if (bottle.available_bottles >= 1) {
      return true;
    } else {
      return false;
    }
  }

  function rating(reviews) {
    //extract stars property and make an array of star values
    const ratings = reviews.map(a => a.stars);
    return (
      ratings.length > 0 ? Math.round(ratings.reduce((partialSum, a) => partialSum + a, 0) / ratings.length * 10) / 10 : 0
    );
  }

  function calculateAvailability(stocks) {
    const bottles = stocks.map(a => a.available_bottles);

    const inventory = bottles.reduce((partialSum, a) => partialSum + a, 0);
    if (inventory <= 0) {
      return "Out of stock";
    } else if (inventory > 10) {
      return "Available";
    } else if (inventory === 1) {
      return "Only 1 bottle available!";
    } else {
      return "Just " + inventory + " bottles available";
    }
  }

  function lowestPrice(stocks) {
    const prices = stocks.map(a => a.price);
    return Math.min(...prices);
  }

  // clears the filters, (clear region works through the greece region button)
  const clearFilters = () => {
    setFilterState(initialFilterState);
    //toggle to trigger useEffect
    setClearFilterToggle(!clearFilterToggle);
  };

  //"https://i.postimg.cc/4xVY64PV/porto-timoni-double-beach-corfu-greece-700.jpg"

  //data.map((values)) wendet das return statement (also unsere Card-ification) auf alle einträge von data (unseren daten) an (data haben wir davor oben in der hook gesetzt)
  //  const {id, name,origin,image,rating,price,quantity} = values; lässt uns unsere attribute targeten
  return (
    <div>
      <Carousel region={region} setRegion={setRegion} />

      <Container className="mb-5">
        <Row>
          <Filter
            filterState={filterState}
            setFilterState={setFilterState}
            clearFilters={clearFilters}
            filterFromDB={filterFromDB}
          />

          <Col xs={12} lg={9}>
            <Row>

              {ShownData.length !== 0 ? ( 
                ShownData.map(item => {
                return (
                  <Col key={item._id} xs={12} md={6} lg={4}>
                    <div className="mb-3">
                      <img style={{ borderRadius: '6px'}} src={"http://localhost:4200/uploads/"+item?.picture} alt="#" />
                      <h5 className="mt-3" style={{ cursor: 'pointer' }} onClick={() => navigate("product/" + item?._id)}>
                        {item?.name}
                      </h5>
                      <div className="d-block my-3">
                        <img src={geo} className="pe-2" />
                        This olive oil is from {item?.region}.
                      </div>
                      <div className="d-block my-3">
                        <ReactStars
                          value={rating(item?.reviews)}
                          size={20}
                          isHalf={true}
                          edit={false}
                          activeColor="#BBCC44"
                        />
                      </div>
                      <div className={`d-block fw-bold my-3 ${calculateAvailability(item?.stocks) === "Out of stock" ? "text-danger" : ""}`} >
                        <small>
                          {calculateAvailability(item?.stocks)} - from{" "}
                          {lowestPrice(item?.stocks)}€
                        </small>
                      </div>
                      <Button
                        onClick={() => navigate("product/" + item?._id)}
                      >
                        Buy oil
                      </Button>
                    </div>
                  </Col>
                );
              })) :( <Row>
                <Col>
                  <div> We have no matching products for your filter query, sorry :(</div>
                </Col>
              </Row>)}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;