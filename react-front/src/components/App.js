import React, { Component } from 'react';

import GameComponent from '../containers/GameComponent';
import HomeComponent from './HomeComponent';
import DashboardComponent from './DashboardComponent';
import NotFoundComponent from './NotFoundComponent';

import { Switch, Route, Link } from 'react-router-dom';

import { Container, Button, Input } from 'reactstrap';

import Global from '../Global';
import AuthService from '../AuthService';

import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink } from 'reactstrap';

import { ModalBody, Modal, ModalHeader, ModalFooter } from 'reactstrap';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-free-solid'

import '../compiled/App.css';

import { withRouter } from 'react-router-dom'

import NotificationSystem from 'react-notification-system';

import { translate } from 'react-i18next';


class App extends Component {
  constructor(){
    super();

    Global.resetBackgroundImage();

    this.state = { isOpen: false, login: { user: '', pass: '' }, currentUser: null, newGameModal: false, loadingCreatingNewGame: false, inputNewGame: '', inputNewGameImage: '' };

    this.toggle = this.toggle.bind(this);
    this.sendLoginForm = this.sendLoginForm.bind(this);
    this.updateInputUserValue = this.updateInputUserValue.bind(this);
    this.updateInputPassValue = this.updateInputPassValue.bind(this);
    this.logout = this.logout.bind(this);
    this.addNotification = this.addNotification.bind(this);
    this.toggleNewGameModal = this.toggleNewGameModal.bind(this);
    this.createNewGame = this.createNewGame.bind(this);
    this.onChangeNewGameName = this.onChangeNewGameName.bind(this);
    this.onChangeNewGameBgImage = this.onChangeNewGameBgImage.bind(this);

    this.authService = new AuthService();

  }

  toggleNewGameModal(){
    this.setState({
      newGameModal: !this.state.newGameModal
    });
  }

  onChangeNewGameName(ev){
    ev.preventDefault();
    this.setState({
      inputNewGame: ev.target.value
    });
  }

  onChangeNewGameBgImage(ev){
    ev.preventDefault();
    this.setState({
      inputNewGameImage: ev.target.value
    });
  }

  createNewGame(){

    let name = this.state.inputNewGame.trim();

    if(name.length === 0) return;

    this.setState({
      loadingCreatingNewGame: true
    });

    this.authService.fetch('/games', {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        backgroundImage: this.state.inputNewGameImage.trim()
      })
    })
    .then(function(response){
      this.setState({
        loadingCreatingNewGame: false,
        newGameModal: false,
        inputNewGameImage: '',
        inputNewGame: ''
      });

      this.addNotification(this.props.t("new-game-created"), 'success');
      this.props.history.push('/game/' + response._id);

    }.bind(this))
    .catch(function(err){
      console.log(err);
    });
  }


  addNotification(message, level) {
    this.notificationSystem.addNotification({ message, level });
  }



  componentDidMount(){

    if(this.authService.loggedIn()){
      this.setState({
        currentUser: this.authService.getProfile().username
      });
    }
  }

  sendLoginForm(ev){

    ev.preventDefault();

    let user = this.state.login.user.trim();
    let pass = this.state.login.pass.trim();

    if(user.length === 0 || pass.length === 0) return;

    this.authService.login(user, pass)
    .then(function(res){
      if(this.authService.loggedIn()){

        // ログイン成功

        let username = this.authService.getProfile().username;

        this.addNotification(this.props.t('welcome-user', { userName: username }), 'success');

        this.setState({
          currentUser: username
        });

        this.props.history.push('/dashboard');
      }
    }.bind(this))
    .catch(function(err){
      this.addNotification(this.props.t("wrong-login"), 'error');
    }.bind(this));

  }

  logout(){
    this.authService.logout();
    this.setState({ currentUser: null });
  }

  updateInputUserValue(ev){
    this.setState({
      login: {
        user: ev.target.value,
        pass: this.state.login.pass
      }
    });
  }

  updateInputPassValue(ev){
    this.setState({
      login: {
        user: this.state.login.user,
        pass: ev.target.value
      }
    });
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {

    const { t } = this.props;

    let loginUserInput = <NavItem key={0} className='loginFormInput'>
      <Input value={this.state.login.user} onChange={this.updateInputUserValue.bind(this)} placeholder={t("login-user-placeholder")}></Input>
    </NavItem>;

    let loginPassInput = <NavItem key={1} className='loginFormInput'>
      <Input value={this.state.login.pass} onChange={this.updateInputPassValue.bind(this)} placeholder={t("login-password-placeholder")} type="password"></Input>
    </NavItem>;

    let loginButton = <NavItem key={2} className='loginFormInput'>
      <Button type='submit'>{t("login-button")}</Button>
    </NavItem>;

    return (
      <div className='index'>

        <div className='navbar-custom'>
          <Navbar expand="md" fixed='top' className='navbar-custom'>

            <Container className='container-navbar'>

              <Link className='top-link-page-name' to="/">{Global.appName}</Link>
              <NavbarToggler onClick={this.toggle} className='navbar-toggler-btn'>
                <FontAwesomeIcon icon="ellipsis-v"></FontAwesomeIcon>
              </NavbarToggler>
              <Collapse isOpen={this.state.isOpen} navbar>


                {this.state.currentUser?

                <Nav className="ml-auto" navbar>

                  <NavItem tag={NavLink}>
                    <FontAwesomeIcon icon='user-circle'/> {this.state.currentUser}
                  </NavItem>

                  <NavItem>
                    <NavLink to='#' onClick={this.toggleNewGameModal} tag={Link}>
                      <FontAwesomeIcon icon='plus'/> {t('New')}
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink to='/dashboard' tag={Link}>
                      <FontAwesomeIcon icon='user-circle'/> {t('Account')}
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink to='#' tag={Link} onClick={this.logout}>
                      <FontAwesomeIcon icon='user-circle'/> {t('Logout')}
                    </NavLink>
                  </NavItem>

                </Nav> :

                <Nav className="ml-auto" navbar>
                  <form className='form-inline' onSubmit={this.sendLoginForm}>
                  {[loginUserInput, loginPassInput, loginButton].map(function(ele, key){
                    return ele;
                  })}
                  </form>
                </Nav>

                }

              </Collapse>
            </Container>
          </Navbar>
        </div>

        <br/>
        <br/>
        <br/>

        <Container className='main-container'>
          <Switch>
            <Route exact path="/" component={HomeComponent} />
            <Route path="/game/:gameId" component={GameComponent} />
            <Route path="/dashboard" component={DashboardComponent} />

            <Route path="/404" component={NotFoundComponent} />
            <Route component={NotFoundComponent} />
          </Switch>

        </Container>

        <div className='footer-custom text-muted'>{ Global.appName }</div>

        <Modal isOpen={this.state.newGameModal} toggle={this.toggleNewGameModal}>
          <ModalHeader toggle={this.toggleNewGameModal} disabled={this.state.loadingCreatingNewGame}>{t("modal-create-title")}</ModalHeader>
          <ModalBody>

            <div className='mb-4'>
              <div className='mb-2'>{t("modal-create-enter-name")}</div>
              <Input value={this.state.inputNewGame} onChange={this.onChangeNewGameName}></Input>
            </div>

            <div className='mb-4'>
              <div className='mb-2'>{t("modal-create-enter-wallpaper")}</div>
              <Input value={this.state.inputNewGameImage} onChange={this.onChangeNewGameBgImage}></Input>
            </div>

          </ModalBody>

          <ModalFooter>
            {this.state.loadingCreatingNewGame? <FontAwesomeIcon icon='spinner' spin/> : ''}

            <Button color="primary" onClick={this.createNewGame} disabled={this.state.loadingCreatingNewGame}>{t("modal-create-enter-ok-button")}</Button>{' '}
            <Button color="secondary" onClick={this.toggleNewGameModal} disabled={this.state.loadingCreatingNewGame}>{t("modal-cancel")}</Button>
          </ModalFooter>
        </Modal>


        <NotificationSystem ref={n => this.notificationSystem = n} />
      </div>

    );
  }
}


export default translate('translations')(withRouter(App));
