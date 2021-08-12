import React, { Component } from 'react'
import './MapComponents/Map.css';
import "ol/ol.css";
import "ol-ext/dist/ol-ext.css";
import { Map, View } from "ol";

import OSM from 'ol/source/OSM';
import { ScaleLine, MousePosition, defaults as defaultControls } from 'ol/control';
import { format } from 'ol/coordinate';
import { transform } from 'ol/proj';
import { Image as ImageLayer, Tile as TileLayer } from 'ol/layer';
import TileWMS from 'ol/source/TileWMS'
import Moment from 'moment';


let data = '';
class Forecast extends Component {

    constructor() {
        super();

        this.state = {
            todate: "",
            mindate: "",
            maxdate: "",
            rain1: "",
            rain2: "",
            rain3: "",
            rain4: "",
            rain5: "",
            maxrainfall: "",
            tempmax1: "",
            tempmax2: "",
            tempmax3: "",
            tempmax4: "",
            tempmin1: "",
            tempmin2: "",
            tempmin3: "",
            tempmin4: "",
        }
        // latLong = '&nbsp;&nbsp; Latitude : {y}, &nbsp;&nbsp; Longitude: {x} &nbsp;&nbsp;';
        this.scaleLineControl = new ScaleLine({
            units: 'metric',
            type: 'scalebar',
            bar: false,
            steps: 2,
            minWidth: 150
        });
        this.mouse = new MousePosition({
            projection: 'EPSG:4326',
            coordinateFormat: function (coordinate) {
                return format(coordinate, "&nbsp;&nbsp; Latitude : {y}, &nbsp;&nbsp; Longitude: {x} &nbsp;&nbsp;", 4);
            }
        });
        this.layers = [
            new TileLayer({
                source: new OSM(),
            }), new TileLayer({
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
        this.map = new Map({
            target: null,
            view: new View({
                zoom: 7,
                center: transform([77.50, 18.95], 'EPSG:4326', 'EPSG:3857'),
            }),
            controls: defaultControls().extend([this.mouse, this.scaleLineControl]),
            layers: this.layers
        });


    }


    componentDidMount() {
        this.map.setTarget("map");
        const response =fetch("http://gis.mahapocra.gov.in/weatherservices/meta/getforecastdate")
            .then(response => response.json())
            .then(data => {
                this.setState(prev => ({
                    todate: data.forecast[0].today,
                    mindate: data.forecast[0].mindate,
                    maxdate: data.forecast[0].maxdate,
                    rain1: data.forecast[0].rain_class1,
                    rain2: data.forecast[0].rain_class2,
                    rain3: data.forecast[0].rain_class3,
                    rain4: data.forecast[0].rain_class4,
                    rain5: data.forecast[0].rain_class5,
                    maxrainfall: data.forecast[0].maxrainfall,
                    tempmax1: data.forecast[0].temp_max1,
                    tempmax2: data.forecast[0].temp_max2,
                    tempmax3: data.forecast[0].temp_max3,
                    tempmax4: data.forecast[0].temp_max4,
                    tempmin1: data.forecast[0].temp_min1,
                    tempmin2: data.forecast[0].temp_min2,
                    tempmin3: data.forecast[0].temp_min3,
                    tempmin4: data.forecast[0].temp_min4,
                }));
            });
       
        console.log(response);

    }
    setTime() {
        // console.log(data)
    }

    render() {
        return (

            <div >
                <div className="content-wrapper">
                    {/* Content Header (Page header) */}
                    <section className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <label style={{ paddingTop: 9, color: "rgb(248, 112, 33)" }}>IMD Weather Forecast (  {Moment(this.state.mindate).format('DD-MM-YYYY')} - {Moment(this.state.maxdate).format('DD-MM-YYYY')} )</label>
                                </div>
                                <div className="col-sm-6 float-sm-right">
                                    <ol className="breadcrumb float-sm-right">
                                        <li className="nav-item dropdown">
                                            <div className="form-group" style={{ padding: 5 }}>
                                                <select className="form-control">
                                                    <option value="rainfall">Rainfall</option>
                                                    <option value="mintemprature">Minimum Temprature</option>
                                                    <option value="maxtemprature">Maximum Temprature</option>
                                                </select>
                                            </div>
                                        </li>
                                        <li className="nav-item dropdown">
                                            <div className="form-group" style={{ padding: 5 }}>
                                                <label>Forecast on Date: {Moment(this.state.mindate).format('DD-MM-YYYY')}</label>
                                            </div>
                                        </li>
                                        <li className="nav-item dropdown">
                                            <a className="nav-link" >
                                                <i class="fas fa-backward" title={"Privious"} onClick={this.setTime}></i>
                                            </a>
                                        </li>
                                        <li className="nav-item dropdown">
                                            <a className="nav-link" >
                                                <i class="fas fa-play" title={"Play"}></i>
                                            </a>
                                        </li>
                                        <li className="nav-item dropdown">
                                            <a className="nav-link" >
                                                <i class="fas fa-pause" title={"Pause"}></i>
                                            </a>
                                        </li>
                                        <li className="nav-item dropdown">
                                            <a className="nav-link" >
                                                <i class="fas fa-forward" title={"Next"}></i>
                                            </a>
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </div>{/* /.container-fluid */}
                    </section>
                    {/* Main content */}
                    <section className="content" style={{ marginTop: -36 }}>
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



export default Forecast;