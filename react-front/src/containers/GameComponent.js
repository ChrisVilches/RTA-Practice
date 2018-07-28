import { connect } from 'react-redux';
import * as actions from '../actions/GameComponent';
import React, { Component } from 'react';
import GameComponent from '../components/GameComponent';

const mapStateToProps = state => {
  return state;
}

const mapDispatchToProps = dispatch => {

  return {
    fetchGame: (gameId, callback) => { dispatch(actions.fetchGame(gameId, callback)) },
    toggleEditable: () => { dispatch(actions.toggleEditable()) }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GameComponent);
