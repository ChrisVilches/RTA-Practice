export const REQUEST_IMAGES = 'REQUEST_IMAGES';
export const RECEIVE_IMAGES_RESULT = 'RECEIVE_IMAGES_RESULT';
export const INVALIDATE_URL = 'INVALIDATE_URL';

export const REQUEST_SCRAPERS = 'REQUEST_SCRAPERS';
export const REQUEST_SCRAPERS_RESULT = 'REQUEST_SCRAPERS_RESULT';

export const TOGGLE_EDITABLE = 'TOGGLE_EDITABLE';

export function toggleEditable(){
  return {
    type: TOGGLE_EDITABLE
  };
}


let requestImages = function(){
  return {
    type: REQUEST_IMAGES
  };
}

let receiveImagesResult = function(images){
  return {
    type: RECEIVE_IMAGES_RESULT,
    images
  };
}

let invalidateUrl = function(){
  return {
    type: INVALIDATE_URL
  };
}

let requestScrapers = function(){
  return {
    type: REQUEST_SCRAPERS
  };
}

let receiveScrapersResult = function(scrapers){
  return {
    type: REQUEST_SCRAPERS_RESULT,
    scrapers
  };
}


export const fetchImages = function(url){

  return dispatch => {

    dispatch(requestImages());

    fetch("http://localhost:3000/?url=" + url)
    .then(data => {
      if(data.status === 400) throw new Error();
      return data.json();
    })
    .then(data => {
      dispatch(receiveImagesResult(data));
    })
    .catch(err => {
      dispatch(invalidateUrl());
    });
  };
}


export const fetchScrapers = function(){

  return dispatch => {

    dispatch(requestScrapers());

    fetch("http://localhost:3000/active_scrapers")
    .then(data => data.json())
    .then(data => {
      dispatch(receiveScrapersResult(data.scrapers));
    })
    .catch(console.log);

  };
}
