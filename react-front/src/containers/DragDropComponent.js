import { connect } from 'react-redux';
import * as gameActions from '../actions/GameComponent';
import DragDropComponent from '../components/DragDropComponent';
import { bindActionCreators } from 'redux';

const mapStateToProps = state => {
  return state;
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(gameActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DragDropComponent);
