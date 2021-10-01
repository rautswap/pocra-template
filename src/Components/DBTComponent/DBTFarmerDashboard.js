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
import $ from 'jquery';
import select from "select2";
import { act } from 'react-dom/test-utils';
var view = "", map;
let pocraDBTLayer;
var featurelayer; var a = new Array();
var thing;
var vectorSource, geojson;
var imgSource = new ImageWMS({});
export default class DBTFarmerDashboard extends Component {

	constructor(props) {
		super(props)
		this.state = {

			total: 0,
			headerLabel: "",
			lat: 0,
			lon: 0,
			no_of_application: 0,
			districtName: "",
			classValues: {
				appl_1: 0,
				appl_2: 0,
				appl_3: 0,
				appl_4: 0,
				appl_5: 0,
				legendLabel: "No of Applications",
			},
			// activity: [

			// ],
			activity: [
				[]
			],
			district: [
				[]
			],
			taluka: [
				[]
			],
			village: [
				[]
			],
			// district: [

			// ],
			// taluka: [

			// ],
			// village: [

			// ],
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
			zoom: 7.2,
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
		this.getDBTVectorLayerDistrict = this.getDBTVectorLayerDistrict.bind(this);
		this.updateHeaderLabel = this.updateHeaderLabel.bind(this);
		this.handleRadioChange = this.handleRadioChange.bind(this);
	}


	componentDidMount() {
		// this.getDBTLayerClassValues();
		map.setTarget("map");
		this.loadMap1();
		this.getDistrict();
		this.getFarmerActivity();
		this.updateHeaderLabel();
		this.handleRadioChange();
		// this.getCategoryApplicationCount("All","All","All","All");


		// $(function () {
		//Initialize Select2 Elements
		// $('.select2').select2();
		// })
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



	getDBTVectorLayerDistrict(activityId, applicationFor) {
		if (vectorSource) {

		}
		fetch('http://gis.mahapocra.gov.in/dashboard_testing_api_2020_12_22/meta/dbtDistrict?activityId=' + activityId)
			.then(response => {
				return response.json();
			}).then(data => {
				var totalApp = 0;
				vectorSource = new VectorSource({})

				data.activity.map((activities) => {

					// totalApp = totalApp + activities.no_of_application
					if (applicationFor === "no_of_application") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_application,
							districtName: activities.district,
							// total: totalApp
						})
					} else if (applicationFor === "no_of_paymentdone") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_paymentdone,
							districtName: activities.district,
							// total: totalApp
						})
					} else if (applicationFor === "no_of_registration") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_registration,
							districtName: activities.district,
							// total: totalApp
						})
					}


					var feature = new Feature({
						geometry: new Point(transform([parseFloat(this.state.lat), parseFloat(this.state.lon)], 'EPSG:4326', 'EPSG:3857')),
						no_of_application: this.state.no_of_application,
						district: this.state.districtName
					});

					vectorSource.addFeature(feature);

				});
				// this.setState({
				// 	total: totalApp
				// })

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
								offsetY: 15,
								offsetX: 25,
								align: 'bottom',
								scale: 1,
								// textBaseline: 'bottom',
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
	getDBTVectorLayerTaluka(activityId, districtCode, applicationFor) {
		if (vectorSource) {

		}
		fetch('http://gis.mahapocra.gov.in/dashboard_testing_api_2020_12_22/meta/dbtTaluka?activityId=' + activityId + '&districtCode=' + districtCode)
			.then(response => {
				return response.json();
			}).then(data => {

				vectorSource = new VectorSource({})
				data.activity.map((activities) => {
					if (applicationFor === "no_of_application") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_application,
							districtName: activities.district,
							// total: totalApp
						})
					} else if (applicationFor === "no_of_paymentdone") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_paymentdone,
							districtName: activities.district,
							// total: totalApp
						})
					} else if (applicationFor === "no_of_registration") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_registration,
							districtName: activities.district,
							// total: totalApp
						})
					}
					var feature = new Feature({
						geometry: new Point(transform([parseFloat(this.state.lat), parseFloat(this.state.lon)], 'EPSG:4326', 'EPSG:3857')),
						no_of_application: this.state.no_of_application,
						district: this.state.districtName
					});

					vectorSource.addFeature(feature);

				});


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
								offsetY: 15,
								offsetX: 25,
								align: 'bottom',
								scale: 1,
								// textBaseline: 'bottom',
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
	getDBTVectorLayerVillage(activityId, districtCode, talukaCode, applicationFor) {
		if (vectorSource) {

		}
		fetch('http://gis.mahapocra.gov.in/dashboard_testing_api_2020_12_22/meta/dbtVillage?activityId=' + activityId + '&districtCode=' + districtCode + '&talukaCode=' + talukaCode)
			.then(response => {
				return response.json();
			}).then(data => {

				vectorSource = new VectorSource({})
				data.activity.map((activities) => {
					console.log(data)
					if (applicationFor === "no_of_application") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_application,
							districtName: activities.district,
							// total: totalApp
						})
					} else if (applicationFor === "no_of_paymentdone") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_paymentdone,
							districtName: activities.district,
							// total: totalApp
						})
					} else if (applicationFor === "no_of_registration") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_registration,
							districtName: activities.district,
							// total: totalApp
						})
					}
					var feature = new Feature({
						geometry: new Point(transform([parseFloat(this.state.lat), parseFloat(this.state.lon)], 'EPSG:4326', 'EPSG:3857')),
						no_of_application: this.state.no_of_application,
						district: this.state.districtName
					});

					vectorSource.addFeature(feature);

				});


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
								offsetY: 15,
								offsetX: 25,
								align: 'bottom',
								scale: 1,
								// textBaseline: 'bottom',
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
	getDBTLayerClassValues(activityId, applicationFor) {
		var url = "", layerName = "";
		if (activityId === "All") {
			layerName = "dbtDistrict";
		} else {
			layerName = "dbtAcivityGroup";
		}

		let initialActivity = [];

		fetch('http://gis.mahapocra.gov.in/dashboard_testing_api_2020_12_22/meta/dbtNumApplications?activityId=' + activityId + '&summary_for=' + applicationFor)
			.then(response => {
				return response.json();
			}).then(data => {
				// console.log(data)
				var labelValue = "";
				if (applicationFor === "no_of_application") {
					labelValue = "No. of Applications";
				} else if (applicationFor === "no_of_paymentdone") {
					labelValue = "No. of Payment Done";
				} else if (applicationFor === "no_of_registration") {
					labelValue = "No. of Registration";
				}
				initialActivity = data.activity.map((activities) => {
					// console.log(activities.appl_1)
					this.setState(prev => ({
						classValues: {
							appl_1: activities.appl_1,
							appl_2: activities.appl_2,
							appl_3: activities.appl_3,
							appl_4: activities.appl_4,
							appl_5: activities.appl_5,
							legendLabel: labelValue,
						},


					}));
					return activities;

				});
				this.loadMap(initialActivity, layerName, activityId, applicationFor)

			});

	}


	getDBTLayerClassValuesTaluka(activityId, districtCode, applicationFor) {


		var url = "", layerName = "";
		if (activityId === "All") {
			layerName = "dbtTaluka";
		} else {
			layerName = "dbtAcivityGroupTaluka";
		}

		let initialActivity = [];
		var labelValue = "";
		fetch('http://gis.mahapocra.gov.in/dashboard_testing_api_2020_12_22/meta/dbtNumApplicationsTaluka?activityId=' + activityId + '&districtCode=' + districtCode + '&summary_for=' + applicationFor)
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
							legendLabel: labelValue,
						}
					}));
					return activities;

				});
				this.loadMapTaluka(initialActivity, layerName, activityId, "districtCode", districtCode, applicationFor)

			});

	}
	getDBTLayerClassValuesVillage(activityId, districtCode, talukaCode, applicationFor) {


		var url = "", layerName = "";
		if (activityId === "All") {
			// url = "http://gis.mahapocra.gov.in/dashboard_testing_api_2020_12_22/meta/dbtNumApplications?activityId=7&summary_for=application";
			layerName = "dbtVillage";
		} else {
			layerName = "dbtAcivityGroupVillage";
		}

		let initialActivity = [];
		var labelValue = "";
		fetch('http://gis.mahapocra.gov.in/dashboard_testing_api_2020_12_22/meta/dbtNumApplicationsVillage?activityId=' + activityId + '&summary_for=' + applicationFor + '&districtCode=' + districtCode + '&talukaCode=' + talukaCode)
			.then(response => {
				return response.json();
			}).then(data => {
				console.log(data)
				initialActivity = data.activity.map((activities) => {
					// console.log(activities.appl_1)
					this.setState(prev => ({
						classValues: {
							appl_1: activities.appl_1,
							appl_2: activities.appl_2,
							appl_3: activities.appl_3,
							appl_4: activities.appl_4,
							appl_5: activities.appl_5,
							legendLabel: labelValue,
						}
					}));
					return activities;

				});
				this.loadMapVillage(initialActivity, layerName, activityId, districtCode, talukaCode, applicationFor)
				// this.setState(prev => ({
				// 	classValues: initialActivity
				// }));
			});

	}

	loadMap1() {

		if (geojson) {
			map.removeLayer(geojson);
		}

		var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=District&outputFormat=application/json";
		geojson = new Vector({
			title: "Taluka",
			source: new VectorSource({
				url: url,
				format: new GeoJSON()
			}),
		});
		geojson.getSource().on('addfeature', function () {
			//alert(geojson.getSource().getExtent());
			map.getView().fit(
				geojson.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
			);
		});


		map.addLayer(geojson);
		// this.getCategoryApplicationCount({
		// 	target: { value: 'All' }

		// });
	}
	loadMap = (initialActivity, layerName, activityId, applicationFor) => {

		let viewMap = map.getView();
		let extent = viewMap.calculateExtent(map.getSize());
		//hold the current resolution
		let res = viewMap.getResolution();
		viewMap.fit(extent, map.getSize());
		view.setResolution(res);
		if (pocraDBTLayer) {
			map.removeLayer(pocraDBTLayer);
		}
		if (imgSource) {
			map.removeLayer(imgSource);
		}
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
					'env': "propname:" + applicationFor + ";labelName:dtnname;appl_1:" + (parseInt(initialActivity[0].appl_1)) + ";appl_2:" + (parseInt(initialActivity[0].appl_2)) + ";appl_3:" + (parseInt(initialActivity[0].appl_3)) + ";appl_4:" + (parseInt(initialActivity[0].appl_4)) + ";appl_5:" + (parseInt(initialActivity[0].appl_5))
				},
			})
			pocraDBTLayer = new ImageLayer({
				title: "DBT PoCRA",
				source: imgSource
			});
			map.addLayer(pocraDBTLayer);
		} else {
			imgSource = new ImageWMS({
				attributions: ['&copy; DBT PoCRA'],
				crossOrigin: 'Anonymous',
				serverType: 'geoserver',
				visible: true,
				url: "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms?",
				params: {
					'LAYERS': 'PoCRA_Dashboard:' + layerName,
					'TILED': true,
					'env': "propname:" + applicationFor + ";labelName:dtnname;appl_1:" + (parseInt(initialActivity[0].appl_1)) + ";appl_2:" + (parseInt(initialActivity[0].appl_2)) + ";appl_3:" + (parseInt(initialActivity[0].appl_3)) + ";appl_4:" + (parseInt(initialActivity[0].appl_4)) + ";appl_5:" + (parseInt(initialActivity[0].appl_5)),
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

			// wmsSource.updateParams({ENV:'key1:value1;key2:value2'});
			// &viewparams=groupID:6
		}


		// console.log(map.getLayers())
		// map.addLayer(featurelayer)
	}

	loadMapTaluka = (initialActivity, layerName, activityId, paramName, paramValue, applicationFor) => {
		// http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Subdivision&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json
		if (geojson) {
			map.removeLayer(geojson);
		}
		// districtCode:" + paramValue

		var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Taluka&CQL_FILTER=dtncode+ILike+'" + paramValue + "'&outputFormat=application/json";
		geojson = new Vector({
			title: "Taluka",
			source: new VectorSource({
				url: url,
				format: new GeoJSON()
			}),
		});
		geojson.getSource().on('addfeature', function () {
			//alert(geojson.getSource().getExtent());
			map.getView().fit(
				geojson.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
			);
		});


		map.addLayer(geojson);


		if (imgSource) {
			map.removeLayer(imgSource);
		}
		let viewMap = map.getView();
		let extent = viewMap.calculateExtent(map.getSize());
		//hold the current resolution
		let res = viewMap.getResolution();
		viewMap.fit(extent, map.getSize());
		view.setResolution(res);
		if (pocraDBTLayer) {
			map.removeLayer(pocraDBTLayer);
		}


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
					'env': "propname:" + applicationFor + ";labelName:thnname;appl_1:" + (parseInt(initialActivity[0].appl_1)) + ";appl_2:" + (parseInt(initialActivity[0].appl_2)) + ";appl_3:" + (parseInt(initialActivity[0].appl_3)) + ";appl_4:" + (parseInt(initialActivity[0].appl_4)) + ";appl_5:" + (parseInt(initialActivity[0].appl_5)),
					'viewparams': "districtCode:" + paramValue
				},
			})
			pocraDBTLayer = new ImageLayer({
				title: "DBT PoCRA",
				source: imgSource
			});
			map.addLayer(pocraDBTLayer);
		} else {
			imgSource = new ImageWMS({
				attributions: ['&copy; DBT PoCRA'],
				crossOrigin: 'Anonymous',
				serverType: 'geoserver',
				visible: true,
				url: "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms?",
				params: {
					'LAYERS': 'PoCRA_Dashboard:' + layerName,
					'TILED': true,
					'env': "propname:" + applicationFor + ";labelName:thnname;appl_1:" + (parseInt(initialActivity[0].appl_1)) + ";appl_2:" + (parseInt(initialActivity[0].appl_2)) + ";appl_3:" + (parseInt(initialActivity[0].appl_3)) + ";appl_4:" + (parseInt(initialActivity[0].appl_4)) + ";appl_5:" + (parseInt(initialActivity[0].appl_5)),
					// 'CQL_FILTER': indate
					'viewparams': "groupID:" + activityId + ";districtCode:" + paramValue
				},
			})
			pocraDBTLayer = new ImageLayer({
				title: "DBT PoCRA",
				source: imgSource
			});
			// imgSource.updateParams({ viewparams: 'groupID:"6"' });

			map.addLayer(pocraDBTLayer);

			// wmsSource.updateParams({ENV:'key1:value1;key2:value2'});
			// &viewparams=groupID:6
		}


		// console.log(map.getLayers())
		// map.addLayer(featurelayer)
	}
	loadMapVillage = (initialActivity, layerName, activityId, paramValue, talukaCode, applicationFor) => {
		// http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Subdivision&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json
		if (geojson) {
			map.removeLayer(geojson);
		}
		// districtCode:" + paramValue

		var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Village&CQL_FILTER=thncode+ILike+'" + talukaCode + "'&outputFormat=application/json";
		geojson = new Vector({
			title: "Village",
			source: new VectorSource({
				url: url,
				format: new GeoJSON()
			}),
		});
		geojson.getSource().on('addfeature', function () {
			//alert(geojson.getSource().getExtent());
			map.getView().fit(
				geojson.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
			);
		});


		map.addLayer(geojson);


		if (imgSource) {
			map.removeLayer(imgSource);
		}
		let viewMap = map.getView();
		let extent = viewMap.calculateExtent(map.getSize());
		//hold the current resolution
		let res = viewMap.getResolution();
		viewMap.fit(extent, map.getSize());
		view.setResolution(res);
		if (pocraDBTLayer) {
			map.removeLayer(pocraDBTLayer);
		}

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
					'env': "propname:" + applicationFor + ";labelName:vilname;appl_1:" + (parseInt(initialActivity[0].appl_1)) + ";appl_2:" + (parseInt(initialActivity[0].appl_2)) + ";appl_3:" + (parseInt(initialActivity[0].appl_3)) + ";appl_4:" + (parseInt(initialActivity[0].appl_4)) + ";appl_5:" + (parseInt(initialActivity[0].appl_5)),
					'viewparams': "districtCode:" + paramValue + ";talukaCode:" + talukaCode
				},
			})
			pocraDBTLayer = new ImageLayer({
				title: "DBT PoCRA",
				source: imgSource
			});
			map.addLayer(pocraDBTLayer);
		} else {
			imgSource = new ImageWMS({
				attributions: ['&copy; DBT PoCRA'],
				crossOrigin: 'Anonymous',
				serverType: 'geoserver',
				visible: true,
				url: "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms?",
				params: {
					'LAYERS': 'PoCRA_Dashboard:' + layerName,
					'TILED': true,
					'env': "propname:" + applicationFor + ";labelName:vilname;appl_1:" + (parseInt(initialActivity[0].appl_1)) + ";appl_2:" + (parseInt(initialActivity[0].appl_2)) + ";appl_3:" + (parseInt(initialActivity[0].appl_3)) + ";appl_4:" + (parseInt(initialActivity[0].appl_4)) + ";appl_5:" + (parseInt(initialActivity[0].appl_5)),
					// 'CQL_FILTER': indate
					'viewparams': "groupID:" + activityId + ";districtCode:" + paramValue + ";talukaCode:" + talukaCode
				},
			})
			pocraDBTLayer = new ImageLayer({
				title: "DBT PoCRA",
				source: imgSource
			});
			map.addLayer(pocraDBTLayer);
		}
	}



	getFarmerActivity() {
		let initialActivity = [];
		var ele = document.getElementById("activity");;
		ele.innerHTML = "<option value='All'>All Activity</option>";
		fetch('http://gis.mahapocra.gov.in/dashboard_testing_api_2020_12_22/meta/dbtActivityMaster?activity=Farmer&activityId=""')
			.then(response => {
				return response.json();
			}).then(data => {
				// console.log(data)
				initialActivity = data.activity.map((activities) => {

					ele.innerHTML = ele.innerHTML +
						'<option value="' + activities.ActivityGroupID + '">' + activities.ActivityGroupName + '</option>';
					return activities = {
						label: activities.ActivityGroupName,
						value: activities.ActivityGroupID,
						TotalNoOfApplications: activities.TotalNoOfApplications,
						TotalNoOfDisbursement: activities.TotalNoOfDisbursement,
						TotalNoOfPreSanction: activities.TotalNoOfPreSanction
					}
				});
				this.setState({

					// activity: [
					// 	initialActivity,
					// ], 
					activity: [initialActivity]


				});

			});


	}
	getDistrict() {
		document.getElementById("customRadio1").checked = true;
		let initialDistrict = [];
		var ele = document.getElementById("district");;
		ele.innerHTML = "<option value='All'>All District</option>";

		fetch('http://gis.mahapocra.gov.in/weatherservices/meta/districts')
			.then(response => {
				return response.json();
			}).then(data => {
				// console.log(data)
				initialDistrict = data.district.map((district) => {
					ele.innerHTML = ele.innerHTML +
						'<option value="' + district.dtncode + '">' + district.dtename + '</option>';
					// return district = {
					// 	label: district.dtename,
					// 	value: district.dtncode,
					// }
				});
				this.setState({
					// district: [
					// 	initialDistrict
					// ], 
					district: [initialDistrict]
				});

			});

	}


	getTaluka(event) {

		var districtCode = event.target.value;
		var initialTaluka = [];
		var ele = document.getElementById("taluka");
		var ele1 = document.getElementById("village");
		if (districtCode === "All") {
			ele.innerHTML = "<option value='All'>All Taluka</option>";
			ele1.innerHTML = "<option value='All'>All Village</option>";
		} else {
			ele.innerHTML = "<option value='All'>All Taluka</option>";
			ele1.innerHTML = "<option value='All'>All Village</option>";
			fetch('http://gis.mahapocra.gov.in/weatherservices/meta/dtaluka?dtncode=' + districtCode)
				.then(response => {
					return response.json();
				}).then(data => {
					initialTaluka = [];
					initialTaluka = data.taluka.map((taluka) => {
						ele.innerHTML = ele.innerHTML +
							'<option value="' + taluka.thncode + '">' + taluka.thename + '</option>';
						// return taluka = {
						// 	label: taluka.thename,
						// 	value: taluka.thncode,
						// }
					});
					// this.setState({
					// 	// ...this.state,
					// 	// 
					// 	taluka: [
					// 		initialTaluka
					// 	]
					// });
				});
		}

		this.updateHeaderLabel();
		// let activity = document.getElementById("activity").value;
		// let district = document.getElementById("district").value;
		// this.getCategoryApplicationCount(activity,district,"All","All");



	}

	getVillage(event) {
		var talukaCode = event.target.value;
		let initialVillage = [];
		var ele = document.getElementById("village");
		if (talukaCode === "All") {
			ele.innerHTML = "<option value='All'>All Village</option>";
		} else {
			ele.innerHTML = "<option value='All'>All Village</option>";
			fetch('http://gis.mahapocra.gov.in/weatherservices/meta/village?thncode=' + talukaCode)
				.then(response => {
					return response.json();
				}).then(data => {
					initialVillage = data.village.map((village) => {
						ele.innerHTML = ele.innerHTML +
							'<option value="' + village.vincode + '">' + village.vinename + '</option>';
						// return village = {
						// 	label: village.vinename,
						// 	value: village.vincode,
						// }
					});
					this.setState({
						// ...this.state,
						// village: [
						// 	initialVillage
						// ],
						village: [initialVillage]

					});
				});
		}

		this.updateHeaderLabel();
		// this.getCategoryApplicationCount();

	}

	getCategoryApplicationCount(activity, district, taluka, village) {
		let activityValue = document.getElementById("activity").value;
		var genderData = [], categoryData = [], farmerTypeData = [];
		fetch('http://gis.mahapocra.gov.in/dashboard_testing_api_2020_12_22/meta/dbtActivitybyID_dtnCode_thnCode_vinCode?activityID=' + activity + '&districtCode=' + district + '&talukaCode=' + taluka + '&villageCode=' + village)
			.then(response => {
				return response.json();
			}).then(data => {
				// console.log(data)
				data.gender.map(gender => {
					genderData.push({
						name: gender.gender,
						y: parseInt(gender.no_of_application)
					})
				})

				data.socialCategory.map(category => {
					categoryData.push({
						name: category.category,
						y: parseInt(category.no_of_application)
					})

				})
				data.farmerType.map(farmer_type => {
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
		// this.updateHeaderLabel();
	}


	handleRadioChange() {
		var customRadio1 = document.getElementById("customRadio1").checked;
		var customRadio2 = document.getElementById("customRadio2").checked;
		var customRadio3 = document.getElementById("customRadio3").checked;
		if (customRadio1 == true && customRadio2 == false && customRadio3 == false) {
			document.getElementById("customRadio1").checked = true;
			document.getElementById("customRadio2").checked = false;
			document.getElementById("customRadio3").checked = false;
			this.updateHeaderLabel("no_of_application")
		} else if (customRadio1 == false && customRadio2 == true && customRadio3 == false) {
			document.getElementById("customRadio1").checked = false;
			document.getElementById("customRadio2").checked = true;
			document.getElementById("customRadio3").checked = false;
			this.updateHeaderLabel("no_of_registration")
		} else if (customRadio1 == false && customRadio2 == false && customRadio3 == true) {
			document.getElementById("customRadio1").checked = false;
			document.getElementById("customRadio2").checked = false;
			document.getElementById("customRadio3").checked = true;
			this.updateHeaderLabel("no_of_paymentdone")
		}


	}

	updateHeaderLabel() {
		var activity = document.getElementById("activity");
		// console.log(activity)
		var district = document.getElementById("district").value;
		// console.log(district)
		var taluka = document.getElementById("taluka").value;
		// console.log(taluka)

		var village = document.getElementById("village").value;
		// console.log(village)
		// console.log(activity.options[activity.selectedIndex].text)
		var applicationFor = "";
		var customRadio1 = document.getElementById("customRadio1").checked;
		var customRadio2 = document.getElementById("customRadio2").checked;
		var customRadio3 = document.getElementById("customRadio3").checked;
		if (customRadio1 == true && customRadio2 == false && customRadio3 == false) {
			document.getElementById("customRadio1").checked = true;
			document.getElementById("customRadio2").checked = false;
			document.getElementById("customRadio3").checked = false;
			applicationFor = "no_of_application";
		} else if (customRadio1 == false && customRadio2 == true && customRadio3 == false) {
			document.getElementById("customRadio1").checked = false;
			document.getElementById("customRadio2").checked = true;
			document.getElementById("customRadio3").checked = false;
			applicationFor = "no_of_registration";
		} else if (customRadio1 == false && customRadio2 == false && customRadio3 == true) {
			document.getElementById("customRadio1").checked = false;
			document.getElementById("customRadio2").checked = false;
			document.getElementById("customRadio3").checked = true;
			applicationFor = "no_of_paymentdone";
		}
		this.setState({
			headerLabel: "Total Application | Activity : " + activity.options[activity.selectedIndex].text
			// + "( " + this.state.total + " )"
			// + " District : " + district + " Taluka : " + taluka + " Village :" + village
		})

		if (activity.value === "All" && district === "All" && taluka === 'All') {
			this.getDBTVectorLayerDistrict(activity.value, applicationFor);
			this.getDBTLayerClassValues(activity.value, applicationFor);
			this.getCategoryApplicationCount(activity.value, district, "All", "All");
		} else if (activity.value != "All" && district === "All" && taluka === 'All') {
			this.getDBTVectorLayerDistrict(activity.value, applicationFor);
			this.getDBTLayerClassValues(activity.value, applicationFor);
			this.getCategoryApplicationCount(activity.value, district, "All", "All");
		} else if (activity.value === "All" && district != "All" && taluka === 'All') {
			this.getDBTVectorLayerTaluka(activity.value, district, applicationFor);
			this.getDBTLayerClassValuesTaluka(activity.value, district, applicationFor);
			this.getCategoryApplicationCount(activity.value, district, "All", "All");
		} else if (activity.value != "All" && district != "All" && taluka === 'All') {
			this.getDBTVectorLayerTaluka(activity.value, district, applicationFor);
			this.getDBTLayerClassValuesTaluka(activity.value, district, applicationFor);
			this.getCategoryApplicationCount(activity.value, district, "All", "All");
		} else if (activity.value === "All" && district != "All" && taluka != 'All') {

			this.getDBTVectorLayerVillage(activity.value, district, taluka, applicationFor);
			this.getDBTLayerClassValuesVillage(activity.value, district, taluka, applicationFor);
			this.getCategoryApplicationCount(activity.value, district, taluka, "All");
		} else if (activity.value != "All" && district != "All" && taluka != 'All') {
			this.getDBTVectorLayerVillage(activity.value, district, taluka, applicationFor);
			this.getDBTLayerClassValuesVillage(activity.value, district, taluka, applicationFor);
			this.getCategoryApplicationCount(activity.value, district, taluka, "All");
		}

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
									<div className="card-header ">
										<h3 className="card-title"><b>Farmer Activity</b></h3>
										{/* <div className="card-tools">
											<button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus" /></button>
											<button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times" /></button>
										</div> */}
									</div>
									{/* /.card-header */}
									<div className="card-body">
										<div className="row">
											<div className="col-md-12">
												<div className="form-group form-inline">
													<div className="col-md-3">
														<select className="form-control  select2" style={{ width: "100%", fontSize: "14px", wordWrap: "normal" }} onChange={this.updateHeaderLabel} id="activity" >
															<option value="All" >All Activity</option>
															{/* {
																this.state.activity[0].map((activity) => {
																	return <option value={activity.value} >{activity.label}</option>
																})
															} */}

														</select>
													</div>
													<div className="col-md-3">
														<select className="form-control  select2" style={{ width: "100%", fontSize: "14px", marginLeft: "0.2%" }} id="district" onChange={this.getTaluka} >
															<option value="All" >District</option>
															{/* {

																this.state.district[0].map(district => {
																	return <option value={district.value} >{district.label}</option>
																})
															} */}

														</select>
													</div>
													<div className="col-md-3">
														<select className=" form-control select2" style={{ width: "100%", fontSize: "14px", marginLeft: "0.2%" }} onChange={this.getVillage} id="taluka">
															<option value="All" >All Taluka</option>
															{/* {

																this.state.taluka[0].map(taluka => {
																	return <option value={taluka.value} >{taluka.label}</option>
																})
															} */}

														</select>
													</div>
													<div className="col-md-3">
														<select className="margin2 form-control select2" style={{ width: "100%", fontSize: "14px", marginLeft: "0.2%" }} id="village" onChange={this.updateHeaderLabel} >
															<option value="All" >All Village</option>
															{/* {
																this.state.village[0].map(village => {
																	return <option value={village.value} >{village.label}</option>
																})
															} */}
														</select>
													</div>
												</div>
											</div>
										</div>
									</div>

								</div>
							</div>{/* /.container-fluid */}
						</section>
					</section>
					<section className="content-header" style={{ marginTop: "-50px" }}>
						<section className="content">
							<div className="container-fluid">
								{/* SELECT2 EXAMPLE */}
								<div className="card card-default" style={{ marginTop: "0.5%" }}>
									<div className="card-header">
										<h3 className="card-title"><b>{this.state.headerLabel}</b></h3>
										<div className="card-tools">
											<button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus" /></button>
											{/* <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times" /></button> */}
										</div>
									</div>
									{/* /.card-header */}
									<div className="card-body">
										<div className="row">
											<section className="content col-3" style={{ position: "absolute", zIndex: "9", top: "8%", left: "1%" }}>
												<div className="container-fluid">
													{/* SELECT2 EXAMPLE */}
													<div className="card card-default" style={{ marginTop: "0.5%" }}>
														<div className="card-header">
															<h3 className="card-title"><b>Applications</b></h3>
															<div className="card-tools">
																<button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus" /></button>
																{/* <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times" /></button> */}
															</div>
														</div>
														{/* /.card-header */}
														<div className="card-body">
															<div className="row">

																<div className="col">
																	<div className="form-group form-inline">
																		<div className="col-md-12">
																			<div class="form-group">
																				{/* <div>
																					<label className="radio-inline"><input type="radio" defaultValue="LULC_Raster" name="baseGroup" onchange="radioChange(this)" /> Land Use / Cover (2015-16)</label>
																					<label className="radio-inline"><input type="radio" defaultValue="SoilTextureRaster" name="baseGroup" onchange="radioChange(this)" /> मृदा पोत</label>
																					<label className="radio-inline" style={{ marginLeft: 6 }}><input type="radio" defaultValue="SoilDepthRaster" name="baseGroup" onchange="radioChange(this)" /> मृदा खोली</label>
																					<label className="radio-inline"><input type="radio" defaultValue="SoilErosionRaster" name="baseGroup" onchange="radioChange(this)" /> मृदेची धूप</label>
																				</div> */}

																				<div class="custom-control custom-radio">
																					<input class="custom-control-input" type="radio" id="customRadio1" name="customRadio" onChange={this.updateHeaderLabel} />
																					<label for="customRadio1" class="custom-control-label" >No. of Applications</label>
																				</div>
																				<div class="custom-control custom-radio">
																					<input class="custom-control-input" type="radio" id="customRadio2" name="customRadio" onChange={this.updateHeaderLabel} />
																					<label for="customRadio2" class="custom-control-label">No. of Registrations</label>
																				</div>
																				<div class="custom-control custom-radio">
																					<input class="custom-control-input" type="radio" id="customRadio3" name="customRadio" onChange={this.updateHeaderLabel} />
																					<label for="customRadio3" class="custom-control-label">No. of Payment Done</label>
																				</div>
																			</div>
																		</div>


																	</div>
																</div>
															</div>
														</div>

													</div>
												</div>{/* /.container-fluid */}
											</section>
											<div className="col-md-12" id="map" style={{ height: "70vh", width: "100%" }}>
											</div>


											<div id={"legend"} className="box stack-top">
												<LegendPanelDashboard props={this.state.classValues} />
											</div>
										</div>
									</div>

								</div>
							</div>{/* /.container-fluid */}
						</section>
					</section>
					<section className="content-header" style={{ marginTop: "-50px" }}>
						<section className="content">
							<div className="container-fluid">
								{/* SELECT2 EXAMPLE */}
								<div className="card card-default" style={{ marginTop: "0.5%" }}>
									<div className="card-header">
										<h3 className="card-title"><b>Total No. of Application</b></h3>
										<div className="card-tools">
											<button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus" /></button>
											{/* <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times" /></button> */}
										</div>
									</div>
									{/* /.card-header */}
									<div className="card-body">
										<div className="row">
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
							</div>{/* /.container-fluid */}
						</section>
					</section>

				</div>

			</div>
		)
	}
}
