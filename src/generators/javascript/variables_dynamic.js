/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Modifications: BIB - Bob's Improved Blockly
 * Copyright 2024 Nils Springob
 * Source for base code (Blockly): [https://github.com/google/blockly] (Apache-2.0 License)
 * Source for block-color-values and block-captions (OpenRoberta): [https://github.com/OpenRoberta/] (Apache-2.0 License)
 */

/**
 * @fileoverview Generating JavaScript for dynamic variable blocks.
 * @author fenichel@google.com (Rachel Fenichel)
 */
'use strict';

goog.provide('Blockly.JavaScript.variablesDynamic');

goog.require('Blockly.JavaScript');
goog.require('Blockly.JavaScript.variables');


// JavaScript is dynamically typed.
Blockly.JavaScript['variables_get_dynamic'] =
    Blockly.JavaScript['variables_get'];
Blockly.JavaScript['variables_set_dynamic'] =
    Blockly.JavaScript['variables_set'];
