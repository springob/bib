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
 * @fileoverview Generating CPP for functions and variables
 * @author nils@bob3.org (Nils Springob)
 */


'use strict';

goog.provide('Blockly.CPP.functions');

goog.require('Blockly.CPP');


Blockly.CPP['log_block'] = function(block) {
    return '/* log_block */\n';
};


Blockly.CPP['main_variables'] = function(block) {
    Blockly.CPP.globalVariables_ += Blockly.CPP.prefixTrimmedLines(Blockly.CPP.statementToCode(block, 'VARIABLES'), '');
    console.log('<<main_variables>>', Blockly.CPP.globalVariables_);
    return '';
};

Blockly.CPP['main_loop'] = function(block) {
    // optional for loop()
    console.log('<<main_loop>>', 'START');
    let branch = Blockly.CPP.statementToCode(block, 'DO');
    console.log('<<main_loop>>', branch);
    
    let declaration = 'void loop()';
    
    branch = Blockly.CPP.addLoopTrap(branch, block);
    let code = declaration + ' {\n /**/ ' + branch + ' /**/ }\n';
    
    console.log('<<main_loop>>', code);
    return code;
};

Blockly.CPP['globalvar_definition'] = function(block) {
    Blockly.CPP.globalVariables_ += Blockly.CPP.prefixTrimmedLines(Blockly.CPP.statementToCode(block, 'VARIABLES'), '');
    return '';
};

Blockly.CPP['variable_definition'] = function(block) {
    let name = block.getFieldValue('NAME');
    name = Blockly.CPP.create_symbol_name(name);
    let type = block.getFieldValue('TYPE');
    type = Blockly.CPP.get_datatype_(type);
    let isParameter = block.getFieldValue('VARPAR')=='PARAMETER';
    let value = Blockly.CPP.valueToCode(block, 'INITIALIZE', Blockly.CPP.ORDER_COMMA) || '0';

    if (isParameter) {
        return type + ' ' + name;
    } else {
        return type + ' ' + name + ' = ' + value +';\n';
    }
};

Blockly.CPP['function_definition'] = function(block) {
    let name = block.getFunctionName_();
    name = Blockly.CPP.create_symbol_name(name);
    let type = block.getFunctionResultType_();
    type = Blockly.CPP.get_datatype_(type);
    
    let variablePrefix = (name==='loop')?'static ':'';

    let parameters = [];
    let variables = [];
    for (let variable=block.getInputTargetBlock('VARIABLES'); variable!=null; variable=variable.getNextBlock()) {
        let code = Blockly.CPP.blockToCode(variable, true);
        if (variable.getFieldValue('VARPAR')=='PARAMETER') {
            parameters.push(code.trim());
        } else {
            variables.push('  '+variablePrefix+code);
        }
    }
    parameters = parameters.join(', ');
    variables = variables.join('');
    
    let declaration = type + ' ' + name + '(' + parameters + ')';
    Blockly.CPP.globalFunctions_ += declaration + ';\n'

    // optional for loop()
    let branch = Blockly.CPP.statementToCode(block, 'DO');
    branch = Blockly.CPP.addLoopTrap(branch, block);
    
    let code = declaration + ' {\n' + variables + branch;
    
    if (block.getInput('RESULT')) {
        let retval = Blockly.CPP.valueToCode(block, 'RESULT', Blockly.CPP.ORDER_COMMA) || '0';
        code += 'return ' + retval + ';\n';
    }
    
    return code;
};

Blockly.CPP['variable_start_info'] = function(block) {
    return null;
}

Blockly.CPP['variable_set_direct'] = function(block) {
    let name = block.getFieldValue('NAME');
    let value = Blockly.CPP.valueToCode(block, 'VALUE', Blockly.CPP.ORDER_COMMA) || '0';
    let code = name + ' = '+value+';\n';
    return code;
};

Blockly.CPP['variable_set'] = function(block) {
    let variable = Blockly.CPP.valueToCode(block, 'VARIABLE', Blockly.CPP.ORDER_COMMA);
    let value = Blockly.CPP.valueToCode(block, 'VALUE', Blockly.CPP.ORDER_COMMA) || '0';
    if (!variable) return null;
    let code = variable + ' = '+value+';\n';
    return code;
};

Blockly.CPP['variable_change'] = function(block) {
    let variable = Blockly.CPP.valueToCode(block, 'VARIABLE', Blockly.CPP.ORDER_COMMA);
    let value = Blockly.CPP.valueToCode(block, 'VALUE', Blockly.CPP.ORDER_COMMA) || '0';
    if (!variable) return null;
    let code = variable + ' += '+value+';\n';
    return code;
};

Blockly.CPP['variable_value'] = function(block) {
    let name = block.getFieldValue('NAME');
    name = Blockly.CPP.create_symbol_name(name);
    let code = name;
    return [code, Blockly.CPP.ORDER_ATOMIC];
};

Blockly.CPP['function_return'] = function(block) {
    if (block.mutationData.valueType=='VOID') return 'return;\n';
    let value = Blockly.CPP.valueToCode(block, 'VALUE', Blockly.CPP.ORDER_COMMA) || '0';
    let code = 'return '+value+';\n';
    return code;
};

Blockly.CPP['function_call'] = function(block) {
    let name = block.getFieldValue('NAME');
    name = Blockly.CPP.create_symbol_name(name);

    let parameters='';
    for (let i=0; i<block.scb.parameters; i++) {
        if (i>0) parameters += ', ';
        parameters += Blockly.CPP.valueToCode(block, 'INPUT'+i, Blockly.CPP.ORDER_COMMA);
    }
    let code = name+'('+parameters+')';
    
    if (block.scb.result=='VOID') {
        return code+';\n';
    } else {
        return [code, Blockly.CPP.ORDER_FUNCTION_CALL];
    }
};
