import React from 'react';

import { Input } from 'antd';


import './header.css';
import logo from '../pocra.png';



const Header = () => (
	<div id="header-grid">
		<div id="logo-grid">
			{/*<h3 id="logo">LOGO</h3>*/}
			<img src={logo} width={50} height={50} />
		</div>
		<div id="title-grid">
			<h1 id="title">Nanaji Deshmukh Krushi Sanjeevani Prakalp</h1>
		</div>
		{/*<div id="site-search-grid">
			<Input.Search
				id="site-search-input"
				style={{height: '100%', borderBottom: '1.5px solid'}}
				placeholder="Search Site / Get Help"
			/>
		</div>
		<div id="login-button-grid">
			<div id="login-button-text">
				Login
			</div>
		</div>*/}
	</div>
);

export default Header;