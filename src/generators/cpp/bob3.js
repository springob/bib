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

goog.provide('Blockly.CPP.bob3');

goog.require('Blockly.CPP');


Blockly.CPP['log_block'] = function(block) {
    return '/* log_block */';
};



Blockly.CPP['block_base_loop'] = function(block) {
    var code_do = Blockly.CPP.statementToCode(block, 'DO');
    code_do = Blockly.CPP.addLoopTrap(code_do, block);
    var code = 'void loop() {\n'
             + code_do
             + '}\n';
    return code;
};


Blockly.CPP['block_base_setup'] = function(block) {
    var code_do = ''; // Blockly.CPP.statementToCode(block, 'DO');
    //code_do = //Blockly.CPP.addLoopTrap(code_do, block);
    var code = 'void setup() {\n'
             + code_do;
    return code;
};

Blockly.CPP['block_base_run'] = function(block) {
    var code_do = ''; // Blockly.CPP.statementToCode(block, 'DO');
    //code_do = //Blockly.CPP.addLoopTrap(code_do, block);
    var code = 'void run() {\n'
             + code_do;
    return code;
};


Blockly.CPP.fincodes['block_base_setup'] = function(block) {
    return '}\n';
};


Blockly.CPP['block_bob3_touched'] = function(block) {
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
    return [code, Blockly.CPP.ORDER_EQUALITY];
};

Blockly.CPP['block_bob3_seteye'] = function(block) {
    var eye = block.getFieldValue('EYE');
    var color = Blockly.CPP.valueToCode(block, 'COLOR', Blockly.CPP.ORDER_COMMA) || 'OFF';
    var code = 'bob3.setLed('+eye+', '+color+');\n';
    return code;
};

Blockly.CPP['block_bob3_seteye_off'] = function(block) {
    var eye = block.getFieldValue('EYE');
    var code = 'bob3.setLed('+eye+', OFF);\n';
    return code;
};

Blockly.CPP['block_bob3_setwled'] = function(block) {
    var led = block.getFieldValue('LED');
    var color = block.getFieldValue('VAL');
    var code = 'bob3.setLed('+led+', '+color+');\n';
    return code;
};


Blockly.CPP['block_bob3_seteyes'] = function(block) {
    var eye1 = Blockly.CPP.valueToCode(block, 'EYE1', Blockly.CPP.ORDER_COMMA) || 'OFF';
    var eye2 = Blockly.CPP.valueToCode(block, 'EYE2', Blockly.CPP.ORDER_COMMA) || 'OFF';
    var code = 'bob3.setEyes('+eye1+', '+eye2+');\n';
    return code;
};


Blockly.CPP['block_bob3_setwleds'] = function(block) {
    var led3 = Blockly.CPP.valueToCode(block, 'LED3', Blockly.CPP.ORDER_COMMA) || 'OFF';
    var led4 = Blockly.CPP.valueToCode(block, 'LED4', Blockly.CPP.ORDER_COMMA) || 'OFF';
    //var led4 = block.getFieldValue('LED4');
    var code = 'bob3.setWhiteLeds('+led3+', '+led4+');\n';
    return code;
};

Blockly.CPP['block_bob3_setwleds_rgb'] = Blockly.CPP['block_bob3_setwleds'];


Blockly.CPP['bob3_on_off'] = function(block) {
    var VALUE = {
        'TRUE': 'ON',
        'FALSE': 'OFF'
    };
    var code = VALUE[block.getFieldValue('BOOL')];
    return [code, Blockly.CPP.ORDER_ATOMIC];
};


Blockly.CPP['block_bob3_setled'] = function(block) {
    var led = Blockly.CPP.valueToCode(block, 'INDEX', Blockly.CPP.ORDER_COMMA) || '0';
    var color = Blockly.CPP.valueToCode(block, 'COLOR', Blockly.CPP.ORDER_COMMA) || 'OFF';
    var code = 'bob3.setLed('+led+', '+color+');\n';
    return code;
};

Blockly.CPP['block_bob3_getled'] = function(block) {
    var led = Blockly.CPP.valueToCode(block, 'INDEX', Blockly.CPP.ORDER_COMMA) || '0';
    return ['bob3.getLed('+led+')', Blockly.CPP.ORDER_FUNCTION_CALL];
};


Blockly.CPP['block_bob3_delay'] = function(block) {
    var ms = Blockly.CPP.valueToCode(block, 'VAL', Blockly.CPP.ORDER_COMMA) || '0';
    var code = 'delay('+ms+');\n';
    return code;
};

Blockly.CPP['block_bob3_rxMessage'] = function(block) {
    var timeout = Blockly.CPP.valueToCode(block, 'TIMEOUT', Blockly.CPP.ORDER_COMMA) || '0';
    var code = 'bob3.receiveMessage('+timeout+')';
    return [code, Blockly.CPP.ORDER_FUNCTION_CALL];
};

Blockly.CPP['block_bob3_rxMessageBool'] = function(block) {
    var timeout = Blockly.CPP.valueToCode(block, 'TIMEOUT', Blockly.CPP.ORDER_COMMA) || '0';
    var code = 'bob3.receiveMessage('+timeout+')!=-1';
    return [code, Blockly.CPP.ORDER_EQUALITY];
};

Blockly.CPP['block_bob3_rxMessageVoid'] = function(block) {
    var timeout = Blockly.CPP.valueToCode(block, 'TIMEOUT', Blockly.CPP.ORDER_COMMA) || '0';
    var code = 'bob3.receiveMessage('+timeout+');\n';
    return code;
};


Blockly.CPP['block_bob3_lastMessage'] = function(block) {
    var code = 'bob3.lastMessage()';
    return [code, Blockly.CPP.ORDER_FUNCTION_CALL];
};

Blockly.CPP['block_bob3_lastMessageSuccess'] = function(block) {
    var code = 'bob3.lastMessage()!=-1';
    return [code, Blockly.CPP.ORDER_EQUALITY];
};

Blockly.CPP['block_bob3_txMessage'] = function(block) {
    var val = Blockly.CPP.valueToCode(block, 'VAL', Blockly.CPP.ORDER_COMMA) || '0';
    var code = 'bob3.transmitMessage('+val+');\ndelay(10);\n'; //FIXME - needs a better solution!
    return code;
};

Blockly.CPP['block_bob3_remember'] = function(block) {
    var val = Blockly.CPP.valueToCode(block, 'VAL', Blockly.CPP.ORDER_COMMA) || '0';
    var code = 'remember('+val+');\n';
    return code;
};

Blockly.CPP['block_bob3_recall'] = function(block) {
    var code = 'recall()';
    return [code, Blockly.CPP.ORDER_FUNCTION_CALL];
};


Blockly.CPP['block_bob3_getIRSensor'] = function(block) {
    return ['bob3.getIRSensor()', Blockly.CPP.ORDER_FUNCTION_CALL];
};

Blockly.CPP['block_bob3_getIRLight'] = function(block) {
    return ['bob3.getIRLight()', Blockly.CPP.ORDER_FUNCTION_CALL];
};

Blockly.CPP['block_bob3_getIR'] = function(block) {
    let sensor =  block.getFieldValue('SENSOR');
    if (sensor=='IR_REFLECT') {
        return ['bob3.getIRSensor()', Blockly.CPP.ORDER_FUNCTION_CALL];
    } else {
        return ['bob3.getIRLight()', Blockly.CPP.ORDER_FUNCTION_CALL];
    }
};

Blockly.CPP['block_bob3_getarm'] = function(block) {
    var arm = Blockly.CPP.valueToCode(block, 'INDEX', Blockly.CPP.ORDER_COMMA) || '0';
    return ['bob3.getArm('+arm+')', Blockly.CPP.ORDER_FUNCTION_CALL];
};

Blockly.CPP['block_bob3_getID'] = function(block) {
    return ['bob3.getID()', Blockly.CPP.ORDER_FUNCTION_CALL];
};

Blockly.CPP['block_bob3_getMillivolt'] = function(block) {
    return ['bob3.getMillivolt()', Blockly.CPP.ORDER_FUNCTION_CALL];
};

Blockly.CPP['block_bob3_getTemperature'] = function(block) {
    return ['bob3.getTemperature()', Blockly.CPP.ORDER_FUNCTION_CALL];
};



Blockly.CPP['block_debug_white'] = function(block) {
    return '/* block_debug_white */\n';
};

Blockly.CPP['block_bob3_say_text'] = function(block) {
    var text = Blockly.CPP.stringValueToCode(block, 'TEXT', Blockly.CPP.ORDER_FUNCTION_CALL) || '""';
    var code = 'bob3.matrix.scrollString('+text+'.c_str(), 150, true);\n';
    return code;
};


