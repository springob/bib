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

goog.provide('Blockly.JavaScript.bob3');
goog.require('Blockly.JavaScript');

/*
    JS BLOCKS:
        block_bob3sim_makeStep
        block_bob3sim_rotate
        controls_repeat_ext
        controls_if
        block_bob3sim_isFree
        block_bob3sim_detectObject
*/

Blockly.JavaScript['log_block'] = function(block) {
    return '/* log_block */';
};



Blockly.JavaScript['block_base_loop'] = function(block) {
    var code_do = Blockly.JavaScript.statementToCode(block, 'DO');
    code_do = Blockly.JavaScript.addLoopTrap(code_do, block);
    var code = 'void loop() {\n'
             + '  bob3.iteration();\n'
             + code_do
             + '}\n';
    return code;
};


Blockly.JavaScript['block_base_setup'] = function(block) {
    var code_do = ''; // Blockly.JavaScript.statementToCode(block, 'DO');
    //code_do = //Blockly.JavaScript.addLoopTrap(code_do, block);
    var code = 'void setup() {\n'
             + code_do;
    return code;
};

Blockly.JavaScript.fincodes['block_base_setup'] = function(block) {
    return '}\n';
};


Blockly.JavaScript['block_base_run'] = function(block) {
    var code_do = ''; // Blockly.JavaScript.statementToCode(block, 'DO');
    //code_do = //Blockly.JavaScript.addLoopTrap(code_do, block);
    var code = 'void run() {\n'
             + code_do;
    return code;
};

Blockly.JavaScript.fincodes['block_base_run'] = function(block) {
    return '}\n';
};


Blockly.JavaScript['block_bob3_touched'] = function(block) {
    var WHERE = {
        'ANY': '!=0',
        'TOP': '==1',
        'MID': '==2',
        'BOT': '==3',
        'NONE': '==0'
    };
    var code_WHERE = WHERE[block.getFieldValue('WHERE')];
  
    var ARM = {
        'ARM1': '1',
        'ARM2': '2'
    };
    var code_ARM = ARM[block.getFieldValue('ARM')];

    var code = 'bob3.getArm('+code_ARM+')'+code_WHERE;
    return [code, Blockly.JavaScript.ORDER_EQUALITY];
};


Blockly.JavaScript['block_bob3_seteyes'] = function(block) {
    var eye1 = Blockly.JavaScript.valueToCode(block, 'EYE1', Blockly.JavaScript.ORDER_COMMA) || 'OFF';
    var eye2 = Blockly.JavaScript.valueToCode(block, 'EYE2', Blockly.JavaScript.ORDER_COMMA) || 'OFF';
    var code = 'bob3.setEyes('+eye1+', '+eye2+');\n';
    return code;
};


Blockly.JavaScript['block_bob3_setwleds'] = function(block) {
    var led3 = Blockly.JavaScript.valueToCode(block, 'LED3', Blockly.JavaScript.ORDER_COMMA) || 'OFF';
    var led4 = Blockly.JavaScript.valueToCode(block, 'LED4', Blockly.JavaScript.ORDER_COMMA) || 'OFF';
    //var led4 = block.getFieldValue('LED4');
    var code = 'bob3.setWhiteLeds('+led3+', '+led4+');\n';
    return code;
};

Blockly.JavaScript['block_bob3_setwleds_rgb'] = Blockly.JavaScript['block_bob3_setwleds'];


Blockly.JavaScript['bob3_on_off'] = function(block) {
    var VALUE = {
        'TRUE': 'ON',
        'FALSE': 'OFF'
    };
    var code = VALUE[block.getFieldValue('BOOL')];
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['block_bob3_setled'] = function(block) {
    var led = Blockly.JavaScript.valueToCode(block, 'INDEX', Blockly.JavaScript.ORDER_COMMA) || '0';
    var color = Blockly.JavaScript.valueToCode(block, 'COLOUR', Blockly.JavaScript.ORDER_COMMA) || 'OFF';
    var code = 'bob3.setLed('+led+', '+color+');\n';
    return code;
};

Blockly.JavaScript['block_bob3_getled'] = function(block) {
    var led = Blockly.JavaScript.valueToCode(block, 'INDEX', Blockly.JavaScript.ORDER_COMMA) || '0';
    return ['bob3.getLed('+led+')', Blockly.JavaScript.ORDER_FUNCTION_CALL];
};


Blockly.JavaScript['block_bob3_delay'] = function(block) {
    var ms = Blockly.JavaScript.valueToCode(block, 'VAL', Blockly.JavaScript.ORDER_COMMA) || '0';
    var code = 'delay('+ms+');\n';
    return code;
};

Blockly.JavaScript['block_bob3_rxMessage'] = function(block) {
    var timeout = Blockly.JavaScript.valueToCode(block, 'TIMEOUT', Blockly.JavaScript.ORDER_COMMA) || '0';
    var code = 'bob3.receiveMessage('+timeout+')';
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['block_bob3_rxMessageBool'] = function(block) {
    var timeout = Blockly.JavaScript.valueToCode(block, 'TIMEOUT', Blockly.JavaScript.ORDER_COMMA) || '0';
    var code = 'bob3.receiveMessage('+timeout+')!=-1';
    return [code, Blockly.JavaScript.ORDER_EQUALITY];
};

Blockly.JavaScript['block_bob3_rxMessageVoid'] = function(block) {
    var timeout = Blockly.JavaScript.valueToCode(block, 'TIMEOUT', Blockly.JavaScript.ORDER_COMMA) || '0';
    var code = 'bob3.receiveMessage('+timeout+');\n';
    return code;
};


Blockly.JavaScript['block_bob3_lastMessage'] = function(block) {
    var code = 'bob3.lastMessage()';
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['block_bob3_lastMessageSuccess'] = function(block) {
    var code = 'bob3.lastMessage()!=-1';
    return [code, Blockly.JavaScript.ORDER_EQUALITY];
};

Blockly.JavaScript['block_bob3_txMessage'] = function(block) {
    var val = Blockly.JavaScript.valueToCode(block, 'VAL', Blockly.JavaScript.ORDER_COMMA) || '0';
    var code = 'bob3.transmitMessage('+val+');\ndelay(10);\n'; //FIXME
    return code;
};

Blockly.JavaScript['block_bob3_remember'] = function(block) {
    var val = Blockly.JavaScript.valueToCode(block, 'VAL', Blockly.JavaScript.ORDER_COMMA) || '0';
    var code = 'remember('+val+');\n';
    return code;
};

Blockly.JavaScript['block_bob3_recall'] = function(block) {
    var code = 'recall()';
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};


Blockly.JavaScript['block_bob3_getIRSensor'] = function(block) {
    return ['bob3.getIRSensor()', Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['block_bob3_getIRLight'] = function(block) {
    return ['bob3.getIRLight()', Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['block_bob3_getarm'] = function(block) {
    var arm = Blockly.JavaScript.valueToCode(block, 'INDEX', Blockly.JavaScript.ORDER_COMMA) || '0';
    return ['bob3.getArm('+arm+')', Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['block_bob3_getID'] = function(block) {
    return ['bob3.getID()', Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['block_bob3_getMillivolt'] = function(block) {
    return ['bob3.getMillivolt()', Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['block_bob3_getTemperature'] = function(block) {
    return ['bob3.getTemperature()', Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['block_debug_white'] = function(block) {
    return '/* block_debug_white */\n';
};

Blockly.JavaScript['block_bob3_say_text'] = function(block) {
    var text = Blockly.JavaScript.stringValueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_FUNCTION_CALL) || '""';
    var code = 'bob3.matrix.scrollString('+text+'.c_str(), 150, true);\n';
    return code;
};


Blockly.JavaScript['block_bob3sim_makeStep'] = function(block) {
    var code = Blockly.JavaScript.currentBlockTracer(block) 
             + 'await bob3.makeStep();\n';
    return code;
};

Blockly.JavaScript['block_bob3sim_rotate'] = function(block) {
    var DIRECTION = {
        'LEFT': '1',
        'RIGHT': '-1',
    };
    var code_DIRECTION = DIRECTION[block.getFieldValue('DIRECTION')];
    var code = Blockly.JavaScript.currentBlockTracer(block) 
             + 'await bob3.rotate('+code_DIRECTION+');\n';
    return code;
};


Blockly.JavaScript['block_bob3sim_isFree'] = function(block) {
    var DIRECTION = {
        'FRONT': '0',
        'LEFT': '1',
        'RIGHT': '-1',
    };
    var code_DIRECTION = DIRECTION[block.getFieldValue('DIRECTION')];
    return ['await bob3.isFree('+code_DIRECTION+')', Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['block_bob3sim_detectObject'] = function(block) {
    return ['await bob3.detectObject()', Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

