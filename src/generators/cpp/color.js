/**
 * @license
 * Copyright 2015 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Modifications: BIB - Bob's Improved Blockly
 * Copyright 2024 Nils Springob
 * Source for base code (Blockly): [https://github.com/google/blockly] (Apache-2.0 License)
 * Source for block-color-values and block-captions (OpenRoberta): [https://github.com/OpenRoberta/] (Apache-2.0 License)
 */

/**
 * @fileoverview Generating CPP for color blocks.
 * @author nils@bob3.org (Nils Springob)
 */
'use strict';

goog.provide('Blockly.CPP.color');

goog.require('Blockly.CPP');

Blockly.CPP['shadow-no-Color'] = function(block) {
  let code = '0x000'
  return [code, Blockly.CPP.ORDER_ATOMIC];
};


Blockly.CPP['color_picker'] = function(block) {
  // Color picker.
  let code = Blockly.CPP.quote_(block.getFieldValue('COLOR'));
  code = '0x'+code[2]+code[4]+code[6];
  return [code, Blockly.CPP.ORDER_ATOMIC];
};

Blockly.CPP['color_random'] = function(block) {
  // Generate a random color.
  let code = 'randomNumber(0x000, 0xfff)';
  return [code, Blockly.CPP.ORDER_FUNCTION_CALL];
};

Blockly.CPP['color_rgb'] = function(block) {
  // Compose a color from RGB components expressed as percentages.
  let red = Blockly.CPP.valueToCode(block, 'RED',
      Blockly.CPP.ORDER_NONE) || 0;
  let green = Blockly.CPP.valueToCode(block, 'GREEN',
      Blockly.CPP.ORDER_NONE) || 0;
  let blue = Blockly.CPP.valueToCode(block, 'BLUE',
      Blockly.CPP.ORDER_NONE) || 0;
  let code = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
  return [code, Blockly.CPP.ORDER_FUNCTION_CALL];
};

Blockly.CPP['color_hsv'] = function(block) {
  // Compose a color from RGB components expressed as percentages.
  let hue = Blockly.CPP.valueToCode(block, 'HUE',
      Blockly.CPP.ORDER_NONE) || 0;
  let sat = Blockly.CPP.valueToCode(block, 'SAT',
      Blockly.CPP.ORDER_NONE) || 0;
  let val = Blockly.CPP.valueToCode(block, 'VAL',
      Blockly.CPP.ORDER_NONE) || 0;
  let code = 'hsv(' + hue + ', ' + sat + ', ' + val + ')';
  return [code, Blockly.CPP.ORDER_FUNCTION_CALL];
};


Blockly.CPP['color_blend'] = function(block) {
  // Blend two colors together.
  let c1 = Blockly.CPP.valueToCode(block, 'COLOR1',
      Blockly.CPP.ORDER_NONE) || '\'0x000\'';
  let c2 = Blockly.CPP.valueToCode(block, 'COLOR2',
      Blockly.CPP.ORDER_NONE) || '\'0x000\'';
  let ratio = Blockly.CPP.valueToCode(block, 'RATIO',
      Blockly.CPP.ORDER_NONE) || 50;

  let code = 'mixColor100('+c1+', '+c2+', '+ratio+')';
  return [code, Blockly.CPP.ORDER_FUNCTION_CALL];
};



Blockly.CPP['color_component'] = function(block) {
    // Blend two colors together.
    let c1 = Blockly.CPP.valueToCode(block, 'COLOR', Blockly.CPP.ORDER_NONE) || '\'0x000\'';
    let component = block.getFieldValue('COMPONENT');
    let table = {
        'RED':'colorcomp_red',
        'GREEN':'colorcomp_green',
        'BLUE':'colorcomp_blue',
        'HUE':'colorcomp_hue',
        'SAT':'colorcomp_sat',
        'VAL':'colorcomp_val',
    };
    let code = table[component]+'('+c1+')';
    return [code, Blockly.CPP.ORDER_FUNCTION_CALL];
};
