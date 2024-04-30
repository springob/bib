/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Modifications: BIB - Bob's Improved Blockly
 * Copyright 2024 Nils Springob
 * Source for base code (Blockly): [https://github.com/google/blockly] (Apache-2.0 License)
 * Source for block-color-values and block-captions (OpenRoberta): [https://github.com/OpenRoberta/] (Apache-2.0 License)
 */

/**
 * @fileoverview Image blocks for Blockly.
 * @author nils@bob3.org (Nils Springob)
 */
'use strict';

goog.provide('Blockly.Constants.SCB_Image');

goog.require('Blockly');
goog.require('Blockly.Blocks');
goog.require('Blockly.FieldDropdown');
goog.require('Blockly.FieldImage');
goog.require('Blockly.FieldMultilineInput');
goog.require('Blockly.FieldTextInput');
goog.require('Blockly.FieldVariable');
goog.require('Blockly.Mutator');
goog.require('Blockly.Constants.SCB_ICONS');




// *********************************
// *          PARAMETER DEFINITION
// *********************************



Blockly.Blocks['block_image'] = {
    init: function() {
        this.appendDummyInput()
        .appendField(new Blockly.FieldImageMatrix(), 'MATRIX');
        this.setOutput(true, 'Image');
        this.setStyle('scb_look_blocks');
    },
};
