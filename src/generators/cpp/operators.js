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
 * @fileoverview Generating CPP for math blocks.
 * @author nils@bob3.org (Nils Springob)
 */
'use strict';

goog.provide('Blockly.CPP.operators');

goog.require('Blockly.CPP');

Blockly.CPP['operator_num_num2'] = function(block) {
  // Basic arithmetic operators, and power.
  var OPERATORS = {
    'ADD': [' + ', Blockly.CPP.ORDER_ADDITION],
    'SUB': [' - ', Blockly.CPP.ORDER_SUBTRACTION],
    'MUL': [' * ', Blockly.CPP.ORDER_MULTIPLICATION],
    'DIV': [' / ', Blockly.CPP.ORDER_DIVISION],
    'MOD': [' % ', Blockly.CPP.ORDER_DIVISION],
    'POW': [' ** ', Blockly.CPP.ORDER_POWER]
  };
  var tuple = OPERATORS[block.operator_];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.CPP.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.CPP.valueToCode(block, 'B', order) || '0';
  var code = argument0 + operator + argument1;
  return [code, order];
};

Blockly.CPP['operator_bool_num2'] = function(block) {
  // Basic arithmetic operators, and power.
  var OPERATORS = {
    'EQ': [' == ', Blockly.CPP.ORDER_EQUALITY],
    'NEQ': [' != ', Blockly.CPP.ORDER_EQUALITY],
    'LT': [' < ', Blockly.CPP.ORDER_RELATIONAL],
    'GT': [' > ', Blockly.CPP.ORDER_RELATIONAL],
    'LET': [' <= ', Blockly.CPP.ORDER_RELATIONAL],
    'GET': [' >= ', Blockly.CPP.ORDER_RELATIONAL]
  };
  var tuple = OPERATORS[block.operator_];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.CPP.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.CPP.valueToCode(block, 'B', order) || '0';
  var code = argument0 + operator + argument1;
  return [code, order];
};

Blockly.CPP['operator_bool_str2'] = function(block) {
  // Basic arithmetic operators, and power.
  var OPERATORS = {
    'EQ': [' == ', Blockly.CPP.ORDER_EQUALITY],
    'NEQ': [' != ', Blockly.CPP.ORDER_EQUALITY],
    'LT': [' < ', Blockly.CPP.ORDER_RELATIONAL],
    'GT': [' > ', Blockly.CPP.ORDER_RELATIONAL],
    'LET': [' <= ', Blockly.CPP.ORDER_RELATIONAL],
    'GET': [' >= ', Blockly.CPP.ORDER_RELATIONAL]
  };
  var tuple = OPERATORS[block.operator_];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.CPP.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.CPP.valueToCode(block, 'B', order) || '0';
  var code = argument0 + operator + argument1;
  return [code, order];
};


Blockly.CPP['operator_bool_bool2'] = function(block) {
  // Basic arithmetic operators, and power.
  var OPERATORS = {
    'AND': [' && ', Blockly.CPP.ORDER_LOGICAL_AND],
    'OR': [' || ', Blockly.CPP.ORDER_LOGICAL_OR],
    'XOR': [' ^ ', Blockly.CPP.ORDER_LOGICAL_OR],
    'EQ': [' == ', Blockly.CPP.ORDER_EQUALITY]
  };
  var tuple = OPERATORS[block.operator_];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.CPP.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.CPP.valueToCode(block, 'B', order) || '0';
  var code = argument0 + operator + argument1;
  return [code, order];
};

Blockly.CPP['operator_logic_bool'] = function(block) {
  // Basic arithmetic operators, and power.
  const OPERATORS = {
    'AND': [' && ', Blockly.CPP.ORDER_LOGICAL_AND],
    'OR': [' || ', Blockly.CPP.ORDER_LOGICAL_OR],
    'XOR': [' ^ ', Blockly.CPP.ORDER_LOGICAL_OR],
    'EQ': [' == ', Blockly.CPP.ORDER_EQUALITY]
  };
  var tuple = OPERATORS[block.getFieldValue('OP')];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.CPP.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.CPP.valueToCode(block, 'B', order) || '0';
  var code = argument0 + operator + argument1;
  return [code, order];
};


Blockly.CPP['operator_bool_col2'] = function(block) {
  // Basic arithmetic operators, and power.
  var OPERATORS = {
    'EQ': [' == ', Blockly.CPP.ORDER_EQUALITY]
  };
  var tuple = OPERATORS[block.operator_];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.CPP.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.CPP.valueToCode(block, 'B', order) || '0';
  var code = argument0 + operator + argument1;
  return [code, order];
};

Blockly.CPP['operator_not'] = function(block) {
  // Negation.
  var order = Blockly.CPP.ORDER_LOGICAL_NOT;
  var argument0 = Blockly.CPP.valueToCode(block, 'BOOL', order) ||
      'true';
  var code = '!' + argument0;
  return [code, order];
};

Blockly.CPP['operator_random_number'] = function(block) {
  // Negation.
  var order = Blockly.CPP.ORDER_LOGICAL_NOT;
  var lower = Blockly.CPP.valueToCode(block, 'LOWER', order) || '0';
  var upper = Blockly.CPP.valueToCode(block, 'UPPER', order) || '0';
  var code = 'randomNumber('+lower+', '+upper+')';
  return [code, Blockly.CPP.ORDER_FUNCTION_CALL];
};

Blockly.CPP['literal_Boolean'] = function(block) {
  var code = block.value_?'true':'false';
  return [code, Blockly.CPP.ORDER_ATOMIC];
};


Blockly.CPP['operator_concat'] = function(block) {
    var textA = Blockly.CPP.stringValueToCode(block, 'A', Blockly.CPP.ORDER_ADDITION) || '""';
    var textB = Blockly.CPP.stringValueToCode(block, 'B', Blockly.CPP.ORDER_ADDITION) || '""';
    var code = textA + '+' + textB;
    return [code, Blockly.CPP.ORDER_ADDITION];
};

