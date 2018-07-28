import { connect } from 'react-redux';
//import * as actions from '../actions/GameComponent';
import React, { Component } from 'react';
import NodeComponent from '../components/NodeComponent';

const mapStateToProps = state => {
  return state;
}

const mapDispatchToProps = dispatch => {

  return {

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeComponent);
