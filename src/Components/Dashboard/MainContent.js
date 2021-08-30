import React, { Component } from 'react'
import ChartExample from '../DBTComponent/ChartExample'
import FarmerBarChart from '../DBTComponent/FarmerBarChart'

export default class MainContent extends Component {
    render() {
        return (
            <div>
                <div className="content-wrapper">
                    {/* Content Header (Page header) */}
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1 className="m-0">Dashboard</h1>
                                </div>
                                {/* /.col */}
                                <div className="col-sm-6">
                                    <ol className="breadcrumb float-sm-right">

                                    </ol>
                                </div>
                                {/* /.col */}
                            </div>
                            {/* /.row */}
                        </div>
                        {/* /.container-fluid */}
                    </div>
                    {/* /.content-header */}
                    {/* Main content */}
                    <section className="content">
                        <div className="container-fluid">
                            {/* Small boxes (Stat box) */}
                            <div className="row">
                                <div className="col-lg-3 col-6">
                                    {/* small box */}
                                    <div className="small-box bg-info">
                                        <div className="inner">
                                            <h3>150</h3>
                                            <p>New Orders</p>
                                        </div>
                                        <div className="icon">
                                            <i className="ion ion-bag" />
                                        </div>
                                        <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
                                    </div>
                                </div>
                                {/* ./col */}
                                <div className="col-lg-3 col-6">
                                    {/* small box */}
                                    <div className="small-box bg-success">
                                        <div className="inner">
                                            <h3>53<sup style={{ fontSize: 20 }}>%</sup></h3>
                                            <p>Bounce Rate</p>
                                        </div>
                                        <div className="icon">
                                            <i className="ion ion-stats-bars" />
                                        </div>
                                        <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
                                    </div>
                                </div>
                                {/* ./col */}
                                <div className="col-lg-3 col-6">
                                    {/* small box */}
                                    <div className="small-box bg-warning">
                                        <div className="inner">
                                            <h3>44</h3>
                                            <p>User Registrations</p>
                                        </div>
                                        <div className="icon">
                                            <i className="ion ion-person-add" />
                                        </div>
                                        <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
                                    </div>
                                </div>
                                {/* ./col */}
                                <div className="col-lg-3 col-6">
                                    {/* small box */}
                                    <div className="small-box bg-danger">
                                        <div className="inner">
                                            <h3>65</h3>
                                            <p>Unique Visitors</p>
                                        </div>
                                        <div className="icon">
                                            <i className="ion ion-pie-graph" />
                                        </div>
                                        <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
                                    </div>
                                </div>
                                {/* ./col */}
                            </div>
                            {/* /.row */}
                            {/* Main row */}
                            <div className="row">
                                {/* Left col */}
                                <section className="col-lg-7 connectedSortable">
                                    {/* Custom tabs (Charts with tabs)*/}
                                    <div className="card">
                                        <div className="card-header">
                                            <h3 className="card-title">
                                                <i className="fas fa-chart-pie mr-1" /> DBT Farmer
                                            </h3>
                                            <div className="card-tools">
                                                {/* <ul className="nav nav-pills ml-auto">
                                                    <li className="nav-item">
                                                        <a className="nav-link active" href="#revenue-chart" data-toggle="tab">Area</a>
                                                    </li>
                                                    <li className="nav-item">
                                                        <a className="nav-link" href="#sales-chart" data-toggle="tab">Donut</a>
                                                    </li>
                                                </ul> */}
                                            </div>
                                        </div>
                                        {/* /.card-header */}
                                        <div className="card-body">
                                            <div className="tab-content p-0">
                                                <FarmerBarChart />

                                            </div>
                                        </div>
                                        {/* /.card-body */}
                                    </div>
                                </section>
                                {/* /.Left col */}
                                {/* right col (We are only adding the ID to make the widgets sortable)*/}
                                <section className="col-lg-5 connectedSortable">
                                    {/* Map card */}
                                    <div className="card ">
                                        <div className="card-header border-0">
                                            <h3 className="card-title">
                                                <i className="fas fa-map-marker-alt mr-1" /> Chart Example
                                            </h3>
                                            {/* card tools */}
                                            {/* <div className="card-tools">
                                                <button type="button" className="btn btn-primary btn-sm daterange" title="Date range">
                                                    <i className="far fa-calendar-alt" />
                                                </button>
                                                <button type="button" className="btn btn-primary btn-sm" data-card-widget="collapse" title="Collapse">
                                                    <i className="fas fa-minus" />
                                                </button>
                                            </div> */}
                                            {/* /.card-tools */}
                                        </div>
                                        <div className="card-body">
                                            <ChartExample />
                                        </div>
                                    </div>
                                </section>
                                {/* right col */}
                            </div>
                            {/* /.row (main row) */}
                        </div>
                        {/* /.container-fluid */}
                    </section>
                    {/* /.content */}
                </div>

            </div>
        )
    }
}
