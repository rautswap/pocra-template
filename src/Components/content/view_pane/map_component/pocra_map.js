import 'ol/ol.css';

import {
	Map as OlMap,
	View as OlView,
} from 'ol';
import {
	Tile as TileLayer,
	Image as ImageLayer,
	Vector as VectorLayer
} from 'ol/layer';
import {
	OSM as OSMSource,
	ImageWMS as ImageWMSSource,
	Vector as VectorSource
} from 'ol/source';
import {
	default as GeoJSON
} from 'ol/format/GeoJSON';
import {
	default as WMSGetFeatureInfo
} from 'ol/format/WMSGetFeatureInfo';
import {
	toStringHDMS
} from 'ol/coordinate';
import {
	toLonLat,
	fromLonLat
} from 'ol/proj';
import {
	Circle as CircleStyle,
	Fill,
	Style
} from 'ol/style';
import {
	default as OlOverlay
} from 'ol/Overlay';
import {
	Control,
	ScaleLine as ScaleLineControl
} from 'ol/control';
import {
	transformExtent
} from 'ol/proj';
import {
	boundingExtent
} from 'ol/extent';


import './pocra_map.css';

import * as CU from './constants_and_utilities';



class PoCRAMap {

	constructor({target, geoserver_base_url, initial_layers, requested_layers, view_pane_dispatch}) {

		if ((typeof(target) !== "string") && (
			typeof(target) !== "object" || target.constructor.name !== "HTMLDivElement"
		))
			return;

		this.base_layer = new TileLayer({
			title: initial_layers.base_layer.title,
			source: (initial_layers.base_layer.source === 'OSM') ? new OSMSource() : null,
			visible: initial_layers.base_layer.visible,
			zIndex: initial_layers.base_layer.z_index
		});
		this.map = new OlMap({
			target: target,
			layers: [this.base_layer],
			view: new OlView({
				projection: 'EPSG:4326',
				center: [76.5, 19.5],
				zoom: 7
			})
		});
		this.map.addControl(new ScaleLineControl());

		class TitleControl extends Control {
			constructor(options) {
				super({element: document.getElementById('title-div')});
			}
		}
		this.map.addControl(new TitleControl());
		
		class LayersControl extends Control {
			constructor(options) {
				super({element: document.getElementById('layers-div')});
			}
		}
		this.map.addControl(new LayersControl());

		// class ActionsControl extends Control {
		// 	constructor(options) {
		// 		super({element: document.getElementById('actions-div')});
		// 	}
		// }
		// this.map.addControl(new ActionsControl());

		class LegendButtonControl extends Control {
			constructor(options) {
				super({element: document.getElementById('legend-button-div')});
			}
		}
		this.map.addControl(new LegendButtonControl());
		class LegendControl extends Control {
			constructor(options) {
				super({element: document.getElementById('legend-div')});
			}
		}
		this.map.addControl(new LegendControl());

		class PanControl extends Control {
			constructor(options) {
				super({element: document.getElementById('pan-div')});
			}
		}
		this.map.addControl(new PanControl());

		

		const map_popup = document.getElementById('map-popup');
		const map_popup_closer = document.getElementById('map-popup-closer');
		this.map_popup_overlay = new OlOverlay({
			element: map_popup,
			//// auto-panning is not working;
			//// so using this.map_popup_overlay.panIntoView()
			//// in this.set_map_popup_overlay_position()
			// autoPan: true,
			// autoPanAnimation: {
			// 	duration: 250
			// }
		});
		map_popup_closer.onclick = () => view_pane_dispatch({
			type: 'set-map-click-coordinate',
			payload: {
				coordinate: null,
				coordinate_HDMS_string: '',
				properties: {}
			}
		});
		this.map_popup_overlay.setPosition(null);
		this.map.on('click', this.handle_map_click_event);
		this.map.addOverlay(this.map_popup_overlay);

		initial_layers.admin_layers.forEach(l => {
			this[l.variable_name] = new ImageLayer({
				title: l.title,
				source: new ImageWMSSource({
					url: CU.BUILD_MAP_URL({
						layers: l.name_in_geoserver,
						styles: l.style_in_geoserver,
					}),
					serverType: 'geoserver'
				}),
				visible: l.visible,
				zIndex: l.z_index
			});
			this.map.addLayer(this[l.variable_name]);
		});
		
		this.requested_layers = [];

		this.map.on('moveend', this.handle_moveend);

		this.view_pane_dispatch = view_pane_dispatch;

	}

	set_map_popup_overlay_position = coordinate => {
		this.map_popup_overlay.setPosition(coordinate);
		if (coordinate !== null) {
			this.map_popup_overlay.panIntoView({animation: {duration: 250}, margin: 20});
		}
	};

	handle_map_click_event = event => {
		fetch( `${process.env.REACT_APP_POCRAGIS_API_BASE_URL}/meta/point_details?lon=${event.coordinate[0]}&lat=${event.coordinate[1]}` )
		.then(response => response.text())
		.then(json => {
			console.log(json);
			return JSON.parse(json);
		}).then(point_details => {
			this.view_pane_dispatch({
				type: 'set-map-click-coordinate',
				payload: {
					coordinate: event.coordinate,
					coordinate_HDMS_string: toStringHDMS(event.coordinate),
					data: point_details
				}
			});
		})
		return;

		//// deprecated
		// const result = this.map.forEachFeatureAtPixel(event.pixel, (feature, layer) => ({feature, layer}))
		// // console.log(feature, Object.keys(feature));
		// // console.log(feature.get('village'));
		// // console.log(result);
		// let layers = [];
		// this.map.forEachLayerAtPixel( event.pixel, (layer, rgba) => {
		// 	layers.push(layer)
		// });
		// console.log(layers);


		// // console.log(this.layer_district);
		// // let url = this.layer_district.getSource().getFeatureInfoUrl(
		// // 	event.coordinate, this.map.getView().getResolution(),
		// // 	'EPSG:4326', {
		// // 		'INFO_FORMAT': 'application/json',
		// // 		'LAYERS': 'pocra_gis_new:daily_indicators,pocra_gis_new:daily_station_indicators,pocra_gis_new:weekly_station_indicators,pocra_gis_new:monthly_station_indicators,pocra_gis_new:accumulative_weather_indicators',
		// // 		'QUERY_LAYERS': 'pocra_gis_new:daily_indicators,pocra_gis_new:daily_station_indicators,pocra_gis_new:weekly_station_indicators,pocra_gis_new:monthly_station_indicators,pocra_gis_new:accumulative_weather_indicators',
		// // 		// 'QUERY_LAYERS': [
		// // 		// 	"Yesterday's Rainfall",
		// // 		// 	"Yesterday's Average Temperature",
		// // 		// 	"Yesterday's Average Relative Humidity",
		// // 		// 	"Yesterday's Average Wind Speed",
		// // 		// ].includes(layer.get('title'))
		// // 		// ? 'pocra_gis_new:daily_weather_indicators,pocra_gis_new:daily_station_indicators'
		// // 		// : 'pocra_gis_new:accumulative_weather_indicators,pocra_gis_new:accum_station_indicators',
		// // 		'FEATURE_COUNT': '10'
		// // 	}
		// // );
		// // fetch(url)
		// // .then(response => response.text())
		// // .then(json => {
		// // 	console.log(json);
		// // 	let point_data = {};
		// // 	for (const f of json.features) {
		// // 		let category = f.id.split('.')[0];
		// // 		console.log();
		// // 		if (point_data[category] === undefined) {
		// // 			point_data[category] = {}
		// // 		}
		// // 		for (const p in f.properties) {
		// // 			if (p !== 'id') {
		// // 				point_data[category][p] = f.properties[p];
		// // 			}
		// // 		}
		// // 	}
		// // 	console.log(point_data);
		// // 	this.view_pane_dispatch({
		// // 		type: 'set-map-click-coordinate',
		// // 		payload: {
		// // 			coordinate: event.coordinate,
		// // 			coordinate_HDMS_string: toStringHDMS(event.coordinate),
		// // 			feature_id: result ? {dataset: result.layer.get('dataset'), id: result.feature.get('id')} : null,
		// // 			data: point_data
		// // 		}
		// // 	});
		// // });



		// let promises = [];
		// for (const layer of layers) {
		// 	if ( ! (layer.get('title').includes('Rain'))
		// 		&& ! (layer.get('title').includes('Temperature'))
		// 		&& ! (layer.get('title').includes('Humidity'))
		// 		&& ! (layer.get('title').includes('Wind'))
		// 		&& ! (layer.get('title').includes('Cotton'))
		// 		&& ! (layer.get('title').includes('Soyabean'))
		// 	) {
		// 		continue;
		// 	}
		// 	console.log('inside');
		// 	let url = layer.getSource().getFeatureInfoUrl(
		// 		event.coordinate, this.map.getView().getResolution(),
		// 		'EPSG:4326', {
		// 			'INFO_FORMAT': 'application/json',
		// 			'LAYERS': 'pocra_gis_new:daily_indicators,pocra_gis_new:daily_station_indicators,pocra_gis_new:weekly_station_indicators,pocra_gis_new:monthly_station_indicators,pocra_gis_new:accumulative_weather_indicators',
		// 			'QUERY_LAYERS': 'pocra_gis_new:daily_indicators,pocra_gis_new:daily_station_indicators,pocra_gis_new:weekly_station_indicators,pocra_gis_new:monthly_station_indicators,pocra_gis_new:accumulative_weather_indicators',
		// 			// 'QUERY_LAYERS': [
		// 			// 	"Yesterday's Rainfall",
		// 			// 	"Yesterday's Average Temperature",
		// 			// 	"Yesterday's Average Relative Humidity",
		// 			// 	"Yesterday's Average Wind Speed",
		// 			// ].includes(layer.get('title'))
		// 			// ? 'pocra_gis_new:daily_weather_indicators,pocra_gis_new:daily_station_indicators'
		// 			// : 'pocra_gis_new:accumulative_weather_indicators,pocra_gis_new:accum_station_indicators',
		// 			'FEATURE_COUNT': '10'
		// 		}
		// 	);
		// 	console.log(url);
		// 	if (url) {
		// 		promises.push(
		// 			fetch(url)
		// 			.then(response => response.text())
		// 			.then(json => {
		// 				console.log(json);
		// 				return JSON.parse(json);
		// 			})
		// 		);
		// 	}
		// }
		// Promise.all(promises).then(values => {
		// 	let point_data = {};
		// 	for (const data of values) {
		// 		for (const f of data.features) {
		// 			let category = f.id.split('.')[0];
		// 			console.log();
		// 			if (point_data[category] === undefined) {
		// 				point_data[category] = {}
		// 			}
		// 			for (const p in f.properties) {
		// 				if (p !== 'id') {
		// 					point_data[category][p] = f.properties[p];
		// 				}
		// 			}
		// 		}
		// 	}
		// 	console.log(point_data);
		// 	this.view_pane_dispatch({
		// 		type: 'set-map-click-coordinate',
		// 		payload: {
		// 			coordinate: event.coordinate,
		// 			coordinate_HDMS_string: toStringHDMS(event.coordinate),
		// 			feature_id: result ? {dataset: result.layer.get('dataset'), id: result.feature.get('id')} : null,
		// 			data: point_data
		// 		}
		// 	});
		// });
	};

	zoom_to_extent = extent => {
		// console.log(extent);
		// extent = transformExtent(extent, 'EPSG:4326', 'EPSG:3857');
		// console.log(extent);
		this.map.getView().fit(extent, {
			size: this.map.getSize(),
			duration: 2000
		});
	};

	add_point_layer_from_data = (data, z_index, dataset) => {
		// console.log(data.length);
		// console.log(z_index);

		const geojsonObject = {
			type: 'FeatureCollection',
			crs: {
				type: 'name',
				properties: {
					name: 'EPSG:4326'
				}
			},
			features: data.map(d => ({
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [parseFloat(d.lon), parseFloat(d.lat)]
				},
				properties: {...d}
			}))
		};
		// console.log(geojsonObject);
		const vectorSource = new VectorSource({
			features: (new GeoJSON()).readFeatures(geojsonObject)
		});
		
		const vectorLayer = new VectorLayer({
			source: vectorSource,
			style: new Style({
				image: new CircleStyle({
					radius: dataset.includes('Skymet')  ? 3 : 4,
					fill: new Fill({
						color: dataset.includes('Skymet')  ? 'rgb(100, 100, 255)' : 'rgb(200, 150, 50)'
					})
				})
			}),
			visible: true,
			zIndex: z_index
		});
		vectorLayer.set('dataset', dataset);
		const new_length = this.requested_layers.push(vectorLayer);
		this.map.addLayer(vectorLayer);
		this.view_pane_dispatch({
			type: 'set-added-layer-index',
			payload: { added_layer_index: new_length - 1 }
		});
		this.view_pane_dispatch({type: 'clear-new-layer-added'});
	};

	add_wms_layer = layer_info => {
		let wmsLayer = new ImageLayer({
			title: layer_info.title,
			source: new ImageWMSSource({
				url: CU.BUILD_MAP_URL({
					layers: layer_info.name_in_geoserver,
					styles: layer_info.style_in_geoserver,
					env: ( layer_info.style_env_params
						? Object.entries(layer_info.style_env_params).map(
							([k, v]) => `${k}:${v}`
						).join(';')
						: ''
					)
				}),
				serverType: 'geoserver',
				crossOrigin: 'anonymous'
			}),
			visible: layer_info.visible,
			zIndex: layer_info.z_index
		});
		wmsLayer.set('dataset', layer_info.dataset);
		const new_length = this.requested_layers.push(wmsLayer);
		this.map.addLayer(wmsLayer);
		this.view_pane_dispatch({
			type: 'set-added-layer-index',
			payload: { added_layer_index: new_length - 1 }
		});
		this.view_pane_dispatch({type: 'clear-new-layer-added'});

		console.log(this.requested_layers);
	};

	remove_layer_having_title = title => {
		let layer = this.requested_layers.filter(l => l.get('title') === title)[0];
		this.map.removeLayer(layer);
		this.requested_layers = this.requested_layers.filter(l => l.get('title') !== title);
		this.view_pane_dispatch({type: 'clear-layer-removed'});
		console.log(this.requested_layers);
	};

	replace_layer = layer_info => {
		this.requested_layers = this.requested_layers.map(l => {
			if (l.get('title') === layer_info.title) {
				this.map.removeLayer(l);
				let new_l = new ImageLayer({
					title: layer_info.title,
					source: new ImageWMSSource({
						url: CU.BUILD_MAP_URL({
							layers: layer_info.name_in_geoserver,
							styles: layer_info.style_in_geoserver,
							env: ( layer_info.style_env_params
								? Object.entries(layer_info.style_env_params).map(
									([k, v]) => `${k}:${v}`
								).join(';')
								: ''
							)
						}),
						serverType: 'geoserver'
					}),
					visible: layer_info.visible,
					zIndex: layer_info.z_index
				});
				this.map.addLayer(new_l);
				return new_l;
			} else {
				return l;
			}
		});
		this.view_pane_dispatch({type: 'clear-layer-restyled'});
	}

	set_layer_visibility = (layer_spec, visibility) => {
		switch(layer_spec.type) {
			case 'base':
				this.base_layer.setVisible(visibility);
				return;
			case 'admin':
				this[layer_spec.var_name].setVisible(visibility);
				return;
			case 'requested':
				console.log(this.requested_layers);
				this.requested_layers.forEach(l => {
					console.log('Title is : ', l.get('title'), 'layer_spec.title is : ', layer_spec.title);
					console.log('visibility is : ', visibility);
					if (l.get('title') === layer_spec.title) {
						l.setVisible(visibility);
					}					
				});
				return;
		}
	};

	handle_moveend = evt => {
		let visible_layer_titles = [];
		const zoomLevel = this.map.getView().getZoom();
		// if ((zoomLevel <= 6 && !this.layer_pocra_region.getVisible()))
		// 	this.view_pane_dispatch({type: 'toggle-admin-layer-visibility', payload: {title: CU.POCRA_REGION_LAYER_TITLE}});
		// (zoomLevel > 6 && !this.layer_district.getVisible()) || 
		if (zoomLevel <= 6 && !this.layer_district.getVisible())
			this.view_pane_dispatch({type: 'toggle-admin-layer-visibility', payload: {title: CU.DISTRICT_LAYER_TITLE}});
		if ((zoomLevel > 8 && !this.layer_taluka.getVisible()) || (zoomLevel <= 8 && this.layer_taluka.getVisible()))
			this.view_pane_dispatch({type: 'toggle-admin-layer-visibility', payload: {title: CU.TALUKA_LAYER_TITLE}});
		// if ((zoomLevel > 10 && !this.layer_cluster.getVisible()) || (zoomLevel <= 10 && this.layer_cluster.getVisible()))
		// 	this.view_pane_dispatch({type: 'toggle-admin-layer-visibility', payload: {title: CU.CLUSTER_LAYER_TITLE}});
		if ((zoomLevel > 11 && !this.layer_pocra_village.getVisible()) || (zoomLevel <= 11 && this.layer_pocra_village.getVisible()))
			this.view_pane_dispatch({type: 'toggle-admin-layer-visibility', payload: {title: CU.POCRA_VILLAGE_LAYER_TITLE}});
	};
	// handle_moveend(evt) {
	// 	let visible_layer_titles = [];
	// 	const zoomLevel = this.map.getView().getZoom();
	// 	this.layer_district.setVisible(this.layer_district.getVisible() || zoomLevel <= 8);
	// 	if (this.layer_district.getVisible()) visible_layer_titles.push(constants.DISTRICT_LAYER_TITLE);
	// 	this.layer_taluka.setVisible(zoomLevel > 8);
	// 	if (this.layer_taluka.getVisible()) visible_layer_titles.push(constants.TALUKA_LAYER_TITLE);
	// 	this.layer_cluster.setVisible(zoomLevel > 10);
	// 	if (this.layer_cluster.getVisible()) visible_layer_titles.push(constants.CLUSTER_LAYER_TITLE);
	// 	this.layer_village.setVisible(zoomLevel > 12);
	// 	if (this.layer_village.getVisible()) visible_layer_titles.push(constants.VILLAGE_LAYER_TITLE);
	// 	this.props.set_admin_layer_visibility_due_to_zoom(visible_layer_titles);
	// }



}


export default PoCRAMap;