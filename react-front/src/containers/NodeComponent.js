import { connect } from 'react-redux';
import * as nodeActions from '../actions/NodeComponent';
import * as actionsActions from '../actions/ActionsComponent';
import NodeComponent from '../components/NodeComponent';
import { bindActionCreators } from 'redux';

const mapStateToProps = state => {
  return state;
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign(nodeActions, actionsActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeComponent);
