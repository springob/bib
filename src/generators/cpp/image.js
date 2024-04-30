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
 * @fileoverview Generating CPP for bob3 code
 * @author nils@bob3.org (Nils Springob)
 */


'use strict';

goog.provide('Blockly.CPP.image');

goog.require('Blockly.CPP');



Blockly.CPP['block_image'] = function(block) {
    let hexarray = block.getField('MATRIX').getHexArray();
    let code = 'BitmapCol(9,7,1,(uint8_t*)(const uint8_t []) {'+hexarray+'})';
    return [code, Blockly.CPP.ORDER_NONE];
};


Blockly.CPP['block_bob3_display_Image'] = function(block) {
    var image = Blockly.CPP.valueToCode(block, 'IMAGE', Blockly.CPP.ORDER_COMMA) || '';
    //var code1 = 'BitmapCol(9,7,1,(uint8_t*)(const uint8_t []) {0x00, 0x0c, 0x1e, 0x3e, 0x7c, 0x3e, 0x1e, 0x0c, 0x00})';
    var code = "bob3.matrix.drawBitmap(0, 0, " + image + ");\nbob3.matrix.commit();\n";
    return code;
};

