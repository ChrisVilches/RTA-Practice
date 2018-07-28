import { connect } from 'react-redux';
import * as actions from '../actions/GameComponent';
import GameComponent from '../components/GameComponent';

const mapStateToProps = state => {
  return state;
}

const mapDispatchToProps = dispatch => {

  return {
    fetchGame: (gameId, callback) => { dispatch(actions.fetchGame(gameId, callback)) },
    toggleEditable: () => { dispatch(actions.toggleEditable()) },
    setExpansionAll: bool => { dispatch(actions.setExpansionAll(bool)) }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GameComponent);
