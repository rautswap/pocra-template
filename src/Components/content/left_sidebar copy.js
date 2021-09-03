import React, { useState, useEffect } from 'react';

import { Tree, Popover } from 'antd';


import './left_sidebar.css';



const DatasetsTreeNode = ({dtn, hue, level, ancestors, content_dispatch}) => {
	const [expanded, setExpanded] = useState(false);
	const [selectedIndicator, setSelectedIndicator] = useState('');

	console.log(dtn, hue, level, 30-5*level);
	hue = hue || dtn.theme_hue
	return (
		<div
			className={`dtn-div`}// ${dtn.children.length > 0 ? 'with-children' : ''}`}
			style={{
				// marginLeft: level === 1 ? 0 : 5,
				// padding: '5px 0px 0px 5px',
				backgroundColor: `hsl(${hue}, 50%, ${95-5*level}%)`,
				// backgroundColor: `hsl(240, 0%, 90%)`,
				// borderBottom: expanded ? '1px solid black' : '0px',
			}}
		>
			<div
				className="dtn-title-div"
				style={{
					backgroundColor: `hsl(${hue}, 50%, ${70+5*level}%)`,
				}}
				onClick={() => {
					// console.log(dtn);
					setExpanded( !expanded );
					if (dtn.default_map !== undefined) {
						// console.log(dtn);
						content_dispatch({
							type: 'get-map',
							payload: {
								dataset: ancestors,
								title: `${ancestors.join(' : ')} : ${dtn.title}`,
								name_in_geoserver: dtn.default_map.layer_name,
								style_in_geoserver: dtn.default_map.style_name,
								style_env_params: dtn.default_map.default_env_args,
								type: 'gis_entity_set',
								filter: undefined,
								legend: {...dtn.default_map.legend, title: dtn.title},
								visible: true,
								map_renderer: 'geoserver',
							}
						});
					}
				}}
			>
				<span style={{fontSize: 25-5*level, paddingLeft: 5}}>{dtn.title}</span>
			</div>
			{expanded ? (
			<div>
				{dtn.indicators !== undefined ? (
				<div style={{padding: 3}}>
					{/*<label>
						Indicators :
					</label>*/}
					<div style={{textAlign: 'center', padding: 5}}>
						<select
							value={selectedIndicator}
							onChange={e => setSelectedIndicator(e.target.value)}
						>
							<option value="" disabled>--Select Indicator--</option>
							{dtn.indicators.map(indicator => (
								<option key={indicator.title} value={indicator.title}>{indicator.short_title}</option>
							))}
						</select>
					</div>
					<div style={{textAlign: 'center'}}>
						<button
							disabled={selectedIndicator === ''}
							onClick={e => {
								let ind = dtn.indicators.filter(ind => ind.title === selectedIndicator)[0];
								console.log(ind.layer_name);
								content_dispatch({
									type: 'get-map',
									payload: {
										dataset: ancestors,
										title: ind.title,
										name_in_geoserver: ind.layer_name,
										style_in_geoserver: ind.style_name,
										style_env_params: ind.default_env_args,
										type: 'indicator',
										filter: undefined,
										legend: {...ind.legend, title: ind.title},
										visible: true,
										map_renderer: 'geoserver',
									}
								});
							}}
						>
							Show
						</button>
					</div>
				</div>
				) : null }
				<div>
					{dtn.children.map(child => {
						// console.log(child);
						return <DatasetsTreeNode
							key={child.title}
							dtn={child}
							hue={hue}
							level={level+1}
							ancestors={[...ancestors, dtn.title]}
							content_dispatch={content_dispatch}
						/>;
					})}
				</div>
			</div>
			) : null }
		</div>
	);
}
const DatasetsTree = ({dtns, content_dispatch}) => (
	<div style={{height: 'calc(100vh - 50px)', overflow: 'scroll'}}>
		{dtns.map(dtn => (
			<DatasetsTreeNode
				key={dtn.title}
				dtn={dtn}
				hue={null}
				level={1}
				ancestors={[]}
				content_dispatch={content_dispatch}
			/>)
		)}
	</div>
);

const LeftSidebarCopy = ({ sections, makeRequest, content_dispatch }) => {
	console.log(sections);
	return <DatasetsTree dtns={sections} content_dispatch={content_dispatch} />;
};


export default LeftSidebarCopy;



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