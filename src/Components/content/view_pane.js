import React, { useState, useReducer, useEffect } from 'react';
import produce from 'immer';

import { Dropdown, Menu, Modal, Spin } from 'antd';

import ContextViewComponent from './view_pane/context_component';
import PoCRAMapComponent from './view_pane//map_component';
import DataViewComponent from './view_pane/data_component';
// import Modal from './view_pane/add_layer_modal';
// import { VIEW_REQUEST_CONFIG } from './constants';
import { INITIAL_LAYERS } from './view_pane/map_component/constants_and_utilities';


import './view_pane.css';



const AuthenticationModal = ({visible, view_pane_dispatch, action, action_params}) => {
	const [user, setUser] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	// const [abort, setAbort] = useState(false);
	const [invalid_request, setInvalidRequest] = useState(false);

	return (
		<Modal
			title="Authenticate"
			width={250}
			visible={visible}
			okText="Submit"
			onOk={e => {
				setLoading(true);
				// setAbort(false);
				// console.log(abort);
				fetch(
					`${action_params.payload.url}&user=${user}&password=${password}`
				).then(
					response => {
						const data = response.json();
						setLoading(false);
						return data;
					}
				).then(
					data => {
						// console.log(data);//, abort);
						if (data.status === 200) {
							setInvalidRequest(false);
							// if ( !abort ) {
								view_pane_dispatch({type: 'hide-authentication-modal'});
								view_pane_dispatch({
									type: 'add-table-in-data-pane',
									payload: { data: data.data }
								});
								view_pane_dispatch({type: 'switch-tab', payload: 'data'});
						// 	}
						} else {
							setInvalidRequest(true);
						}
						// setAbort(false);
					}
				);
			}}
			okButtonProps={{disabled: user === "" || password == "" || loading}}
			onCancel={e => {
				view_pane_dispatch({type: 'hide-authentication-modal'});
				// console.log(loading);
				// if (loading) {
				// 	setAbort(true);
				// 	console.log(abort);
				// }
			}}
		>
			<Spin spinning={loading}>
				<div>
					<div>Username :</div>
					<input type="text" value={user} onChange={e => setUser(e.target.value)}/>
				</div>
				<div>
					<div>Password :</div>
					<input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
				</div>
				<div style={{display: invalid_request ? "block" : "none", color: 'red'}}>
					Invalid Request
				</div>
			</Spin>
		</Modal>
	);
}



const initialState = {
	active_tab: 'maps',
	add_layer_modal_visible: false,
	authentication_modal_visible: false,
	authentication_modal_params: {},
	context_view_data: {
		title: '',
		details: null
	},
	maps_view_data: {
		...INITIAL_LAYERS,
		layers: [],
		// top_layer: INITIAL_LAYERS.admin_layers[1],
		new_layer_added: false,
		layer_removed: null,
		layer_restyled: null,
		// current_extent: null
	},
	data_view_data: {
		tables: [],
		new_table_added: false
	},
	map_click_coordinate: {
		coordinate: null,
		coordinate_HDMS_string: '',
		feature_id: null
	},
};


const reducer = produce((draft, action) => {
	let i;
	switch(action.type) {
		case 'switch-tab':
			draft.active_tab = action.payload;
			return;
		case 'show-add-layer-modal':
			draft.add_layer_modal_visible = true;
			return;
		case 'hide-add-layer-modal':
			draft.add_layer_modal_visible = false;
			return;
		case 'add-point-feature-map-data':
			draft.maps_view_data.layers[0].data = action.payload.data;
			// console.log(action.payload.data);
			// draft.maps_view_data.layers[action.payload.new_layer_index].legend = action.payload.legend;
			return;
		case 'set-added-layer-index':
			draft.maps_view_data.layers[0].ol_layer_index = action.payload.added_layer_index;
			return;
		case 'clear-new-layer-added':
			draft.maps_view_data.new_layer_added = false;
			return;
		case 'set-map-click-coordinate':
			draft.map_click_coordinate = action.payload;
			if (action.payload.feature_id) {
				// console.log(action.payload.feature_id, JSON.stringify(draft.maps_view_data.layers.map(l => l.title)));
				// const dataset = draft.maps_view_data.layers.filter(l => l.title === action.payload.feature_id.title)[0]['dataset'];
				draft.map_click_coordinate.feature_id = {
					dataset: action.payload.feature_id.dataset,
					id: action.payload.feature_id.id
				};
			}
			console.log(action.payload);
			draft.map_click_coordinate.data = action.payload.data;
			return;
		case 'set-new-view':
			let new_len;
			draft.active_tab = action.payload.request.view;
			switch (action.payload.request.view) {
				case 'context':
					draft.context_view_data = action.payload.data;
					break;
				case 'maps':
					draft.maps_view_data.new_layer_index = draft.maps_view_data.layers.push(action.payload.data) - 1;
					break;
				case 'data':
					draft.data_view_data.new_table_index = draft.data_view_data.tables.push(action.payload.data) - 1;
					break;
			}
			return;
		case 'get-map':
			draft.active_tab = 'maps';

			const existing_titles = draft.maps_view_data.layers.map(l => l.title);
			// if requirement is "do not allow multiple copies of the same layer"
			// then use this code-fragment
			if (existing_titles.includes(action.payload.title)) {
				for (const l of draft.maps_view_data.layers) {
					if (l.title !== action.payload.title) {
						l.visible = false;
					} else {
						l.visible = true;
						break;
					}
				}
				return;
			} else {
				let payload_copy = {...action.payload};
				if (payload_copy.z_index === undefined) {
					// const max_user_layer_z_index = (draft.maps_view_data.layers.length > 0
					// 	? draft.maps_view_data.layers.map(l => l.z_index).filter(z => 0.0 < z && z < 1.0).sort((z1, z2) => z2 - z1)[0]
					// 	: 0
					// );
					// action.payload.z_index = max_user_layer_z_index + ( (1 - max_user_layer_z_index) / 2 );
					payload_copy.z_index = (draft.maps_view_data.layers.length > 0
						? draft.maps_view_data.layers[0].z_index + ( (1 - draft.maps_view_data.layers[0].z_index) / 2 )
						: 0.5
					);
				}

				// since copies of a layer are not allowed, this logic is being deprecated
				// let original_title = payload_copy.title;
				// i = 0;
				// while(existing_titles.includes(payload_copy.title)) {
				// 	i += 1;
				// 	payload_copy.title = original_title + ' -- (copy ' + i + ')';
				// }

				// draft.maps_view_data.new_layer_index = draft.maps_view_data.layers.push(action.payload) - 1;
				draft.maps_view_data.layers.unshift(payload_copy);
				draft.maps_view_data.new_layer_added = true;
			}
			return;
		case 'remove-layer':
			draft.maps_view_data.layers = draft.maps_view_data.layers.filter(l => l.title !== action.payload.title);
			draft.maps_view_data.layer_removed = action.payload.title;
			return;
		case 'clear-layer-removed':
			draft.maps_view_data.layer_removed = null;
			return;
		case 'restyle-layer':
			draft.maps_view_data.layers.forEach(l => {
				if (l.title === action.payload.title) {
					l.style_env_params = action.payload.style_env_params;
					l.legend = action.payload.legend;
				}
			});
			draft.maps_view_data.layer_restyled = draft.maps_view_data.layers.filter(
				l => l.title === action.payload.title
			)[0];
			return;
		case 'clear-layer-restyled':
			draft.maps_view_data.layer_restyled = null;
			return;
		case 'toggle-base-layer-visibility':
			draft.maps_view_data.base_layer.visible = !draft.maps_view_data.base_layer.visible;
			// draft.maps_view_data.top_layer = get_top_layer();
			return;
		case 'toggle-admin-layer-visibility':
			draft.maps_view_data.admin_layers.forEach(l => {
				if (l.title === action.payload.title)
					l.visible = !l.visible;
			});
			// draft.maps_view_data.top_layer = get_top_layer();
			return;
		case 'toggle-layer-visibility':
			draft.maps_view_data.layers[action.payload.index].visible = !draft.maps_view_data.layers[action.payload.index].visible;
			// draft.maps_view_data.top_layer = get_top_layer();
			return;
		case 'hide-all-user-layers':
			draft.maps_view_data.layers.forEach(l => {l.visible = false});
			// draft.maps_view_data.top_layer = get_top_layer();
			return;
		// case 'pan-to-extent':
		// 	draft.maps_view_data.current_extent = action.payload.extent;
		// 	return;
		case 'add-table-in-data-pane':
			draft.data_view_data.tables.unshift(action.payload.data);
			draft.data_view_data.new_table_added = true;
			return;
		case 'clear-new-table-added':
			draft.data_view_data.new_table_added = false;
			return;
		case "show-authentication-modal":
			draft.authentication_modal_visible = true;
			draft.authentication_modal_params = action.payload;
			return;
		case "hide-authentication-modal":
			draft.authentication_modal_visible = false;
			return;
	}
});


const getContextViewProps = state => ({
	display: state.active_tab ==='context',
	data: state.context_view_data
});

const getPoCRAMapComponentProps = state => ({
	display: state.active_tab === 'maps',
	// point_feature_layer_data: state.new_data_key !== null ? state.data.maps.get(state.new_data_key) : null,
	data: {
		...state.maps_view_data,
		new_layer_data: (state.maps_view_data.new_layer_added
			? state.maps_view_data.layers[0].data
			: undefined
		),
		fetch_new_wms_layer: (
			state.maps_view_data.new_layer_added && ['indicator', 'gis_entity_set'].includes(state.maps_view_data.layers[0].type)
		),
		new_layer_legend: (state.maps_view_data.new_layer_added
			? state.maps_view_data.layers[0].legend
			: undefined
		)
	},
	map_click_coordinate: state.map_click_coordinate,
	// current_extent: state.maps_view_data.current_extent
});

const getDataViewProps = state => ({
	display: state.active_tab ==='data',
	data: state.data_view_data
});


const ViewPane = ({gis_data_sections, navigation_request, add_layer, clearGetMap, clearRequest}) => {

	const [state, dispatch] = useReducer(reducer, initialState);
	console.log(gis_data_sections);
	console.log(navigation_request);
	console.log(add_layer);
	console.log(clearGetMap);
	console.log(clearRequest);

	useEffect(() => {
		if (navigation_request === null)
			return;
		
		let selected_gds = gis_data_sections.filter(gds => gds.title === navigation_request.dataset_item)[0];
		
		dispatch({
			type: 'set-new-view',
			payload : {
				request: navigation_request,
				data: selected_gds
			}
		});
		clearRequest();
	}, [navigation_request]);

	useEffect(() => {
		// console.log(add_layer);
		if (add_layer === null)
			return;
		dispatch({type: 'get-map', payload: add_layer});
		clearGetMap();
	}, [add_layer])

	useEffect(() => {
		if ( !state.maps_view_data.new_layer_added )
			return;
		if (state.maps_view_data.layers[0].map_renderer !== 'client')
			return;
		const layer = state.maps_view_data.layers[0];
		const fetchData = async () => {
			// console.log(layer);
			const response = await fetch(layer.url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(layer)
			});
			const response_json = await response.json();
			// console.log(response_json);
			// console.log("Uncomment the return statement here when debugging ends.")
			// return;
			dispatch({
				type: 'add-point-feature-map-data',
				payload: {
					data: response_json,
					// legend: response_json.legend,
					// new_layer_index: state.maps_view_data.new_layer_index
				}
			});
		};
		fetchData();
	}, [state.maps_view_data.new_layer_added]);


	return (
		<div id="view-pane-grid">
			<div id='view-pane-tabs-buttons-grid'>
				<div 
					id="maps-tab-button-grid"
					onClick={e => dispatch({type: 'switch-tab', payload: 'maps'})}
					className={state.active_tab === 'maps' ? 'selected' : 'not-selected'}
				>
					<span id="maps-tab-button-text" className="view-pane-tabs-buttons-text">Maps</span>
					{/*<Dropdown
						overlay={
							<Menu onClick={e => {dispatch({type: 'show-add-layer-modal'})}}>
								<Menu.Item key="Add New Layer">Add New Layer</Menu.Item>
							</Menu>
						}
						placement="bottomRight"
					>
						<span id="maps-tab-button-subbutton-add">Menu</span>
					</Dropdown>*/}
				</div>
				<div
					id="data-tab-button-grid"
					onClick={e => dispatch({type: 'switch-tab', payload: 'data'})}
					className={state.active_tab === 'data'? 'selected' : 'not-selected'}
				>
					<span id="data-tab-button-text" className="view-pane-tabs-buttons-text">Data</span>
				</div>
				{
				/*<div 
					id="context-tab-button-grid"
					onClick={e => dispatch({type: 'switch-tab', payload: 'context'})}
					className={state.active_tab === 'context' ? 'selected' : 'not-selected'}
				>
					<span id="context-tab-button-text" className="view-pane-tabs-buttons-text">Context</span>
				</div>
				*/
				}

			</div>
			<div id="content-tabs-panes-grid">
				<ContextViewComponent {...getContextViewProps(state)} view_pane_dispatch={dispatch}/>
				<PoCRAMapComponent {...getPoCRAMapComponentProps(state)} view_pane_dispatch={dispatch} />
				<DataViewComponent {...getDataViewProps(state)} view_pane_dispatch={dispatch}/>
			</div>
			{/*<Modal
				title="Add New Layer"
				visible={state.add_layer_modal_visible}
				gis_data_sections={gis_data_sections}
				view_pane_dispatch={dispatch}
			/>*/}
			<AuthenticationModal
				visible={state.authentication_modal_visible} 
				view_pane_dispatch={dispatch}
				{...state.authentication_modal_params}
			/>
		</div>
	);
}

export default ViewPane;