import { connect } from 'react-redux';
//import * as actions from '../actions/GameComponent';
import React, { Component } from 'react';
import ActionsComponent from '../components/ActionsComponent';

const mapStateToProps = state => {
  return state;
}

const mapDispatchToProps = dispatch => {

  return {

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionsComponent);
