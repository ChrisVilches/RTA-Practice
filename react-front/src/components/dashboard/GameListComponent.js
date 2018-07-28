import { translate } from 'react-i18next';
import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import { Row, Col, Container } from 'reactstrap';

import AuthService from '../../AuthService';

class GameListComponent extends Component {

  constructor(){
    super();
    this.state = {
      games: []
    };

    this.authService = new AuthService();

  }

  componentDidMount(){

    this.authService.fetch('/games')
    .then(function(res){
      this.setState({ games: res });
    }.bind(this))
    .catch(function(err){
      console.log(err);
    });

  }

  render(){

    const { t } = this.props;

    return (
      <div>
        {this.state.games.map(function(game, i){
          return <div className='game-list-item' key={i}>

            <Link to={`/game/${game._id}`}>{game.name}</Link>

            {game.practiceCount > 0?
              <Container className='game-list-item-info-container'>
                <Row>
                  <Col>{t("game-list-last-time-used")}</Col><Col>{
                    function(){
                      let date = new Date(game.lastPractice);
                      let days = date.toLocaleDateString();
                      let time = date.toLocaleTimeString();
                      return days + ' ' + time;
                    }()
                  }</Col>
                </Row>

                <Row>
                  <Col>{t("game-list-rep-count")}</Col><Col>{t("game-list-n-times", { times: game.practiceCount })}</Col>
                </Row>

              </Container> : <div className='game-list-item-info-container'>{t("game-list-no-reps-yet")}</div>
            }

          </div>;
        })}
      </div>
    );
  }
}

export default translate('translations')(GameListComponent);
