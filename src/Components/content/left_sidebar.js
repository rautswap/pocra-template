import React, { useState, useEffect } from 'react';

import { Tree, Popover } from 'antd';


import './left_sidebar.css';



const DatasetsTreeNode = ({ dtn, hue, level, ancestors, content_dispatch }) => {
	const [expanded, setExpanded] = useState(false);
	const [selectedIndicator, setSelectedIndicator] = useState('');

	// console.log(ancestors)
	hue = hue || dtn.theme_hue
	return (
		<div >
			{
				dtn.map(({ title, description, indicators, children: subItems, ...rest }, index) => (
					<li className="nav-item" key={index}>
						{
							Array.isArray(subItems) ? (
								<li className="nav-item has-treeview" >
									<a href='#' className="nav-link">
										<i className='nav-icon fas fa-cloud-moon-rain'></i>
										<p>
											{title}
											<i className="right fas fa-angle-left"></i>
										</p>
									</a>
									{
										Array.isArray(indicators) ? (<>
											{
												indicators.map(({ title, short_title, layer_name, style_name, default_env_args, legend, indicators: itm, ...rest }, index) => (

													<ul className="nav nav-treeview" key={index}>

														{
															Array.isArray(itm) ? (
																<li className="nav-item has-treeview">
																	<a className="nav-link">
																		<i className='nav-icon fas fa-cloud-moon-rain'></i>
																		<p>
																			{short_title}
																			<i className="right fas fa-angle-left"></i>
																		</p>
																	</a>
																	<ul className="nav nav-treeview">
																		{itm.map((itmn, index) => (
																			<li className="nav-item" key={short_title + index}>
																				<a className="nav-link">
																					<i className='nav-icon fas fa-cloud-moon-rain'></i>
																					<p> {itmn.short_title}</p>
																				</a>
																			</li>

																		))}
																	</ul>
																</li>
															) :
																<li className="nav-item" key={index}>
																	<a onClick={e => {
																		// console.log(ind.layer_name);
																		content_dispatch({
																			type: 'get-map',
																			payload: {
																				dataset: ancestors,
																				title: title,
																				name_in_geoserver: layer_name,
																				style_in_geoserver: style_name,
																				style_env_params: default_env_args,
																				type: 'indicator',
																				filter: undefined,
																				legend: { ...legend, title: title },
																				visible: true,
																				map_renderer: 'geoserver',
																			}
																		});
																	}} className="nav-link">
																		<i className='nav-icon fas fa-cloud-moon-rain'></i>
																		<p> {short_title}</p>
																	</a>
																</li>
														}
													</ul>
												))
											}
										</>) : <>
											{
												subItems.map(({ title,short_title, layer_name, style_name, default_env_args, legend, indicators: itm, ...rest }, index) => (

													<ul className="nav nav-treeview" key={index}>

														{
															Array.isArray(itm) ? (
																<li className="nav-item has-treeview">

																	<a href='#' className="nav-link">
																		<i className='#'></i>
																		<p>
																			{title}
																			<i className="right fas fa-angle-left"></i>
																		</p>
																	</a>
																	<ul className="nav nav-treeview">
																		{itm.map((itmn, index) => (
																			<li className="nav-item" key={index + itmn.short_title}>

																				<a onClick={e => {
																					console.log(itmn);
																					// content_dispatch({
																					// 	type: 'get-map',
																					// 	payload: {
																					// 		dataset: ancestors,
																					// 		title: title,
																					// 		name_in_geoserver: layer_name,
																					// 		style_in_geoserver: style_name,
																					// 		style_env_params: default_env_args,
																					// 		type: 'indicator',
																					// 		filter: undefined,
																					// 		legend: { ...legend, title: title },
																					// 		visible: true,
																					// 		map_renderer: 'geoserver',
																					// 	}
																					// });
																				}} className="nav-link">
																					<i className='#'></i>
																					<p>{itmn.short_title}</p>
																				</a>
																			</li>

																		))}
																	</ul>
																</li>
															) :
																<li className="nav-item" key={index + title}>
																	<a className="nav-link" onClick={e => {
																		console.log(subItems);
																		// content_dispatch({
																		// 	type: 'get-map',
																		// 	payload: {
																		// 		dataset: ancestors,
																		// 		title: title,
																		// 		name_in_geoserver: layer_name,
																		// 		style_in_geoserver: style_name,
																		// 		style_env_params: default_env_args,
																		// 		type: 'indicator',
																		// 		filter: undefined,
																		// 		legend: { ...legend, title: title },
																		// 		visible: true,
																		// 		map_renderer: 'geoserver',
																		// 	}
																		// });
																	}} >
																		<i className='#'></i>
																		<p>{title}</p>
																	</a>
																</li>
														}
													</ul>
												))
											}
										</>
									}

								</li>
							) :
								<li className="nav-item has-treeview" key={index}>
									<a href='#' className="nav-link">
										<i className='#'></i>
										<p>
											{title}
											<i className="right fas"></i>
										</p>
									</a>
								</li>
						}
					</li>
				))
			}
		</div>
	);
}
const DatasetsTree = ({ dtns, content_dispatch }) => (
	<div>
		<DatasetsTreeNode
			key={dtns.title}
			dtn={dtns}
			hue={null}
			level={1}
			ancestors={[]}
			content_dispatch={content_dispatch}
		/>
	</div>
);

const LeftSidebar = ({ sections, makeRequest, content_dispatch }) => {
	// console.log(sections);
	return <DatasetsTree dtns={sections} content_dispatch={content_dispatch} />;
};


export default LeftSidebar;



// antd-Tree based implementation that is about to be deprecated
// const LeftSidebar = ({ sections, makeRequest }) => {

// 	return (
// 		<div id="left-sidebar-grid">
// 			<Tree
// 				selectedKeys={[]}
// 				onSelect={selectedKeys => {
// 					// if (! selectedKeys.includes('Weather'))
// 					// 	return;
// 					makeRequest({
// 						dataset_item: selectedKeys[0],
// 						view: 'maps'
// 					});
// 				}}
// 			>
// 				{
// 				sections.map(s => (
// 					<Tree.TreeNode
// 						title={<h2>{s}</h2>}
// 						key={s}
// 					/>
// 				))
// 				}
// 			</Tree>
// 		</div>
// 	);
// };