import React, { Component } from 'react'

import "ol/ol.css";
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

import * as CU from './Constant'


class MapComponent {
	constructor() {
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
	}


}

export default MapComponent;