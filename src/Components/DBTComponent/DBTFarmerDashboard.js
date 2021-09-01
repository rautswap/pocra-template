import React, { Component } from 'react'
import '../MapComponents/Map.css';
import "ol/ol.css";
import "ol-ext/dist/ol-ext.css";
import { Map, View } from "ol";
import Overlay from 'ol/Overlay';
import XYZ from 'ol/source/XYZ';
import { ScaleLine, MousePosition, defaults as defaultControls } from 'ol/control';
import { format } from 'ol/coordinate';
import { transform } from 'ol/proj';
import { Image as ImageLayer, Tile as TileLayer } from 'ol/layer';
import TileWMS from 'ol/source/TileWMS'
import ImageWMS from 'ol/source/ImageWMS'
import Moment from 'moment';
import ReactDOM from 'react-dom';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import DropDown from './DropDown';
import Select from 'react-select';
import "./DBTDashboard.css"
import FarmerFPCChart from './FarmerFPCChart';
import DBTPieChart from './DBTPieChart';

var view = "";
export default class DBTFarmerDashboard extends Component {

	constructor(props) {
		super(props)

		this.state = {
			activity: [
			],
			district: [

			],
			taluka: [

			],
			village: [

			],
			gender: [
				{ value: 'm', label: 'Male' },
				{ value: 'f', label: 'Female' },
				{ value: 'o', label: 'Other' },
			],
			social_category: [
				{ value: 'sc', label: 'SC' },
				{ value: 'st', label: 'ST' },
				{ value: 'other', label: 'Other' },
			],
			farm_type: [
				{ value: 'sc', label: 'Land Less' },
				{ value: 'st', label: 'Marginal' },
				{ value: 'other', label: 'Small' },
			]
		}


		this.scaleLineControl = new ScaleLine({
			units: 'metric',
			type: 'scalebar',
			bar: true,
			steps: 4,
			minWidth: 150
		});
		this.mouse = new MousePosition({
			projection: 'EPSG:4326',
			coordinateFormat: function (coordinate) {
				return format(coordinate, "&nbsp;&nbsp; Latitude : {y}, &nbsp;&nbsp; Longitude: {x} &nbsp;&nbsp;", 4);
			}
		});

		var topo = new TileLayer({
			title: 'Topo Map',
			type: 'base',
			visible: true,
			source: new XYZ({
				attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
					'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
				url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
					'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
				crossOrigin: 'Anonymous',
			})
		});
		this.pocra = new TileLayer({
			title: "Base Layer",
			source: new TileWMS({
				url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms',
				crossOrigin: 'Anonymous',
				serverType: 'geoserver',
				visible: true,
				params: {
					'LAYERS': 'PoCRA_Dashboard:District',
					'TILED': true,
				}
			})
		});

		this.pocraDistrict = new TileLayer({
			title: "Base Layer",
			source: new TileWMS({
				url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms',
				crossOrigin: 'Anonymous',
				serverType: 'geoserver',
				visible: true,
				params: {
					'LAYERS': 'PoCRA_Dashboard:District',
					'TILED': true,
				}
			})
		});

		view = new View({
			zoom: 7,
			center: transform([77.50, 18.95], 'EPSG:4326', 'EPSG:3857'),
		});


		this.map = new Map({
			// overlays: [this.overlay],
			target: null,
			view: view,
			controls: defaultControls().extend([this.mouse, this.scaleLineControl]),
			layers: [topo, this.pocraDistrict]
		});
		//function binding
		this.getTaluka = this.getTaluka.bind(this)
		this.getVillage = this.getVillage.bind(this)
	}

	componentDidMount() {

		this.map.setTarget("map");
		this.getDistrict();
		this.getFarmerActivity();

		// this.getForecastData();
		// const overlay = new Overlay({
		// 	element: ReactDOM.findDOMNode(this).querySelector('#popup'),
		// 	positioning: 'center-center',
		// 	stopEvent: false
		// });

		// this.map.addOverlay(overlay);

		// this.map.on('click', evt => {
		// 	overlay.setPosition(undefined)
		// 	const coordinate = evt.coordinate;

		// 	var viewResolution = (view.getResolution());
		// 	var url = imdlayer.getSource().getFeatureInfoUrl(
		// 		evt.coordinate,
		// 		viewResolution,
		// 		'EPSG:3857', { 'INFO_FORMAT': 'application/json' }
		// 	);
		// 	if (url) {
		// 		fetch(url)
		// 			.then((response) => {
		// 				// console.log(response.text());
		// 				return response.text();
		// 			})
		// 			.then((html) => {
		// 				var jsondata = JSON.parse(html);
		// 				if (jsondata.features[0]) {
		// 					if (jsondata.features[0].properties) {
		// 						var popupContent = overlay.element.querySelector('#popup-content');
		// 						popupContent.innerHTML = '';
		// 						popupContent.innerHTML = '<table id="customers" className="table table-bordered" style="border:1px solid black;width: 100%;color:black"><tr ><td style="background-color:skyblue;text-align:center;font-weight:bold;" colspan=2 >IMD Weather Forecast Attribute Information</td></tr><tr><td style="text-align: left">District </td><td style="text-align: left">' + jsondata.features[0].properties.dtnname + '</td></tr><tr><td style="text-align: left">Taluka </td><td style="text-align: left">' + jsondata.features[0].properties.thnname + '</td></tr><tr><td style="text-align: left">Forecast Date </td><td style="text-align: left">' + jsondata.features[0].properties.forecast_date + '</td></tr><tr><td style="text-align: left">Rainfall (mm) </td><td style="text-align: left">' + parseFloat(jsondata.features[0].properties.rainfall_mm) + '</td></tr><tr><td style="text-align: left">Maximum Temprature &#8451; </td><td style="text-align: left ">' + parseFloat(jsondata.features[0].properties.temp_max_deg_c) + '</td></tr><tr><td style="text-align: left">Minimum Temprature &#8451; </td><td style="text-align: left">' + parseFloat(jsondata.features[0].properties.temp_min_deg_c) + '</td></tr><tr><td style="text-align: left">Wind Speed(m/s) </td><td style="text-align: left">' + parseFloat(jsondata.features[0].properties.wind_speed_ms) + '</td></tr><tr><td style="text-align: left">Wind Direction</td><td style="text-align: left">' + parseFloat(jsondata.features[0].properties.wind_direction_deg) + '</td></tr><tr><td style="text-align: left">Humidity 1 (%) </td><td style="text-align: left">' + parseFloat(jsondata.features[0].properties.humidity_1) + '</td></tr><tr><td style="text-align: left">Humidity 2 (%)</td><td style="text-align: left">' + parseFloat(jsondata.features[0].properties.humidity_2) + '</td></tr><tr><td style="text-align: left">Cloud Cover </td><td style="text-align: left">' + parseFloat(jsondata.features[0].properties.cloud_cover_octa) + '</td></tr><tr></table>';
		// 						// overlay.addOverlay(this.popup);
		// 						overlay.setPosition(coordinate);
		// 					}
		// 				}
		// 			});
		// 	}
		// })

	}

	getFarmerActivity() {
		let initialActivity = [];
		fetch('http://gis.mahapocra.gov.in/dashboard_testing_api_2020_12_22/meta/dbtActivityMaster?activity=Farmer')
			.then(response => {
				return response.json();
			}).then(data => {
				// console.log(data)
				initialActivity = data.activity.map((activities) => {
					return activities = {
						label: activities.ActivityGroupName,
						value: activities.ActivityGroupID,
						TotalNoOfApplications: activities.TotalNoOfApplications,
						TotalNoOfDisbursement: activities.TotalNoOfDisbursement,
						TotalNoOfPreSanction: activities.TotalNoOfPreSanction

					}
				});
				this.setState({
					activity: [
						initialActivity
					]
				});

			});


	}


	getDistrict() {
		let initialDistrict = [];
		fetch('http://gis.mahapocra.gov.in/weatherservices/meta/districts')
			.then(response => {
				return response.json();
			}).then(data => {
				// console.log(data)
				initialDistrict = data.district.map((district) => {
					return district = {
						label: district.dtnname,
						value: district.dtncode,
					}
				});
				this.setState({
					district: [
						initialDistrict
					]
				});

			});

	}

	getTaluka = (districtCode) => {
		// var districtCode = document.getElementById("district").value;
		// console.log(districtCode)
		// console.log(districtCode)
		let initialTaluka = [];

		fetch('http://gis.mahapocra.gov.in/weatherservices/meta/dtaluka?dtncode=' + districtCode)
			.then(response => {
				return response.json();
			}).then(data => {
				initialTaluka = data.taluka.map((taluka) => {
					return taluka = {
						label: taluka.thnname,
						value: taluka.thncode,
					}
				});
				this.setState({
					...this.state,
					taluka: [
						initialTaluka
					],

				});
			});
	}

	getVillage = (talukaCode) => {

		let initialVillage = [];

		fetch('http://gis.mahapocra.gov.in/weatherservices/meta/village?thncode=' + talukaCode)
			.then(response => {
				return response.json();
			}).then(data => {
				initialVillage = data.village.map((village) => {
					console.log(data)
					return village = {
						label: village.vinname,
						value: village.vincode,
					}
				});
				console.log(initialVillage);
				this.setState({
					...this.state,
					village: [
						initialVillage
					],

				});
			});

	}

	render() {

		return (
			<div>
				<div className="content-wrapper">
					{/* Content Header (Page header) */}
					<section className="content-header">
						<section className="content">
							<div className="container-fluid">
								{/* SELECT2 EXAMPLE */}
								<div className="card card-default" style={{ marginTop: "0.5%" }}>
									<div className="card-header">
										<h3 className="card-title">DBT Farmer Dashboard</h3>
										{/* <div className="card-tools">
											<button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus" /></button>
											<button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times" /></button>
										</div> */}
									</div>
									{/* /.card-header */}
									<div className="card-body">
										<div className="row">
											<div className="col-md-12">
												<form className="form-inline">

													{/* <label>Select Activity Group</label> */}
													{/* <DropDown activity_props={this.state} /> */}

													<div className="form-group" >
														<Select className="selectlabel-lg" placeholder="Select Activity"
															options={this.state.activity[0]}
														/>

													</div>
													<div className="form-group" >
														<Select className="selectlabel" placeholder="Select District"
															options={this.state.district[0]}
															onChange={district => this.getTaluka(district.value)}
														/>
													</div>
													<div className="form-group" >
														<Select className="selectlabel" placeholder="Select Taluka"
															options={this.state.taluka[0]}
															onChange={taluka => this.getVillage(taluka.value)}
														/>

													</div>
													<div className="form-group" >
														<Select className="selectlabel" placeholder="Select Village"
															options={this.state.village[0]}
														/>

													</div>
													<div className="form-group" >
														<Select className="selectlabel" placeholder="Select Gender"
															options={this.state.gender}
														/>

													</div>
													<div className="form-group" >
														<Select className="selectlabel" placeholder="Select Category"
															options={this.state.social_category}
														/>

													</div>
													<div className="form-group" >
														<Select className="selectlabel" placeholder="Select Farm Type"
															options={this.state.farm_type}
														/>

													</div>
												</form>
											</div>
										</div>
									</div>
									{/* /.card-body */}
									{/* <div className="card-footer">
										Visit <a href="https://select2.github.io/">Select2 documentation</a> for more examples and information about
										the plugin.
									</div> */}
								</div>



							</div>{/* /.container-fluid */}
						</section>
					</section>



					{/* Main content */}
					<section className="content"  >
						{/* Default box */}
						<div className="card card-solid">
							<div className="card-body">
								<div className="row mb-2" >
									<div className="col-12" id="map" style={{ height: "50vh", width: "100%" }}>
									</div>
									<div className="box stack-top">
										{/* Custom tabs (Charts with tabs)*/}
										<div className="card" style={{ width: "50%", right: "-50%" }}>
											<div className="card-header">
												<h3 className="card-title">
													<i className="fas fa-chart-bar" /> FPC/NRM
												</h3>
												<div className="card-tools ">
													<button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus"></i>
													</button>
													{/* <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i></button> */}
												</div>
											</div>
											{/* /.card-header */}
											<div className="card-body">
												<div className="tab-content p-0" >
													{/* <FarmerFPCChart  /> */}
													<DBTPieChart />
												</div>
											</div>
											{/* /.card-body */}
										</div>
									</div>
								</div>
							</div>

							{/* /.card-body */}
						</div>
						{/* /.card */}
					</section>
					<section className="content"  >
						<div className="card card-solid">
							<div className="card-body">
								<div className="row mb-2" >
									<section className="col-lg-4 connectedSortable">
										{/* Custom tabs (Charts with tabs)*/}
										<div className="card">
											<div className="card-header">
												<h3 className="card-title">
													<i className="fas fa-restroom"></i> DBT Distribution as per Gender
												</h3>
												<div className="card-tools">
													<button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus"></i>
													</button>
													{/* <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i></button> */}
												</div>
											</div>
											{/* /.card-header */}
											<div className="card-body">
												<div className="tab-content p-0">
													<DBTPieChart />

												</div>
											</div>
											{/* /.card-body */}
										</div>
									</section>
									<section className="col-lg-4 connectedSortable">
										{/* Custom tabs (Charts with tabs)*/}
										<div className="card">
											<div className="card-header">
												<h3 className="card-title">
													<i className="fas fa-users"> </i> Social Category
												</h3>
												<div className="card-tools">
													<button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus"></i>
													</button>
													{/* <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i></button> */}
												</div>
											</div>
											{/* /.card-header */}
											<div className="card-body">
												<div className="tab-content p-0">
													<DBTPieChart />

												</div>
											</div>
											{/* /.card-body */}
										</div>
									</section>
									<section className="col-lg-4 connectedSortable">
										{/* Custom tabs (Charts with tabs)*/}
										<div className="card">
											<div className="card-header">
												<h3 className="card-title">
													<i className="fas fa-user-friends"></i> Farmer Type
												</h3>
												<div className="card-tools">
													<button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus"></i>
													</button>
													{/* <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i></button> */}
												</div>
											</div>
											{/* /.card-header */}
											<div className="card-body">
												<div className="tab-content p-0">
													<DBTPieChart />

												</div>
											</div>
											{/* /.card-body */}
										</div>
									</section>
								</div>
							</div>
						</div>
					</section>
					{/* /.content */}
				</div>

			</div>
		)
	}
}
