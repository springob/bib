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
 * @fileoverview Generating CPP for logic blocks.
 * @author daarond@gmail.com (Daaron Dwyer)
 */
'use strict';

goog.provide('Blockly.CPP.logic');

goog.require('Blockly.CPP');


Blockly.CPP['controls_if'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var code = '', branchCode, conditionCode;
  if (Blockly.CPP.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    code += Blockly.CPP.injectId(Blockly.CPP.STATEMENT_PREFIX, block);
  }
  do {
    conditionCode = Blockly.CPP.valueToCode(block, 'IF' + n,
        Blockly.CPP.ORDER_NONE) || 'false';
    branchCode = Blockly.CPP.statementToCode(block, 'DO' + n);
    if (Blockly.CPP.STATEMENT_SUFFIX) {
      branchCode = Blockly.CPP.prefixLines(
          Blockly.CPP.injectId(Blockly.CPP.STATEMENT_SUFFIX, block),
          Blockly.CPP.INDENT) + branchCode;
    }
    code += (n > 0 ? ' else ' : '') +
        'if (' + conditionCode + ') {\n' + branchCode + '}';
    ++n;
  } while (block.getInput('IF' + n));

  if (block.getInput('ELSE') || Blockly.CPP.STATEMENT_SUFFIX) {
    branchCode = Blockly.CPP.statementToCode(block, 'ELSE');
    if (Blockly.CPP.STATEMENT_SUFFIX) {
      branchCode = Blockly.CPP.prefixLines(
          Blockly.CPP.injectId(Blockly.CPP.STATEMENT_SUFFIX, block),
          Blockly.CPP.INDENT) + branchCode;
    }
    code += ' else {\n' + branchCode + '}';
  }
  return code + '\n';
};

Blockly.CPP['controls_ifelse'] = Blockly.CPP['controls_if'];

Blockly.CPP['controls_ifonly'] = Blockly.CPP['controls_if'];

Blockly.CPP['logic_compare'] = function(block) {
  // Comparison operator.
  var OPERATORS = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var order = (operator == '==' || operator == '!=') ?
      Blockly.CPP.ORDER_EQUALITY : Blockly.CPP.ORDER_RELATIONAL;
  var argument0 = Blockly.CPP.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.CPP.valueToCode(block, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.CPP['logic_operation'] = function(block) {
  // Operations 'and', 'or'.
  var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
  var order = (operator == '&&') ? Blockly.CPP.ORDER_LOGICAL_AND :
      Blockly.CPP.ORDER_LOGICAL_OR;
  var argument0 = Blockly.CPP.valueToCode(block, 'A', order);
  var argument1 = Blockly.CPP.valueToCode(block, 'B', order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'false';
    argument1 = 'false';
  } else {
    // Single missing arguments have no effect on the return value.
    var defaultArgument = (operator == '&&') ? 'true' : 'false';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.CPP['logic_negate'] = function(block) {
  // Negation.
  var order = Blockly.CPP.ORDER_LOGICAL_NOT;
  var argument0 = Blockly.CPP.valueToCode(block, 'BOOL', order) ||
      'true';
  var code = '!' + argument0;
  return [code, order];
};

Blockly.CPP['logic_boolean'] = function(block) {
  // Boolean values true and false.
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
  return [code, Blockly.CPP.ORDER_ATOMIC];
};

Blockly.CPP['shadow-no-Boolean'] = function(block) {
    return ['false', Blockly.CPP.ORDER_ATOMIC];
};

Blockly.CPP['logic_null'] = function(block) {
  // Null data type.
  return ['null', Blockly.CPP.ORDER_ATOMIC];
};

Blockly.CPP['logic_ternary'] = function(block) {
  // Ternary operator.
  var value_if = Blockly.CPP.valueToCode(block, 'IF',
      Blockly.CPP.ORDER_CONDITIONAL) || 'false';
  var value_then = Blockly.CPP.valueToCode(block, 'THEN',
      Blockly.CPP.ORDER_CONDITIONAL) || 'null';
  var value_else = Blockly.CPP.valueToCode(block, 'ELSE',
      Blockly.CPP.ORDER_CONDITIONAL) || 'null';
  var code = value_if + ' ? ' + value_then + ' : ' + value_else;
  return [code, Blockly.CPP.ORDER_CONDITIONAL];
};
