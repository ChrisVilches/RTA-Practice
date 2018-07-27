class ActionDataAnalyzer {

  static get maxScore(){ return 4; }

  static get onlyNLast(){ return 20; }

  static getRepsEachAction(actions){
    let reps = new Array(actions.children.length);
    for(let i=0; i < reps.length; i++) reps[i] = 0;

    for(let i=0; i<actions.children.length; i++){
      let child = actions.children[i];

      if(!child.hasOwnProperty('scores')) continue;

      for(let j=child.scores.length-1; j>=0; j--){
        if(child.scores[j] != null && typeof child.scores[j] !== 'undefined'){
          reps[i]++;
        }
      }
    }

    return reps;
  }

  static getConsistencyRates(actions){
    let consistencies = new Array(actions.children.length);
    for(let i=0; i < consistencies.length; i++) consistencies[i] = 0;

    for(let i=0; i<actions.children.length; i++){
      let child = actions.children[i];
      let sum = 0;
      let maxPossible = 0;
      let remaining = ActionDataAnalyzer.onlyNLast;

      if(!child.hasOwnProperty('scores')) continue;

      for(let j=child.scores.length-1; j>=0; j--){
        if(child.scores[j] != null && typeof child.scores[j] !== 'undefined'){
          sum += child.scores[j];
          maxPossible += ActionDataAnalyzer.maxScore;
          remaining--;
          if(remaining === 0) break;
        }
      }

      if(maxPossible === 0){
        consistencies[i] = 0;
      } else {

        let division = ActionDataAnalyzer.onlyNLast * ActionDataAnalyzer.maxScore;
        division = Math.max(division, maxPossible);

        consistencies[i] = Math.round((sum/division) * 100);
      }
    }
    return consistencies;
  }

}


export default ActionDataAnalyzer;
