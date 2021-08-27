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
var view = "";
export default class DBTDashboard extends Component {
	constructor(props) {
		super(props)

		this.state = {
			activity: [
				{
					label: 'Select Activity Group',
					items: [
						{ value: 'frm', name: 'Farmer' },
						{ value: 'nrm', name: 'NRM' },
					],
				},
			],
			district: [
				{
					label: 'Select District',
					items: [],
				},
			],
			taluka: [
				{
					label: 'Select Taluka',
					items: [],
				},
			],
			village: [
				{
					label: 'Select Village',
					items: [],
				},
			],
			gender: [
				{
					label: 'Select Gender',
					items: [
						{ value: 'm', name: 'Male' },
						{ value: 'f', name: 'Female' },
						{ value: 'o', name: 'Other' },
					],
				},
			],
			social_category: [
				{
					label: 'Select Social Category',
					items: [
						{ value: 'sc', name: 'SC' },
						{ value: 'st', name: 'ST' },
						{ value: 'other', name: 'Other' },
					],
				},
			],
			farm_type: [
				{
					label: 'Select Farm Type',
					items: [
						{ value: 'sc', name: 'Land Less' },
						{ value: 'st', name: 'Marginal' },
						{ value: 'other', name: 'Small' },
					],
				},
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


	getDistrict() {
		let initialDistrict = [];
		fetch('http://gis.mahapocra.gov.in/weatherservices/meta/districts')
			.then(response => {
				return response.json();
			}).then(data => {
				// console.log(data)
				initialDistrict = data.district.map((district) => {
					return district
				});
				// console.log(initialPlanets);
				this.setState({
					// ...this.state,
					district: [
						{
							label: 'Select District',
							items: initialDistrict,
						},
					]
				});
			});
	}

	getTaluka = () => {
		var districtCode = document.getElementById("district").value;
		let initialTaluka = [];

		fetch('http://gis.mahapocra.gov.in/weatherservices/meta/dtaluka?dtncode=' + districtCode)
			.then(response => {
				return response.json();
			}).then(data => {
				initialTaluka = data.taluka.map((taluka) => {
					return taluka
				});
				console.log(initialTaluka);
				this.setState({
					...this.state,
					taluka: [
						{
							label: 'Select Taluka',
							items: initialTaluka,
						},
					],
					
				});
			});
	}

	getVillage = () => {
		var talukaCode = document.getElementById("taluka").value;
		let initialVillage = [];

		fetch('http://gis.mahapocra.gov.in/weatherservices/meta/village?thncode=' + talukaCode)
			.then(response => {
				return response.json();
			}).then(data => {
				initialVillage = data.village.map((village) => {
					return village
				});
				console.log(initialVillage);
				this.setState({
					...this.state,
					village: [
						{
							label: 'Select Taluka',
							items: initialVillage,
						},
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
								<div className="card card-default">
									<div className="card-header">
										<h3 className="card-title">DBT Dashboard</h3>
										{/* <div className="card-tools">
											<button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus" /></button>
											<button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times" /></button>
										</div> */}
									</div>
									{/* /.card-header */}
									<div className="card-body">
										<div className="row">
											<div className="col-md-12">
												<form class="form-inline">

													{/* <label>Select Activity Group</label> */}
													{/* <DropDown activity_props={this.state} /> */}

													<div className="form-group" >
														{this.state.activity.map(({ label, items: subItems, ...rest }) => (
															<>
																{Array.isArray(subItems) ? (
																	<>
																		<label>{label}</label>
																		<select className="form-control select2" style={{ width: '90%' }}>
																			{subItems.map((subItem) => (
																				<option value={subItem.value}>{subItem.name}</option>
																			))}
																		</select>
																	</>
																) : ""}
															</>
														))}
													</div>
													<div className="form-group" >
														{
															this.state.district.map(({ label, items: subItems, ...rest }) => (
																<>
																	{Array.isArray(subItems) ? (
																		<>
																			<label>{label}</label>
																			<select className="form-control select2" id="district" style={{ width: '90%' }} onChange={this.getTaluka}>
																				<option value="-1">Select District</option>
																				{subItems.map((subItem) => (
																					<option value={subItem.dtncode}>{subItem.dtnname}</option>
																				))}
																			</select>
																		</>
																	) : ""}
																</>
															))
														}
													</div>
													<div className="form-group" >
														{this.state.taluka.map(({ label, items: subItems, ...rest }) => (
															<>
																{Array.isArray(subItems) ? (
																	<>
																		<label>{label}</label>
																		<select className="form-control select2" id="taluka" style={{ width: '90%' }} onChange={this.getVillage}>
																			<option value="-1">Select Taluka</option>
																			{subItems.map((subItem) => (
																				<option value={subItem.thncode}>{subItem.thnname}</option>
																			))}
																		</select>
																	</>
																) : ""}
															</>
														))}
													</div>
													<div className="form-group" >
														{this.state.village.map(({ label, items: subItems, ...rest }) => (
															<>
																{Array.isArray(subItems) ? (
																	<>
																		<label>{label}</label>
																		<select className="form-control select2" style={{ width: '90%' }}>
																		<option value="-1">Select Village</option>
																			{subItems.map((subItem) => (
																				<option value={subItem.vincode}>{subItem.vinname}</option>
																			))}
																		</select>
																	</>
																) : ""}
															</>
														))}
													</div>
													<div className="form-group" >
														{this.state.gender.map(({ label, items: subItems, ...rest }) => (
															<>
																{Array.isArray(subItems) ? (
																	<>
																		<label>{label}</label>
																		<select className="form-control select2" style={{ width: '90%' }}>
																			{subItems.map((subItem) => (
																				<option value={subItem.value}>{subItem.name}</option>
																			))}
																		</select>
																	</>
																) : ""}
															</>
														))}
													</div>
													<div className="form-group" >
														{this.state.social_category.map(({ label, items: subItems, ...rest }) => (
															<>
																{Array.isArray(subItems) ? (
																	<>
																		<label>{label}</label>
																		<select className="form-control select2" style={{ width: '90%' }}>
																			{subItems.map((subItem) => (
																				<option value={subItem.value}>{subItem.name}</option>
																			))}
																		</select>
																	</>
																) : ""}
															</>
														))}
													</div>
													<div className="form-group" >
														{this.state.farm_type.map(({ label, items: subItems, ...rest }) => (
															<>
																{Array.isArray(subItems) ? (
																	<>
																		<label>{label}</label>
																		<select className="form-control select2" style={{ width: '90%' }}>
																			{subItems.map((subItem) => (
																				<option value={subItem.value}>{subItem.name}</option>
																			))}
																		</select>
																	</>
																) : ""}
															</>
														))}
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
								<div className="row">
									<div className="col-12 col-sm-12" id="map" style={{ height: "60vh", width: "100%" }}>
									</div>




									{/* Legend:
									<div><img id="legend" /></div> */}
								</div>


							</div>

							{/* /.card-body */}
						</div>
						{/* /.card */}
					</section>

					{/* /.content */}
				</div>

			</div>
		)
	}
}
