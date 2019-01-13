import React from "react";
import { Card, CardBody, CardFooter, CardTitle, Col, Row } from "reactstrap";

const CampaignConnectionCard = props => {
  const { title, number, logo } = props;
  return (
    <Card className="card-stats">
      <CardBody>
        <Row>
          <Col md="3" xs="5">
            <div className="icon-big text-center">
              <i className={logo} />
            </div>
          </Col>
          <Col md="9" xs="7">
            <div className="numbers">
              <p className="card-category">{title}</p>
              <CardTitle tag="p">{number}</CardTitle>
              <p />
            </div>
          </Col>
        </Row>
      </CardBody>
      <CardFooter>
        {/* <hr />
        <div className="stats">
          <i className={descrIcon} />
          {descrText}
        </div>*/}
      </CardFooter>
    </Card>
  );
};

export default CampaignConnectionCard;
