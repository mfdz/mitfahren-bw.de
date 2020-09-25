import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

const SavedRow = ({ from, to, date, time, passengerNumber }) => {
  return (
    <tr className="saved-search-row">
      <td className="saved-search-data text-center">
        {moment.unix(date).format('DD.MM.YYYY')}
      </td>
      <td className="saved-search-data text-center">
        {moment.unix(time).format('hh:mm')}
      </td>
      <td className="saved-search-data">{from}</td>
      <td className="saved-search-data">{to}</td>
      {passengerNumber !== 0 && (
        <td className="saved-search-data text-center">{passengerNumber}</td>
      )}
    </tr>
  );
};

SavedRow.propTypes = {
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  date: PropTypes.number.isRequired,
  time: PropTypes.number.isRequired,
  passengerNumber: PropTypes.number,
};

SavedRow.defaultProps = {
  passengerNumber: 0,
};

SavedRow.contextTypes = {
  config: PropTypes.object,
};

export default SavedRow;