import React, { Component } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
export default class DBTPieChart extends Component {
	constructor(props) {
		super(props)

		this.state = {
			districtName: "",
			districtCode: "",
			total: 0,
			g_other: 0,
			male: 0,
			female: 0,
			c_others: 0,
			c_other: 0,
			sc: 0,
			st: 0
		}
	}

	componentDidMount() {
		this.getCategoryApplicationCount();
	}
	getCategoryApplicationCount() {
		// http://gis.mahapocra.gov.in/dashboard_testing_api_2020_12_22/meta/dbt_data?dist_code=501
		let initialActivity = [];
		var districtName, total, g_other, c_other, c_others, sc, st, male, female, districtCode;
		fetch('http://gis.mahapocra.gov.in/dashboard_testing_api_2020_12_22/meta/dbt_data?dist_code=501')
			.then(response => {
				return response.json();
			}).then(data => {

				initialActivity = data.dbt_data.map((farmers) => {
					// 	console.log(data)
					c_other = farmers.c_others;

					districtName = farmers.district;
					districtCode = farmers.dtncode;

					total = parseFloat(farmers.total);

					g_other = parseFloat(farmers.g_other);
					male = parseFloat(farmers.male);
					female = parseFloat(farmers.female);

					c_others = parseFloat(farmers.c_others);
					sc = parseFloat(farmers.sc);
					st = parseFloat(farmers.st);
				});

				this.setState({
					districtName: districtName,
					districtCode: districtCode,
					total: total,
					g_other: g_other,
					male: male,
					female: female,
					c_others: c_others,
					c_other: c_other,
					sc: sc,
					st: st
				});

			});
	}
	render() {
		console.log(this.state.male)
		const options = {

			chart: {
				plotBackgroundColor: "#ebebe0",
				plotBorderWidth: "#8c8c5a",
				plotShadow: true,
				type: 'pie',
				margin: 0,
				padding: 0,
				height: '50%'
			},
			title: {
				style: {
					color: '#FF0000',
					fontWeight: 'bold'
				},
				text: ''
			},
			subtitle: {
				style: {
					fontWeight: 'bold'
				},
				text: 'District : ' + this.state.districtName +
					"<br/>Total Application recieved : " + this.state.total
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			},
			accessibility: {
				point: {
					valueSuffix: ''
				}
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					size: '30%',
					height: '30%',
					allowPointSelect: true,
					cursor: 'pointer',
					// colors: pieColors,
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.percentage:.1f}'
					},
					showInLegend: true
				}
			},
			series: [{
				name: 'Total',
				colorByPoint: true,
				data: [
					{
						name: 'Male',
						y: this.state.male,
						color: '#22A8DB',
					},
					{
						name: 'Female',
						y: this.state.female,
						color: '#FC0F3A'
					},
					{ name: 'Other', y: this.state.g_other }
				]
			}]
		};
		return (
			<div>
				<HighchartsReact highcharts={Highcharts} options={options} />
			</div>
		)
	}
}
