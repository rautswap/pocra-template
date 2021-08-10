import React, { Component } from 'react'
import "./Sidebar.css"
export default class Header extends Component {
    render() {
        return (
            <div>
                <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                    {/* Left navbar links */}
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars" /></a>
                        </li>

                        <div id="title-grid" >
                            <h1 id="title">नानाजी देशमुख कृषि संजीवनी प्रकल्प</h1>
                        </div>
                        <div class="top-menu">
                            <ul class="nav navbar-nav pull-right">

                            </ul>
                        </div>
                    </ul>
                    {/* Right navbar links */}
                    <ul className="navbar-nav ml-auto">
                        {/* Navbar Search */}
                        <li class="dropdown dropdown-quick-sidebar-toggler">
                            <img src="https://mahapocra.gov.in/assets/images/emblum.png" />
                            <img src="https://mahapocra.gov.in/assets/images/logo.png" />
                        </li>
                    </ul>
                </nav>

            </div>
        )
    }
}
