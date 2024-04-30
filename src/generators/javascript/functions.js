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
 * @fileoverview Generating JavaScript for bob3 code
 * @author nils@bob3.org (Nils Springob)
 */


'use strict';

goog.provide('Blockly.JavaScript.functions');

goog.require('Blockly.JavaScript');


Blockly.JavaScript['log_block'] = function(block) {
    return '/* log_block */\n';
};


Blockly.JavaScript['globalvar_definition'] = function(block) {
    Blockly.JavaScript.globalDefinitions_ += Blockly.JavaScript.prefixTrimmedLines(Blockly.JavaScript.statementToCode(block, 'VARIABLES'), '');
    return '';
};

Blockly.JavaScript['variable_definition'] = function(block) {
    var name = block.getFieldValue('NAME');
    name = Blockly.JavaScript.create_symbol_name(name);
    var type = block.getFieldValue('TYPE');
    type = Blockly.JavaScript.get_datatype_(type);
    
    var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_COMMA) || '0';
    var code = type + ' ' + name + ' = ' + value +';\n';
    return code;
};

Blockly.JavaScript['parameter_definition'] = function(block) {
    var name = block.getFieldValue('NAME');
    name = Blockly.JavaScript.create_symbol_name(name);
    var type = block.getFieldValue('TYPE');
    type = Blockly.JavaScript.get_datatype_(type);
    var code = ' ' + type + ' ' + name + ',';
    return code;
};


Blockly.JavaScript['function_definition'] = function(block) {
    var name = block.getFunctionName_();
    name = Blockly.JavaScript.create_symbol_name(name);
    var type = block.getFunctionResultType_();
    type = Blockly.JavaScript.get_datatype_(type);

    var parameters = Blockly.JavaScript.statementToCode(block, 'PARAMETERS').trim();
    parameters = parameters.substr(0, parameters.length - 1);
    var variables = Blockly.JavaScript.statementToCode(block, 'VARIABLES');
    var declaration = 'userprog.' + name + ' = async function(' + parameters + ')';
    Blockly.JavaScript.globalDefinitions_ += declaration + ';\n'

    if (name==='loop') {
        variables = Blockly.JavaScript.prefixTrimmedLines(variables, '  static ');
    }
    
    // optional for loop()
    var branch = Blockly.JavaScript.statementToCode(block, 'DO');
    branch = Blockly.JavaScript.addLoopTrap(branch, block);
    
    var code = declaration + ' {\n' + variables + branch;
    return code;
};

Blockly.JavaScript['variable_set'] = function(block) {
    var variable = Blockly.JavaScript.valueToCode(block, 'VARIABLE', Blockly.JavaScript.ORDER_COMMA);
    var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_COMMA) || '0';
    if (!variable) return null;
    let code = variable + ' = '+value+';\n';
    return code;
};

Blockly.JavaScript['variable_change'] = function(block) {
    var variable = Blockly.JavaScript.valueToCode(block, 'VARIABLE', Blockly.JavaScript.ORDER_COMMA);
    var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_COMMA) || '0';
    if (!variable) return null;
    let code = variable + ' += '+value+';\n';
    return code;
};

Blockly.JavaScript['variable_value'] = function(block) {
    var name = block.getFieldValue('NAME');
    name = Blockly.JavaScript.create_symbol_name(name);
    var code = name;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['function_return'] = function(block) {
    var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_COMMA) || '0';
    var code = 'return '+value+';\n';
    return code;
};

Blockly.JavaScript['function_call'] = function(block) {
    var name = block.getFieldValue('NAME');
    name = Blockly.JavaScript.create_symbol_name(name);

    let parameters='';
    for (let i=0; i<block.scb.parameters; i++) {
        if (i>0) parameters += ', ';
        parameters += Blockly.JavaScript.valueToCode(block, 'INPUT'+i, Blockly.JavaScript.ORDER_COMMA);
    }
    var code = name+'('+parameters+')';
    
    if (block.scb.result=='VOID') {
        return code+';\n';
    } else {
        return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    }
};
