import React, { Component } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'




export default class FarmerFPCChart extends Component {
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
		// this.getFarmerActivity();
	}

	getFarmerActivity() {
		let initialActivity = [];
		let activityGroupName = [], totalAmountDisbursed = [], totalNoOfApplications = [], totalNoOfDisbursement = [], totalNoOfPreSanction = [];
		fetch('http://gis.mahapocra.gov.in/dashboard_testing_api_2020_12_22/meta/dbtActivityMaster?activity=' + this.props.chartProps.activity)
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
				plotBackgroundColor: '#afa',
				plotBorderColor: '#f0f',
				plotBorderWidth: 2,
				plotShadow: false,
				type: 'pie'
			},
			title: {
				text: 'Browser market shares in January, 2018'
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			},
			accessibility: {
				point: {
					valueSuffix: '%'
				}
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: false
					},
					showInLegend: true
				}
			},
			series: [{
				name: 'Brands',
				colorByPoint: true,
				data: [{
					name: 'Chrome',
					y: 61.41,
					sliced: true,
					selected: true
				}, {
					name: 'Internet Explorer',
					y: 11.84
				}, {
					name: 'Firefox',
					y: 10.85
				}, {
					name: 'Edge',
					y: 4.67
				}, {
					name: 'Safari',
					y: 4.18
				}, {
					name: 'Other',
					y: 7.05
				}]
			}]
		};
		return (
			<div >
				<HighchartsReact highcharts={Highcharts} options={options} style={{height:"100px"}} />
			</div>
		)
	}
}
