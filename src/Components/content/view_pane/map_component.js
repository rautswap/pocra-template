import React, {
	// Component,
	useRef, useEffect, useReducer //, useState
} from 'react';
import ReactDOM from 'react-dom';

import { Tree } from 'antd';

import produce from 'immer' ;


import PoCRAMap from './map_component/pocra_map';
import MapLayers from './map_component/map_layers';
import { MapLegend, MapLegendButton } from './map_component/map_legend';
import MapPan from './map_component/map_pan';
import Collapsible from 'react-collapsible'




const MapTitle = ({title, filter_string}) => {
	// console.log(specifications);
	return (title === null ? null : (
		<div>
			{title}
			{
				(filter_string !== null) ? (
					<div className="title-filter" style={{fontSize: 12, fontWeight: 'normal'}}>
						<b>Filter :</b> {filter_string}
					</div>
				) : null
			}
		</div>
	));
};



// const reducer = produce((draft, action) => {
// 	switch(action.type) {
// 		case 'toggle-base-layer-visibility':
// 			draft.base_layer.visible = !draft.base_layer.visible;
// 			return;
// 		case 'toggle-admin-layer-visibility':
// 			draft.admin_layers.forEach(l => {
// 				if (l.title === action.payload.title)
// 					l.visible = !l.visible;
// 			});
// 			return;
// 		case 'toggle-layer-visibility':
// 			draft.layers[action.payload.index].visible = !draft.layers[action.payload.index].visible;
// 			return;
// 	}
// });


const initialState = {
	point_details: null
}

const reducer = produce((draft, action) => {
	switch(action.type) {
		case 'set-point-details':
			draft.point_details = action.payload.point_details;
			return;
	}
});


const PoCRAMapComponent = ({
	display,
	data,
	map_click_coordinate,
	current_extent,

	view_pane_dispatch
}) => {
	
	const mapDivRef = useRef();
	const mapInstanceRef = useRef();

	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		mapInstanceRef.current = new PoCRAMap({
			target: mapDivRef.current,
			geoserver_base_url: 'http://gis.mahapocra.gov.in/',
			initial_layers: {
				base_layer: data.base_layer,
				admin_layers: data.admin_layers
			},
			requested_layers: data.layers,
			view_pane_dispatch: view_pane_dispatch,
		});
	}, []);

	useEffect(() => {
		
		ReactDOM.render(
			<MapLayers
				base_layer={data.base_layer}
				admin_layers={data.admin_layers}
				layers={data.layers}
				view_pane_dispatch={view_pane_dispatch}
			/>,
			document.getElementById('layers-div')
		);
		// ReactDOM.render( <MapActions />, document.getElementById('actions-div'));
		mapInstanceRef.current.set_layer_visibility({type: 'base'}, data.base_layer.visible);
		data.admin_layers.forEach(l => mapInstanceRef.current.set_layer_visibility(
			{type: 'admin', var_name: l.variable_name}, l.visible
		));
		data.layers.forEach((l, i) => {
			// if (l.ol_layer_index === undefined)
			// 	return;
			// console.log(l);
			// console.log('here');
			mapInstanceRef.current.set_layer_visibility({
				type: 'requested',
				title: l.title
			}, l.visible);
		});

		const get_top_layer = () => {
			let top_layer = null, top_z_index = -1;
			for (const l of data.layers) {
				// console.log(l.title, l.z_index);
				// if (l.visible && l.z_index > top_z_index){
				// 	top_layer = l;
				// 	top_z_index = l.z_index;
				// }
				if (l.visible)
					return l;
			}
			if (top_layer)
				return top_layer;
			for (const al of data.admin_layers)
				if (al.visible) // relies on the sorted order used in the admin_layers array; so no z_index check
					return al;
			if (data.base_layer.visible)
				return data.base_layer;
		}
		const top_layer = get_top_layer(); //data.layers.filter(l=>(l.visible && 0<l.z_index && l.z_index<1)).sort((l1,l2)=>l2.z_index-l1.z_index)[0];
		// console.log(top_layer);

		ReactDOM.render(
			<MapTitle
				title={(top_layer && top_layer.title) ? top_layer.title : null}
				filter_string={top_layer && top_layer.filter_string ? top_layer.filter_string : null}
			/>,
			document.getElementById('title-div')
		);
		
		ReactDOM.render(
			<MapLegendButton
				layer={(top_layer && top_layer.legend) ? top_layer : null}
				new_layer_legend={data.new_layer_legend}
				view_pane_dispatch={view_pane_dispatch}
			/>,
			document.getElementById('legend-button-div')
		);
		ReactDOM.render(
			<MapLegend specifications={(top_layer && top_layer.legend) ? top_layer.legend : null} />,
			document.getElementById('legend-div')
		);

		ReactDOM.render(
			<MapPan	zoom_to_extent={zoom_to_extent}	/>,
			document.getElementById('pan-div')
		);
	}, [data.base_layer, data.admin_layers, data.layers]);
	
	const zoom_to_extent = extent => {
		// console.log(extent);
		if (extent !== null)
			mapInstanceRef.current.zoom_to_extent(extent);
	};

	useEffect(() => {
		// console.log(data.new_layer_data);
		if (data.new_layer_data === undefined)
			return;
		// const layer = data.layers[data.new_layer_index];
		// console.log('Here' + layer.map_renderer);
		// console.log('Here' + data.new_layer_data);
		// if (layer.map_renderer !== 'client' || layer.data === undefined)
		// 	return;
		mapInstanceRef.current.add_point_layer_from_data(
			data.new_layer_data,
			data.layers[0].z_index,
			data.layers[0].dataset
		);
	}, [data.new_layer_data]);

	useEffect(() => {
		if (data.fetch_new_wms_layer) {
			// console.log('here');
			mapInstanceRef.current.add_wms_layer(data.layers[0]);
		}
	}, [data.fetch_new_wms_layer]);

	useEffect(() => {
		if (data.layer_removed !== null) {
			// console.log('here');
			mapInstanceRef.current.remove_layer_having_title(data.layer_removed);
		}
	}, [data.layer_removed]);

	useEffect(() => {
		if (data.layer_restyled !== null) {
			console.log('restyled');
			mapInstanceRef.current.replace_layer(data.layer_restyled);
		}
	}, [data.layer_restyled]);
	
	useEffect(() => {
		// console.log(map_click_coordinate);
		const fetchDetails = async () => {
			const response = await fetch('/datasets/feature_details', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...map_click_coordinate.feature_id })
			});
			const response_data = await response.json();
			// console.log(response_data);
			// return;
			dispatch({
				type: 'set-point-details',
				payload: {
					point_details: {...response_data, ...map_click_coordinate.data}, //this combination of response_data + map_click_coordinate.data has not been tested
				}
			});
		};
		if (map_click_coordinate.feature_id) {
			fetchDetails();
		} else if (map_click_coordinate.data) {
			console.log(map_click_coordinate.data);
			dispatch({
				type: 'set-point-details',
				payload: {
					point_details: map_click_coordinate.data
				}
			});
		}
		mapInstanceRef.current.set_map_popup_overlay_position(map_click_coordinate.coordinate);
	}, [map_click_coordinate]);


	const build_point_details_subtree = (data_obj, level) => {
		// console.log(data_obj);
		return Object.entries(data_obj).sort((e1, e2) => e1[1][0] - e2[1][0]).map(([k, v]) => {
			// console.log(k, v);
			if (v[1] === null)
				return null;

			if (Array.isArray(v[1])) {
				if (v[1][0] === 'link'){
					return (
						<div key={k} style={{paddingLeft: 15}}>
							<span style={{fontWeight: 'bold'}}>
								{ k.replace(/_/gi, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') }
								: <a style={{fontWeight: 'normal'}} onClick={e => {
									view_pane_dispatch({
										type: "show-authentication-modal",
										payload: {
											action: 'view_pane_dispatch',
											action_params: {
												type: 'add-table-in-data-pane',
												payload: {
													url: `${process.env.REACT_APP_POCRAGIS_API_BASE_URL}${v[1][2]}`
												}
											}
										}
									});
									// fetch(
									// 	`${process.env.REACT_APP_POCRAGIS_API_BASE_URL}${v[1][2]}`
									// ).then(
									// 	response => {
									// 		const data = response.json();
									// 		console.log(data);
									// 		return data;
									// 	}
									// // ).then(
									// // 	data => view_pane_dispatch({
									// // 		type: 'add-table-in-data-pane',
									// // 		payload: { data }
									// // 	})
									// );
									// // view_pane_dispatch({type: 'switch-tab', payload: 'data'});
								}}>{ v[1][1] }</a>
							</span>
						</div>
					);
				}
				return null;
			} else if (typeof v[1] === 'object') {
				if(level === 1){
					return (
						<Collapsible key={k} trigger={ k.replace(/_/gi, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') } triggerStyle={{fontWeight: 'bold'}}>
							{build_point_details_subtree(v[1], level+1)}
						</Collapsible>
					)	
				}
				return (
					<div key={k} style={{paddingLeft: 15}}>
						<span style={{fontWeight: 'bold'}}>
							{ k.replace(/_/gi, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') }
						</span>
						{build_point_details_subtree(v[1], level+1)}
					</div>
				);
			} else {
				return (
					<div key={k} style={{paddingLeft: 15}}>
						<span style={{fontWeight: 'bold'}}>
							{ k.replace(/_/gi, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') }
							: <span style={{fontWeight: 'normal'}}>{ v[1] }</span>
						</span>
					</div>
				);
			}

			// if (typeof v === 'object') {
			// 	return (
			// 		<Tree.TreeNode
			// 			title={
			// 				<span style={{fontSize: '1.1em', fontWeight: 'bold'}}>
			// 					{ k.replace(/_/gi, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') }
			// 				</span>
			// 			}
			// 			key={k.replace(/[\W]+/g, '')}
			// 		>
			// 			{build_point_details_subtree(v)}
			// 		</Tree.TreeNode>
			// 	);
			// } else {
			// 	return (
			// 		<Tree.TreeNode
			// 			title={
			// 				<span style={{fontWeight: 'bold'}}>
			// 					{ k.replace(/_/gi, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') }
			// 					: <span style={{fontWeight: 'normal'}}>{ v }</span>
			// 				</span>
			// 			}
			// 			key={k.replace(/[\W]+/g, '')}
			// 		/>
			// 	);
			// }
		});
	}

	return (
		<React.Fragment>
			<div
				ref={mapDivRef}
				style={{
					width: '100%',
					height: '100%',
					display: (display ? 'block' : 'none')
				}}
			>
			</div>
			<div id="title-div" className="title-control ol-control">
			</div>
			<div id="layers-div" className="layers-control ol-unselectable ol-control">
			</div>
			<div id="legend-button-div" className="legend-button-control ol-unselectable ol-control">
			</div>
			<div id="legend-div" className="legend-control ol-control">
			</div>
			<div id="pan-div" className="pan-control ol-unselectable ol-control">
			</div>
			<div id="map-popup">
				<button id="map-popup-closer">X</button>
				{/* <div id="map-popup-content" style={{margin: 10}}> */}
				<div id="map-popup-content">
				{(map_click_coordinate.feature_id || (map_click_coordinate.data && Object.entries(map_click_coordinate.data).length != 0)) ? (
					<React.Fragment>
					{map_click_coordinate.feature_id ? 
					<ul>
						{Object.entries(map_click_coordinate.feature_id).map(e => (
							e[0] !== 'geometry' ? <li key={e[0]}>{e[0] + ' : ' + e[1]}</li> : null
						))}
					</ul> : null
					}
					{
					state.point_details ? (
						<div 
							// style={{height: 150, width: 350, whiteSpace: 'nowrap', overflow: 'auto', borderBottom: 'solid 1px #ccc'}}
							style={{height: 185, width: 365, whiteSpace: 'nowrap', overflow: 'auto'}}

						>
							{ build_point_details_subtree(state.point_details, 1) }
						</div>
					) : null
					}
					{/*
					state.point_details ? (
						<Tree
							blockNode
							style={{minHeight: 300, maxHeight: 300, overflow: 'scroll', borderBottom: 'solid 1px #ccc'}}
							defaultExpandAll={true}
						>
							{ build_point_details_subtree(state.point_details) }
						</Tree>
					) : null
					*/}
					</React.Fragment>
				) : (
					<div>
						<p>Coordinates :</p>
						<code>
							{map_click_coordinate.coordinate_HDMS_string}
						</code>
					</div>
				)}
				</div>
			</div>
		</React.Fragment>
	);


};



export default PoCRAMapComponent;



////// Earlier class-based implementation

// class PoCRAMapComponent extends Component {

//  constructor(props) {
//      super(props);
//      this.mapRef = React.createRef();
//  }

//  componentDidMount() {
//      this.pocra_map = new PoCRAMap(
//          this.mapRef.current, {geoserver_base_url: 'http://localhost:8080'}
//      );
//  }

//  render() {
//      return (
//          <div ref={this.mapRef} style={{width: '100%', height: '100%'}}></div>
//      );
//  }

// }
