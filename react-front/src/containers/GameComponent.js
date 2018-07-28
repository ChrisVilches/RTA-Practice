import { connect } from 'react-redux';
import * as gameActions from '../actions/GameComponent';
import * as nodeActions from '../actions/NodeComponent';
import GameComponent from '../components/GameComponent';
import { bindActionCreators } from 'redux';

const mapStateToProps = state => {
  return state;
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign(gameActions, nodeActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(GameComponent);
