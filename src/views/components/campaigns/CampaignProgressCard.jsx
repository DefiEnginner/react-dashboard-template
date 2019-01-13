import React from "react";
import { Card, CardHeader, CardBody, CardFooter, CardTitle } from "reactstrap";
import { Doughnut } from "react-chartjs-2";
import { chartExample5 } from "variables/charts.jsx";

const CampaignProgressCard = props => {
  const { doneSeqs, totalSeqs } = props;
  return (
    <Card className="camp-dash-progress">
      <CardHeader>
        <CardTitle>Progress</CardTitle>
        <p className="card-category">Total sequence actions</p>
      </CardHeader>
      <CardBody>
        <Doughnut
          // data={chartExample5.data}
          data={{
            labels: [1, 2],
            datasets: [
              {
                ...chartExample5.data.datasets[0],
                data: [doneSeqs, totalSeqs - doneSeqs]
              }
            ]
          }}
          options={{
            ...chartExample5.options,
            elements: {
              center: {
                ...chartExample5.options.elements.center,
                text: `${((totalSeqs ? doneSeqs / totalSeqs : 0) * 100).toFixed(
                  2
                )}%`
              }
            }
          }}
          className="ct-chart ct-perfect-fourth"
          height={300}
          width={456}
          cutoutPercentage={10}
        />
      </CardBody>
      <CardFooter>
        <div className="legend">
          <i className="fa fa-circle text-info" />
          Completed ({`${doneSeqs}/${totalSeqs}`})
        </div>
        {/*<hr />
        <div className="stats">
          <i className="fa fa-clock-o" />
          Updated 1 hour ago
        </div>*/}
      </CardFooter>
    </Card>
  );
};

export default CampaignProgressCard;
