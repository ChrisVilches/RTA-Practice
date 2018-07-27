import defaultBackground from'./img/bg.jpg';

class Global {

  static get baseUrl(){
    return 'http://localhost:3000'
  }

  static get appName(){
    return 'RTA Training';
  }

  static resetBackgroundImage(){

    document.body.style.backgroundImage = 'url(' + defaultBackground + ')';

  }

  static resetTitle(){
    document.title = Global.appName;
  }


}


export default Global;
