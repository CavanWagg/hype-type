import React from 'react';
import { Typography } from '@smooth-ui/core-sc';

function helpers() {}

helpers.createWord = string => {
  return string.split('').map((letter, index) => {
    var letterElement = (
      <Typography variant="h5" color="gray100" className="letter" key={index}>
        {letter}
      </Typography>
    );
    return letterElement;
  });
};

helpers.changeLetterColor = (target, letterIndex) => {
  var wordContainer = document.querySelector(target);
  var letterArray = wordContainer.childNodes;
  for (var i = 0; i < letterIndex; i++) {
    letterArray[i].style.color = 'purple';
  }
};

export default helpers;
