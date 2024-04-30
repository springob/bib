
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


'use strict';

goog.provide('Blockly.BIB.Control_Loops');

goog.require('Blockly');
goog.require('Blockly.Blocks');
goog.require('Blockly.FieldDropdown');
goog.require('Blockly.FieldLabel');
goog.require('Blockly.FieldNumber');
goog.require('Blockly.FieldVariable');
goog.require('Blockly.BIB.Icons');

Blockly.defineBlocksWithJsonArray([  // BEGIN JSON EXTRACT
  // Block for repeat n times (external number).
  {
    "type": "controls_repeat_ext",
    "lastDummyAlign1": "RIGHT",
    "message0": "wiederhole %1 mal",
    "args0": [{
      "type": "input_value",
      "name": "TIMES",
      "check": "Number"
    }],
    "message1": "mache %1",
    "args1": [
        {
            "type": "input_statement",
            "name": "DO",
            "check": "STATEMENT"
        },
    ],
    "previousStatement": 'STATEMENT',
    "nextStatement": 'STATEMENT',
    "style": "rblk_control_blocks",
    "tooltip": "%{BKY_CONTROLS_REPEAT_TOOLTIP}",
    "helpUrl": "%{BKY_CONTROLS_REPEAT_HELPURL}"
  },
  
  // Block for repeat forever.
  {
    "type": "controls_repeat_forever",
    "lastDummyAlign1": "RIGHT",
    "message0": "wiederhole unendlich oft %1",
    "args0": [{
      "type": "input_dummy",
    }],
    "message1": "mache %1 %2",
    "args1": [
        {
            "type": "input_statement",
            "name": "DO",
            "check": "STATEMENT"
        }, {
            "type": "field_image",
            "src": Blockly.BIB.Icons.ICON_LEVEL_UP_ALT,
            "width": 18,
            "height": 18,
            "alt": "*"
        },
    ],
    "previousStatement": 'STATEMENT',
    "nextStatement": 'STATEMENT',
    "style": "rblk_control_blocks",
    "tooltip": "%{BKY_CONTROLS_REPEAT_TOOLTIP}",
    "helpUrl": "%{BKY_CONTROLS_REPEAT_HELPURL}"
  },

  // Block for repeat until (external condition).
  {
    "type": "controls_repeat_until",
    "lastDummyAlign1": "RIGHT",
    "message0": "wiederhole bis %1",
    "args0": [{
      "type": "input_value",
      "name": "COND",
      "check": "Boolean"
    }],
    "message1": "mache %1 %2",
    "args1": [
        {
            "type": "input_statement",
            "name": "DO",
            "check": "STATEMENT"
        }, {
            "type": "field_image",
            "src": Blockly.BIB.Icons.ICON_LEVEL_UP_ALT,
            "width": 18,
            "height": 18,
            "alt": "*"
        },
    ],
    "previousStatement": 'STATEMENT',
    "nextStatement": 'STATEMENT',
    "style": "rblk_control_blocks",
    "tooltip": "%{BKY_CONTROLS_REPEAT_TOOLTIP}",
    "helpUrl": "%{BKY_CONTROLS_REPEAT_HELPURL}"
  },

  // Block for repeat until (external condition).
  {
    "type": "controls_wait_until",
    "lastDummyAlign1": "RIGHT",
    "message0": "warte bis %1",
    "args0": [{
      "type": "input_value",
      "name": "COND",
      "check": "Boolean"
    }],
    "previousStatement": 'STATEMENT',
    "nextStatement": 'STATEMENT',
    "style": "rblk_control_blocks",
    "tooltip": "%{BKY_CONTROLS_REPEAT_TOOLTIP}",
    "helpUrl": "%{BKY_CONTROLS_REPEAT_HELPURL}"
  },

  
  // Block for repeat n times (internal number).
  // The 'controls_repeat_ext' block is preferred as it is more flexible.
  {
    "type": "controls_repeat",
    "message0": "%{BKY_CONTROLS_REPEAT_TITLE}",
    "args0": [{
      "type": "field_number",
      "name": "TIMES",
      "value": 10,
      "min": 0,
      "precision": 1
    }],
    "message1": "%{BKY_CONTROLS_REPEAT_INPUT_DO} %1",
    "args1": [{
      "type": "input_statement",
      "name": "DO",
      "check": "STATEMENT"
    }],
    "previousStatement": 'STATEMENT',
    "nextStatement": 'STATEMENT',
    "style": "rblk_control_blocks",
    "tooltip": "%{BKY_CONTROLS_REPEAT_TOOLTIP}",
    "helpUrl": "%{BKY_CONTROLS_REPEAT_HELPURL}"
  },
 
  
]);  // END JSON EXTRACT (Do not delete this comment.)



Blockly.Blocks['controls_loop_break'] = {
    debug_out: Blockly.BIB.lib.DEBUG_OFF,
    
    init: function() {
        this.jsonInit({
            "message0": "%{BKY_CONTROLS_FLOW_STATEMENTS_OPERATOR_BREAK}",
            "previousStatement": 'STATEMENT',
            "style": "rblk_control_blocks",
            "helpUrl": "%{BKY_CONTROLS_FLOW_STATEMENTS_HELPURL}",
        });
        
        this.onchange = Blockly.BIB.lib.EVENT_DISPATCHER;
        this.bib_onFinishedLoading = this._checkBlockContext;
        this.bib_onBlockParentPlug = this._checkBlockContext;
        
    },
    
    _checkBlockContext: function(e) {
        this.debug_out('_checkBlockContext', this);
        let inLoop = !!Blockly.BIB.lib.getAncesterBlockOfType(this, ['controls_repeat', 'controls_repeat_until', 'controls_repeat_forever', 'controls_repeat_ext']);
        this.setWarningText(inLoop ? null : Blockly.Msg['BIB_CONTROLS_FLOW_STATEMENTS_WARNING']);
        if (!this.isInFlyout) {
            var group = Blockly.Events.getGroup();
            // Makes it so the move and the disable event get undone together.
            Blockly.Events.setGroup(e.group);
            this.setEnabled(inLoop);
            Blockly.Events.setGroup(group);
        }
    },
    
};


    

Blockly.Blocks['controls_if'] = {
    debug_out: Blockly.BIB.lib.DEBUG_OFF,
    
    init: function() {
        this.jsonInit({
            "message0": "%{BKY_CONTROLS_IF_MSG_IF} %1",
            "args0": [{
                "type": "input_value",
                "name": "IF0",
                "check": "Boolean"
            }],
            "message1": "%{BKY_CONTROLS_IF_MSG_MAKE} %1",
            "args1": [{
                "type": "input_statement",
                "name": "DO0"
            }],
            "previousStatement": 'STATEMENT',
            "nextStatement": 'STATEMENT',
            "style": "rblk_control_blocks",
            "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
        });
        
        this.onchange = Blockly.BIB.lib.eventDispatcher;
        
        this.inputList[0].insertFieldAt(0, Blockly.BIB.lib.createButtonField('+', 'PLUS'), 'PLUS');
        
        this.elseifCount_ = 0;
        this.elseCount_ = 0;
    },
    
    doCmd_addElse_: function() {
        this.elseCount_=1;
        this.rebuildShape_();
    },

    doCmd_delElse_: function() {
        this.elseCount_=0;
        this.rebuildShape_();
    },

    doCmd_addElseIf_: function() {
        this.elseifCount_++;
        this.rebuildShape_();
    },

    doCmd_delElseIf_: function() {
        this.elseifCount_--;
        this.rebuildShape_();
    },
    
    on_buttonClicked: function(arg) {
        if (arg=='PLUS') {
            this.doCmd_addElseIf_();
        } else if (arg=='MINUS') {
            this.doCmd_delElseIf_();
        }
    },
    
    on_moveChild: function(event) {
        this.debug_out('on_moveChild', this, event);
        this.updateMinusField();
    },
    
    updateMinusField: function() {
        let ec = this.elseifCount_;
        let canDelElseIf = (ec>0); // && (!this.getInputTargetBlock('IF'+ec)) && (!this.getInputTargetBlock('DO'+ec));
        let minusField = this.getField('MINUS');
        if (canDelElseIf && !minusField) {
            this.inputList[0].insertFieldAt(1, Blockly.BIB.lib.createButtonField('-', 'MINUS'), 'MINUS');
        } else if (!canDelElseIf && minusField) {
            this.inputList[0].removeField('MINUS', true);
        }
    },
    
    customContextMenu: function(menuitems) {
        let ec = this.elseifCount_;
        let canAddElse = this.elseCount_==0;
        let canDelElse = this.elseCount_>0;
        let canAddElseIf = true;
        let canDelElseIf = (ec>0) && (!this.getInputTargetBlock('IF'+ec)) && (!this.getInputTargetBlock('DO'+ec));
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help'], [
            {text: '+ «sonst-wenn-mache»-Zweig hinzufügen', enabled: canAddElseIf, callback: function(scope) {scope.doCmd_addElseIf_();}, scope: this, weight: 2},
            {text: '- «sonst-wenn-mache»-Zweig entfernen', enabled: canDelElseIf, callback: function(scope) {scope.doCmd_delElseIf_();}, scope: this, weight: 2},
            {text: '+ «sonst»-Zweig hinzufügen', enabled: canAddElse, callback: function(scope) {scope.doCmd_addElse_();}, scope: this, weight: 2},
            {text: '- «sonst»-Zweig entfernen', enabled: canDelElse, callback: function(scope) {scope.doCmd_delElse_();}, scope: this, weight: 2},
        ], true);
    },

    mutationToDom: function(workspace) {
        //console.log('*** mutationToDom');
        var xmlElement = Blockly.utils.xml.createElement('mutation');
        xmlElement.setAttribute('elseif', this.elseifCount_);
        xmlElement.setAttribute('else', this.elseCount_);
        return xmlElement;
    },
    
    domToMutation: function(xmlElement) {
        //console.log('*** domToMutation', xmlElement);
        this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10) || 0;
        this.elseCount_ = parseInt(xmlElement.getAttribute('else'), 10) || 0;
        this.rebuildShape_();
    },
    
    rebuildShape_: function() {
        //console.log ('rebuildShape_', this);
        var valueConnections = [null];
        var statementConnections = [null];
        var elseStatementConnection = null;

        if (this.getInput('ELSE')) {
            elseStatementConnection = this.getInput('ELSE').connection.targetConnection;
        }
        var i = 1;
        while (this.getInput('IF' + i)) {
            var inputIf = this.getInput('IF' + i);
            var inputDo = this.getInput('DO' + i);
            valueConnections.push(inputIf.connection.targetConnection);
            statementConnections.push(inputDo.connection.targetConnection);
            i++;
        }
        this.updateShape_();
        this.reconnectChildBlocks_(valueConnections, statementConnections, elseStatementConnection);
        this.updateMinusField();
    },

    updateShape_: function() {
        // Delete everything.
        if (this.getInput('ELSE')) {
            this.removeInput('ELSE');
        }
        var i = 1;
        while (this.getInput('IF' + i)) {
            //this.removeInput('IF_MSG' + i);
            this.removeInput('IF' + i);
            this.removeInput('DO' + i);
            i++;
        }
        // Rebuild block.
        for (i = 1; i <= this.elseifCount_; i++) {
            this.appendValueInput('IF' + i)
                .setCheck('Boolean')
                .appendField(Blockly.Msg['CONTROLS_IF_MSG_ELSEIF']);
            //this.appendDummyInput('IF_MSG' + i)
            //    .appendField(Blockly.Msg['CONTROLS_IF_MSG_THEN']);
            this.appendStatementInput('DO' + i).appendField(Blockly.Msg['CONTROLS_IF_MSG_MAKE']);
        }
        if (this.elseCount_) {
            this.appendStatementInput('ELSE').appendField(Blockly.Msg['CONTROLS_IF_MSG_ELSE']);
        }
    },

    reconnectChildBlocks_: function(valueConnections, statementConnections, elseStatementConnection) {
        this.debug_out('reconnectChildBlocks_', this, valueConnections, statementConnections, elseStatementConnection);
        for (var i = 1; i <= this.elseifCount_; i++) {
            this.debug_out('reconnectChildBlocks_' , i, this.getInput('IF' + i));
            if (valueConnections[i]) valueConnections[i].connect(this.getInput('IF' + i).connection);
            if (statementConnections[i]) statementConnections[i].connect(this.getInput('DO' + i).connection);
        }
        if (elseStatementConnection) {
            this.debug_out('reconnectChildBlocks_', 'ELSE', this.getInput('ELSE'));
            //elseStatementConnection[i].connect(this.getInput('ELSE').connection);
            elseStatementConnection.connect(this.getInput('ELSE').connection);
        }
    }
    
};


