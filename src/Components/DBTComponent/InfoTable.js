import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery';
import './InfoTable.css'
class InfoTable extends Component {
	constructor(props) {
		super(props)


	}
	componentDidMount() {
		this.renderTableData();
	}


	renderTableData() {
		return this.props.tabdata.map((data, index) => {
			const { activity_group, no_of_application, no_of_paymentdone, no_of_registration } = data //destructuring
			return (
				<tr key={index}>
					<td>{activity_group}</td>
					<td>{no_of_registration}</td>
					<td>{no_of_application}</td>
					<td>{no_of_paymentdone}</td>
				</tr>
			)
		})
	}
	render() {
		return (
			<div className="container-fluid" >
				<div className="row" >
					<div className="col-12">
						{/* /.card */}
						<div className="card">
							<div className="card-header">
								<h3 className="card-title">Attribute Information</h3>
								<div className="card-tools">
									<button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus" /></button>
									{/* <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times" /></button> */}
								</div>
							</div>

							{/* /.card-header */}
							<div className="card-body" > 
								<table id="example" className="table table-bordered table-striped">
									<thead >
										<tr style={{fontSize:"10px" }}>
											<th>Activity Name</th>
											<th>Registrations</th>
											<th>Applications </th>
											<th>Disbursement </th>
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
		)
	}
}

export default InfoTable;
