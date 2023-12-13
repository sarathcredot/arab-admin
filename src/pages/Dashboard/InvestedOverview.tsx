import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Col, Card, CardBody, Row } from "reactstrap";
import { createSelector } from "reselect";
import { getInvestedOverview } from "src/store/actions";

const InvestedOverview = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState("AP");

  const onSelectData = (data: any) => {
    setState(data);
    dispatch(getInvestedOverview(data));
  };

  useEffect(() => {
    dispatch(getInvestedOverview("AP"));
  }, []);

  const investData = createSelector(

    (state: any) => state.dashboard,
    (state) => ({
      InvestedData: state.InvestedData,
    })
  );
  // Inside your component
  const { InvestedData } = useSelector(investData);

  const radialchartColors = ["#5156be", "#34c38f"];

  const options: Object = {
    chart: {
      height: 270,
      type: "radialBar",
      offsetY: -10,
    },
    plotOptions: {
      radialBar: {
        startAngle: -130,
        endAngle: 130,
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: 10,
            fontSize: "18px",
            color: undefined,
            formatter: function (val: any) {
              return val + "%";
            },
          },
        },
      },
    },
    colors: [radialchartColors[0]],
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        gradientToColors: [radialchartColors[1]],
        shadeIntensity: 0.15,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [20, 60],
      },
    },
    stroke: {
      dashArray: 4,
    },
    legend: {
      show: false,
    },
    labels: ["Series A"],
  };

  return (
    <React.Fragment>
      <Col xl={8}>
        <Card className="card-h-100">
          <CardBody>
            <div className="d-flex flex-wrap align-items-center mb-4 p-0">
              <h5 className="card-title me-2">Invested Overview</h5>
              <div className="ms-auto">
                <select
                  className="form-select form-select-sm"
                  onChange={(e: any) => onSelectData(e.target.value)}
                >
                  <option value="AP">April</option>
                  <option value="MA">March</option>
                  <option value="FE">February</option>
                  <option value="JA">January</option>
                  <option value="DE">December</option>
                </select>
              </div>
            </div>

            <Row className="align-items-center">
              <div className="col-sm">
                <div id="invested-overview" className="apex-charts">
                  <ReactApexChart
                    options={options}
                    series={InvestedData.data || []}
                    type="radialBar"
                    height="263"
                    className="apex-charts"
                  />
                </div>
              </div>
              <div className="col-sm align-self-center">
                <div className="mt-4 mt-sm-0">
                  <p className="mb-1">Invested Amount</p>
                  <h4>$ 6134.39</h4>

                  <p className="text-muted mb-4">
                    {" "}
                    + 0.0012.23 ( 0.2 % ){" "}
                    <i className="mdi mdi-arrow-up ms-1 text-success"></i>
                  </p>

                  <Row className="g-0">
                    <Col xs={6}>
                      <div>
                        <p className="mb-2 text-muted text-uppercase font-size-11">
                          Income
                        </p>
                        <h5 className="fw-medium">$ 2632.46</h5>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div>
                        <p className="mb-2 text-muted text-uppercase font-size-11">
                          Expenses
                        </p>
                        <h5 className="fw-medium">-$ 924.38</h5>
                      </div>
                    </Col>
                  </Row>

                  <div className="mt-2">
                    <Link to="/email-inbox" className="btn btn-primary btn-sm">
                      View more <i className="mdi mdi-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default InvestedOverview;
