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
 * @fileoverview Generating CPP for loop blocks.
 * @author daarond@gmail.com (Daaron Dwyer)
 */
'use strict';

goog.provide('Blockly.CPP.loops');

goog.require('Blockly.CPP');


Blockly.CPP['controls_repeat_ext'] = function(block) {
  // Repeat n times.
  if (block.getField('TIMES')) {
    // Internal number.
    var repeats = String(Number(block.getFieldValue('TIMES')));
  } else {
    // External number.
    var repeats = Blockly.CPP.valueToCode(block, 'TIMES',
        Blockly.CPP.ORDER_ASSIGNMENT) || '0';
  }
  var branch = Blockly.CPP.statementToCode(block, 'DO');
  branch = Blockly.CPP.addLoopTrap(branch, block);
  var code = '';
  code += 'for (int _cnt=0, _end='+repeats+'; _cnt<_end; _cnt++) {\n' +
      branch + '}\n';
  return code;
};

Blockly.CPP['controls_repeat'] = Blockly.CPP['controls_repeat_ext'];


Blockly.CPP['controls_repeat_until'] = function(block) {
  // Do while/until loop.
  var argument0 = Blockly.CPP.valueToCode(block, 'COND', Blockly.CPP.ORDER_LOGICAL_NOT) || 'false';
  var branch = Blockly.CPP.statementToCode(block, 'DO');
  branch = Blockly.CPP.addLoopTrap(branch, block);
  argument0 = '!' + argument0;
  return 'while (' + argument0 + ') {\n' + branch + '}\n';
};


Blockly.CPP['controls_wait_until'] = function(block) {
  // Do while/until loop.
  var argument0 = Blockly.CPP.valueToCode(block, 'COND', Blockly.CPP.ORDER_LOGICAL_NOT) || 'false';
  argument0 = '!' + argument0;
  return 'while (' + argument0 + ') { _delay_us(100); }\n';
};


Blockly.CPP['controls_repeat_forever'] = function(block) {
  // Do while/until loop.
  var branch = Blockly.CPP.statementToCode(block, 'DO');
  branch = Blockly.CPP.addLoopTrap(branch, block);
  return 'while (true) {\n' + branch + '}\n';
};



Blockly.CPP['controls_whileUntil'] = function(block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.CPP.valueToCode(block, 'BOOL',
      until ? Blockly.CPP.ORDER_LOGICAL_NOT :
      Blockly.CPP.ORDER_NONE) || 'false';
  var branch = Blockly.CPP.statementToCode(block, 'DO');
  branch = Blockly.CPP.addLoopTrap(branch, block);
  if (until) {
    argument0 = '!' + argument0;
  }
  return 'while (' + argument0 + ') {\n' + branch + '}\n';
};

Blockly.CPP['controls_for'] = function(block) {
  // For loop.
  var variable0 = Blockly.CPP.nameDB_.getName(
      block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
  var argument0 = Blockly.CPP.valueToCode(block, 'FROM',
      Blockly.CPP.ORDER_ASSIGNMENT) || '0';
  var argument1 = Blockly.CPP.valueToCode(block, 'TO',
      Blockly.CPP.ORDER_ASSIGNMENT) || '0';
  var increment = Blockly.CPP.valueToCode(block, 'BY',
      Blockly.CPP.ORDER_ASSIGNMENT) || '1';
  var branch = Blockly.CPP.statementToCode(block, 'DO');
  branch = Blockly.CPP.addLoopTrap(branch, block);
  var code;
  if (Blockly.isNumber(argument0) && Blockly.isNumber(argument1) &&
      Blockly.isNumber(increment)) {
    // All arguments are simple numbers.
    var up = Number(argument0) <= Number(argument1);
    code = 'for (' + variable0 + ' = ' + argument0 + '; ' +
        variable0 + (up ? ' <= ' : ' >= ') + argument1 + '; ' +
        variable0;
    var step = Math.abs(Number(increment));
    if (step == 1) {
      code += up ? '++' : '--';
    } else {
      code += (up ? ' += ' : ' -= ') + step;
    }
    code += ') {\n' + branch + '}\n';
  } else {
    code = '';
    // Cache non-trivial values to variables to prevent repeated look-ups.
    var startVar = argument0;
    if (!argument0.match(/^\w+$/) && !Blockly.isNumber(argument0)) {
      startVar = Blockly.CPP.nameDB_.getDistinctName(
          variable0 + '_start', Blockly.VARIABLE_CATEGORY_NAME);
      code += startVar + ' = ' + argument0 + ';\n';
    }
    var endVar = argument1;
    if (!argument1.match(/^\w+$/) && !Blockly.isNumber(argument1)) {
      endVar = Blockly.CPP.nameDB_.getDistinctName(
          variable0 + '_end', Blockly.VARIABLE_CATEGORY_NAME);
      code += endVar + ' = ' + argument1 + ';\n';
    }
    // Determine loop direction at start, in case one of the bounds
    // changes during loop execution.
    var incVar = Blockly.CPP.nameDB_.getDistinctName(
        variable0 + '_inc', Blockly.VARIABLE_CATEGORY_NAME);
    code += incVar + ' = ';
    if (Blockly.isNumber(increment)) {
      code += Math.abs(increment) + ';\n';
    } else {
      code += 'abs(' + increment + ');\n';
    }
    code += 'if (' + startVar + ' > ' + endVar + ') {\n';
    code += Blockly.CPP.INDENT + incVar + ' = -' + incVar + ';\n';
    code += '}\n';
    code += 'for (' + variable0 + ' = ' + startVar + '; ' +
        incVar + ' >= 0 ? ' +
        variable0 + ' <= ' + endVar + ' : ' +
        variable0 + ' >= ' + endVar + '; ' +
        variable0 + ' += ' + incVar + ') {\n' +
        branch + '}\n';
  }
  return code;
};

Blockly.CPP['controls_forEach'] = function(block) {
  // For each loop.
  var variable0 = Blockly.CPP.nameDB_.getName(
      block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
  var argument0 = Blockly.CPP.valueToCode(block, 'LIST',
      Blockly.CPP.ORDER_ASSIGNMENT) || '[]';
  var branch = Blockly.CPP.statementToCode(block, 'DO');
  branch = Blockly.CPP.addLoopTrap(branch, block);
  var code = '';
  code += 'foreach (' + argument0 + ' as ' + variable0 +
      ') {\n' + branch + '}\n';
  return code;
};

Blockly.CPP['controls_flow_statements'] = function(block) {
  // Flow statements: continue, break.
  var xfix = '';
  if (Blockly.CPP.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    xfix += Blockly.CPP.injectId(Blockly.CPP.STATEMENT_PREFIX, block);
  }
  if (Blockly.CPP.STATEMENT_SUFFIX) {
    // Inject any statement suffix here since the regular one at the end
    // will not get executed if the break/continue is triggered.
    xfix += Blockly.CPP.injectId(Blockly.CPP.STATEMENT_SUFFIX, block);
  }
  if (Blockly.CPP.STATEMENT_PREFIX) {
    var loop = Blockly.Constants.Loops
        .CONTROL_FLOW_IN_LOOP_CHECK_MIXIN.getSurroundLoop(block);
    if (loop && !loop.suppressPrefixSuffix) {
      // Inject loop's statement prefix here since the regular one at the end
      // of the loop will not get executed if 'continue' is triggered.
      // In the case of 'break', a prefix is needed due to the loop's suffix.
      xfix += Blockly.CPP.injectId(Blockly.CPP.STATEMENT_PREFIX, loop);
    }
  }
  switch (block.getFieldValue('FLOW')) {
    case 'BREAK':
      return xfix + 'break;\n';
    case 'CONTINUE':
      return xfix + 'continue;\n';
  }
  throw Error('Unknown flow statement.');
};

Blockly.CPP['controls_loop_break'] = function(block) {
    return 'break;\n';
}


