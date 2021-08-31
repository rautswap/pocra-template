import React, { Component } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'








export default class FarmerBarChart extends Component {
	constructor(props) {
		super(props)
		this.state = {
			ActivityGroupName: [],
			TotalAmountDisbursed: [],
			TotalNoOfApplications: [],
			TotalNoOfDisbursement: [],
			TotalNoOfPreSanction: []
		}
	}

	componentDidMount() {
		this.getFarmerActivity();
	}

	getFarmerActivity() {
		let initialActivity = [];
		let activityGroupName = [], totalAmountDisbursed = [], totalNoOfApplications = [], totalNoOfDisbursement = [], totalNoOfPreSanction = [];
		fetch('http://gis.mahapocra.gov.in/dashboard_testing_api_2020_12_22/meta/dbtActivityMaster?activity=Farmer')
			.then(response => {
				return response.json();
			}).then(data => {
				// console.log(data)
				initialActivity = data.activity.map((farmers) => {
					activityGroupName.push(farmers.ActivityGroupName);
					totalAmountDisbursed.push(farmers.TotalAmountDisbursed);
					totalNoOfApplications.push(farmers.TotalNoOfApplications);
					totalNoOfDisbursement.push(farmers.TotalNoOfDisbursement);
					totalNoOfPreSanction.push(farmers.TotalNoOfPreSanction);
				});

				this.setState({
					ActivityGroupName: activityGroupName,
					TotalAmountDisbursed: totalAmountDisbursed,
					TotalNoOfApplications: totalNoOfApplications,
					TotalNoOfDisbursement: totalNoOfDisbursement,
					TotalNoOfPreSanction: totalNoOfPreSanction
				});

			});


	}

	render() {

		const options = {

			chart: {
				type: 'column'
			},
			title: {
				text: 'Farmer Activity Report'
			},
			subtitle: {
				text: 'No of Applications'
			},
			xAxis: {
				categories: this.state.ActivityGroupName,
				crosshair: true
			},
			yAxis: {
				min: 0,
				title: {
					text: 'Count'
				}
			},
			tooltip: {
				headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
				pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
					'<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
				footerFormat: '</table>',
				shared: true,
				useHTML: true
			},
			plotOptions: {
				column: {
					pointPadding: 0.2,
					borderWidth: 0
				}
			},
			series: [ {
				name: 'Total No Of Applications',
				data:this.state.TotalNoOfApplications

			}, {
				name: 'Total No Of Disbursement',
				data: this.state.TotalNoOfDisbursement

			}, {
				name: 'Total No Of PreSanction',
				data: this.state.TotalNoOfPreSanction

			}]
		};
		return (
			<div >
				<HighchartsReact highcharts={Highcharts} options={options} />
			</div>
		)
	}
}
