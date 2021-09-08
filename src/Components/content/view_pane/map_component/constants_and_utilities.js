// import { GEOSERVER_BASE_URL } from '../../../constants';
export const GEOSERVER_BASE_URL = process.env.REACT_APP_GEOSERVER_BASE_URL;
export const GEOSERVER_WORKSPACE_NAME = process.env.REACT_APP_GEOSERVER_WORKSPACE_NAME;
// console.log(process.env.REACT_APP_GEOSERVER_BASE_URL);
export const GEOSERVER_POCRAGIS_WMS_BASE_URL = (new URL(`/geoserver/${GEOSERVER_WORKSPACE_NAME}/wms`, GEOSERVER_BASE_URL)).toString();
export const GEOSERVER_POCRAGIS_WMS_MAP_COMMON_PARAMS = {
	service: 'WMS', version: '1.1.0', request: 'GetMap',
	srs: 'EPSG:32643', format: 'image/png',
};
export const GEOSERVER_POCRAGIS_WMS_LEGEND_COMMON_PARAMS = {
	service: 'WMS', version: '1.1.0', request: 'GetLegendGraphic', format: 'image/png',
};
export const BUILD_MAP_URL = params => GEOSERVER_POCRAGIS_WMS_BASE_URL + '?' + (
	new URLSearchParams({...GEOSERVER_POCRAGIS_WMS_MAP_COMMON_PARAMS, ...params})
).toString();
export const BUILD_LEGEND_GRAPHIC_URL = params => GEOSERVER_POCRAGIS_WMS_BASE_URL + '?' + (
	new URLSearchParams({...GEOSERVER_POCRAGIS_WMS_LEGEND_COMMON_PARAMS, ...params})
).toString();

export const VILLAGE_LAYER_TITLE = 'All Villages of PoCRA Districts';
export const POCRA_VILLAGE_LAYER_TITLE = 'PoCRA Villages';
export const CLUSTER_LAYER_TITLE = 'All Clusters of PoCRA Districts';
export const POCRA_CLUSTER_LAYER_TITLE = 'PoCRA Clusters';
export const TALUKA_LAYER_TITLE = 'Talukas in PoCRA Districts';
export const DISTRICT_LAYER_TITLE = 'PoCRA Districts';
export const POCRA_REGION_LAYER_TITLE = 'Entire Region of PoCRA Districts';
export const BASE_LAYER_TITLE = 'OpenStreetMap Base Layer';

export const INITIAL_LAYERS = {
	base_layer: {
		title: BASE_LAYER_TITLE,
		variable_name: 'base_layer',
		source: 'OSM',
		visible: true,
		z_index: 0
	},
	admin_layers: [{
		title: DISTRICT_LAYER_TITLE,
		variable_name: 'layer_district',
		name_in_geoserver: `${GEOSERVER_WORKSPACE_NAME}:pocra_districts`,
		style_in_geoserver: `${GEOSERVER_WORKSPACE_NAME}:pocra_districts`,
		visible: true,
		z_index: 5
	}, {
		title: TALUKA_LAYER_TITLE,
		variable_name: 'layer_taluka',
		name_in_geoserver: `${GEOSERVER_WORKSPACE_NAME}:pocra_districts_all_talukas`,
		style_in_geoserver: `${GEOSERVER_WORKSPACE_NAME}:pocra_districts_all_talukas`,
		visible: false,
		z_index: 4
	}, {
		title: POCRA_CLUSTER_LAYER_TITLE,
		variable_name: 'layer_pocra_cluster',
		name_in_geoserver: `${GEOSERVER_WORKSPACE_NAME}:pocra_clusters`,
		style_in_geoserver: `${GEOSERVER_WORKSPACE_NAME}:pocra_districts_all_clusters`,
		visible: false,
		z_index: 3.5
	}, {
		title: CLUSTER_LAYER_TITLE,
		variable_name: 'layer_cluster',
		name_in_geoserver: `${GEOSERVER_WORKSPACE_NAME}:pocra_districts_all_clusters`,
		style_in_geoserver: `${GEOSERVER_WORKSPACE_NAME}:pocra_districts_all_clusters`,
		visible: false,
		z_index: 3
	}, {
		title: POCRA_VILLAGE_LAYER_TITLE,
		variable_name: 'layer_pocra_village',
		// name_in_geoserver: `${GEOSERVER_WORKSPACE_NAME}:pocra_districts_all_talukas_villages`, // old name
		// style_in_geoserver: `${GEOSERVER_WORKSPACE_NAME}:pocra_districts_all_talukas_villages`, // old name
		name_in_geoserver: `${GEOSERVER_WORKSPACE_NAME}:pocra_villages`,
		style_in_geoserver: `${GEOSERVER_WORKSPACE_NAME}:pocra_districts_all_villages`,
		visible: false,
		z_index: 2.5
	}, {
		title: VILLAGE_LAYER_TITLE,
		variable_name: 'layer_village',
		// name_in_geoserver: `${GEOSERVER_WORKSPACE_NAME}:pocra_districts_all_talukas_villages`, // old name
		// style_in_geoserver: `${GEOSERVER_WORKSPACE_NAME}:pocra_districts_all_talukas_villages`, // old name
		name_in_geoserver: `${GEOSERVER_WORKSPACE_NAME}:pocra_districts_all_villages`,
		style_in_geoserver: `${GEOSERVER_WORKSPACE_NAME}:pocra_districts_all_villages`,
		visible: false,
		z_index: 2
	// }, {
	// 	title: POCRA_REGION_LAYER_TITLE,
	// 	variable_name: 'layer_pocra_region',
	// 	name_in_geoserver: `${GEOSERVER_WORKSPACE_NAME}:entire_pocra_districts_region`,
	// 	style_in_geoserver: `${GEOSERVER_WORKSPACE_NAME}:polygon_no_fill`,
	// 	visible: true,
	// 	z_index: 1
	}],
	// layers: [1, 2, 3].map(i => ({
	// 	short_title: 'FFS Layer ' + i.toString(),
	// 	full_title: 'Farm Field School : Layer ' + i.toString(),
	// 	source_data_key: 'FFS',
	// 	visible: false,
	// 	z_index: 
	// 	filter: {},
	// 	buttons: ['filter', 'style', 'download']
	// }))
};