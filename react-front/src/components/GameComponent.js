import React, { Component } from 'react';
import NodeComponent from '../containers/NodeComponent';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import Global from '../Global';
import AuthService from '../AuthService';

import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { translate } from 'react-i18next';

import '../compiled/GameComponent.css';
import classNames from 'classnames';


class GameComponent extends Component {
  constructor(){
    super();

    this.authService = new AuthService();

    this.state = { game: null, isOpen: false, modal: false, startDate: new Date() };
    this.toggle = this.toggle.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.updateTreeData = this.updateTreeData.bind(this);
    this.setScore = this.setScore.bind(this);
    this.saveActions = this.saveActions.bind(this);
    this.addNewChildSegment = this.addNewChildSegment.bind(this);
    this.modifyNode = this.modifyNode.bind(this);
    this.loadGame = this.loadGame.bind(this);
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal
    });
  }

  modifyNode(nodeId, newNode, callback = ()=>{}){

    let segments = this.props.tree.game.children;

    if(newNode.hasOwnProperty('removeFlag')){
      segments = GameComponent.removeNode(segments, nodeId);
    }
    else {
      GameComponent.findNodeUpdate(segments, nodeId, function(node){
        Object.keys(newNode).map(function(key){
          node[key] = newNode[key];
          return null;
        });
      });
    }


    this.updateTreeData(segments, callback);
  }


  saveActions(nodeId, newActionNodes, callback = () => {}){

    let treeTemp = this.props.tree.game.children;

    GameComponent.findNodeUpdate(treeTemp, nodeId, function(n){
      n.children = newActionNodes;
    });

    this.updateTreeData(treeTemp, callback);

  }


  static removeNode(parentSegments, nodeId){

    for(let i=0; i < parentSegments.length; i++){
      if(parentSegments[i].nodeId === nodeId){
        parentSegments.splice(i, 1);
        return parentSegments;
      }
    }

    GameComponent.findNodeUpdate(parentSegments, nodeId, function(node, parent){
      let index = -1;
      for(let i=0; i < parent.children.length; i++){
        if(nodeId === parent.children[i].nodeId){
          index = i;
          break;
        }
      }
      if(index !== -1){
        parent.children.splice(index, 1);
      }
    });
    return parentSegments;
  }


  static traversal(node, func, parent = null) {
    func(node, parent);
    if(node.hasOwnProperty('children')){
      for(let i=0; i < node.children.length; i++){
        GameComponent.traversal(node.children[i], func, node);
      }
    }
  };

  static traverseAllNodes(parentSegments, func){
    for(let i=0; i < parentSegments.length; i++){
      GameComponent.traversal(parentSegments[i], func);
    }
  }

  static findNode(parentSegments, nodeId){
    let node = null;
    GameComponent.traverseAllNodes(parentSegments, function(x){
      if(x.nodeId === nodeId){
        node = x;
      }
    });
    return node;
  }

  static findNodeUpdate(parentSegments, nodeId, updateFunction){
    GameComponent.traverseAllNodes(parentSegments, function(node, parent){
      if(node.nodeId === nodeId){
        updateFunction(node, parent);
      }
    });
  }


  addNewChildSegment(nodeId, callback = ()=>{}){

    let segments = this.state.game.children;
    if(nodeId === -1){
      segments.push({ name: '' });
      this.updateTreeData(segments, callback);
      return;
    }

    GameComponent.findNodeUpdate(segments, nodeId, function(node, parent){
      node.children.push({
        name: ''
      });
    });

    this.updateTreeData(segments, callback);
  }



  setScore(scores, nodeId, actionCallback){

    let node = GameComponent.findNode(this.state.game.children, nodeId);

    for(let i=0; i < node.children.length; i++){

      if(!node.children[i].hasOwnProperty('scores')){
        node.children[i]['scores'] = [];
      }

      if(typeof scores[i]){
        node.children[i].scores.push(scores[i]);
      }
    }

    this.updateTreeData(this.state.game.children, actionCallback);

  }

  updateTreeData(treeData, actionCallback = () => {}){

    this.authService.fetch('/games/' + this.state.game._id, {
      method: 'PUT',
      body: JSON.stringify({
        children: treeData
      })
    })
    .then(function(response){

      this.setState({ game: response }, actionCallback);

    }.bind(this))
    .catch(function(err){
      console.log(err);
    });

  }

  loadGame(){
    let gameId = this.props.match.params.gameId;
    this.props.fetchGame(gameId, function(){

      let image = this.props.tree.game.backgroundImage;
      let title = this.props.tree.game.name;

      if(image){
        document.body.style.backgroundImage = 'url(' + image + ')';
      }

      document.title = `${title} | ${Global.appName}`;
    }.bind(this));
  }



  componentDidUpdate(prevProps, prevState, snapshot){
    let gameId = this.props.match.params.gameId;
    if(prevProps.match.params.gameId === gameId) return;
    this.loadGame();
  }

  componentDidMount(){
    this.loadGame();
  }

  componentWillUnmount(){
    Global.resetBackgroundImage();
    Global.resetTitle();
  }


  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {

    const { t } = this.props;

    if(this.props.tree.isFetchingGame === true){
      return (
        <Col>
          <FontAwesomeIcon icon='spinner' spin/>
        </Col>
      );
    }

    return (

      <Row>
        <Col>

          <h1>{ this.props.tree.game.name }</h1>
          <p className="created-at-by">{t("created-at-by", { date: this.props.tree.startDate, author: this.props.tree.game.owner.username })}</p>

          <div className='toolbar'>
            <Button onClick={() => { this.props.setExpansionAll(false) }}><FontAwesomeIcon icon='folder'/> {t("game-collapse")}</Button>
            <Button onClick={() => { this.props.setExpansionAll(true) }}><FontAwesomeIcon icon='folder-open'/> {t("game-expand")}</Button>
            <Button onClick={this.toggleModal}><FontAwesomeIcon icon='chart-bar'/> {t("game-stats")}</Button>

            <Button onClick={this.props.toggleEditable} className={classNames({ 'btn-active': this.props.tree.editable })}><FontAwesomeIcon icon='edit'/> {t("game-edit")}</Button>
          </div>

          {
            this.props.tree.game.children.map(function(n, i){
              return <NodeComponent
                node={n}
                key={i}
                modifyNode={this.modifyNode}
                setScore={this.setScore}
                saveActions={this.saveActions}
                lastChild={this.props.tree.game.children.length === i+1}
                segmentQuantity={this.props.tree.game.children.length}
                addNewChildSegment={this.addNewChildSegment}
                />;

            }.bind(this))
          }

          {this.props.tree.editable? <Button onClick={()=>{ this.addNewChildSegment(-1) }}><FontAwesomeIcon icon='plus'/></Button> : ''}

        </Col>

        <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>{t("game-stats")}</ModalHeader>
          <ModalBody>
            <p>{t("page-under-construction")}</p>
          </ModalBody>

          <ModalFooter>
            <Button color="primary" onClick={this.toggleModal}>{t("modal-accept")}</Button>{' '}
            <Button color="secondary" onClick={this.toggleModal}>{t("modal-cancel")}</Button>
          </ModalFooter>
        </Modal>

      </Row>

    );
  }
}

export default translate('translations')(GameComponent);
