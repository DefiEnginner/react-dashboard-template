// Sequence Page

import React from "react";
import SequenceManager from "./SequenceManager";
import SequenceAddEditPage from "./SequenceAddEditViewPage";

const SequencePage = props => {
  const { identifier } = props.match.params;
  return identifier ? (
    <SequenceAddEditPage {...props} />
  ) : (
    <SequenceManager {...props} />
  );
};

export default SequencePage;
