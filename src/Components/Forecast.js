import React, { Component } from 'react'
import './MapComponents/Map.css';
import "ol/ol.css";
import "ol-ext/dist/ol-ext.css";
import { Map, View } from "ol";

import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { ScaleLine, MousePosition, defaults as defaultControls } from 'ol/control';
import { format } from 'ol/coordinate';
import { transform } from 'ol/proj';
import { Image as ImageLayer, Tile as TileLayer } from 'ol/layer';
import TileWMS from 'ol/source/TileWMS'
import ImageWMS from 'ol/source/ImageWMS'
import Moment from 'moment';


let startDate = "", sdate = "";
let frameRate = 0.5; // frames per second
let animationId = null, imdlayer, MahaDist, minimumDate;
let rain_class1, rain_class2, rain_class3, rain_class4, rain_class5, maxrainfall;
let rain1, rain2, rain3, rain4, rain5, tempmax1, tempmax2, tempmax3, tempmax4, tempmin1, tempmin2, tempmin3, tempmin4;
class Forecast extends Component {

    constructor(props) {
        super(props);

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

        let topo = new TileLayer({
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
        MahaDist = new TileLayer({
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
        });



        this.map = new Map({
            target: null,
            view: new View({
                zoom: 7,
                center: transform([77.50, 18.95], 'EPSG:4326', 'EPSG:3857'),
            }),
            controls: defaultControls().extend([this.mouse, this.scaleLineControl]),
            layers: [topo]
        });
        this.setTime = this.setTime.bind(this);
        this.stop = this.stop.bind(this);
        this.play = this.play.bind(this);
        this.loadMap = this.loadMap.bind(this);
        // this.updateLegend = this.updateLegend.bind(this);
    }


    componentDidMount() {
        this.map.setTarget("map");
        this.getForecastData();


    }

    async getForecastData() {
        const response = fetch("http://gis.mahapocra.gov.in/weatherservices/meta/getforecastdate")
            .then(response => response.json())
            .then(data => {
                this.setState(prev => ({
                    todate: data.forecast[0].today,
                    mindate: data.forecast[0].mindate,
                    minimumdate: data.forecast[0].mindate,
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
                this.loadMap(data.forecast[0].mindate);
            });

    }

    loadMap = (forecatdate) => {
        // let elevalue = document.getElementById("mapselect").value;
        if (imdlayer) {
            this.map.removeLayer(imdlayer);
        }
        if (MahaDist) {
            this.map.removeLayer(MahaDist);

        }
        // if (elevalue === "rainfall") {
        this.propname = "rainfall_mm";
        this.label = "Rainfall";
        // // document.getElementById("legendTitle").innerHTML = label + '(mm)';
        rain_class1 = this.state.rain1;
        rain_class2 = this.state.rain2;
        rain_class3 = this.state.rain3;
        rain_class4 = this.state.rain4;
        rain_class5 = this.state.rain5;

        console.log(forecatdate)
        // legend = new ol.legend.Legend({
        //     title: label,
        //     // style: getFeatureStyle
        // })
        // legendCtrl = new ol.control.Legend({
        //     legend: legend,
        //     collapsed: false
        // });
        // map.addControl(legendCtrl);
        // legend.addItem({
        //     title: (parseInt(rain_class1)) + " - " + (parseInt(rain_class2)),
        //     typeGeom: 'Point',
        //     style: new ol.style.Style({
        //         image: new ol.style.Icon({
        //             size: [35, 35],
        //             src: "./legend/forcast1.jpg"
        //         })
        //     })
        // });
        // legend.addItem({
        //     title: (parseInt(rain_class2) + 0.1) + " - " + (parseInt(rain_class3)),
        //     typeGeom: 'Point',
        //     style: new ol.style.Style({
        //         image: new ol.style.Icon({
        //             size: [35, 35],
        //             src: "./legend/forcast2.jpg"
        //         })
        //     })
        // });
        // legend.addItem({
        //     title: (parseInt(rain_class3) + 0.1) + " - " + (parseInt(rain_class4)),
        //     typeGeom: 'Point',
        //     style: new ol.style.Style({
        //         image: new ol.style.Icon({
        //             size: [35, 35],
        //             src: "./legend/forcast3.jpg"
        //         })
        //     })
        // });
        // legend.addItem({
        //     title: (parseInt(rain_class4) + 0.1) + " and above ",
        //     typeGeom: 'Point',
        //     style: new ol.style.Style({
        //         image: new ol.style.Icon({
        //             size: [35, 35],
        //             src: "./legend/forcast4.jpg"
        //         })
        //     })
        // });
        // }
        console.log("propname:" + this.propname + ";rain1:" + (parseInt(rain_class2)) + ";rain2:" + (parseInt(rain_class2) + 0.1) + ";rain3:" + (parseInt(rain_class3)) + ";rain4:" + (parseInt(rain_class3) + 0.1) + ";rain5:" + (parseInt(rain_class4)) + ";rain6:" + (parseInt(rain_class4) + 0.1))
        var indate = "forecast_date IN('" + Moment(forecatdate).format('YYYY-MM-DD') + "')";
        imdlayer = new ImageLayer({
            title: "IMD Forecast",
            source: new ImageWMS({
                attributions: ['&copy; IMD Forecast'],
                crossOrigin: 'Anonymous',
                serverType: 'geoserver',
                visible: true,
                url: "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms?",
                params: {
                    'LAYERS': 'PoCRA:ForecastView',
                    'TILED': true,
                    'env': "propname:" + this.propname + ";rain1:" + (parseInt(rain_class2)) + ";rain2:" + (parseInt(rain_class2) + 0.1) + ";rain3:" + (parseInt(rain_class3)) + ";rain4:" + (parseInt(rain_class3) + 0.1) + ";rain5:" + (parseInt(rain_class4)) + ";rain6:" + (parseInt(rain_class4) + 0.1),
                    'CQL_FILTER': indate
                },
            })
        });

        this.map.addLayer(imdlayer);
        this.map.getView().calculateExtent(this.map.getSize())
        // Nowadays, map.getSize() is optional most of the time (except if you don't share view between different maps), so above is equivalent to the following

        this.map.getView().fit(
            this.map.getView().calculateExtent(this.map.getSize()), { duration: 1590, size: this.map.getSize() - 100 }
        );
        const resolution = this.map.getView().getResolution();
        // this.updateLegend(resolution);
        let graphicUrl = imdlayer.getSource().getLegendUrl(resolution);
        console.log(graphicUrl)
        let img = document.getElementById('legend');
        img.src = graphicUrl;

    }
    //    updateLegend =  (resolution)=> {
    //         let graphicUrl = imdlayer.getLegendUrl(resolution);
    //         console.log(graphicUrl)
    //         let img = document.getElementById('legend');
    //         img.src = graphicUrl;
    //     };
    // 


    setTime() {
        console.log("setTime call")

        var edate = Moment(this.state.maxdate).format('DD-MM-YYYY')

        startDate = new Date(this.state.mindate);
        startDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
        sdate = Moment(startDate).format('DD-MM-YYYY');
        this.setState({
            mindate: startDate
        });

        if (sdate == edate) {
            this.setState({
                mindate: new Date(new Date(this.state.todate).getTime() + 24 * 60 * 60 * 1000)
            });
            console.log("stop loop")
            this.stop();
        }
        this.loadMap(Moment(startDate).format('YYYY-MM-DD'));
    }

    stop() {
        if (animationId !== null) {
            window.clearInterval(animationId);
            animationId = null;
        }
    };

    play() {
        console.log("play call")
        this.stop();
        animationId = window.setInterval(this.setTime, 5000 / frameRate);
    };
    // zoom_to_extent = extent => {
    // 	// console.log(extent);
    // 	extent = transformExtent(extent, 'EPSG:4326', 'EPSG:3857');
    // 	console.log(extent);
    // 	this.map.getView().fit(extent, {
    // 		size: this.map.getSize(),
    // 		duration: 2000
    // 	});
    // };

    render() {

        return (

            <div >
                <div className="content-wrapper">
                    {/* Content Header (Page header) */}
                    <section className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <label style={{ paddingTop: 9, color: "rgb(248, 112, 33)" }}>IMD Weather Forecast (  {Moment(this.state.minimumdate).format('DD-MM-YYYY')} - {Moment(this.state.maxdate).format('DD-MM-YYYY')} )</label>
                                </div>
                                <div className="col-sm-6 float-sm-right">
                                    <ol className="breadcrumb float-sm-right">
                                        <li className="nav-item dropdown">
                                            <div className="form-group" style={{ padding: 5 }}>
                                                <select className="form-control" id="mapselect">
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
                                                <i class="fas fa-play" title={"Play"} onClick={this.play}></i>
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
                                    Legend:
                                    <div><img id="legend" /></div>
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