import React from 'react';
import PropTypes from 'prop-types';
import ActionDataAnalyzer from '../ActionDataAnalyzer';
import { Button, Tooltip, Col, Row, Input, Form } from 'reactstrap';
import '../compiled/ActionsComponent.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { translate } from 'react-i18next';
import Global from '../Global';

class ActionsComponent extends React.Component {

  constructor(){
    super();
    this.state = {
      actions: [],
      step: 0,
      scores: [],
      uploadingScore: false,
      tooltipOpen: false,
      consistencyRates: [],
      repsEachAction: [],
      latestUpdated: null,
      newNames: [],
      saveTimeout: null,
      savedMessageTimeout: null
    };

    this.setScore = this.setScore.bind(this);
    this.reset = this.reset.bind(this);
    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.passScoresToParent = this.passScoresToParent.bind(this);
    this.onChangeActionName = this.onChangeActionName.bind(this);
    this.createTempNamesArray = this.createTempNamesArray.bind(this);
    this.deleteAction = this.deleteAction.bind(this);
    this.renderNonEditable = this.renderNonEditable.bind(this);
    this.renderEditable = this.renderEditable.bind(this);
    this.saveActions = this.saveActions.bind(this);
    this.moveUp = this.moveUp.bind(this);
    this.moveDown = this.moveDown.bind(this);
    this.addNewAction = this.addNewAction.bind(this);
    this.turnAllIntoFolders = this.turnAllIntoFolders.bind(this);
    this.dispatchSaveTimeout = this.dispatchSaveTimeout.bind(this);
  }


  static getDerivedStateFromProps(nextProps, prevState){

    let newState = {};

    // 何もしないで
    if(prevState.latestUpdated === nextProps.latestUpdated){

    } else {

      // 木構造が変更されたので、時間がかかる計算を再度行う。

      console.log("成功率を計算")

      let consistencyRates = ActionDataAnalyzer.getConsistencyRates(nextProps.actions);
      let repsEachAction = ActionDataAnalyzer.getRepsEachAction(nextProps.actions);
      newState['scores'] = new Array(nextProps.actions.children.length);
      newState['latestUpdated'] = nextProps.latestUpdated;
      newState['consistencyRates'] = consistencyRates;
      newState['repsEachAction'] = repsEachAction;
      newState['actions'] = nextProps.actions;
    }

    return newState;
  }

  turnAllIntoFolders(){
    let actions = this.state.actions.children;
    for(let i=0; i < actions.length; i++){
      let children = [{ name: '', scores: [] }];
      actions[i].children = children;
      if(actions[i].hasOwnProperty('scores')){
        actions[i].children[0].scores = actions[i]['scores'];
        delete actions[i]['scores'];
      }
    }
    this.props.saveActions(this.state.actions.nodeId, actions);
  }


  addNewAction(){console.log("NEW ACTION")
    let temp = this.state.newNames;
    temp.push({
      name: '',
      nodeId: -1
    });

    this.setState({ newNames: temp });

    this.dispatchSaveTimeout();
  }

  moveUp(index){
    if(index === 0) return;

    let newNames = this.state.newNames;

    let temp = newNames[index];
    newNames[index] = newNames[index-1];
    newNames[index-1] = temp;

    this.setState({ newNames });

    this.dispatchSaveTimeout();
  }

  moveDown(index){

    let newNames = this.state.newNames;

    if(index === newNames.length-1) return;

    let temp = newNames[index];
    newNames[index] = newNames[index+1];
    newNames[index+1] = temp;

    this.setState({ newNames });

    this.dispatchSaveTimeout();
  }


  dispatchSaveTimeout(){

    clearTimeout(this.state.savedMessageTimeout);

    if(this.state.saveTimeout !== null){
      clearTimeout(this.state.saveTimeout);
    }

    this.setState({
      savedMessageTimeout: null,
      saveTimeout: setTimeout(this.saveActions, Global.saveDelayTime)
    });

  }


  saveActions(){

    clearTimeout(this.state.saveTimeout);
    this.setState({
      saveTimeout: null
    });

    let newChildren = [];

    let newNames = this.state.newNames;
    let actions = this.state.actions.children;

    for(let i=0; i < newNames.length; i++){
      let oldChild;

      if(newNames[i].nodeId === -1){
        // 新しい
        oldChild = {
          name: newNames[i].name,
          scores: []
        };

      } else {
        for(let j=0; j < actions.length; j++){
          if(newNames[i].nodeId === actions[j].nodeId){
            oldChild = actions[j];
            break;
          }
        }
        oldChild.name = newNames[i].name;
      }
      newChildren.push(oldChild);
    }

    this.props.saveActions(this.state.actions.nodeId, newChildren, function(){
      this.setState({
        savedMessageTimeout: setTimeout(function(){
          this.setState({
            savedMessageTimeout: null
          });
        }.bind(this), 1500)
      });


      this.createTempNamesArray();

    }.bind(this));

  }

  componentWillUnmount(){
    clearTimeout(this.state.saveTimeout);
    clearTimeout(this.state.savedMessageTimeout);
  }


  deleteAction(index){

    let temp = this.state.newNames;

    temp.splice(index, 1);

    this.setState({
      newNames: temp
    });

    this.dispatchSaveTimeout();
  }

  onChangeActionName(ev, i){
    ev.preventDefault();

    let temp = this.state.newNames;

    temp[i].name = ev.target.value;

    this.setState({ newNames: temp });

    this.dispatchSaveTimeout();
  }



  passScoresToParent(){

    this.setState({ uploadingScore: true });

    this.props.setScore(this.state.scores, this.props.nodeId, function(){

      this.setState({ uploadingScore: false });
      this.reset();

    }.bind(this));
  }

  setScore(step, score){

    let scores = this.state.scores;

    let nextStep = this.state.actions.children.length;

    scores[step] = score;

    for(let i=0; i < scores.length; i++){
      if(typeof scores[i] === 'undefined'){
        nextStep = i;
        break;
      }
    }

    this.setState({ scores: scores, step: nextStep });

    if(nextStep === this.state.actions.children.length){
      this.passScoresToParent();
    }
  }

  reset(){
    this.setState({
      step: 0, scores: new Array(this.state.actions.children.length)
    });
  }

  toggleTooltip() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }

  createTempNamesArray(){
    let newNames = [];

    for(let i=0; i < this.state.actions.children.length; i++){
      newNames.push({
        nodeId: this.state.actions.children[i].nodeId,
        name: this.state.actions.children[i].name
      });
    }

    this.setState({
      newNames
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot){

    // editableをtrueにした
    if(!prevProps.tree.editable && this.props.tree.editable){
      this.reset();
      this.createTempNamesArray();
    }
  }

  componentDidMount(){
    this.createTempNamesArray();
    this.props.onRef(this);
  }


  renderNonEditable(){

    const { t } = this.props;

    return <div>

      {this.state.actions.children.map(function(action, step){

        return <div key={step} className='action-item'>

          {action.name? action.name : <i>{t("default")}</i>}

          <Row>
            <Col md='6'>
              <div className='button-bar'>
              {[0, 1, 2, 3, 4].map(function(num, index){
                return <Button
                className={classNames({
                  'marked-score': this.state.scores[step] === num,
                  'score-btn': true
                })}
                key={index} disabled={this.state.step < step || this.state.uploadingScore}
                onClick={ () => { this.setScore(step, index) }}>{ t(`score-${num}`) }</Button>;
              }.bind(this))}
              </div>
            </Col>

            <Col className='info' md='6'>
              <span>{t("success-rate-total-times", { rate: this.state.consistencyRates[step], times: this.state.repsEachAction[step] })}</span>
            </Col>

          </Row>

        </div>

      }.bind(this))}

      {this.state.step > 0?
        <div>
          <Button className='form-button' color='danger' disabled={this.state.uploadingScore} onClick={this.reset}>{t("modal-cancel")}</Button>
          <Button className='form-button' color='primary' disabled={this.state.uploadingScore} onClick={this.passScoresToParent} id='send-btn'>
            {t("form-send")}
          </Button>

          <Tooltip placement='right' target='send-btn' isOpen={this.state.tooltipOpen} toggle={this.toggleTooltip}>
            {t("send-scores")}
          </Tooltip>

        </div> : ''
      }

    </div>;
  }


  renderEditable(){

    return <div>

      {this.state.newNames.map(function(action, step){

        return <div key={step} className='action-item'>

          <Form inline onSubmit={ev => { ev.preventDefault(); }}>
            <Button className='margin-right' color='danger' onClick={() => {this.deleteAction(step)}}><FontAwesomeIcon icon='times'/></Button>
            <Input className='margin-right' value={action.name} onChange={(e) => {this.onChangeActionName(e, step)}}/>

            {step > 0? <Button type='button' className='margin-right' color='secondary' onClick={() => {this.moveUp(step)}}><FontAwesomeIcon icon='arrow-up'/></Button> : ''}
            {step < this.state.newNames.length-1? <Button className='margin-right' color='secondary' onClick={() => {this.moveDown(step)}}><FontAwesomeIcon icon='arrow-down'/></Button> : ''}

          </Form>
        </div>

      }.bind(this))}

      <Form inline className='add-new-input'>
        {this.state.saveTimeout === null? '' : <FontAwesomeIcon icon='spinner' spin/>}
        {this.state.savedMessageTimeout === null? '' : <span><FontAwesomeIcon icon='check'/></span>}
      </Form>

    </div>;

  }


  render(){

    if(!this.props.tree.editable){
      return this.renderNonEditable();
    }

    // editable == true
    return this.renderEditable();
  }

}

ActionsComponent.propTypes = {
  setScore: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired,
  nodeId: PropTypes.number.isRequired,
  latestUpdated: PropTypes.string.isRequired,
  saveActions: PropTypes.func.isRequired
};

export default translate('translations')(ActionsComponent);
