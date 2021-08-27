import React, { Component } from 'react'

export default class DropDown extends Component {
	constructor(props) {
		super(props)

		console.log(props.activity_props)
	}

	render() {
		
		return (
			<div className="form-group">
				
				<label>{this.props.props.activityGroup[0].label}</label>
				<select className="form-control select2" style={{ width: '90%' }}>
					<option selected="selected">Alabama</option>
					<option>Alaska</option>
					<option>California</option>
					<option>Delaware</option>
					<option>Tennessee</option>
					<option>Texas</option>
					<option>Washington</option>
				</select>
			</div>
		)
	}
}
