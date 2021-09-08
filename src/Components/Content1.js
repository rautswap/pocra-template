import React, { useState, useReducer, useEffect } from 'react';

import produce from 'immer';

import LeftSidebar from './content/left_sidebar';
import ViewPane from './content/view_pane';
// import { GIS_DATA_SECTIONS } from './constants';

import './content.css';



const initialState = {
	gis_data_sections: [],
	navigation_request: null,
	add_layer: null
};

const reducer = produce((draft, action) => {
	switch (action.type) {
		case 'add-gis-data-sections':
			draft.gis_data_sections = action.payload;
			return;
		case 'make-navigation-request':
			draft.navigation_request = action.payload;
			return;
		case 'clear-navigation-request':
			draft.navigation_request = null;
			return;
		case 'get-map':
			console.log(action);
			draft.add_layer = action.payload;
			return;
		case 'clear-get-map':
			draft.add_layer = null;
			return;
	}
});


const getLeftSidebarProps = state => state.gis_data_sections;


const Content1 = () => {

	const [state, dispatch] = useReducer(reducer, initialState);

	function makeRequest(nav_req) {
		// console.log(nav_req);
		dispatch({ type: 'make-navigation-request', payload: nav_req });
	}

	function clearRequest() {
		dispatch({ type: 'clear-navigation-request' });
	}

	//// This is the eaelier API-based implementation
	// useEffect(() => {
	// 	const fetchData = async (gds) => {
	// 		// console.log(gds);
	// 		const response = await fetch( gds.base_url + '/meta' );
	// 		const response_json = await response.json();
	// 		// console.log(response_json);
	// 		dispatch({
	// 			type: 'add-gis-data-section',
	// 			payload : response_json
	// 		});
	// 	};
	// 	GIS_DATA_SECTIONS.forEach(async gds => fetchData(gds));
	// }, []);

	useEffect(() => {
		const fetchGISDataSections = async () => {
			const response = await fetch(`${process.env.REACT_APP_POCRAGIS_API_BASE_URL}/meta/datasets`);
			const response_json = await response.json();
			// console.log(response_json);
			dispatch({
				type: 'add-gis-data-sections',
				payload: response_json
			});
		};
		fetchGISDataSections();
	}, []);

	return (
		<>
			{/* <LeftSidebar
				sections={getLeftSidebarProps(state)}
				makeRequest={makeRequest}
				content_dispatch={dispatch}
			/> */}

			<ViewPane
				{...state}
				clearGetMap={e => dispatch({ type: 'clear-get-map' })}
				clearRequest={clearRequest}
			/>
		</>
	);
}

export default Content1;