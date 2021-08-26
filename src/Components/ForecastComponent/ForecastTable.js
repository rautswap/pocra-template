import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery';

import Moment from 'moment';
class ForecastTable extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: []

		}

	}
	componentDidMount() {
		this.getForecastData();
		// $(function () {
		// 	$("#example1").DataTable({
		// 		"responsive": true,
		// 		"autoWidth": false,
		// 	});
		// 	// $('#example2').DataTable({
		// 	//   "paging": true,
		// 	//   "lengthChange": false,
		// 	//   "searching": false,
		// 	//   "ordering": true,
		// 	//   "info": true,
		// 	//   "autoWidth": false,
		// 	//   "responsive": true,
		// 	// });
		// });
		$(document).ready(function () {
			setTimeout(function () {
				$('#example').DataTable();
			}, 1000);
		});
	}
	async getForecastData() {
		const response = fetch("http://gis.mahapocra.gov.in/dashboard_testing_api_2020_12_22/meta/todaysforecast")
			.then(response => response.json())
			.then(forecastdata => {
				this.setState(prev => ({
					data: forecastdata.forecast,

				}));
			});
	}


	renderTableData() {
		return this.state.data.map((student, index) => {
			const { dtnname, thnname, forecast_date, rainfall_mm, temp_min_deg_c, temp_max_deg_c, humidity_1, humidity_2, wind_speed_ms, wind_direction_deg, cloud_cover_octa } = student //destructuring
			return (
				<tr key={index}>
					<td>{dtnname}</td>
					<td>{thnname}</td>
					<td>{forecast_date}</td>
					<td>{rainfall_mm}</td>
					<td>{temp_min_deg_c}</td>
					<td>{temp_max_deg_c}</td>
					<td>{humidity_1}</td>
					<td>{humidity_2}</td>
					<td>{wind_speed_ms}</td>
					<td>{wind_direction_deg}</td>
					<td>{cloud_cover_octa}</td>

				</tr>
			)
		})
	}

	render() {
		return (
			<section className="content">
				<div className="container-fluid">
					<div className="row">
						<div className="col-12">
							{/* /.card */}
							<div className="card">
								<div className="card-header">
									<h3 className="card-title">Forecast Attribute information for date {Moment(this.props.todate).format('DD-MM-YYYY')}</h3>
								</div>
								{/* /.card-header */}
								<div className="card-body">
									<table id="example" className="table table-bordered table-striped">
										<thead>
											<tr >
												<th>District</th>
												<th>Taluka</th>
												<th>Forecast Date </th>
												<th>Rainfall (mm) </th>
												<th>Minimun Temprature (&#176;C) </th>
												<th>Maximum Temprature (&#176;C) </th>
												<th>Humidity 1 (%)</th>
												<th>Humidity 2 (%)</th>
												<th>Wind Speed (m/s)</th>
												<th>Wind Direction </th>
												<th>Cloud Cover</th>
											</tr>
										</thead>
										<tbody>
											{this.renderTableData()}
										</tbody>
									</table>
								</div>
								{/* /.card-body */}
							</div>
							{/* /.card */}
						</div>
						{/* /.col */}
					</div>
					{/* /.row */}
				</div>
				{/* /.container-fluid */}
			</section>		)
	}
}
export default ForecastTable;