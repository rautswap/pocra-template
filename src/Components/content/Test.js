import React, { useState, useEffect } from 'react';

import { Tree, Popover } from 'antd';


import './left_sidebar.css';



const DatasetsTreeNode = ({ dtn, hue, level, ancestors, content_dispatch }) => {
	const [expanded, setExpanded] = useState(false);
	const [selectedIndicator, setSelectedIndicator] = useState('');


	// hue = hue || dtn.theme_hue
	return (
		<div >
			{dtn.map(({ title, description, indicators, children: subItems, ...rest }, index) => (
				<li className="nav-item" key={index}>
					{
						Array.isArray(subItems) ? (<>
						<h1>{title}</h1></>) :
							<>

								<li className="nav-item has-treeview" key={index}>
									<a href='#' className="nav-link">
										<i className='#'></i>
										<p>
											{title}
											<i className="right fas"></i>
										</p>
									</a>
								</li>
							</>
					}
				</li>
			)
			)}
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
		{
			dtns.map(({ title, description, indicators, children: subItems, ...rest }, index) => (
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
											indicators.map(({ title, short_title, indicators: itm, ...rest }, index) => (

												<ul className="nav nav-treeview" key={index}>

													{
														Array.isArray(itm) ? (<>
															<li className="nav-item has-treeview">
																<a href='#' className="nav-link">
																	<i className='nav-icon fas fa-cloud-moon-rain'></i>
																	<p>
																		{short_title}
																		<i className="right fas fa-angle-left"></i>
																	</p>
																</a>
																<ul className="nav nav-treeview">
																	{itm.map((itmn, index) => (
																		<li className="nav-item" key={short_title + index}>

																			<a href='/' className="nav-link">
																				<i className='nav-icon fas fa-cloud-moon-rain'></i>
																				<p> {itmn.short_title}</p>
																			</a>
																		</li>

																	))}
																</ul>
															</li>
														</>) : <>

															<li className="nav-item" key={index}>
																<a href='#' className="nav-link">
																	<i className='nav-icon fas fa-cloud-moon-rain'></i>
																	<p> {short_title}</p>
																</a>
															</li>
														</>
													}
												</ul>
											))
										}
									</>) : <>
										{
											subItems.map(({ title, indicators: itm, ...rest }, index) => (

												<ul className="nav nav-treeview" key={index}>

													{
														Array.isArray(itm) ? (<>
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

																			<a className="nav-link">
																				<i className='#'></i>
																				<p>{itmn.short_title}</p>
																			</a>
																		</li>

																	))}
																</ul>
															</li>
														</>) : <>

															<li className="nav-item" key={index + title}>
																<a className="nav-link">
																	<i className='#'></i>
																	<p>{title}</p>
																</a>
															</li>
														</>
													}
												</ul>
											))
										}
									</>
								}

							</li>
						) :
							<>

								<li className="nav-item has-treeview" key={index}>
									<a href='#' className="nav-link">
										<i className='#'></i>
										<p>
											{title}
											<i className="right fas"></i>
										</p>
									</a>
								</li>
							</>
					}
				</li>
			))
		}
	</div>
);

const Test = ({ sections, makeRequest, content_dispatch }) => {
	// console.log(sections);
	return <DatasetsTree dtns={sections} content_dispatch={content_dispatch} />;
};


export default Test;



// antd-Tree based implementation that is about to be deprecated
// const Test = ({ sections, makeRequest }) => {

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