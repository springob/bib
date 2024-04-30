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
 * @fileoverview Generating CPP for procedure blocks.
 * @author daarond@gmail.com (Daaron Dwyer)
 */
'use strict';

goog.provide('Blockly.CPP.procedures');

goog.require('Blockly.CPP');


Blockly.CPP['procedures_defreturn'] = function(block) {
  // Define a procedure with a return value.
  // First, add a 'global' statement for every variable that is not shadowed by
  // a local parameter.
  var globals = [];
  var workspace = block.workspace;
  var variables = Blockly.Variables.allUsedVarModels(workspace) || [];
  for (var i = 0, variable; variable = variables[i]; i++) {
    var varName = variable.name;
    if (block.getVars().indexOf(varName) == -1) {
      globals.push(Blockly.CPP.nameDB_.getName(varName,
          Blockly.VARIABLE_CATEGORY_NAME));
    }
  }
  // Add developer variables.
  var devVarList = Blockly.Variables.allDeveloperVariables(workspace);
  for (var i = 0; i < devVarList.length; i++) {
    globals.push(Blockly.CPP.nameDB_.getName(devVarList[i],
        Blockly.Names.DEVELOPER_VARIABLE_TYPE));
  }
  globals = globals.length ?
      Blockly.CPP.INDENT + 'global ' + globals.join(', ') + ';\n' : '';

  var funcName = Blockly.CPP.nameDB_.getName(
      block.getFieldValue('NAME'), Blockly.PROCEDURE_CATEGORY_NAME);
  var xfix1 = '';
  if (Blockly.CPP.STATEMENT_PREFIX) {
    xfix1 += Blockly.CPP.injectId(Blockly.CPP.STATEMENT_PREFIX, block);
  }
  if (Blockly.CPP.STATEMENT_SUFFIX) {
    xfix1 += Blockly.CPP.injectId(Blockly.CPP.STATEMENT_SUFFIX, block);
  }
  if (xfix1) {
    xfix1 = Blockly.CPP.prefixLines(xfix1, Blockly.CPP.INDENT);
  }
  var loopTrap = '';
  if (Blockly.CPP.INFINITE_LOOP_TRAP) {
    loopTrap = Blockly.CPP.prefixLines(
        Blockly.CPP.injectId(Blockly.CPP.INFINITE_LOOP_TRAP, block),
        Blockly.CPP.INDENT);
  }
  var branch = Blockly.CPP.statementToCode(block, 'STACK');
  var returnValue = Blockly.CPP.valueToCode(block, 'RETURN',
      Blockly.CPP.ORDER_NONE) || '';
  var xfix2 = '';
  if (branch && returnValue) {
    // After executing the function body, revisit this block for the return.
    xfix2 = xfix1;
  }
  if (returnValue) {
    returnValue = Blockly.CPP.INDENT + 'return ' + returnValue + ';\n';
  }
  var args = [];
  var variables = block.getVars();
  for (var i = 0; i < variables.length; i++) {
    args[i] = Blockly.CPP.nameDB_.getName(variables[i],
        Blockly.VARIABLE_CATEGORY_NAME);
  }
  var code = 'function ' + funcName + '(' + args.join(', ') + ') {\n' +
      globals + xfix1 + loopTrap + branch + xfix2 + returnValue + '}';
  code = Blockly.CPP.scrub_(block, code);
  // Add % so as not to collide with helper functions in definitions list.
  Blockly.CPP.definitions_['%' + funcName] = code;
  return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Blockly.CPP['procedures_defnoreturn'] =
    Blockly.CPP['procedures_defreturn'];

Blockly.CPP['procedures_callreturn'] = function(block) {
  // Call a procedure with a return value.
  var funcName = Blockly.CPP.nameDB_.getName(
      block.getFieldValue('NAME'), Blockly.PROCEDURE_CATEGORY_NAME);
  var args = [];
  var variables = block.getVars();
  for (var i = 0; i < variables.length; i++) {
    args[i] = Blockly.CPP.valueToCode(block, 'ARG' + i,
        Blockly.CPP.ORDER_NONE) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.CPP.ORDER_FUNCTION_CALL];
};

Blockly.CPP['procedures_callnoreturn'] = function(block) {
  // Call a procedure with no return value.
  // Generated code is for a function call as a statement is the same as a
  // function call as a value, with the addition of line ending.
  var tuple = Blockly.CPP['procedures_callreturn'](block);
  return tuple[0] + ';\n';
};

Blockly.CPP['procedures_ifreturn'] = function(block) {
  // Conditionally return value from a procedure.
  var condition = Blockly.CPP.valueToCode(block, 'CONDITION',
      Blockly.CPP.ORDER_NONE) || 'false';
  var code = 'if (' + condition + ') {\n';
  if (Blockly.CPP.STATEMENT_SUFFIX) {
    // Inject any statement suffix here since the regular one at the end
    // will not get executed if the return is triggered.
    code += Blockly.CPP.prefixLines(
        Blockly.CPP.injectId(Blockly.CPP.STATEMENT_SUFFIX, block),
        Blockly.CPP.INDENT);
  }
  if (block.hasReturnValue_) {
    var value = Blockly.CPP.valueToCode(block, 'VALUE',
        Blockly.CPP.ORDER_NONE) || 'null';
    code += Blockly.CPP.INDENT + 'return ' + value + ';\n';
  } else {
    code += Blockly.CPP.INDENT + 'return;\n';
  }
  code += '}\n';
  return code;
};
