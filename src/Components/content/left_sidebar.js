import React, { useState, useEffect } from 'react';

import { Tree, Popover } from 'antd';


import './left_sidebar.css';



const DatasetsTreeNode = ({ dtn, hue, level, ancestors, content_dispatch }) => {
	const [expanded, setExpanded] = useState(false);
	const [selectedIndicator, setSelectedIndicator] = useState('');

	
}
const DatasetsTree = ({ dtns, content_dispatch }) => (
	<div >
		{dtns.map(({ title,children: subItems, ...rest }) => (
			<li className="nav-item">
			{Array.isArray(subItems) ? (
				<li className="nav-item">
					<a href="" className="nav-link">
						<i className=""></i>
						<p>
							{title}
							<i className="fas fa-angle-left right"></i>
						</p>
					</a>
					{subItems.map((subItem) => (
						<ul className="nav nav-treeview">
							<li className="nav-item">
								<a href="" className="nav-link">
									<i className=""></i>
									<p>{subItem.title}</p>
								</a>
							</li>
						</ul>

					))}
				</li>

			) : <a href="" className="nav-link">
				<i className=""></i>
				<p>
					{title}
				</p>
			</a>}
		</li>)
			// 
			
		)}
	</div>
);

const LeftSidebar = ({ sections, makeRequest, content_dispatch }) => {
	console.log(sections);
	return <DatasetsTree dtns={sections}
		content_dispatch={content_dispatch}
	/>;
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