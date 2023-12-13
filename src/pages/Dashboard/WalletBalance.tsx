import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, Col, Row } from "reactstrap";
import { createSelector } from "reselect";
import { getWalletBalance } from "src/store/actions";

const WalletBalance = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState<any>("ALL");

  const onChangehandle = (data: any) => {
    setState(data);
    dispatch(getWalletBalance(data));
  };

  const walletData = createSelector(

    (state: any) => state.dashboard,
    (state) => ({
      WallentBalanceData: state.WallentBalanceData,
    })
  );
  // Inside your component
  const { WallentBalanceData } = useSelector(walletData);

  useEffect(() => {
    dispatch(getWalletBalance(state));
  }, [state]);

  useEffect(() => {
    dispatch(getWalletBalance(state));
  }, [dispatch]);

  const piechartColors = ["#777aca", "#5156be", "#a8aada"];
  const options: Object = {
    chart: {
      width: 227,
      height: 227,
      type: "pie",
    },
    labels: ["Ethereum", "Bitcoin", "Litecoin"],
    colors: piechartColors,
    stroke: {
      width: 0,
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  return (
    <React.Fragment>
      <Col xl={5}>
        <Card className="card-h-100">
          <CardBody>
            <div className="d-flex flex-wrap align-items-center mb-4">
              <h5 className="card-title me-2">Wallet Balance</h5>
              <div className="ms-auto">
                <div>
                  <button
                    type="button"
                    className="btn btn-soft-primary btn-sm"
                    onClick={() => onChangehandle("ALL")}
                  >
                    ALL
                  </button>{" "}
                  <button
                    type="button"
                    className="btn btn-soft-secondary btn-sm"
                    onClick={() => onChangehandle("1M")}
                  >
                    1M
                  </button>{" "}
                  <button
                    type="button"
                    className="btn btn-soft-secondary btn-sm"
                    onClick={() => onChangehandle("6M")}
                  >
                    6M
                  </button>{" "}
                  <button
                    type="button"
                    className="btn btn-soft-secondary btn-sm"
                    onClick={() => onChangehandle("1Y")}
                  >
                    1Y
                  </button>
                </div>
              </div>
            </div>

            <Row className="align-items-center">
              <div className="col-sm">
                <div id="wallet-balance" className="apex-charts">
                  <ReactApexChart
                    options={options}
                    series={WallentBalanceData.data || []}
                    type="pie"
                    height="227"
                  />
                </div>
              </div>
              <div className="col-sm align-self-center">
                <div className="mt-4 mt-sm-0">
                  <div>
                    <p className="mb-2">
                      <i className="mdi mdi-circle align-middle font-size-10 me-2 text-success"></i>{" "}
                      Bitcoin
                    </p>
                    <h6>
                      0.4412 BTC ={" "}
                      <span className="text-muted font-size-14 fw-normal">
                        $ 4025.32
                      </span>
                    </h6>
                  </div>

                  <div className="mt-4 pt-2">
                    <p className="mb-2">
                      <i className="mdi mdi-circle align-middle font-size-10 me-2 text-primary"></i>{" "}
                      Ethereum
                    </p>
                    <h6>
                      4.5701 ETH ={" "}
                      <span className="text-muted font-size-14 fw-normal">
                        $ 1123.64
                      </span>
                    </h6>
                  </div>

                  <div className="mt-4 pt-2">
                    <p className="mb-2">
                      <i className="mdi mdi-circle align-middle font-size-10 me-2 text-info"></i>{" "}
                      Litecoin
                    </p>
                    <h6>
                      35.3811 LTC ={" "}
                      <span className="text-muted font-size-14 fw-normal">
                        $ 2263.09
                      </span>
                    </h6>
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

export default WalletBalance;
