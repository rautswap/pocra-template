import React, { Component } from 'react';
import { render } from 'react-dom';

// Import stylesheets
import "ol/ol.css";
import "ol-ext/dist/ol-ext.css";
import Stamen from 'ol/source/Stamen';
import { Map, View } from "ol";
import { defaults } from "ol/control";
import TileLayer from 'ol/layer/Tile';










// Layers
var layers = [
	new TileLayer({
		title: 'terrain-background',
		source: new Stamen({ layer: 'terrain' })
	})
]
// The map
var map = new Map({
	target: null,
	view: new View({
		zoom: 5,
		center: [261720, 5951081]
	}),
	controls: defaults({ "attribution": false }),
	layers: layers
});






class OlMap extends Component {







	componentDidMount() {
		map.setTarget("map");
	}




	render() {









		return (
			<div>
				<div id="map" style={{ width: "1610px", height: "900px" }}></div>

			</div>
		);
	}
}


export default OlMap;