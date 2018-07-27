import { translate } from 'react-i18next';
import React, { Component } from 'react';

class UserInfoComponent extends Component {
  render(){
    const { t } = this.props;
    return <p>{t("page-under-construction")}</p>;
  }
}

export default translate('translations')(UserInfoComponent);
