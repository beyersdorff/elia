import React from "react";

// assets
import filterIcon from "../../assets/icons/filter.svg";

// bootstrap components
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const Filter = ({ filterState, setFilterState, clearFilters, filterFromDB }) => {

  return (
    <Col xs={12} lg={3} className="mb-4 mb-lg-0">
      <div className="filter p-4">
        <Row className="align-items-center mb-3">
          <Col>
            <h3>
              <img src={filterIcon} alt="Filter icon" width="22" height="22" className="pb-1 me-2" />
              Filter
            </h3>
          </Col>
          <Col>
            <Button
                className="btn-sm float-end"
                variant="outline-primary"
                onClick={clearFilters}
              >
                Clear
              </Button>
          </Col>
        </Row>

        <h6>Filtration</h6>

        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="filtrated"
            checked={filterState?.filtrated}
            onChange={() => setFilterState((preState) => ({ ...preState, filtrated: !filterState?.filtrated }))}
          ></input>
          <label className="filter__label" htmlFor="filtrated">
            Filtrated
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="unfiltrated"
            checked={filterState?.unfiltrated}
            onChange={() => setFilterState((preState) => ({ ...preState, unfiltrated: !filterState?.unfiltrated }))}
          ></input>
          <label className="filter__label" htmlFor="unfiltrated">
            Unfiltrated
          </label>
        </div>
        <hr></hr>
        <div className="mt-3">
          <h6>Variety</h6>
        </div>

        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="mono"
            checked={filterState?.mono}
            onChange={() => setFilterState((preState) => ({ ...preState, mono: !filterState?.mono }))}
          ></input>
          <label className="filter__label" htmlFor="mono">
            Monovariate
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="multi"
            checked={filterState?.multi}
            onChange={() => setFilterState((preState) => ({ ...preState, multi: !filterState?.multi }))}
          ></input>
          <label className="filter__label" htmlFor="multi">
            Multivariate
          </label>
        </div>
        <hr></hr>
        <div className="mt-3">
          <h6>Date of harvest</h6>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="october"
            checked={filterState?.october}
            onChange={() => setFilterState((preState) => ({ ...preState, october: !filterState?.october }))}
          ></input>
          <label className="filter__label" htmlFor="october">
            October
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="november"
            checked={filterState?.november}
            onChange={() => setFilterState((preState) => ({ ...preState, november: !filterState?.november }))}
          ></input>
          <label className="filter__label" htmlFor="november">
            November
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="december"
            checked={filterState?.december}
            onChange={() => setFilterState((preState) => ({ ...preState, december: !filterState?.december }))}
          ></input>
          <label className="filter__label" htmlFor="december">
            December
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="january"
            checked={filterState?.january}
            onChange={() => setFilterState((preState) => ({ ...preState, january: !filterState?.january }))}
          ></input>
          <label className="filter__label" htmlFor="january">
            January
          </label>
        </div>
        <hr></hr>
        <div className="mt-3">
          <h6>Harvesting height</h6>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="low"
            checked={filterState?.low}
            onChange={() => setFilterState((preState) => ({ ...preState, low: !filterState?.low }))}
          ></input>
          <label className="filter__label" htmlFor="low">
            0m-500m
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="middle"
            checked={filterState?.middle}
            onChange={() => setFilterState((preState) => ({ ...preState, middle: !filterState?.middle }))}
          ></input>
          <label className="filter__label" htmlFor="middle">
            501m-1000m
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="high"
            checked={filterState?.high}
            onChange={() => setFilterState((preState) => ({ ...preState, high: !filterState?.high }))}
          ></input>
          <label className="filter__label" htmlFor="high">
            1001m-1500m
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="rest"
            checked={filterState?.rest}
            onChange={() => setFilterState((preState) => ({ ...preState, rest: !filterState?.rest }))}
          ></input>
          <label className="filter__label" htmlFor="rest">
            >1500m
          </label>
        </div>
        <hr></hr>
        <div className="mt-3">
          <h6>Stock</h6>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="available"
            checked={filterState?.available}
            onChange={() => setFilterState((preState) => ({ ...preState, available: !filterState?.available }))}
          ></input>
          <label className="filter__label" htmlFor="available">
            in stock
          </label>
        </div>

        <Button className="mt-4" onClick={filterFromDB}>
          Apply
        </Button>
      </div>
    </Col>
  )}

export default Filter;