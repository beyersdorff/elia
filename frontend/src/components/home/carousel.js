import React from "react";

// keen slider
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'

// bootstrap components
import Container from 'react-bootstrap/Container';

// assets
import greece from "../../assets/images/regions/greece.png";
import centralWest from "../../assets/images/regions/central-west.png";
import crete from "../../assets/images/regions/crete.png";
import epirus from "../../assets/images/regions/epirus.png";
import peloponnese from "../../assets/images/regions/peloponnese.png";
import thessaly from "../../assets/images/regions/thessaly.png";
import thrace from "../../assets/images/regions/thrace.png";
import macedonia from "../../assets/images/regions/macedonia.png";
import attica from "../../assets/images/regions/attica.png";

const Carousel = ({ region, setRegion }) => {

  const [sliderRef] = useKeenSlider({
    breakpoints: {
      "(min-width: 400px)": {
        slides: { perView: 4, spacing: 5 },
      },
      "(min-width: 768px)": {
        slides: { perView: 5, spacing: 5 },
      },
      "(min-width: 1200px)": {
        slides: { perView: 9, spacing: 10 },
      },
    },
    slides: { perView: 3 },
  })

  return (
    <Container>
      <div ref={sliderRef} className="keen-slider">
        <div className={`keen-slider__slide ${region == undefined ? "active" : ""}`}
          onClick={() => setRegion(undefined)}
        >
          <img src={greece} className="keen-slider__image" width="50" height="50" alt="#" />
          Greece
        </div>

        <div className={`keen-slider__slide ${region == "Thrace" ? "active" : ""}`}
          onClick={() => setRegion("Thrace")}
        >
          <img src={thrace} className="keen-slider__image" width="50" height="50" alt="#" />
          Thrace
        </div>

        <div className={`keen-slider__slide ${region == "Macedonia" ? "active" : ""}`}
          onClick={() => setRegion("Macedonia")}
        >
          <img src={macedonia} className="keen-slider__image" width="50" height="50" alt="#" />
          Macedonia
        </div>

        <div className={`keen-slider__slide ${region == "Epirus" ? "active" : ""}`}
          onClick={() => setRegion("Epirus")}
        >
          <img src={epirus} className="keen-slider__image" width="50" height="50" alt="#" />
          Epirus
        </div>

        <div className={`keen-slider__slide ${region == "Thessaly" ? "active" : ""}`}
          onClick={() => setRegion("Thessaly")}
        >
          <img src={thessaly} className="keen-slider__image" width="50" height="50" alt="#" />
          Thessaly
        </div>

        <div className={`keen-slider__slide ${region == "West- & Middle" ? "active" : ""}`}
          onClick={() => setRegion("West- & Middle")}
        >
          <img src={centralWest} className="keen-slider__image" width="50" height="50" alt="#" />
          West- & Middle
        </div>

        <div className={`keen-slider__slide ${region == "Attica" ? "active" : ""}`}
          onClick={() => setRegion("Attica")}
        >
          <img src={attica} className="keen-slider__image" width="50" height="50" alt="#" />
          Attica
        </div>

        <div className={`keen-slider__slide ${region == "Peloponnese" ? "active" : ""}`}
          onClick={() => setRegion("Peloponnese")}
        >
          <img src={peloponnese} className="keen-slider__image" width="50" height="50" alt="#" />
          Peloponnese
        </div>

        <div className={`keen-slider__slide ${region == "Crete" ? "active" : ""}`}
          onClick={() => setRegion("Crete")}
        >
          <img src={crete} className="keen-slider__image" width="50" height="50" alt="#" />
          Crete
        </div>
      </div>
    </Container>
  )}

export default Carousel;