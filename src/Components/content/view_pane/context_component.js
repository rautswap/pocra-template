import React, { useState, useReducer, useEffect } from 'react';

import produce from 'immer';


import './context_component.css';



const ContextViewComponent = ({
	display,
	data,

	view_pane_dispatch
}) => {
	// console.log(data);
	// console.log(data.data.details === null);
	return (
		<div style={{display: display ? 'block' : 'none'}}>
			<div className="context-view-title">
				<h1>{data.title}</h1>
			</div>
			<div className="context-view-description">
				<p>{data.details !== null ? data.details.description : ''}</p>
			</div>
			<div className="context-view-request">
				<button
					onClick={e => {view_pane_dispatch({type: 'show-add-layer-modal'})}}
				>
					Request Map
				</button>
				{/*<button>Request Data</button>*/}
			</div>
		</div>
	);
};


export default ContextViewComponent;