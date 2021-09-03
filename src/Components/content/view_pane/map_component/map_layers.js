import React, { useReducer } from 'react';

import produce from 'immer';

import { Popover, Button, Dropdown, Menu } from 'antd';


import './map_layers.css';



const init = layers => ({
	expanded: layers.map(l => false)
});

const reducer = produce((draft, action) => {
	switch(action.type) {
		case 'toggle-layer-item-expansion':
			draft.expanded[action.payload.index] = !draft.expanded[action.payload.index];
			return;
	}
});


const MapLayers = ({base_layer, admin_layers, layers, view_pane_dispatch}) => {

	const [state, dispatch] = useReducer(reducer, layers, init);

	const layers_lists = (
		<div className="layers-lists-div">
			<div style={{height: 150, overflow: 'scroll'}} >
			{
			layers.map((l, i) => (( // not required: slice().sort((l1, l2) => l2.z_index - l1.z_index). since layers are in a sorted state all the time
				state.expanded[i]
			) ? (
				<div
					key={l.title}
					className="map-layers-item-expanded"
				>
					<div className="title">
						<input
							type="checkbox"
							checked={l.visible}
							onChange={e => view_pane_dispatch({type: 'toggle-layer-visibility', payload: {index: i}})}
						/>
						<span onClick={e => dispatch({type: 'toggle-layer-item-expansion', payload: {index: i}})}>
							{l.title}
						</span>
					</div>
					{(l.filter_string !== undefined ? <div> <b>Filter :</b> {l.filter_string} </div> : '')}
					<div>
						<button
							style={{borderColor: 'red', color: 'red'}}
							onClick={e => view_pane_dispatch({
								type: 'remove-layer',
								payload: {title: l.title}
							})}
						>
							Remove
						</button>
					</div>
				</div>
			) : (
				<div key={l.title}>
					<div className="map-layers-item-collapsed">
						<input
							type="checkbox"
							checked={l.visible}
							onChange={e => view_pane_dispatch({type: 'toggle-layer-visibility', payload: {index: i}})}
						/>
						<span onClick={e => dispatch({type: 'toggle-layer-item-expansion', payload: {index: i}})}>
							{l.title + (l.filter_string !== undefined ? '(filtered layer)' : '')}
						</span>
					</div>
				</div>
			)))
			}
			</div>
			<hr />
			<span style={{fontSize: '1.2em'}}>Administrative Boundaries</span>
			{
			admin_layers.map(l => (
				<div key={l.title}>
					<div>
						<input
							type="checkbox"
							checked={l.visible}
							onChange={e => view_pane_dispatch({type: 'toggle-admin-layer-visibility', payload: {title: l.title}})}
						/>
						<span >
							{l.title}
						</span>
					</div>
				</div>
			))
			}
			<hr />
			<div key={base_layer.title} style={{width: 300}}>
				<div>
					<input
						type="checkbox"
						checked={base_layer.visible}
						onChange={e => view_pane_dispatch({type: 'toggle-base-layer-visibility'})}
					/>
					<span style={{fontSize: '1.2em'}}>
						{base_layer.title}
					</span>
				</div>
			</div>
		</div>
	);
	
	return (
		<Popover
			placement="leftTop"
			title={
				<Dropdown overlay={
					<Menu onClick={({item, key, kepPath, domEvent}) => {
						console.log(key);
						switch(key) {
							case 'Hide All':
								view_pane_dispatch({ type: 'hide-all-user-layers' })
								return;
						}
					}}>
						<Menu.Item key="Hide All">Hide All</Menu.Item>
					</Menu>
				}>
					<Button>Layers</Button>
				</Dropdown>
			}
			content={layers_lists}
			// visible={true}
		>
			<div>L</div>
		</Popover>
	);
};


export default MapLayers;