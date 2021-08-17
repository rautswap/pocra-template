import React from 'react'

import Moment from 'moment';

const ForecastLabel = (props) => {
	console.log(props)
	return (
		<>
			<div className="col-sm-6">
				<label style={{ paddingTop: 9, color: "rgb(248, 112, 33)" }}>IMD Weather Forecast (  {Moment().format('DD-MM-YYYY')} - {Moment(props.forecastdata.maxdate).format('DD-MM-YYYY')} )</label>
			</div>
		</>
	)
}
export default ForecastLabel;