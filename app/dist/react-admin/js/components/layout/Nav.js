"use strict";

// Vendor modules
import React                          from "react";
import { IndexLink, Link }            from "react-router";

export default class Nav extends React.Component {
  constructor() {
    super()
    this.state = {
      collapsed: true,
    };
  }

  toggleCollapse() {
    const collapsed = !this.state.collapsed;
    this.setState({collapsed});
  }

  render() {
    const { location } = this.props;
    const { collapsed } = this.state;
    const courseAdminClass = (location.pathname === "/admin/course" || location.pathname === "/") ? "active" : "";
    const conferenceAdminClass = location.pathname === "/admin/conference" ? "active" : "";
    const loginClass = location.pathname === "/admin/login" ? "active" : "";
    const navClass = collapsed ? "collapse" : "";

    return (
      <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" onClick={this.toggleCollapse.bind(this)} >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
          </div>
          <div className={"navbar-collapse " + navClass} id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li>
                <a href="http://www.mondeavie.ca" onClick={this.toggleCollapse.bind(this)}>
                  <span dangerouslySetInnerHTML={{__html: " &lt; RETOUR AU SITE" }}></span>
                </a>
              </li>
              <li className={courseAdminClass}>
                <IndexLink to="/admin/course" onClick={this.toggleCollapse.bind(this)}>CALENDRIER DES COURS</IndexLink>
              </li>
              <li className={conferenceAdminClass}>
                <Link to="/admin/conference" onClick={this.toggleCollapse.bind(this)}>CONFÉRENCES ET ATELIERS</Link>
              </li>
              <li className={loginClass}>
                <Link to="/admin/login" onClick={this.toggleCollapse.bind(this)}>LOGIN</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}