import React, { Component } from 'react';

import bkImage from'../img/bk.png';
import marioImage from'../img/mario.png';

import { Row, Col } from 'reactstrap';

import AuthService from '../AuthService';

import { translate } from 'react-i18next';

import '../compiled/HomeComponent.css';

class HomeComponent extends Component {
  constructor(){
    super();
    this.state = {
      games: []
    };

    this.authService = new AuthService();
  }


  render() {

    const { t } = this.props;
    return (

      <div>

        <Row className="homepage-main-block">
          <Col md="6">
            <img src={bkImage} alt='Banjo Kazooie'/>
          </Col>
          <Col md="6" className='vertical-middle-text'>
            <p>{t("RTA-what-is")}</p>
          </Col>
        </Row>


        <Row className="homepage-main-block">
          <Col md="6" className='vertical-middle-text'>
            <p>{t("TAS-what-is")}</p>
          </Col>
          <Col md="6">
            <img src={marioImage} alt='Mario'/>
          </Col>
        </Row>


      </div>
    );
  }
}

export default translate('translations')(HomeComponent);
