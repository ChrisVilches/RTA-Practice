import React, { Component } from 'react';

import { Switch, Route, Redirect, NavLink } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import { translate } from 'react-i18next';

import './compiled/DashboardComponent.css';

import GameListComponent from './dashboard/GameListComponent';
import SettingsComponent from './dashboard/SettingsComponent';
import UserInfoComponent from './dashboard/UserInfoComponent';


class DashboardComponent extends Component {

  render() {
    const { t } = this.props;

    return (

      <div>

        <Row className='mb-4'>
          <Col>
            <h1>{t("dashboard-account-title")}</h1>
          </Col>
        </Row>

        <Row>

          <Col md="3" className='mb-4'>

            <NavLink to={`${this.props.match.url}/games`} className='config-menu-item' activeClassName="config-menu-item-selected">
              <FontAwesomeIcon icon="gamepad"/> {t("dashboard-list-games")}
            </NavLink>

            <NavLink to={`${this.props.match.url}/settings`} className='config-menu-item' activeClassName="config-menu-item-selected">
              <FontAwesomeIcon icon="wrench"/> {t("dashboard-settings")}
            </NavLink>

            <NavLink to={`${this.props.match.url}/user`} className='config-menu-item' activeClassName="config-menu-item-selected">
              <FontAwesomeIcon icon="user"/> {t("dashboard-account")}
            </NavLink>

          </Col>

          <Col md="6">
            <Switch>
              <Route exact path={`${this.props.match.url}`} render={() => <Redirect to={`${this.props.match.url}/games`} />} />
              <Route exact path={`${this.props.match.url}/games`} component={GameListComponent} />

              <Route path={`${this.props.match.url}/settings`} component={SettingsComponent} />
              <Route path={`${this.props.match.url}/user`} component={UserInfoComponent} />
              <Route render={() => <Redirect to="/404" />} />
            </Switch>
          </Col>

        </Row>

      </div>

    );
  }
}

export default translate('translations')(DashboardComponent);
