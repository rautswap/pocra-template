import React, { useState, useEffect, useReducer } from 'react';

import { Dropdown, Button, InputNumber, Row, Col, Popover } from 'antd';

// import Konva from 'konva';
import { Stage, Layer, Group, Text, Rect, Circle, Line } from 'react-konva';
import { ChromePicker } from 'react-color';

import * as CU from './constants_and_utilities';



const LEGEND_GRADIENT_BAR_HEIGHT = 150;


export const MapLegendButton = ({layer, new_layer_legend, view_pane_dispatch}) => {
	// console.log(layer !== null ? layer.legend.breaks : null);

	const [breaks, setBreaks] = useState(
		/*using JSON to achieve the required deep-copy*/
		(layer !== null && layer.legend.breaks !== undefined)
		? JSON.parse(JSON.stringify(layer.legend.breaks)).sort((b1, b2) => b2[0]-b1[0])
		: []
	);
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		// console.log(layer);
		if (layer !== null && layer.legend.breaks !== undefined)
			setBreaks(JSON.parse(JSON.stringify(layer.legend.breaks)).sort((b1, b2) => b2[0]-b1[0]));
	}, [layer, new_layer_legend]);

	// console.log(layer);
	// console.log(breaks);
	return ((layer === null || layer.legend.breaks === undefined) ? <div>+</div> : (
		<Popover
			trigger="click"
			//visible={visible}
			//onClick={e=>setVisible(true)}
			placement="leftBottom"
			content={
				<div style={{width: 300, minHeight: 200, maxHeight: 200, overflowY: 'scroll'}}>
				{breaks.map((b, i) => (
					<Row type="flex" align="middle" justify="space-around" style={{height: 50}} key={i.toString()}>
						<Col span={6}>
							<InputNumber
								value={b[0]}
								onChange={value => {
									// console.log(breaks, [...breaks]);
									let new_breaks = [...breaks];
									new_breaks[i] = [value, breaks[i][1]];
									setBreaks(new_breaks);
								}}
							/>
						</Col>
						<Col span={6}>
							<Popover
								placement="bottom"
				      			content={
				      				<ChromePicker
				      					color={b[1]}
										onChangeComplete={(colour, event) => {
											// console.log(colour);
											let new_breaks = [...breaks];
											new_breaks[i] = [breaks[i][0], colour.hex];
											setBreaks(new_breaks);
										}}
									/>
								}
			      			>
				      			<div style={{width: '100%', height: 16, background: b[1]}}/>
				      		</Popover>
						</Col>
					</Row>
					)
				)}
					<div style={{textAlign: 'center', marginTop: 10}}>
						<Button
							style={{marginRight: 10}}
							onClick={e => setBreaks(JSON.parse(JSON.stringify(layer.legend.breaks)).sort((b1, b2) => b2[0]-b1[0]))}
						>
							Reset
						</Button>
						<Button
							type="primary"
							style={{marginLeft: 10}}
							onClick={e => {
								// console.log('here1');
								let sorted_breaks = [...breaks].sort((b1, b2) => b1[0]-b2[0]);
								view_pane_dispatch({
									type: 'restyle-layer',
									payload: {
										title: layer.title,
										style_env_params: {
											...layer.style_env_params,
											x1: sorted_breaks[0][0], c1: sorted_breaks[0][1],
											x2: sorted_breaks[1][0], c2: sorted_breaks[1][1],
											x3: sorted_breaks[2][0], c3: sorted_breaks[2][1],
										},
										legend: {
											...layer.legend,
											breaks: sorted_breaks
										}
									}
								});
								setVisible(false);
								// console.log({
								// 	...layer,
								// 	style_env_params: {
								// 		...layer.style_env_params,
								// 		x1: breaks[2][0], c1: breaks[2][1],
								// 		x2: breaks[1][0], c2: breaks[1][1],
								// 		x3: breaks[0][0], c3: breaks[0][1],
								// 	},
								// 	legend: {
								// 		...layer.legend,
								// 		breaks: breaks
								// 	}
								// });
								// console.log('here2');
								// view_pane_dispatch({
								// 	type: 'get-map',
								// 	payload: {
								// 		...layer,
								// 		style_env_params: {
								// 			...layer.style_env_params,
								// 			x1: breaks[2][0], c1: breaks[2][1],
								// 			x2: breaks[1][0], c2: breaks[1][1],
								// 			x3: breaks[0][0], c3: breaks[0][1],
								// 		},
								// 		legend: {
								// 			...layer.legend,
								// 			breaks: breaks
								// 		}
								// 	}
								// });
							}}
						>
							Apply
						</Button>
					</div>
				</div>
			}
		>
			<div> +</div>
		</Popover>
	));
};


export const MapLegend = ({specifications}) => {
	// console.log(specifications);
	// return null;
	return (

			<Popover
			placement="top"
			title="legend"
			//trigger="click"
			content={
				specifications === null ? null : (
		specifications.type === 'ramp' ? (



		<div>
			{/*<div className="legend-title">
				{specifications.title}
			</div>*/}
			<Stage
				width={document.getElementById('legend-div').clientWidth}
				height={LEGEND_GRADIENT_BAR_HEIGHT +50 /*document.getElementById('legend-div').clientHeight*/}
			>
				<Layer>
					<Rect
						x={10}
						y={10}
						width={20}
						height={LEGEND_GRADIENT_BAR_HEIGHT}
						fillLinearGradientStartPointY={0}
						fillLinearGradientEndPointY={LEGEND_GRADIENT_BAR_HEIGHT}
						fillLinearGradientColorStops={[].concat(...(
							[...specifications.breaks].sort((b1, b2) => b2[0]-b1[0]).map((b, i, breaks) => [i/(breaks.length-1), b[1]])
						))}
					/>
					<Text x={5} y={180} text={"Units : "+specifications.measurement_unit} />
					{[...specifications.breaks].sort((b1, b2) => b2[0]-b1[0]).map((b, i, breaks) => {
						// console.log(cs);
						return (
							<Text
								key={b[0].toString()}
								x={ 35 }
								y={ 10 + Math.round(LEGEND_GRADIENT_BAR_HEIGHT * i/(breaks.length-1)) - 5 }
								text={b[0].toString()}
							/>
						);
					})}
				</Layer>
			</Stage>
		</div>
		) : (
		specifications.type === 'url' ? (
		<div>
			<img src={CU.BUILD_LEGEND_GRAPHIC_URL(specifications.url_params)}/>
		</div>
		) : null ))
			}
			// visible={true}
			>
			<div>Legend Control</div>
		</Popover>

		



	);



		{/* ( this one should be used for discrete (adjustable-colour) categories; temporarrily using <null>
		<div>
			<div className="legend-title">
				{specifications.title}
			</div>
			<Stage
				width={document.getElementById('legend-div').clientWidth}
				height={document.getElementById('legend-div').clientHeight}
			>
				<Layer>
					{specifications.items.map((item, idx) => {
						// console.log(item);
						switch(item.shape) {
							case 'circle':
								return (
									<Group>
										<Circle
											x={10}
											y={10*(idx+1)}
											radius={item.size_params.radius}
											fill={item.fill_colour}
										/>
										<Text x={50} y={10*(idx+0.5)} text="label" />
									</Group>
								);
						}
					})}
				</Layer>
			</Stage>
		</div>
	)));*/}
};


// export default MapLegend;