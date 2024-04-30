/**
 * @license
 * Copyright 2025 nicai-systems
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Modifications: BIB - Bob's Improved Blockly
 * Copyright 2024 Nils Springob
 * Source for base code (Blockly): [https://github.com/google/blockly] (Apache-2.0 License)
 * Source for block-color-values and block-captions (OpenRoberta): [https://github.com/OpenRoberta/] (Apache-2.0 License)
 */

/**
 * @fileoverview Shadow blocks for Blockly.
 * @author nils@bob3.org (Nils Springob)
 */
'use strict';

goog.provide('Blockly.Constants.SCB_Shadows');

goog.require('Blockly');
goog.require('Blockly.Blocks');
goog.require('Blockly.FieldDropdown');
goog.require('Blockly.FieldImage');
goog.require('Blockly.FieldMultilineInput');
goog.require('Blockly.FieldTextInput');
goog.require('Blockly.FieldVariable');
goog.require('Blockly.Mutator');



Blockly.Blocks['shadow_INT16'] = {
    init: function() {
        this.jsonInit({
            "message0": "%1",
            "args0": [{
                "type": "field_number",
                "name": "NUM",
                "value": 0
            }],
            "output": "Number",
            "helpUrl": "%{BKY_MATH_NUMBER_HELPURL}",
            "style": "rblk_shadow_blocks",
            "tooltip": "%{BKY_MATH_NUMBER_TOOLTIP}",
            "extensions": ["parent_tooltip_when_inline"]
        });
        this.getField('NUM').setConstraints(-32768, 32767, 1);
        this.getField('NUM').initView = this.hackFieldInitView_;
        this.scb_init = false;
    },
    onchange: function(e) {
        if (this.scb_init) return;
        if (this.getParent()) {
            let style = this.getParent().getStyleName();
            //console.log('shadow_INT16', e, style+'-shadow');
            if (style=="auto_#000000") return;
            this.setStyle(style + '-shadow');
            this.scb_init = true;
        }
    },
    hackFieldInitView_: function() {
        this.fullBlockClickTarget_ =true;
        this.clickTarget_ = this.sourceBlock_.getSvgRoot();
        this.createTextElement_();
    },
};

Blockly.Blocks['integer_Number'] = Blockly.Blocks['shadow_INT16']; //HACK


Blockly.Blocks['shadow_UINT4'] = {
    init: function() {
        this.jsonInit({
            "message0": "%1",
            "args0": [{
                "type": "field_number",
                "name": "NUM",
                "value": 0
            }],
            "output": "Number",
            "helpUrl": "%{BKY_MATH_NUMBER_HELPURL}",
            "style": "rblk_shadow_blocks",
            "tooltip": "%{BKY_MATH_NUMBER_TOOLTIP}",
            "extensions": ["parent_tooltip_when_inline"]
        });
        this.getField('NUM').setConstraints(0, 15, 1);
        this.getField('NUM').initView = this.hackFieldInitView_;
        this.scb_init = false;
    },
    
    onchange: function(e) {
        if (this.scb_init) return;
        //console.log(e, this.getParent().getStyleName()+'-shadow');
        if (this.getParent()) {
            this.setStyle(this.getParent().getStyleName()+'-shadow');
            this.scb_init = true;
        }
    },
    
    hackFieldInitView_: function() {
        this.fullBlockClickTarget_ =true;
        this.clickTarget_ = this.sourceBlock_.getSvgRoot();
        this.createTextElement_();
    },
};

Blockly.Blocks['integer_UINT4'] = Blockly.Blocks['shadow_UINT4']; //HACK


Blockly.Blocks['shadow_INT_1_2'] = {
    init: function() {
        this.jsonInit({
            "message0": "%1",
            "args0": [{
                "type": "field_number",
                "name": "NUM",
                "value": 0
            }],
            "output": "Number",
            "helpUrl": "%{BKY_MATH_NUMBER_HELPURL}",
            "style": "rblk_shadow_blocks",
            "tooltip": "%{BKY_MATH_NUMBER_TOOLTIP}",
            "extensions": ["parent_tooltip_when_inline"]
        });
        this.getField('NUM').setConstraints(1, 2, 1);
        this.getField('NUM').initView = this.hackFieldInitView_;
        this.scb_init = true;
    },
    onchange: function(e) {
        if (this.scb_init) return;
        //console.log(e, this.getParent().getStyleName()+'-shadow');
        if (this.getParent()) {
            this.setStyle(this.getParent().getStyleName()+'-shadow');
            this.scb_init = false;
        }
    },
    
    hackFieldInitView_: function() {
        this.fullBlockClickTarget_ =true;
        this.clickTarget_ = this.sourceBlock_.getSvgRoot();
        this.createTextElement_();
    },
};

Blockly.Blocks['shadow_INT_1_2_3_4'] = {
    init: function() {
        this.jsonInit({
            "message0": "%1",
            "args0": [{
                "type": "field_number",
                "name": "NUM",
                "value": 0
            }],
            "output": "Number",
            "helpUrl": "%{BKY_MATH_NUMBER_HELPURL}",
            "style": "rblk_shadow_blocks",
            "tooltip": "%{BKY_MATH_NUMBER_TOOLTIP}",
            "extensions": ["parent_tooltip_when_inline"]
        });
        this.getField('NUM').setConstraints(1, 4, 1);
        this.getField('NUM').initView = this.hackFieldInitView_;
        this.scb_init = false;
        
    },
    onchange: function(e) {
        if (this.scb_init) return;
        //console.log(e, this.getParent().getStyleName()+'-shadow');
        if (this.getParent()) {
            this.setStyle(this.getParent().getStyleName()+'-shadow');
            this.scb_init = true;
        }
    },
    
    hackFieldInitView_: function() {
        this.fullBlockClickTarget_ =true;
        this.clickTarget_ = this.sourceBlock_.getSvgRoot();
        this.createTextElement_();
    },
    
};



Blockly.Blocks['shadow_INT_unit'] = {
    init: function() {
        this.jsonInit({
            "message0": "%1 %2",
            "args0": [
                {
                    "type": "field_number",
                    "name": "NUM",
                }, {
                    "type": "field_label_serializable",
                    "name": "UNIT",
                }
            ],
            "output": "Number",
            "style": "rblk_shadow_blocks",
            
        });
        
        this.scb_init = false;
        this.unit_initialized_ = false;
        this.getField('UNIT').setClass('TEST-black-font');
        this.getField('NUM').setPrecision(1);
        
        this.getField('NUM').initView = this.hackFieldInitView_;
    },

    onchange: function(e) {
        if (this.getParent()) {
            this.setStyle(this.getParent().getStyleName()+'-shadow');
            this.scb_init = true;
        }
        if (this.unit_initialized_) return;
        let numField = this.getField('NUM');
        let unit = this.getFieldValue('UNIT');
        if (unit=='%') {
            numField.setConstraints(-0, 100, 1);
        } else if (unit=='°') {
            numField.setConstraints(-360, 360, 1);
        } else {
            this.getField('NUM').setConstraints(-32768, 32767, 1);
        }
        
        this.unit_initialized_ = true;
        //console.log(unit, this);
        //this.getField('NUM').borderRect_ = null;
        this.getField('NUM').markDirty();
    },
    
    hackFieldInitView_: function() {
        this.fullBlockClickTarget_ = true;
        this.clickTarget_ = this.sourceBlock_.getSvgRoot();
        this.createTextElement_();
    },
    
    /*
    domToMutation: function(container) {
        console.log('domToMutation');
        if (this.getParent()) {
            this.setStyle(this.getParent().getStyleName());
        }
    },
    */
};

Blockly.Blocks['unit_Number'] = Blockly.Blocks['shadow_INT_unit']; //HACK


Blockly.Blocks['shadow-empty'] = {
    init: function() {
        this.jsonInit({
            "message0": "%1",
            "args0": [
                {
                    "type": "field_label",
                    "text": " "
                }
            ],
            "output": "",
            "helpUrl": "",
            "style": "rblk_shadow_blocks",
            "tooltip": "",
            "extensions": ["parent_tooltip_when_inline"]
        });
        this.scb_init = false;
    },
    
    onchange: function(e) {
        if (this.scb_init) return;
        console.log(e, this.getParent().getStyleName()+'-shadow');
        if (this.getParent()) {
            this.setStyle(this.getParent().getStyleName()+'-shadow');
            this.scb_init = true;
        }
    },
};

// *********************************
// **** Shadows
// *********************************


Blockly.Blocks['shadow-no-Variable'] = {
    init: function() {
        this.jsonInit({
            "message0": "Variable",
            "args0": [],
            "output": "",
            "helpUrl": "",
            "style": "rblk_shadow_blocks",
            "tooltip": "",
            "extensions": ["parent_tooltip_when_inline"]
        });
    },
};

Blockly.Blocks['shadow-no-Value'] = {
    init: function() {
        this.jsonInit({
            "message0": "Wert",
            "args0": [],
            "output": "",
            "helpUrl": "",
            "style": "rblk_shadow_blocks",
            "tooltip": "",
            "extensions": ["parent_tooltip_when_inline"]
        });
    },
};

Blockly.Blocks['shadow-no-Color'] = {
    init: function() {
        this.jsonInit({
            "message0": "Farbe",
            "args0": [],
            "output": "",
            "helpUrl": "",
            "style": "rblk_shadow_blocks",
            "tooltip": "",
            "extensions": ["parent_tooltip_when_inline"]
        });
        
        this.render = function(opt_bubble) {
            //console.log('RENDER');
            Blockly.BlockSvg.prototype.render.call(this, opt_bubble);
        }
        
    },
};

Blockly.Blocks['shadow-no-Number'] = {
    init: function() {
        this.jsonInit({
            "message0": "Zahl",
            "args0": [],
            "output": "",
            "helpUrl": "",
            "style": "rblk_shadow_blocks",
            "tooltip": "",
            "extensions": ["parent_tooltip_when_inline"]
        });
    },
};

Blockly.Blocks['shadow-no-Boolean'] = {
    init: function() {
        this.jsonInit({
            "message0": "Wahrheit",
            "args0": [],
            "output": "",
            "helpUrl": "",
            "style": "rblk_shadow_blocks",
            "tooltip": "",
            "extensions": ["parent_tooltip_when_inline"]
        });
    },
};

