import React, { Component } from 'react'
import './MapComponents/Map.css';
import "ol/ol.css";
import "ol-ext/dist/ol-ext.css";
import { Map, Tile, View } from "ol";

import OSM from 'ol/source/OSM';
import { ScaleLine, MousePosition, defaults as defaultControls } from 'ol/control';
import { format } from 'ol/coordinate';
import { transform } from 'ol/proj';
import { Image as ImageLayer, Tile as TileLayer } from 'ol/layer';
import TileWMS from 'ol/source/TileWMS'
var latLong = '&nbsp;&nbsp; Latitude : {y}, &nbsp;&nbsp; Longitude: {x} &nbsp;&nbsp;';
var scaleLineControl = new ScaleLine({
    units: 'metric',
    type: 'scalebar',
    bar: false,
    steps: 2,
    minWidth: 150
});
var mouse = new MousePosition({
    projection: 'EPSG:4326',
    coordinateFormat: function (coordinate) {
        return format(coordinate, latLong, 4);
    }
});
var layers = [
    new TileLayer({
        source: new OSM(),
    }),new TileLayer({
		source: new TileWMS({
			url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms',
			crossOrigin: 'Anonymous',
			serverType: 'geoserver',
			visible: true,
			params: {
				'LAYERS': 'PoCRA:MahaDist',
				'TILED': true,
			}
		}),
	}),

]

// The map
var map = new Map({
    target: null,
    view: new View({
        zoom: 7,
        center: transform([77.50, 18.95], 'EPSG:4326', 'EPSG:3857'),
    }),
    controls: defaultControls().extend([mouse, scaleLineControl]),
    layers: layers
});
class OlMap extends Component {
    componentDidMount() {
        map.setTarget("map");
    }
    render() {
        return (
            <div>
                <div className="content-wrapper">
                    {/* Content Header (Page header) */}
                    <section className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1>Forecast</h1>
                                </div>
                                <div className="col-sm-6">
                                    <ol className="breadcrumb float-sm-right">
                                    </ol>
                                </div>
                            </div>
                        </div>{/* /.container-fluid */}
                    </section>
                    {/* Main content */}
                    <section className="content">
                        {/* Default box */}
                        <div className="card card-solid">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12 col-sm-12" id="map" style={{ height: "80vh" }}>
                                    </div>
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
export default OlMap;