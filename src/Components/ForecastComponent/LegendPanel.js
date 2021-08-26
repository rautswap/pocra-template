import React, { Component } from 'react'
import "./LegendPanel.css"
export default class LegendPanel extends Component {
	render() {


		const renderAuthButton = () => {

			console.log(this.props.mapcomp.pname)
			if (this.props.mapcomp.pname == "rainfall_mm") {
				return (
					<>
						<table >
							<tr>
								<th colSpan={2} className="borber" > Legend</th>
							</tr>
							<tr>
								<th colSpan={2}> Rainfall (mm)</th>
							</tr>
							<tr>
								<td><img src="dist/legend/forcast1.jpg" height={'30px'} width={'50px'} />  </td>

								<td>{this.props.mapcomp.rain1} - {this.props.mapcomp.rain2} </td>
							</tr>
							<tr>
								<td><img src="dist/legend/forcast2.jpg" height={'30px'} width={'50px'} />  </td>

								<td>{this.props.mapcomp.rain2 + 0.1} - {this.props.mapcomp.rain3} </td>
							</tr>
							<tr>
								<td><img src="dist/legend/forcast3.jpg" height={'30px'} width={'50px'} />  </td>

								<td>{this.props.mapcomp.rain3 + 0.1} - {this.props.mapcomp.rain4} </td>
							</tr>
							<tr>
								<td><img src="dist/legend/forcast4.jpg" height={'30px'} width={'50px'} />  </td>

								<td>{this.props.mapcomp.rain4 + 0.1} and above </td>
							</tr>
						</table>
					</>
				)

			} else if (this.props.mapcomp.pname == "temp_min_deg_c") {
				return (
					<>
						<table>
							<tr>
								<th colSpan={2} className="borber" > Legend</th>
							</tr>
							<tr>
								<th colSpan={2}> Minimun Temprature (&#176;C)</th>
							</tr>
							<tr>
								<td><img src="dist/legend/forcast1.jpg" height={'30px'} width={'50px'} />  </td>

								<td>{this.props.mapcomp.rain1} - {this.props.mapcomp.tempmin1} </td>
							</tr>
							<tr>
								<td><img src="dist/legend/forcast2.jpg" height={'30px'} width={'50px'} />  </td>

								<td>{this.props.mapcomp.tempmin1 + 0.1} - {this.props.mapcomp.tempmin2} </td>
							</tr>
							<tr>
								<td><img src="dist/legend/forcast3.jpg" height={'30px'} width={'50px'} />  </td>

								<td>{this.props.mapcomp.tempmin2 + 0.1} - {this.props.mapcomp.tempmin3} </td>
							</tr>
							<tr>
								<td><img src="dist/legend/forcast4.jpg" height={'30px'} width={'50px'} />  </td>

								<td>{this.props.mapcomp.tempmin3 + 0.1} and above </td>
							</tr>
						</table>
					</>
				)

			} else if (this.props.mapcomp.pname == "temp_max_deg_c") {
				return (
					<>
						<table>
							<tr>
								<th colSpan={2} className="borber" > Legend</th>
							</tr>
							<tr>
								<th colSpan={2}> Maximum Temprature (&#176;C)</th>
							</tr>
							<tr>
								<td><img src="dist/legend/forcast1.jpg" height={'30px'} width={'50px'} />  </td>

								<td>{this.props.mapcomp.rain1} - {this.props.mapcomp.tempmax1} </td>
							</tr>
							<tr>
								<td><img src="dist/legend/forcast2.jpg" height={'30px'} width={'50px'} />  </td>

								<td>{this.props.mapcomp.tempmax1 + 0.1} - {this.props.mapcomp.tempmax2} </td>
							</tr>
							<tr>
								<td><img src="dist/legend/forcast3.jpg" height={'30px'} width={'50px'} />  </td>

								<td>{this.props.mapcomp.tempmax2 + 0.1} - {this.props.mapcomp.tempmax3} </td>
							</tr>
							<tr>
								<td><img src="dist/legend/forcast4.jpg" height={'30px'} width={'50px'} />  </td>

								<td>{this.props.mapcomp.tempmax3 + 0.1} and above </td>
							</tr>
						</table>
					</>
				)

			}
		}
		return (
			<div>
				{renderAuthButton()}
			</div>
		)

	}
}
