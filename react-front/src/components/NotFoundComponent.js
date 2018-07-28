import { Row, Col } from 'reactstrap';
import React, { Component } from 'react';
import { translate } from 'react-i18next';

class NotFoundComponent extends Component {
  render(){

    const { t } = this.props;

    return (
      <Row>
        <Col><h1>{t("404")}</h1></Col>
      </Row>
    );
  }
}

export default translate('translations')(NotFoundComponent);
