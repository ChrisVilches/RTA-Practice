import React from 'react';
import ReactDOM from 'react-dom';
import ActionDataAnalyzer from '../ActionDataAnalyzer';

it('成功率を正しく計算できる', () => {

  let testCases = [
    [{ children: [{}, {}, {}] }, [0, 0, 0]],
    [{ children: [{ scores: [4, 4] }, { scores: [1, null] }, { scores: [2, null] }] }, [100, 25, 50]],
    [{ children: [{ scores: [4, 4, null, 4, null, 4] }, { scores: [1, null, 1, 2] }, { scores: [2, null, null] }] }, [100, 33, 50]],
    [{ children: [{ scores: [1] }] }, [25]]
  ];

  for(let i=0; i<testCases.length; i++){

    let test = testCases[i];

    let actions = test[0];
    let consistenciesResult = ActionDataAnalyzer.getConsistencyRates(actions);
    let consistenciesCorrect = test[1];

    expect(consistenciesResult.length).toEqual(consistenciesCorrect.length);
    expect(consistenciesResult[0]).toEqual(consistenciesCorrect[0]);
    expect(consistenciesResult[1]).toEqual(consistenciesCorrect[1]);
    expect(consistenciesResult[2]).toEqual(consistenciesCorrect[2]);

  }


});
