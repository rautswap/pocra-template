import React, { Component } from 'react'
import "./Sidebar.css"
export default class Sidebar extends Component {

    render() {
        const items = [
            { name: 'home', css: 'nav-icon fas fa-tachometer-alt', label: 'होम' },
            { name: 'forecast', css: 'nav-icon fas fa-th', label: 'हवामान अंदाज' },
            { name: 'soilcard', css: 'nav-icon fas fa-copy', label: 'मृद आरोग्य पत्रिका ' },
            // { name: 'dbt', css: 'nav-icon fas fa-tachometer-alt', label: 'PoCRA DBT' },
            {
                name: 'dbt',
                label: 'PoCRA DBT',
                css: 'nav-icon fas fa-tachometer-alt',
                items: [
                    { name: 'dbt', label: 'Farmer' },
                    { name: 'nrm', label: 'NRM' },
                    { name: 'fpc_fpo', label: 'FPC/FPO' },
                ],
            },
            // {
            //     name: 'forecast',
            //     label: 'Forecast',
            //     items: [{ name: 'profile', label: 'Profile' }],
            // },
        ]
        return (
            <div>
                <aside className="main-sidebar sidebar-dark-primary elevation-4">
                    {/* Brand Logo */}
                    <a className="brand-link">
                        <img src="https://mahapocra.gov.in/assets/images/pocra.png" alt="PoCRA Logo" className="brand-image img-square" />
                        <span className="brand-text font-weight " id="title">PoCRA</span>
                    </a>
                    {/* Sidebar */}
                    <div className="sidebar">
                        {/* Sidebar user panel (optional) */}
                        <div className="form-inline" style={{paddingTop:5}} >
                            <div className="input-group" data-widget="sidebar-search">
                                <input className="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
                                <div className="input-group-append">
                                    <button className="btn btn-sidebar">
                                        <i className="fas fa-search fa-fw" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <nav className="mt-2">
                            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                                {items.map(({ label, name, css, items: subItems, ...rest }) => (
                                    <li className="nav-item">
                                        {Array.isArray(subItems) ? (
                                            <li className="nav-item">
                                                <a href={"/" + name} className="nav-link">
                                                    <i className="nav-icon fas fa-copy"></i>
                                                    <p>
                                                        {label}
                                                        <i className="fas fa-angle-left right"></i>
                                                    </p>
                                                </a>
                                                {subItems.map((subItem) => (
                                                    <ul className="nav nav-treeview">
                                                        <li className="nav-item">
                                                            <a href={subItem.name} className="nav-link">
                                                                <i className="far fa-circle nav-icon"></i>
                                                                <p>{subItem.label}</p>
                                                            </a>
                                                        </li>
                                                    </ul>

                                                ))}
                                            </li>

                                        ) : <a href={name} className="nav-link">
                                            <i className={css}></i>
                                            <p>
                                                {label}
                                            </p>
                                        </a>}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        {/* /.sidebar-menu */}
                    </div>
                    {/* /.sidebar */}
                </aside>

            </div>
        )
    }
}
