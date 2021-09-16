import React, { Component } from 'react'
import "./LegendPanel.css"
export default class LegendPanelDashboard extends Component {
	constructor(props) {
		super(props)


	}

	render() {


		const renderAuthButton = () => {


			return (
				<>
					<table >
						{
							console.log(this.props)
						}
						{/* <tr>
							<th colSpan={2} className="borber" > Legend</th>
						</tr>
						<tr>
							<th colSpan={2}> No of Applications</th>
						</tr>
						<tr>
							<td><img src="dist/legend/forcast1.jpg" height={'30px'} width={'50px'} />  </td>

							<td>0 - {this.props.props.appl_1} </td>
						</tr>
						<tr>
							<td><img src="dist/legend/forcast2.jpg" height={'30px'} width={'50px'} />  </td>

							<td>{this.props.props[0].appl_1 + 0.1} - {this.props.props[0].appl_2} </td>
						</tr>
						<tr>
							<td><img src="dist/legend/forcast3.jpg" height={'30px'} width={'50px'} />  </td>

							<td>{this.props.props[0].appl_2 + 0.1} - {this.props.props[0].appl_3} </td>
						</tr>
						<tr>
							<td><img src="dist/legend/forcast4.jpg" height={'30px'} width={'50px'} />  </td>

							<td>{this.props.props[0].appl_3 + 0.1} and above </td>
						</tr> */}
					</table>
				</>
			)


		}
		return (
			<div>
				{/* {renderAuthButton()} */}
				return (
				<>
					<table >
						{
							console.log(this.props.props.appl_1)
						}
						<tr>
							<th colSpan={2} className="borber" > Legend</th>
						</tr>
						<tr>
							<th colSpan={2}> No of Applications</th>
						</tr>
						<tr>
							<td><img src="dist/legend/forcast1.jpg" height={'30px'} width={'50px'} />  </td>

							<td>0 - {this.props.props.appl_1} </td>
						</tr>
						<tr>
							<td><img src="dist/legend/forcast2.jpg" height={'30px'} width={'50px'} />  </td>

							<td>{this.props.props.appl_1 + 0.1} - {this.props.props.appl_2} </td>
						</tr>
						<tr>
							<td><img src="dist/legend/forcast3.jpg" height={'30px'} width={'50px'} />  </td>

							<td>{this.props.props.appl_2 + 0.1} - {this.props.props.appl_3} </td>
						</tr>
						<tr>
							<td><img src="dist/legend/forcast3.jpg" height={'30px'} width={'50px'} />  </td>

							<td>{this.props.props.appl_3 + 0.1} - {this.props.props.appl_4} </td>
						</tr>
						<tr>
							<td><img src="dist/legend/forcast3.jpg" height={'30px'} width={'50px'} />  </td>

							<td>{this.props.props.appl_4 + 0.1} - {this.props.props.appl_5} </td>
						</tr>
					</table>
				</>
				)
			</div>
		)

	}
}
