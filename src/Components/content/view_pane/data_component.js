import React, { useState, useReducer, useEffect } from 'react';

import produce from 'immer';
import { Tooltip } from 'antd';

// import Plotly from "plotly.js-cartesian-dist";
// import createPlotlyComponent from 'react-plotly.js/factory';
// const Plot = createPlotlyComponent(Plotly);

// import PivotTableUI from 'react-pivottable/PivotTableUI';
// import 'react-pivottable/pivottable.css';

import './data_component.css';


const DataViewComponent = ({display, data, view_pane_dispatch}) => {
	const table_data = data.new_table_added ? data.tables[0] : null;
	// console.log(data);
	return (
		<div 
			id="data-view-pane"
			style={{
				display: display ? 'grid' : 'none'
			}}
		>
			<div id="data-view-pane-table">
			{ data.new_table_added ? (
				<table style={{margin: 'auto', border: '1px solid #888888'}}>
					<thead>
					<tr style={{backgroundColor: '#888888', color: 'white'}}>
						{table_data.headers.map(e => <th key={e} style={{textAlign: 'center', padding: 10}}>{e}</th>)}
					</tr>
					</thead>
					<tbody>
					{table_data.cells.map(row => (
						<tr key={row[0]} style={{borderBottom: '1px solid #888888'}}>
							{row.map(c => <td key={c} style={{textAlign: 'center', padding: 10}}>{c}</td>)}
						</tr>
					))}
					</tbody>
				</table>
			) : null }
			</div>
			<div id="data-view-pane-toolbar">
				<Tooltip title="Download" placement="left">
					<button
						style={{
							border: 0,
							width: '100%', height: 50, fontSize: 25, fontWeight: 'bolder'
						}}
						onClick={e => {
							if (table_data !== null) {
								window.open(encodeURI(
									"data:text/csv;charset=utf-8," + (
										table_data.headers.join(',')
									) + '\n' + (
										table_data.cells.map(r => r.join(',')).join('\n')
									)
								));
							}
						}}
					>
						{String.fromCharCode(0x2913)}
					</button>
				</Tooltip>
			</div>
		</div>
	);
};


export default DataViewComponent;