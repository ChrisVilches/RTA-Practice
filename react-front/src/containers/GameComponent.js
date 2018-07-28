import { connect } from 'react-redux';
import * as actions from '../actions/GameComponent';
import React, { Component } from 'react';
import GameComponent from '../components/GameComponent';

const mapStateToProps = state => {
  return state;
}

const mapDispatchToProps = dispatch => {

  return {
    fetchImages: url => { dispatch(actions.fetchImages(url)) },
    fetchScrapers: () => { dispatch(actions.fetchScrapers()) },
    toggleEditable: () => { dispatch(actions.toggleEditable()) }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GameComponent);
