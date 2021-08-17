import React, { useEffect, useState } from 'react'
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import TileLayer from 'ol/layer/Tile';
import { Map, View } from "ol";
import "ol/ol.css";
import "ol-ext/dist/ol-ext.css";
import { transform } from 'ol/proj';
import OSM from 'ol/source/OSM';
import { ScaleLine, MousePosition, defaults as defaultControls } from 'ol/control';
import { format } from 'ol/coordinate';
import Moment from 'moment';

const Forecast = () => {
    const [todate, setTodate] = useState('');
    const [minDate, setMinDate] = useState('');
    const [minimumDate, setMinimumDate] = useState('');
    const [maxDate, setMaxDate] = useState('');
    const [rain1, setRain1] = useState('');
    const [rain2, setRain2] = useState('');
    const [rain3, setRain3] = useState('');
    const [rain4, setRain4] = useState('');
    const [rain5, setRain5] = useState('');
    const [maxRainfall, setMaxRainfall] = useState('');
    const [tempmax1, setTempMax1] = useState('');
    const [tempmax2, setTempMax2] = useState('');
    const [tempmax3, setTempMax3] = useState('');
    const [tempmax4, setTempMax4] = useState('');
    const [tempmin1, setTempMin1] = useState('');
    const [tempmin2, setTempMin2] = useState('');
    const [tempmin3, setTempMin3] = useState('');
    const [tempmin4, setTempMin4] = useState('');

    var scaleLineControl = new ScaleLine({
        units: 'metric',
        type: 'scalebar',
        bar: true,
        steps: 4,
        minWidth: 150
    });
    var mouse = new MousePosition({
        projection: 'EPSG:4326',
        coordinateFormat: function (coordinate) {
            return format(coordinate, "&nbsp;&nbsp; Latitude : {y}, &nbsp;&nbsp; Longitude: {x} &nbsp;&nbsp;", 4);
        }
    });
    var baseLayer = new TileLayer({
        title: 'OSM',
        source: new OSM()
    });

    var pocraBaseLayer = new ImageLayer({
        source: new ImageWMS({
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
    // Layers

    // The map
    var map = new Map({
        target: null,
        view: new View({
            zoom: 7,
            center: transform([77.50, 18.95], 'EPSG:4326', 'EPSG:3857')
        }),
        controls: defaultControls().extend([mouse, scaleLineControl]),
        layers: [baseLayer, pocraBaseLayer]
    });
    let frameRate = 0.5; // frames per second
    let animationId = null, imdlayer;


    async function fetchData() {
        const response = await fetch("http://gis.mahapocra.gov.in/weatherservices/meta/getforecastdate")
            .then(response => response.json())
            .then(data => {
                console.log(data.forecast[0].maxdate)
                setTodate((prevTodate) => {
                    const updateTodate = [data.forecast[0].today];
                    return updateTodate;
                });
                setMinDate((prevMindate) => {
                    const updateMindate = [data.forecast[0].mindate];
                    return updateMindate;
                });
                setMaxDate([data.forecast[0].maxdate])
                setMinimumDate((prevMinimumDate) => {
                    const updateMinimuDate = [data.forecast[0].mindate];
                    return updateMinimuDate;
                });
                // setMinimumDate(data.forecast[0].mindate);

                // setMinDate(data.forecast[0].mindate);
                // setMinimumDate(data.forecast[0].mindate);
                // setMaxDate(data.forecast[0].maxdate);
                // setRain1(data.forecast[0].rain1);
                // setRain2(data.forecast[0].rain2);
                // setRain3(data.forecast[0].rain3);
                // setRain4(data.forecast[0].rain4);
                // setRain5(data.forecast[0].rain5);
                // setMaxRainfall(data.forecast[0].maxrainfall);
                // setTempMax1(data.forecast[0].temp_max1);
                // setTempMax2(data.forecast[0].temp_max2);
                // setTempMax3(data.forecast[0].temp_max3);
                // setTempMax4(data.forecast[0].temp_max4);
                // setTempMin1(data.forecast[0].temp_min1);
                // setTempMin2(data.forecast[0].temp_min2);
                // setTempMin3(data.forecast[0].temp_min3);
                // setTempMin4(data.forecast[0].temp_min4);
                // loadMap(data.forecast[0].mindate);
            });
    }

    useEffect(() => {
        map.setTarget("map");

        fetchData();

        // response;
    }, []);






    const loadMap = (forecatdate) => {
        var label, propname;
        var rain_class1, rain_class2, rain_class3, rain_class4, rain_class5, maxrainfall;
        let elevalue = document.getElementById("mapselect").value;
        if (imdlayer) {
            map.removeLayer(imdlayer);
        }

        if (elevalue === "rainfall") {
            propname = "rainfall_mm";
            label = "Rainfall";
            // // document.getElementById("legendTitle").innerHTML = label + '(mm)';


            console.log(rain1)
            // rain_class1 = rain1;
            // rain_class2 = rain2;
            // rain_class3 = rain3;
            // rain_class4 = rain4;
            // rain_class5 = rain5;

        }
        // else if(elevalue === "rainfall") {
        //     propname = "rainfall_mm";
        //     label = "Rainfall";
        //     // // document.getElementById("legendTitle").innerHTML = label + '(mm)';
        //     rain_class1 = state.rain1;
        //     rain_class2 = state.rain2;
        //     rain_class3 = state.rain3;
        //     rain_class4 = state.rain4;
        //     rain_class5 = state.rain5;

        // }
        console.log("propname:" + propname + ";rain1:" + (parseInt(rain_class2)) + ";rain2:" + (parseInt(rain_class2) + 0.1) + ";rain3:" + (parseInt(rain_class3)) + ";rain4:" + (parseInt(rain_class3) + 0.1) + ";rain5:" + (parseInt(rain_class4)) + ";rain6:" + (parseInt(rain_class4) + 0.1))
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
                    'env': "propname:" + propname + ";rain1:" + (parseInt(rain_class2)) + ";rain2:" + (parseInt(rain_class2) + 0.1) + ";rain3:" + (parseInt(rain_class3)) + ";rain4:" + (parseInt(rain_class3) + 0.1) + ";rain5:" + (parseInt(rain_class4)) + ";rain6:" + (parseInt(rain_class4) + 0.1),
                    'CQL_FILTER': indate
                },
            })
        });

        map.addLayer(imdlayer);

        const resolution = map.getView().getResolution();
        // updateLegend(resolution);
        let graphicUrl = imdlayer.getSource().getLegendUrl(resolution);
        console.log(graphicUrl)
        let img = document.getElementById('legend');
        img.src = graphicUrl;

    }


    return (
        <div >
            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <label style={{ paddingTop: 9, color: "rgb(248, 112, 33)" }}>IMD Weather Forecast (  {Moment({ minimumDate }).format('DD-MM-YYYY')} - {Moment({ maxDate }).format('DD-MM-YYYY')} )</label>
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
                                            <label>Forecast on Date: {Moment({ minDate }).format('DD-MM-YYYY')}</label>
                                        </div>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <a className="nav-link" >
                                            <i class="fas fa-backward" title={"Privious"} ></i>
                                        </a>
                                    </li>
                                    <li className="nav-item dropdown">
                                        {/* <a className="nav-link" onClick={play}>
                                                <i class="fas fa-play" title={"Play"} ></i>
                                            </a> */}
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

export default Forecast;