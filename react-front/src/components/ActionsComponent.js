import React from 'react';
import PropTypes from 'prop-types';
import ActionDataAnalyzer from '../ActionDataAnalyzer';
import { Button, Tooltip, Col, Row, Input, Form } from 'reactstrap';
import '../compiled/ActionsComponent.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { translate } from 'react-i18next';
import DragDropComponent from '../containers/DragDropComponent';

class ActionsComponent extends React.Component {

  constructor(){
    super();
    this.state = {
      actions: null,
      step: 0,
      scores: [],
      uploadingScore: false,
      tooltipOpen: false,
      consistencyRates: [],
      repsEachAction: [],
      newNameInput: "",
      editingIndex: -1
    };

    this.setScore = this.setScore.bind(this);
    this.reset = this.reset.bind(this);
    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.passScoresToParent = this.passScoresToParent.bind(this);
    this.onChangeActionName = this.onChangeActionName.bind(this);
    this.deleteAction = this.deleteAction.bind(this);
    this.addNewAction = this.addNewAction.bind(this);
    this.turnAllIntoFolders = this.turnAllIntoFolders.bind(this);
    this.startEditing = this.startEditing.bind(this);
    this.updateActionName = this.updateActionName.bind(this);
  }

  startEditing(step){
    this.setState({
      editingIndex: step,
      newNameInput: this.state.actions.children[step].name
    });
  }

  updateActionName(){
    let nodeId = this.state.actions.children[this.state.editingIndex].nodeId;
    let name = this.state.newNameInput;
    this.setState({ editingIndex: -1 });
    this.props.updateActionName(this.props.tree.game.children, this.props.tree.gameId, nodeId, name);
  }


  static getDerivedStateFromProps(nextProps, prevState){

    let newState = {};

    // 何もしないで
    if(prevState.updatedAt === nextProps.tree.game.updatedAt){

    } else {

      // 木構造が変更されたので、時間がかかる計算を再度行う。

      console.log(`成功率を計算、${prevState.updatedAt}!=${nextProps.tree.game.updatedAt}`)

      let consistencyRates = ActionDataAnalyzer.getConsistencyRates(nextProps.actions);
      let repsEachAction = ActionDataAnalyzer.getRepsEachAction(nextProps.actions);
      newState['scores'] = new Array(nextProps.actions.children.length);
      newState['updatedAt'] = nextProps.tree.game.updatedAt;
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
    this.props.saveActions(this.props.tree.game.children, this.props.tree.gameId, this.props.parentId, actions);
  }

  
  addNewAction(){
    this.props.addNewAction(this.props.tree.game.children, this.props.tree.gameId, this.props.parentId);
  }

  deleteAction(nodeId){

    this.props.deleteAction(this.props.tree.game.children, this.props.tree.gameId, nodeId);
  }

  onChangeActionName(ev){
    ev.preventDefault();
    this.setState({ newNameInput: ev.target.value });
  }


  passScoresToParent(){

    this.setState({ uploadingScore: true });

    this.props.setScore(this.state.scores, this.props.parentId, function(){

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


  componentDidUpdate(prevProps, prevState, snapshot){

    if(prevProps.tree.game.updatedAt !== this.props.tree.game.updatedAt){
      this.reset();
    }
  }

  componentDidMount(){
    this.props.onRef(this);
  }


  render(){

    const { t } = this.props;

    return <div>


      <DragDropComponent
        data={this.state.actions.children}
        parentId={this.props.parentId}>{(provided, snapshot, n, i) => (

          <div key={i} className='action-item' ref={provided.innerRef} {...provided.draggableProps}>

            {this.state.editingIndex === i?

              <Form className="mt-2 mb-2" inline onSubmit={ev => { ev.preventDefault(); this.updateActionName(); }}>
                <Button className='margin-right' color='danger' onClick={() => {this.deleteAction(n.nodeId)}}><FontAwesomeIcon icon='times'/></Button>
                <Input autoFocus className='margin-right' value={this.state.newNameInput} onChange={this.onChangeActionName} onBlur={()=>{setTimeout(this.updateActionName.bind(this), 100)}}/>
              </Form>

              :
              <span onClick={() => { this.startEditing(i) }}>
              {n.name? n.name : <i>{t("default")}</i>}
              </span>
            }

            <Row>
              <Col md='6'>
                <div className='button-bar'>
                  {[0, 1, 2, 3, 4].map(function(num, index){
                    return <Button
                    className={classNames({
                      'marked-score': this.state.scores[i] === num,
                      'score-btn': true
                    })}
                    key={index} disabled={this.state.step < i || this.state.uploadingScore}
                    onClick={ () => { this.setScore(i, index) }}>{ t(`score-${num}`) }</Button>;
                  }.bind(this))}

                  <span className='node-toolbar-btn visible-only-hover' color="" {...provided.dragHandleProps}><FontAwesomeIcon icon='arrows-alt'/></span>

                </div>

              </Col>

              <Col className='info' md='6'>
                <span>{t("success-rate-total-times", { rate: this.state.consistencyRates[i], times: this.state.repsEachAction[i] })}</span>
              </Col>

            </Row>

          </div>

        )}</DragDropComponent>

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



}

ActionsComponent.propTypes = {
  setScore: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired,
  parentId: PropTypes.number.isRequired
};

export default translate('translations')(ActionsComponent);
