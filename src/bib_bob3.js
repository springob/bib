/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Modifications: BIB - Bob's Improved Blockly
 * Copyright 2024 Nils Springob
 * Source for base code (Blockly): [https://github.com/google/blockly] (Apache-2.0 License)
 * Source for block-color-values and block-captions (OpenRoberta): [https://github.com/OpenRoberta/] (Apache-2.0 License)
 */

/**
 * @fileoverview BOB3 robot blocks for Blockly.
 * @author nils@bob3.org (Nils Springob)
 */
'use strict';

goog.provide('Blockly.BIB.Bob3');

goog.require('Blockly');
goog.require('Blockly.Blocks');
goog.require('Blockly.FieldDropdown');
goog.require('Blockly.FieldImage');
goog.require('Blockly.FieldMultilineInput');
goog.require('Blockly.FieldTextInput');
goog.require('Blockly.FieldVariable');
goog.require('Blockly.Mutator');
goog.require('Blockly.BIB.Icons');






Blockly.defineBlocksWithJsonArray([  // BEGIN JSON EXTRACT
    // IR Sensor
    {
        "type": "block_bob3_getIRSensor",
        "message0": "%{BKY_BIB_BOB3_GET_REFELCTED}",
        "args0": [
            {
                "type": "input_dummy",
            }
        ],
        "inputsInline": true,
        "output": "Number",
        "style": "rblk_sensor_blocks",
        "tooltip": "",
        "helpUrl": ""
    },
  
    // IR Sensor
    {
        "type": "block_bob3_getIRLight",
        "message0": "%{BKY_BIB_BOB3_GET_DAYLIGHT}",
        "args0": [
            {
                "type": "input_dummy",
            }
        ],
        "inputsInline": true,
        "output": "Number",
        "style": "rblk_sensor_blocks",
        "tooltip": "",
        "helpUrl": ""
    },

    // IR Sensor
    {
        "type": "block_bob3_getTemperature",
        "message0": "%{BKY_BIB_BOB3_GET_TEMPERATURE}",
        "args0": [
            {
                "type": "input_dummy",
            }
        ],
        "inputsInline": true,
        "output": "Number",
        "style": "rblk_sensor_blocks",
        "tooltip": "",
        "helpUrl": ""
    },

    // IR Sensor
    {
        "type": "block_bob3_getMillivolt",
        "message0": "%{BKY_BIB_BOB3_GET_VOLTAGE}",
        "args0": [
            {
                "type": "input_dummy",
            }
        ],
        "inputsInline": true,
        "output": "Number",
        "style": "rblk_sensor_blocks",
        "tooltip": "",
        "helpUrl": ""
    },

    // IR Sensor
    {
        "type": "block_bob3_getID",
        "message0": "%{BKY_BIB_BOB3_GET_ID}",
        "args0": [
            {
                "type": "input_dummy",
            }
        ],
        "inputsInline": true,
        "output": "Number",
        "style": "rblk_sensor_blocks",
        "tooltip": "",
        "helpUrl": ""
    },
    
    // txMessage
    {
        "type": "block_bob3_txMessage",
        "message0": "%{BKY_BIB_BOB3_SEND_MSG}",
        "args0": [
            {
                "type": "input_value",
                "name": "VAL",
                "check": "Number"
            }
        ],
        "inputsInline": true,
        "previousStatement": 'STATEMENT',
        "nextStatement": 'STATEMENT',
        "style": "rblk_message_blocks",
        "tooltip": "",
        "helpUrl": ""
    },
    
    // rxMessage
    {
        "type": "block_bob3_rxMessage",
        "message0": "%{BKY_BIB_BOB3_RECV_MSG}",
        "args0": [
            {
                "type": "input_value",
                "name": "TIMEOUT",
                "check": "Number"
            }
        ],
        "inputsInline": true,
        "output": "Number",
        "style": "rblk_message_blocks",
        "tooltip": "",
        "helpUrl": ""
    },

    // rxMessageBool
    {
        "type": "block_bob3_rxMessageBool",
        "message0": "%{BKY_BIB_BOB3_RECV_MSG}",
        "args0": [
            {
                "type": "input_value",
                "name": "TIMEOUT",
                "check": "Number"
            }
        ],
        "inputsInline": true,
        "output": "Boolean",
        "style": "rblk_message_blocks",
        "tooltip": "",
        "helpUrl": ""
    },

    // rxMessageVoid
    {
        "type": "block_bob3_rxMessageVoid",
        "message0": "%{BKY_BIB_BOB3_RECV_MSG}",
        "args0": [
            {
                "type": "input_value",
                "name": "TIMEOUT",
                "check": "Number"
            }
        ],
        "inputsInline": true,
        "previousStatement": 'STATEMENT',
        "nextStatement": 'STATEMENT',
        "style": "rblk_message_blocks",
        "tooltip": "",
        "helpUrl": ""
    },
    
    // lastMessageSuccess
    {
        "type": "block_bob3_lastMessageSuccess",
        "message0": "%{BKY_BIB_BOB3_RECV_OK}",
        "inputsInline": true,
        "output": "Boolean",
        "style": "rblk_message_blocks",
        "tooltip": "",
        "helpUrl": ""
    },

    // lastMessage
    {
        "type": "block_bob3_lastMessage",
        "message0": "%{BKY_BIB_BOB3_RECV_VAL}",
        "inputsInline": true,
        "output": "Number",
        "style": "rblk_message_blocks",
        "tooltip": "",
        "helpUrl": ""
    },
    
    // remember
    {
        "type": "block_bob3_remember",
        "message0": "%{BKY_BIB_BOB3_REMEMBER}",
        "args0": [
            {
                "type": "input_value",
                "name": "VAL",
                "check": "Number"
            }
        ],
        "inputsInline": true,
        "previousStatement": 'STATEMENT',
        "nextStatement": 'STATEMENT',
        "style": "rblk_action_blocks",
        "tooltip": "",
        "helpUrl": ""
    },

    // recall
    {
        "type": "block_bob3_recall",
        "message0": "%{BKY_BIB_BOB3_RECALL}",
        "inputsInline": true,
        "output": "Number",
        "style": "rblk_action_blocks",
        "tooltip": "",
        "helpUrl": ""
    },
    
    {
    "type": "bob3_on_off",
    "message0": "%1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "BOOL",
        "options": [
          ["%{BKY_BIB_BOB3_LED_ON}", "TRUE"],
          ["%{BKY_BIB_BOB3_LED_OFF}", "FALSE"]
        ]
      }
    ],
    "output": "Boolean",
    "style": "rblk_action_blocks",
    "tooltip": "%{BKY_LOGIC_BOOLEAN_TOOLTIP}",
    "helpUrl": "%{BKY_LOGIC_BOOLEAN_HELPURL}"
  },

]);



Blockly.Blocks['block_bob3_seteye'] = {
    init: function() {
        this.jsonInit({
            "message0": "%{BKY_BIB_BOB3_SWITCH_EYE_ON}",
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "EYE",
                    "options": [
                        ["%{BKY_BIB_BOB3_RIGHT}", "EYE_1"],
                        ["%{BKY_BIB_BOB3_LEFT}", "EYE_2"]
                    ]
                }, {
                    "type": "input_value",
                    "name": "COLOR",
                    "check": "Color"
                }
            ],
            "inputsInline": false,
            "previousStatement": 'STATEMENT',
            "nextStatement": 'STATEMENT',
            "style": "rblk_action_blocks",
            "tooltip": "",
            "helpUrl": ""
        });
    },
    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help', 'comment', 'fold', 'deactivate']);
    },

};

Blockly.Blocks['block_bob3_seteye_off'] = {
    init: function() {
        this.jsonInit({
            "message0": "%{BKY_BIB_BOB3_SWITCH_EYE_OFF}",
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "EYE",
                    "options": [
                        ["%{BKY_BIB_BOB3_RIGHT}", "EYE_1"],
                        ["%{BKY_BIB_BOB3_LEFT}", "EYE_2"]
                    ]
                }
            ],
            "inputsInline": false,
            "previousStatement": 'STATEMENT',
            "nextStatement": 'STATEMENT',
            "style": "rblk_action_blocks",
            "tooltip": "",
            "helpUrl": ""
        });
    },
    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help', 'comment', 'fold', 'deactivate']);
    },

};


Blockly.Blocks['block_bob3_setwled'] = {
    init: function() {
        this.jsonInit({
            "message0": "%{BKY_BIB_BOB3_SWITCH_BODYLED}",
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "LED",
                    "options": [
                        ["%{BKY_BIB_BOB3_RIGHT}", "LED_3"],
                        ["%{BKY_BIB_BOB3_LEFT}", "LED_4"]
                    ]
                },{
                    "type": "field_dropdown",
                    "name": "VAL",
                    "options": [
                        ["%{BKY_BIB_BOB3_ON}", "ON"],
                        ["%{BKY_BIB_BOB3_OFF}", "OFF"]
                    ]
                }

            ],
            "inputsInline": false,
            "previousStatement": 'STATEMENT',
            "nextStatement": 'STATEMENT',
            "style": "rblk_action_blocks",
            "tooltip": "",
            "helpUrl": ""
        });
    },
    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help', 'comment', 'fold', 'deactivate']);
    },

};


Blockly.Blocks['block_bob3_setwleds'] = {
    init: function() {
        this.jsonInit({
            "message0": "%{BKY_BIB_BOB3_SWITCH_BODYLEDS}",
            "args0": [
                {
                    "type": "input_value",
                    "name": "LED3",
                    "check": "Boolean"
                }, {
                    "type": "input_value",
                    "name": "LED4",
                    "check": "Boolean"
                }
            ],
            "inputsInline": true,
            "previousStatement": 'STATEMENT',
            "nextStatement": 'STATEMENT',
            "style": "rblk_action_blocks",
            "tooltip": "",
            "helpUrl": ""
        });
    },
    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help', 'comment', 'fold', 'deactivate']);
    },
};


Blockly.Blocks['block_bob3_setwleds_rgb'] = {
    init: function() {
        this.jsonInit({
            "message0": "%{BKY_BIB_BOB3_SWITCH_BODYLEDS}",
            "args0": [
                {
                    "type": "input_value",
                    "name": "LED3",
                    "check": "Color"
                }, {
                    "type": "input_value",
                    "name": "LED4",
                    "check": "Color"
                }
            ],
            "inputsInline": true,
            "previousStatement": 'STATEMENT',
            "nextStatement": 'STATEMENT',
            "style": "rblk_action_blocks",
            "tooltip": "",
            "helpUrl": ""
        });
    },
    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help', 'comment', 'fold', 'deactivate']);
    },
};


Blockly.Blocks['block_bob3_delay'] = {
    init: function() {
        this.jsonInit({
            "message0": "%{BKY_BIB_BOB3_WAIT_MS}",
            "args0": [
                {
                    "type": "input_value",
                    "name": "VAL",
                    "check": "Number"
                }
            ],
            "inputsInline": false,
            "previousStatement": 'STATEMENT',
            "nextStatement": 'STATEMENT',
            "style": "rblk_control_blocks",
            "tooltip": "",
            "helpUrl": ""
        });
    },
    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help', 'comment', 'fold', 'deactivate']);
    },
};



Blockly.Blocks['block_bob3_setled'] = {
    init: function() {
        this.jsonInit({
            "message0": "%{BKY_BIB_BOB3_SET_LED}",
            "args0": [
                {
                    "type": "input_value",
                    "name": "INDEX",
                    "check": "Number"
                }, {
                    "type": "input_value",
                    "name": "COLOR",
                    "check": "Color"
                }
            ],
            "inputsInline": true,
            "previousStatement": 'STATEMENT',
            "nextStatement": 'STATEMENT',
            "style": "rblk_action_blocks",
            "tooltip": "",
            "helpUrl": ""
        });
    },
    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help', 'comment', 'fold', 'deactivate']);
    },
};


Blockly.Blocks['block_bob3_getled'] = {
    init: function() {
        this.jsonInit({
            "message0": "%{BKY_BIB_BOB3_GET_LED_COLOR}",
            "args0": [
                {
                    "type": "field_image",
                    "src": Blockly.BIB.Icons.ICON_BROOM,
                    "width": 18,
                    "height": 18,
                }, {
                    "type": "input_value",
                    "name": "INDEX",
                    "check": "Number"
                }
            ],
            "inputsInline": true,
            "output": "Color",
            "style": "rblk_action_blocks",
            "tooltip": "",
            "helpUrl": ""
        });
    },
    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help', 'comment', 'fold', 'deactivate']);
    },

};


Blockly.Blocks['block_bob3_getarm'] = {
    init: function() {
        this.jsonInit({
            "message0": "%{BKY_BIB_BOB3_GET_ARM}",
            "args0": [
                {
                    "type": "input_value",
                    "name": "INDEX",
                    "check": "Number"
                }
            ],
            "inputsInline": true,
            "output": "Number",
            "style": "rblk_sensor_blocks",
            "tooltip": "",
            "helpUrl": ""
        });
    },
    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help', 'comment', 'fold', 'deactivate']);
    },

};


Blockly.Blocks['block_bob3_getIR'] = {
    init: function() {
        this.jsonInit({
            "message0": "%{BKY_BIB_BOB3_GET_IR_SENSOR}",
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "SENSOR",
                    "options": [
                        ["%{BKY_BIB_BOB3_REFELCTED}", "IR_REFLECT"],
                        ["%{BKY_BIB_BOB3_DAYLIGHT}", "IR_LIGHT"]
                    ]
                }
            ],
            "inputsInline": true,
            "output": "Number",
            "style": "rblk_sensor_blocks",
            "tooltip": "",
            "helpUrl": ""
        });
    },
    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help', 'comment', 'fold', 'deactivate']);
    },

};


Blockly.Blocks['block_bob3_say_text'] = {
    init: function() {
        this.jsonInit({
            "message0": "%{BKY_BIB_BOB3_BLK_SAY}",
            "args0": [
                {
                    "type": "input_value",
                    "name": "TEXT",
                    "check": ["String", "Number", "Image", "Boolean", "Color"]
                }
            ],
            "inputsInline": true,
            "previousStatement": 'STATEMENT',
            "nextStatement": 'STATEMENT',
            "style": "rblk_text_blocks",
            "tooltip": "",
            "helpUrl": ""
        });
    },
    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help', 'comment', 'fold', 'deactivate']);
    },
};


Blockly.Blocks['block_bob3_display_Image'] = {
    init: function() {
        this.jsonInit({
            "message0": "%{BKY_BIB_BOB3_BLK_SHOW}",
            "args0": [
                {
                    "type": "input_value",
                    "name": "IMAGE",
                    "check": "Image"
                }
            ],
            "inputsInline": true,
            "previousStatement": 'STATEMENT',
            "nextStatement": 'STATEMENT',
            "style": "rblk_text_blocks",
            "tooltip": "",
            "helpUrl": ""
        });
    },
    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help', 'comment', 'fold', 'deactivate']);
    },
};


Blockly.Blocks['block_bob3_touched'] = {
    init: function() {
        this.jsonInit({
            
            "message0": "%{BKY_BIB_BOB3_ARM_TOUCHED}",
            "args0": [
                {
                "type": "field_dropdown",
                "name": "ARM",
                "options": [
                    ["%{BKY_BIB_BOB3_RIGHT}", "ARM1"],
                    ["%{BKY_BIB_BOB3_LEFT}", "ARM2"]
                ]
                },
                {
                "type": "field_dropdown",
                "name": "WHERE",
                "options": [
                    ["%{BKY_BIB_BOB3_ANYWHERE}irgendwo", "ANY"],
                    ["%{BKY_BIB_BOB3_TOP}", "TOP"],
                    ["%{BKY_BIB_BOB3_MID}", "MID"],
                    ["%{BKY_BIB_BOB3_BOT}", "BOT"],
                    ["%{BKY_BIB_BOB3_NOT}", "NONE"]
                ]
                }
            ],
            "inputsInline": true,
            "output": "Boolean",
            "style": "rblk_sensor_blocks",
            "tooltip": "",
            "helpUrl": ""
        });
    },
    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help', 'comment', 'fold', 'deactivate']);
    },

};



/* SIMULATOR BLOCKWORLD BLOCKS */


Blockly.Blocks['block_bob3sim_makeStep'] = {
    init: function() {
        this.jsonInit({
            "message0": "%{BKY_BIB_BOB3_SIM_STEP}",
            "inputsInline": true,
            "previousStatement": 'STATEMENT',
            "nextStatement": 'STATEMENT',
            "style": "rblk_action_blocks",
            "tooltip": "",
            "helpUrl": ""
        });
    },
    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help', 'comment', 'fold', 'deactivate']);
    },
};

Blockly.Blocks['block_bob3sim_rotate'] = {
    init: function() {
        this.jsonInit({
            "message0": "%{BKY_BIB_BOB3_SIM_TURN}",
            "args0": [
                {
                "type": "field_dropdown",
                "name": "DIRECTION",
                "options": [
                    ["%{BKY_BIB_BOB3_SIM_TURN_LEFT}", "LEFT"],
                    ["%{BKY_BIB_BOB3_SIM_TURN_RIGHT}", "RIGHT"]
                ]
                }
            ],
            "inputsInline": true,
            "previousStatement": 'STATEMENT',
            "nextStatement": 'STATEMENT',
            "style": "rblk_action_blocks",
            "tooltip": "",
            "helpUrl": ""
        });
    },
    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help', 'comment', 'fold', 'deactivate']);
    },
};

Blockly.Blocks['block_bob3sim_isFree'] = {
    init: function() {
        this.jsonInit({
            
            "message0": "%{BKY_BIB_BOB3_SIM_IS_FREE}",
            "args0": [
                {
                "type": "field_dropdown",
                "name": "DIRECTION",
                "options": [
                    ["%{BKY_BIB_BOB3_SIM_FREE_FRONT}", "FRONT"],
                    ["%{BKY_BIB_BOB3_SIM_FREE_LEFT}", "LEFT"],
                    ["%{BKY_BIB_BOB3_SIM_FREE_RIGHT}", "RIGHT"]
                ]
                }
            ],
            "inputsInline": true,
            "output": "Boolean",
            "style": "rblk_sensor_blocks",
            "tooltip": "",
            "helpUrl": ""
        });
    },
    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help', 'comment', 'fold', 'deactivate']);
    },
};


Blockly.Blocks['block_bob3sim_detectObject'] = {
    init: function() {
        this.jsonInit({
            "message0": "%{BKY_BIB_BOB3_SIM_SCAN}",
            "inputsInline": true,
            "output": "Number",
            "style": "rblk_sensor_blocks",
            "tooltip": "",
            "helpUrl": ""
        });
    },
    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help', 'comment', 'fold', 'deactivate']);
    },
};
