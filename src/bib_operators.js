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
 * @fileoverview Operator blocks for Blockly.
 * @author nils@bob3.org (Nils Springob)
 */
'use strict';

goog.provide('Blockly.BIB.Operators');

goog.require('Blockly');
goog.require('Blockly.Blocks');
goog.require('Blockly.FieldDropdown');
goog.require('Blockly.FieldImage');
goog.require('Blockly.FieldMultilineInput');
goog.require('Blockly.FieldTextInput');
goog.require('Blockly.FieldVariable');
goog.require('Blockly.Mutator');
goog.require('Blockly.BIB.Icons');




// *********************************
// *          PARAMETER DEFINITION
// *********************************


Blockly.Blocks['operator_num_num2'] = {
    init: function() {
        this.jsonInit({
            "inputsInline": true,
            "output": "Number",
            "style": "rblk_math_blocks",
            "helpUrl": "%{BKY_MATH_ARITHMETIC_HELPURL}"
        });
        
        this.appendValueInput('A').setCheck('Number');
        this.appendValueInput('B').setCheck('Number').appendField('OP','OP');
        this.operator_='OP';
    },
    
    makeMenuItem_: function(op, weight) {
        return {
            text: Blockly.BIB.TXT('%{BIB_OPERATORS_TRANSFORM_OP}', '%{BIB_OPERATORS_OP_TXT_'+op+'}'), 
            enabled: 'true', 
            callback: function(scope) {
                scope.setOperator_(op);
            },
            scope: this,
            weight: weight
        };
    },
    
    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help'], [
            this.makeMenuItem_('ADD', 2),
            this.makeMenuItem_('SUB', 2),
            this.makeMenuItem_('MUL', 0),
            this.makeMenuItem_('DIV', 3),
            this.makeMenuItem_('MOD', 3),
        ], true);
    },
    
    mutationToDom: function(workspace) {
        //console.log('*** mutationToDom');
        var container = Blockly.utils.xml.createElement('mutation');
        container.setAttribute('operator', this.operator_);
        return container;
    },
    
    domToMutation: function(container) {
        //console.log('*** domToMutation', container);
        var value = container.getAttribute('operator');
        //console.log('operator', value);
        this.setOperator_(value);
    },
    
    setOperator_(value) {
        this.operator_ = value;
        let input = this.getInput('B');
        input.removeField('OP');
        let field = value;

        let sym = Blockly.BIB.Operators.ICON_TABLE[value];
        if (sym) {
            if (sym.icon) {
                field = new Blockly.FieldImage(sym.icon, 14, 14, sym.text);
            } else {
                field = sym.text;
            }
        } 
        
        input.appendField(field, 'OP');
    },
    
};

Blockly.Blocks['operator_logic_bool'] = {
    init: function() {
        this.jsonInit({
            "message0": "%1 %2 %3",
            "args0": [
            {
                "type": "input_value",
                "name": "A",
                "check": "Boolean"
            },
            {
                "type": "field_dropdown",
                "name": "OP",
                "options": [
                ["%{BKY_BIB_OPERATORS_OP_TXT_AND}", "AND"],
                ["%{BKY_BIB_OPERATORS_OP_TXT_OR}", "OR"],
                ["%{BKY_BIB_OPERATORS_OP_TXT_XOR}", "XOR"],
                ["%{BKY_BIB_OPERATORS_OP_TXT_NXOR}", "NXOR"]
                ]
            },
            {
                "type": "input_value",
                "name": "B",
                "check": "Boolean"
            }
            ],
            "inputsInline": true,
            "output": "Boolean",
            "style": "rblk_logic_blocks",
            "helpUrl": "%{BKY_LOGIC_OPERATION_HELPURL}",
            "extensions": ["logic_op_tooltip"]
        });
    }
};
        


Blockly.Blocks['operator_bool_bool2'] = {
    init: function() {
        this.jsonInit({
            "inputsInline": true,
            "output": "Boolean",
            "style": "rblk_logic_blocks",
            "helpUrl": "%{BKY_LOGIC_OPERATION_HELPURL}"
        });
        
        this.appendValueInput('A').setCheck('Boolean');
        this.appendValueInput('B').setCheck('Boolean').appendField('OP','OP');
        this.operator_='OP';
    },

    makeMenuItem_: function(op, weight) {
        return {
            text: Blockly.BIB.TXT('%{BIB_OPERATORS_TRANSFORM_OP}', '%{BIB_OPERATORS_OP_TXT_'+op+'}'), 
            enabled: 'true', 
            callback: function(scope) {
                scope.setOperator_(op);
            },
            scope: this,
            weight: weight
        };
    },
    
    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help'], [
            this.makeMenuItem_('AND', 3),
            this.makeMenuItem_('OR', 3),
            this.makeMenuItem_('XOR', 3),
            this.makeMenuItem_('NXOR', 3),
        ], true);
    },
    
    mutationToDom: Blockly.Blocks['operator_num_num2'].mutationToDom,
    domToMutation: Blockly.Blocks['operator_num_num2'].domToMutation,
    setOperator_: Blockly.Blocks['operator_num_num2'].setOperator_,
    
};


Blockly.Blocks['operator_bool_num2'] = {
    init: function() {
        this.jsonInit({
            "inputsInline": true,
            "output": "Boolean",
            "style": "rblk_logic_blocks",
            "helpUrl": "%{LOGIC_COMPARE_HELPURL}"
        });
        
        this.appendValueInput('A').setCheck('Number');
        this.appendValueInput('B').setCheck('Number').appendField('OP','OP');
        this.operator_='OP';
    },
    
    makeMenuItem_: function(op, weight) {
        return {
            text: Blockly.BIB.TXT('%{BIB_OPERATORS_TRANSFORM_OP}', '%{BIB_OPERATORS_OP_TXT_'+op+'}'), 
            enabled: 'true', 
            callback: function(scope) {
                scope.setOperator_(op);
            },
            scope: this,
            weight: weight
        };
    },

    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help'], [
            this.makeMenuItem_('EQ', 2),
            this.makeMenuItem_('NEQ', 2),
            this.makeMenuItem_('GT', 0),
            this.makeMenuItem_('LT', 3),
            this.makeMenuItem_('GET', 3),
            this.makeMenuItem_('LET', 3),
        ], true);
    },
    
    mutationToDom: Blockly.Blocks['operator_num_num2'].mutationToDom,
    domToMutation: Blockly.Blocks['operator_num_num2'].domToMutation,
    setOperator_: Blockly.Blocks['operator_num_num2'].setOperator_,
    
};


Blockly.Blocks['operator_bool_col2'] = {
    init: function() {
        this.jsonInit({
            "inputsInline": true,
            "output": "Boolean",
            "style": "rblk_logic_blocks",
            "helpUrl": "%{BKY_MATH_ARITHMETIC_HELPURL}"
        });
        
        this.appendValueInput('A').setCheck('Color');
        this.appendValueInput('B').setCheck('Color').appendField('OP','OP');
        this.operator_='OP';
    },

    makeMenuItem_: function(op, weight) {
        return {
            text: Blockly.BIB.TXT('%{BIB_OPERATORS_TRANSFORM_OP}', '%{BIB_OPERATORS_OP_TXT_'+op+'}'), 
            enabled: 'true', 
            callback: function(scope) {
                scope.setOperator_(op);
            },
            scope: this,
            weight: weight
        };
    },
    
    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help'], [
            this.makeMenuItem_('EQ', 2),
            this.makeMenuItem_('NEQ', 2),
        ], true);
    },
    
    mutationToDom: Blockly.Blocks['operator_num_num2'].mutationToDom,
    domToMutation: Blockly.Blocks['operator_num_num2'].domToMutation,
    setOperator_: Blockly.Blocks['operator_num_num2'].setOperator_,
    
};


Blockly.Blocks['operator_bool_str2'] = {
    init: function() {
        this.jsonInit({
            "inputsInline": true,
            "output": "Boolean",
            "style": "rblk_logic_blocks",
            "helpUrl": "%{BKY_MATH_ARITHMETIC_HELPURL}"
        });
        
        this.appendValueInput('A').setCheck('String');
        this.appendValueInput('B').setCheck('String').appendField('OP','OP');
        this.operator_='OP';
    },
    
    makeMenuItem_: function(op, weight) {
        return {
            text: Blockly.BIB.TXT('%{BIB_OPERATORS_TRANSFORM_OP}', '%{BIB_OPERATORS_OP_TXT_'+op+'}'), 
            enabled: 'true', 
            callback: function(scope) {
                scope.setOperator_(op);
            },
            scope: this,
            weight: weight
        };
    },

    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help'], [
            this.makeMenuItem_('EQ', 2),
            this.makeMenuItem_('NEQ', 2),
            this.makeMenuItem_('GT', 0),
            this.makeMenuItem_('LT', 3),
            this.makeMenuItem_('GET', 2),
            this.makeMenuItem_('LET', 2),
        ], true);
    },
    
    mutationToDom: Blockly.Blocks['operator_num_num2'].mutationToDom,
    domToMutation: Blockly.Blocks['operator_num_num2'].domToMutation,
    setOperator_: Blockly.Blocks['operator_num_num2'].setOperator_,
    
};


Blockly.Blocks['operator_not'] = {
    init: function() {
        this.jsonInit({
            "message0": "%{BKY_BIB_OPERATORS_NEGATE}",
            "args0": [{
                "type": "input_value",
                "name": "BOOL",
                "check": "Boolean"
            }],
            "output": "Boolean",
            "style": "rblk_logic_blocks",
            "tooltip": "%{BKY_LOGIC_NEGATE_TOOLTIP}",
            "helpUrl": "%{BKY_LOGIC_NEGATE_HELPURL}"
        });
    },

    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help']);
    },
    
};


Blockly.Blocks['operator_random_number'] = {
    init: function() {
        this.jsonInit({
            "message0": "%{BKY_BIB_OPERATORS_RANDOM}",
            "args0": [
                {
                    "type": "input_value",
                    "name": "LOWER",
                    "check": "Number"
                },
                {
                    "type": "input_value",
                    "name": "UPPER",
                    "check": "Number"
                }
            ],
            "inputsInline": true,
            "output": "Number",
            "style": "rblk_math_blocks",
            "tooltip": "%{BKY_LOGIC_NEGATE_TOOLTIP}",
            "helpUrl": "%{BKY_LOGIC_NEGATE_HELPURL}"
        });
    },

    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help']);
    },
    
};


Blockly.Blocks['operator_concat'] = {
    init: function() {
        this.jsonInit({
            "message0": "%{BKY_BIB_OPERATORS_CONCAT}",
            "args0": [
                {
                    "type": "input_value",
                    "name": "A",
                    "check": ["String", "Number", "Image", "Boolean", "Color"]
                },
                {
                    "type": "input_value",
                    "name": "B",
                    "check": ["String", "Number", "Image", "Boolean", "Color"]
                }
            ],
            "inputsInline": true,
            "output": "String",
            "style": "rblk_text_blocks",
            "tooltip": "",
            "helpUrl": ""
        });
    },
    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help', 'comment', 'fold', 'deactivate']);
    },
};



Blockly.Blocks['literal_Boolean'] = {
    init: function() {
        this.jsonInit({
            "message0": "%1",
            "args0": [
            {
                "type": "field_label",
                "name": "BOOL",
                "text": "%{BKY_LOGIC_BOOLEAN_FALSE}"
            }
            ],
            "output": "Boolean",
            "style": "rblk_logic_blocks"
        });
        this.value_=false;
    },

    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete'], [
            {text: Blockly.Msg[LOGIC_BOOLEAN_TRUE], enabled: 'true', callback: function(scope) {scope.setValue_(true);}, scope: this, weight: 2},
            {text: Blockly.Msg[LOGIC_BOOLEAN_FALSE], enabled: 'true', callback: function(scope) {scope.setValue_(false);}, scope: this, weight: 2}
        ], true);
    },
    
    setValue_: function(value) {
        this.value_ = value;
        let text = Blockly.Msg[value?'LOGIC_BOOLEAN_TRUE':'LOGIC_BOOLEAN_FALSE'];
        this.setFieldValue(text, 'BOOL');
    },
    
    mutationToDom: function(workspace) {
        //console.log('*** mutationToDom');
        var container = Blockly.utils.xml.createElement('mutation');
        container.setAttribute('value', this.value_);
        return container;
    },
        
    domToMutation: function(container) {
        //console.log('*** domToMutation', container);
        var value = container.getAttribute('value')==='true';
        this.setValue_(value);
    },
    
};





Blockly.BIB.Operators.ICON_TABLE = {
    'ADD': {text: '+', icon: Blockly.BIB.Icons.ICON_PLUS},
    'SUB': {text: '-', icon: Blockly.BIB.Icons.ICON_MINUS},
    'MUL': {text: '⋅', icon: Blockly.BIB.Icons.ICON_MULTIPLY_DOT},
    'DIV': {text: '∶', icon: Blockly.BIB.Icons.ICON_DIVIDE_DOTS},
    'MOD': {text: '∶Rest'},
    'AND': {text: 'und'},
    'OR':  {text: 'oder'},
    'XOR': {text: '↮'},
    'NXOR': {text: '↔'},
    'EQ':  {text: '=', icon: Blockly.BIB.Icons.ICON_EQUAL},
    'NEQ': {text: '!=', icon: Blockly.BIB.Icons.ICON_NOT_EQUAL},
    'GT':  {text: '>', icon: Blockly.BIB.Icons.ICON_GREATER_THAN},
    'LT':  {text: '<', icon: Blockly.BIB.Icons.ICON_LESS_THAN},
    'GET': {text: '>=', icon: Blockly.BIB.Icons.ICON_GREATER_THAN_EQUAL},
    'LET': {text: '<=', icon: Blockly.BIB.Icons.ICON_LESS_THAN_EQUAL},
};
