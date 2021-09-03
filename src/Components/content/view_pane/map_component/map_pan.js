import React, { useEffect, useReducer } from 'react';

import produce from 'immer';

import { Popover, Cascader } from 'antd';


// import './map_pan.css';



const initialState = {
	entire_extent: null,
	options: null,
	// current_region: {type: 'entire', id: 'entire', subregion: null},
}

const reducer = produce((draft, action) => {
	switch (action.type) {
		// case 'change-region':
		// 	draft.current_region.subregion = {
		// 		type: action.payload.region_type,
		// 		id: action.payload.value,
		// 		subregion: null
		// 	};
		// 	return;
		case 'set-entire-extent':
			draft.entire_extent = action.payload;
			return;
		case 'set-options':
			draft.options = action.payload;
			// let subregion = draft.current_region, options = draft.options;
			// while(subregion.subregion !== null) {
			// 	subregion = subregion.subregion;
			// 	options = options.filter(o => o.value === subregion.id)[0].children;
			// }
			// options.push(...(action.payload.subregion_ids.map(o => ({
			// 	value: o, label: o, isLeaf: action.payload.subregion_type === 'village', children: [],
			// 	region_type: action.payload.subregion_type
			// }))));
			return;
	}
})

const MapPan = ({zoom_to_extent}) => {
	// return <div>P</div>

	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		const fetch_options_and_extent = async () => {
			
			let response = await fetch(`${process.env.REACT_APP_POCRAGIS_API_BASE_URL}/meta/zooming_hierarchy/extent`);
			const extent = await response.json();
			// console.log(response_json);
			dispatch({
				type: 'set-entire-extent',
				payload: extent
			});
			zoom_to_extent(extent);

			response = await fetch(`${process.env.REACT_APP_POCRAGIS_API_BASE_URL}/meta/zooming_hierarchy/options`);
			const options = await response.json();
			// console.log(response_json);
			dispatch({
				type: 'set-options',
				payload: options
			});
		}
		fetch_options_and_extent();
	}, []);

	// const load_data = selected_options => {
	// 	let target_option = selected_options[selected_options.length - 1]
	// 	target_option.loading = true;
	// 	console.log(target_option);

	// };

	const on_change = (value, selected_options) => {
		console.log(value, selected_options);
		// dispatch({
		// 	type: 'change-region',
		// 	payload: selected_options[selected_options.length - 1]
		// })
		if (selected_options.length == 0) {
			zoom_to_extent(state.entire_extent);
		} else {
			zoom_to_extent(selected_options[selected_options.length - 1].extent);
		}
	};

	return (
		<Popover
			placement="right"
			title="Zoom to District / Taluka / PoCRA-Village"
			trigger="click"
			content={(
				<div>
					<Cascader 
						options={state.options}
						onChange={on_change}
						style={{width: 400}}
						changeOnSelect
					/>
				</div>
			)}
		>
			<div>Z</div>
		</Popover>
	);
};


export default MapPan;