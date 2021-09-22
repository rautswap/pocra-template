import React, { Component } from 'react'
import '../MapComponents/Map.css';
import "ol/ol.css";
import "ol-ext/dist/ol-ext.css";
import { Feature, Map, View } from "ol";
import Overlay from 'ol/Overlay';
import XYZ from 'ol/source/XYZ';
import { ScaleLine, MousePosition, defaults as defaultControls } from 'ol/control';
import { format } from 'ol/coordinate';
import { transform } from 'ol/proj';
import { Image as ImageLayer, Tile as TileLayer, Vector } from 'ol/layer';
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
import Point from 'ol/geom/Point';
import { Fill, Stroke, RegularShape, Circle, Icon, Text, Style } from 'ol/style';
import LegendPanelDashboard from './LegendPanelDashboard';

var view = "", map;
let pocraDBTLayer;
var featurelayer; var a = new Array();
var thing;
var vectorSource;
export default class DBTFarmerDashboard extends Component {

	constructor(props) {
		super(props)
		this.state = {
			lat: 0, lon: 0, no_of_application: 0, districtName: "",
			classValues: {
				appl_1: 0,
				appl_2: 0,
				appl_3: 0,
				appl_4: 0,
				appl_5: 0,
			},
			activity: [

			],
			district: [

			],
			taluka: [

			],
			village: [

			],
			genderSelect: [
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
			],
			gender: {

			},
			farmerType: {

			},
			category: {

			}
		}


		this.scaleLineControl = new ScaleLine({
			units: 'metric',
			type: 'scalebar',
			bar: true,
			steps: 2,
			minWidth: 80
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
		// this.pocra = new TileLayer({
		// 	title: "Base Layer",
		// 	source: new TileWMS({
		// 		url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms',
		// 		crossOrigin: 'Anonymous',
		// 		serverType: 'geoserver',
		// 		visible: true,
		// 		params: {
		// 			'LAYERS': 'PoCRA_Dashboard:District',
		// 			'TILED': true,
		// 		}
		// 	})
		// });

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




		// 

		view = new View({
			zoom: 7.5,
			center: transform([77.50, 18.95], 'EPSG:4326', 'EPSG:3857'),
		});


		map = new Map({
			// overlays: [this.overlay],
			target: null,
			view: view,
			controls: defaultControls().extend([this.mouse, this.scaleLineControl]),
			layers: [topo]
		});


		//function binding
		this.getTaluka = this.getTaluka.bind(this)
		this.getVillage = this.getVillage.bind(this)
		this.getCategoryApplicationCount = this.getCategoryApplicationCount.bind(this)
		this.loadMap = this.loadMap.bind(this);
		this.getDBTVectorLayer = this.getDBTVectorLayer.bind(this);
	}

	componentDidMount() {
		// this.getDBTLayerClassValues();
		map.setTarget("map");
		this.getDistrict();
		this.getFarmerActivity();
		this.getCategoryApplicationCount({
			value: 'All'
		});

		// this.styleFunction = (feature) => {
		// 	this.style.getText().setText(feature.get('no_of_application'));
		// 	return this.style;
		// }

		// this.getForecastData();
		// const overlay = new Overlay({
		// 	element: ReactDOM.findDOMNode(this).querySelector('#popup'),
		// 	positioning: 'center-center',
		// 	stopEvent: false
		// });

		// map.addOverlay(overlay);

		// map.on('click', evt => {
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

	getDBTVectorLayer(activityId) {


		if (vectorSource) {

		}
		fetch('http://gis.mahapocra.gov.in/dashboard_testing_api_2020_12_22/meta/dbtDistrict?activityId=' + activityId)
			.then(response => {
				return response.json();
			}).then(data => {

				vectorSource = new VectorSource({})
				data.activity.map((activities) => {
					this.setState({
						lat: activities.lat,
						lon: activities.lon,
						no_of_application: activities.no_of_application,
						districtName: activities.district
					})
					var feature = new Feature({
						geometry: new Point(transform([parseFloat(this.state.lat) , parseFloat(this.state.lon)], 'EPSG:4326', 'EPSG:3857')),
						no_of_application: this.state.no_of_application,
						district: this.state.districtName
					});

					vectorSource.addFeature(feature);
					// var element = document.createElement('div');
					// element.innerHTML = '<div class="circle">' + this.state.no_of_application+ '</div>';
					// var marker = new Overlay({
					// 	position: transform([parseFloat(this.state.lat) + 0.1, parseFloat(this.state.lon) + 0.1], 'EPSG:4326', 'EPSG:3857'),
					// 	// position: [parseFloat(activities.lon), parseFloat(activities.lat)],
					// 	positioning: 'center-center',
					// 	element: element,
					// 	stopEvent: false
					// });
					// map.addOverlay(marker);
				});

				// var style = new Style({
				// 	image: new Circle({
				// 		radius: 7,
				// 		stroke: new Stroke({
				// 			color: 'rgba(200,200,200,1.0)',
				// 			width: 3,
				// 		}),
				// 		fill: new Fill({
				// 			color: 'rgba(255,0,0,1.0)'
				// 		})
				// 	}),
				// 	text: new Text({
				// 		font: 'bold 11px "Open Sans", "Arial Unicode MS", "sans-serif"',
				// 		placement: 'point',
				// 		fill: new Fill({ color: '#fff' }),
				// 		stroke: new Stroke({ color: '#000', width: 2 }),
				// 	}),
				// });
				if (featurelayer) {
					map.removeLayer(featurelayer)
				}
				featurelayer = new Vector({
					source: vectorSource,
					style: (feature) => {
						return new Style({
							text: new Text({
								
								text: '' + feature.get('no_of_application') + '',
								font: '12px Calibri,sans-serif',
								offsetY: -10,
								offsetX: 15,
								// align: 'center',
								scale:1,
								textBaseline: 'bottom',
								fill: new Fill({
									color: '#ffffff'
								}),
								stroke: new Stroke({
									color: '#5151c8',
									width: 3
								})
							}),
						});
					}
				})
				map.addLayer(featurelayer)
			});

	}
	getDBTLayerClassValues(activityId) {

		var url = "", layerName = "";
		if (activityId === "All") {
			// url = "http://gis.mahapocra.gov.in/dashboard_testing_api_2020_12_22/meta/dbtNumApplications?activityId=7&summary_for=application";
			layerName = "dbtDistrict";
		} else {
			layerName = "dbtAcivityGroup";
		}

		let initialActivity = [];

		fetch('http://gis.mahapocra.gov.in/dashboard_testing_api_2020_12_22/meta/dbtNumApplications?activityId=' + activityId + '&summary_for=application')
			.then(response => {
				return response.json();
			}).then(data => {
				// console.log(data)
				initialActivity = data.activity.map((activities) => {
					// console.log(activities.appl_1)
					this.setState(prev => ({
						classValues: {
							appl_1: activities.appl_1,
							appl_2: activities.appl_2,
							appl_3: activities.appl_3,
							appl_4: activities.appl_4,
							appl_5: activities.appl_5,
						}
					}));
					return activities;

				});
				this.loadMap(initialActivity, layerName, activityId)
				// this.setState(prev => ({
				// 	classValues: initialActivity
				// }));
			});

	}


	loadMap = (initialActivity, layerName, activityId) => {

		let viewMap = map.getView();
		let extent = viewMap.calculateExtent(map.getSize());
		//hold the current resolution
		let res = viewMap.getResolution();
		viewMap.fit(extent, map.getSize());
		view.setResolution(res);
		if (pocraDBTLayer) {
			map.removeLayer(pocraDBTLayer);
		}
		var imgSource = new ImageWMS({})

		if (activityId === 'All') {
			imgSource = new ImageWMS({
				attributions: ['&copy; DBT PoCRA'],
				crossOrigin: 'Anonymous',
				serverType: 'geoserver',
				visible: true,
				url: "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms?",
				params: {
					'LAYERS': 'PoCRA_Dashboard:' + layerName,
					'TILED': true,
					'env': "propname:no_of_application;appl_1:" + (parseInt(initialActivity[0].appl_1)) + ";appl_2:" + (parseInt(initialActivity[0].appl_2)) + ";appl_3:" + (parseInt(initialActivity[0].appl_3)) + ";appl_4:" + (parseInt(initialActivity[0].appl_4)) + ";appl_5:" + (parseInt(initialActivity[0].appl_5)),
				},
			})
			pocraDBTLayer = new ImageLayer({
				title: "DBT PoCRA",
				source: imgSource
			});
			map.addLayer(pocraDBTLayer);
			this.getDBTVectorLayer(activityId);
		} else {
			console.log("propname:no_of_application;appl_1:" + (parseInt(initialActivity[0].appl_1)) + ";appl_2:" + (parseInt(initialActivity[0].appl_2)) + ";appl_3:" + (parseInt(initialActivity[0].appl_3)) + ";appl_4:" + (parseInt(initialActivity[0].appl_4)) + ";appl_5:" + (parseInt(initialActivity[0].appl_5)))
			imgSource = new ImageWMS({
				attributions: ['&copy; DBT PoCRA'],
				crossOrigin: 'Anonymous',
				serverType: 'geoserver',
				visible: true,
				url: "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms?",
				params: {
					'LAYERS': 'PoCRA_Dashboard:' + layerName,
					'TILED': true,
					'env': "propname:no_of_application;appl_1:" + (parseInt(initialActivity[0].appl_1)) + ";appl_2:" + (parseInt(initialActivity[0].appl_2)) + ";appl_3:" + (parseInt(initialActivity[0].appl_3)) + ";appl_4:" + (parseInt(initialActivity[0].appl_4)) + ";appl_5:" + (parseInt(initialActivity[0].appl_5)),
					// 'CQL_FILTER': indate
					'viewparams': "groupID:" + activityId
				},
			})
			pocraDBTLayer = new ImageLayer({
				title: "DBT PoCRA",
				source: imgSource
			});
			// imgSource.updateParams({ viewparams: 'groupID:"6"' });

			map.addLayer(pocraDBTLayer);
			this.getDBTVectorLayer(activityId);
			// wmsSource.updateParams({ENV:'key1:value1;key2:value2'});
			// &viewparams=groupID:6
		}


		// console.log(map.getLayers())
		// map.addLayer(featurelayer)
	}

	getFarmerActivity() {
		let initialActivity = [];
		fetch('http://gis.mahapocra.gov.in/dashboard_testing_api_2020_12_22/meta/dbtActivityMaster?activity=Farmer&activityId=""')
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
						initialActivity,
					],
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
					return village = {
						label: village.vinname,
						value: village.vincode,
					}
				});
				this.setState({
					...this.state,
					village: [
						initialVillage
					],

				});
			});

	}

	getCategoryApplicationCount(event) {

		let activityValue = event.value;

		this.getDBTLayerClassValues(activityValue);
		var genderData = [], categoryData = [], farmerTypeData = [];
		fetch('http://gis.mahapocra.gov.in/dashboard_testing_api_2020_12_22/meta/dbtAllActivitybyID_All?activityID=' + activityValue)
			.then(response => {
				return response.json();
			}).then(data => {
				// console.log(data)
				data.activitySummar.gender.map(gender => {
					genderData.push({
						name: gender.gender,
						y: parseInt(gender.no_of_application)
					})
				})

				data.activitySummar.category.map(category => {
					categoryData.push({
						name: category.category,
						y: parseInt(category.no_of_application)
					})

				})
				data.activitySummar.farmer_type.map(farmer_type => {
					farmerTypeData.push({
						name: farmer_type.farmer_type,
						y: parseInt(farmer_type.no_of_application)
					})
				})

				// console.log(genderData);
				// console.log(categoryData);
				// console.log(farmerTypeData);
				this.setState({
					gender: genderData,
					category: categoryData,
					farmerType: farmerTypeData
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
													<div className="form-group" >
														<Select className="selectlabel-lg" placeholder="Select Activity"
															onChange={this.getCategoryApplicationCount}
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
															options={this.state.genderSelect}
														/>

													</div>
													<div className="form-group" >
														<Select className="selectlabel" placeholder="Select Category"
															options={this.state.social_category}
														/>

													</div>
													<div className="form-group" >
														<Select className="selectlabel-lg" placeholder="Select Farmer Type"
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
					<section className="content" style={{ marginTop: "-24px" }} >
						{/* Default box */}
						<div className="card card-solid">
							<div className="card-body">
								<div className="row mb-2" >
									<div className="col-12" id="map" style={{ height: "60vh", width: "100%" }}>
									</div>
									<div id={"legend"} className="box stack-top">

										<LegendPanelDashboard props={this.state.classValues} />
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
								<div className="row" >


									{/* <section className="col-md-4">
										<div className="card">
											<div className="card-header">
												<h3 className="card-title">
													<i className="fas fa-restroom"></i> DBT Distribution as per Gender
												</h3>
												<div className="card-tools">
													<button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus"></i>
													</button>
												</div>
											</div>
											
											<div className="card-body">
												<DBTPieChart />
											</div>
										</div>
									</section> */}
									<DBTPieChart pieChartProps={{
										activityLabel: "Gender",
										activity: "Farmer",
										data: this.state.gender
									}} />
									<DBTPieChart pieChartProps={{
										activityLabel: "Social Category",
										activity: "Social",
										data: this.state.category
									}} />
									<DBTPieChart pieChartProps={{
										activityLabel: "Farmer Type",
										activity: "Farmer",
										data: this.state.farmerType
									}} />
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
