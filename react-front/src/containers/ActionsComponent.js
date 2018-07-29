import { connect } from 'react-redux';
import * as actionsActions from '../actions/ActionsComponent';
import ActionsComponent from '../components/ActionsComponent';
import { bindActionCreators } from 'redux';

const mapStateToProps = state => {
  return state;
}

const mapDispatchToProps = dispatch => {

  return bindActionCreators(actionsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionsComponent);
