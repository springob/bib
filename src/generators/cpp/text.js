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
 * @fileoverview Generating CPP for text blocks.
 * @author daarond@gmail.com (Daaron Dwyer)
 */
'use strict';

goog.provide('Blockly.CPP.texts');

goog.require('Blockly.CPP');


Blockly.CPP['text'] = function(block) {
  // Text value.
  var code = 'string_t('+Blockly.CPP.quote_(block.getFieldValue('TEXT'))+')';
  return [code, Blockly.CPP.ORDER_ATOMIC];
};

Blockly.CPP['text_multiline'] = function(block) {
  // Text value.
  var code = Blockly.CPP.multiline_quote_(block.getFieldValue('TEXT'));
  var order = code.indexOf('.') != -1 ? Blockly.CPP.ORDER_STRING_CONCAT :
      Blockly.CPP.ORDER_ATOMIC;
  return [code, order];
};

Blockly.CPP['text_join'] = function(block) {
  // Create a string made up of any number of elements of any type.
  if (block.itemCount_ == 0) {
    return ['\'\'', Blockly.CPP.ORDER_ATOMIC];
  } else if (block.itemCount_ == 1) {
    var element = Blockly.CPP.valueToCode(block, 'ADD0',
        Blockly.CPP.ORDER_NONE) || '\'\'';
    var code = element;
    return [code, Blockly.CPP.ORDER_NONE];
  } else if (block.itemCount_ == 2) {
    var element0 = Blockly.CPP.valueToCode(block, 'ADD0',
        Blockly.CPP.ORDER_STRING_CONCAT) || '\'\'';
    var element1 = Blockly.CPP.valueToCode(block, 'ADD1',
        Blockly.CPP.ORDER_STRING_CONCAT) || '\'\'';
    var code = element0 + ' . ' + element1;
    return [code, Blockly.CPP.ORDER_STRING_CONCAT];
  } else {
    var elements = new Array(block.itemCount_);
    for (var i = 0; i < block.itemCount_; i++) {
      elements[i] = Blockly.CPP.valueToCode(block, 'ADD' + i,
          Blockly.CPP.ORDER_NONE) || '\'\'';
    }
    var code = 'implode(\'\', array(' + elements.join(',') + '))';
    return [code, Blockly.CPP.ORDER_FUNCTION_CALL];
  }
};

Blockly.CPP['text_append'] = function(block) {
  // Append to a variable in place.
  var varName = Blockly.CPP.nameDB_.getName(
      block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
  var value = Blockly.CPP.valueToCode(block, 'TEXT',
      Blockly.CPP.ORDER_ASSIGNMENT) || '\'\'';
  return varName + ' .= ' + value + ';\n';
};

Blockly.CPP['text_length'] = function(block) {
  // String or array length.
  var functionName = Blockly.CPP.provideFunction_(
      'length',
      ['function ' + Blockly.CPP.FUNCTION_NAME_PLACEHOLDER_ + '($value) {',
       '  if (is_string($value)) {',
       '    return strlen($value);',
       '  } else {',
       '    return count($value);',
       '  }',
       '}']);
  var text = Blockly.CPP.valueToCode(block, 'VALUE',
      Blockly.CPP.ORDER_NONE) || '\'\'';
  return [functionName + '(' + text + ')', Blockly.CPP.ORDER_FUNCTION_CALL];
};

Blockly.CPP['text_isEmpty'] = function(block) {
  // Is the string null or array empty?
  var text = Blockly.CPP.valueToCode(block, 'VALUE',
      Blockly.CPP.ORDER_NONE) || '\'\'';
  return ['empty(' + text + ')', Blockly.CPP.ORDER_FUNCTION_CALL];
};

Blockly.CPP['text_indexOf'] = function(block) {
  // Search the text for a substring.
  var operator = block.getFieldValue('END') == 'FIRST' ?
      'strpos' : 'strrpos';
  var substring = Blockly.CPP.valueToCode(block, 'FIND',
      Blockly.CPP.ORDER_NONE) || '\'\'';
  var text = Blockly.CPP.valueToCode(block, 'VALUE',
      Blockly.CPP.ORDER_NONE) || '\'\'';
  if (block.workspace.options.oneBasedIndex) {
    var errorIndex = ' 0';
    var indexAdjustment = ' + 1';
  } else {
    var errorIndex = ' -1';
    var indexAdjustment = '';
  }
  var functionName = Blockly.CPP.provideFunction_(
      block.getFieldValue('END') == 'FIRST' ?
          'text_indexOf' : 'text_lastIndexOf',
      ['function ' + Blockly.CPP.FUNCTION_NAME_PLACEHOLDER_ +
          '($text, $search) {',
       '  $pos = ' + operator + '($text, $search);',
       '  return $pos === false ? ' + errorIndex + ' : $pos' +
          indexAdjustment + ';',
       '}']);
  var code = functionName + '(' + text + ', ' + substring + ')';
  return [code, Blockly.CPP.ORDER_FUNCTION_CALL];
};

Blockly.CPP['text_charAt'] = function(block) {
  // Get letter at index.
  var where = block.getFieldValue('WHERE') || 'FROM_START';
  var textOrder = (where == 'RANDOM') ? Blockly.CPP.ORDER_NONE :
      Blockly.CPP.ORDER_NONE;
  var text = Blockly.CPP.valueToCode(block, 'VALUE', textOrder) || '\'\'';
  switch (where) {
    case 'FIRST':
      var code = 'substr(' + text + ', 0, 1)';
      return [code, Blockly.CPP.ORDER_FUNCTION_CALL];
    case 'LAST':
      var code = 'substr(' + text + ', -1)';
      return [code, Blockly.CPP.ORDER_FUNCTION_CALL];
    case 'FROM_START':
      var at = Blockly.CPP.getAdjusted(block, 'AT');
      var code = 'substr(' + text + ', ' + at + ', 1)';
      return [code, Blockly.CPP.ORDER_FUNCTION_CALL];
    case 'FROM_END':
      var at = Blockly.CPP.getAdjusted(block, 'AT', 1, true);
      var code = 'substr(' + text + ', ' + at + ', 1)';
      return [code, Blockly.CPP.ORDER_FUNCTION_CALL];
    case 'RANDOM':
      var functionName = Blockly.CPP.provideFunction_(
          'text_random_letter',
          ['function ' + Blockly.CPP.FUNCTION_NAME_PLACEHOLDER_ + '($text) {',
           '  return $text[rand(0, strlen($text) - 1)];',
           '}']);
      code = functionName + '(' + text + ')';
      return [code, Blockly.CPP.ORDER_FUNCTION_CALL];
  }
  throw Error('Unhandled option (text_charAt).');
};

Blockly.CPP['text_getSubstring'] = function(block) {
  // Get substring.
  var where1 = block.getFieldValue('WHERE1');
  var where2 = block.getFieldValue('WHERE2');
  var text = Blockly.CPP.valueToCode(block, 'STRING',
      Blockly.CPP.ORDER_NONE) || '\'\'';
  if (where1 == 'FIRST' && where2 == 'LAST') {
    var code = text;
    return [code, Blockly.CPP.ORDER_NONE];
  } else {
    var at1 = Blockly.CPP.getAdjusted(block, 'AT1');
    var at2 = Blockly.CPP.getAdjusted(block, 'AT2');
    var functionName = Blockly.CPP.provideFunction_(
        'text_get_substring',
        ['function ' + Blockly.CPP.FUNCTION_NAME_PLACEHOLDER_ +
            '($text, $where1, $at1, $where2, $at2) {',
         '  if ($where1 == \'FROM_END\') {',
         '    $at1 = strlen($text) - 1 - $at1;',
         '  } else if ($where1 == \'FIRST\') {',
         '    $at1 = 0;',
         '  } else if ($where1 != \'FROM_START\') {',
         '    throw new Exception(\'Unhandled option (text_get_substring).\');',
         '  }',
         '  $length = 0;',
         '  if ($where2 == \'FROM_START\') {',
         '    $length = $at2 - $at1 + 1;',
         '  } else if ($where2 == \'FROM_END\') {',
         '    $length = strlen($text) - $at1 - $at2;',
         '  } else if ($where2 == \'LAST\') {',
         '    $length = strlen($text) - $at1;',
         '  } else {',
         '    throw new Exception(\'Unhandled option (text_get_substring).\');',
         '  }',
         '  return substr($text, $at1, $length);',
         '}']);
    var code = functionName + '(' + text + ', \'' +
        where1 + '\', ' + at1 + ', \'' + where2 + '\', ' + at2 + ')';
    return [code, Blockly.CPP.ORDER_FUNCTION_CALL];
  }
};

Blockly.CPP['text_changeCase'] = function(block) {
  // Change capitalization.
  var text = Blockly.CPP.valueToCode(block, 'TEXT',
          Blockly.CPP.ORDER_NONE) || '\'\'';
  if (block.getFieldValue('CASE') == 'UPPERCASE') {
    var code = 'strtoupper(' + text + ')';
  } else if (block.getFieldValue('CASE') == 'LOWERCASE') {
    var code = 'strtolower(' + text + ')';
  } else if (block.getFieldValue('CASE') == 'TITLECASE') {
    var code = 'ucwords(strtolower(' + text + '))';
  }
  return [code, Blockly.CPP.ORDER_FUNCTION_CALL];
};

Blockly.CPP['text_trim'] = function(block) {
  // Trim spaces.
  var OPERATORS = {
    'LEFT': 'ltrim',
    'RIGHT': 'rtrim',
    'BOTH': 'trim'
  };
  var operator = OPERATORS[block.getFieldValue('MODE')];
  var text = Blockly.CPP.valueToCode(block, 'TEXT',
      Blockly.CPP.ORDER_NONE) || '\'\'';
  return [operator + '(' + text + ')', Blockly.CPP.ORDER_FUNCTION_CALL];
};

Blockly.CPP['text_print'] = function(block) {
  // Print statement.
  var msg = Blockly.CPP.valueToCode(block, 'TEXT',
      Blockly.CPP.ORDER_NONE) || '\'\'';
  return 'print(' + msg + ');\n';
};

Blockly.CPP['text_prompt_ext'] = function(block) {
  // Prompt function.
  if (block.getField('TEXT')) {
    // Internal message.
    var msg = Blockly.CPP.quote_(block.getFieldValue('TEXT'));
  } else {
    // External message.
    var msg = Blockly.CPP.valueToCode(block, 'TEXT',
        Blockly.CPP.ORDER_NONE) || '\'\'';
  }
  var code = 'readline(' + msg + ')';
  var toNumber = block.getFieldValue('TYPE') == 'NUMBER';
  if (toNumber) {
    code = 'floatval(' + code + ')';
  }
  return [code, Blockly.CPP.ORDER_FUNCTION_CALL];
};

Blockly.CPP['text_prompt'] = Blockly.CPP['text_prompt_ext'];

Blockly.CPP['text_count'] = function(block) {
  var text = Blockly.CPP.valueToCode(block, 'TEXT',
      Blockly.CPP.ORDER_NONE) || '\'\'';
  var sub = Blockly.CPP.valueToCode(block, 'SUB',
      Blockly.CPP.ORDER_NONE) || '\'\'';
  var code = 'strlen(' + sub + ') === 0'
    + ' ? strlen(' + text + ') + 1'
    + ' : substr_count(' + text + ', ' + sub + ')';
  return [code, Blockly.CPP.ORDER_CONDITIONAL];
};

Blockly.CPP['text_replace'] = function(block) {
  var text = Blockly.CPP.valueToCode(block, 'TEXT',
      Blockly.CPP.ORDER_NONE) || '\'\'';
  var from = Blockly.CPP.valueToCode(block, 'FROM',
      Blockly.CPP.ORDER_NONE) || '\'\'';
  var to = Blockly.CPP.valueToCode(block, 'TO',
      Blockly.CPP.ORDER_NONE) || '\'\'';
  var code = 'str_replace(' + from + ', ' + to + ', ' + text + ')';
  return [code, Blockly.CPP.ORDER_FUNCTION_CALL];
};

Blockly.CPP['text_reverse'] = function(block) {
  var text = Blockly.CPP.valueToCode(block, 'TEXT',
      Blockly.CPP.ORDER_NONE) || '\'\'';
  var code = 'strrev(' + text + ')';
  return [code, Blockly.CPP.ORDER_FUNCTION_CALL];
};
