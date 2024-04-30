/**
 * @license
 * Copyright 2024 Nils Springob
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Modifications: BIB - Bob's Improved Blockly
 * Source for base code (Blockly): [https://github.com/google/blockly] (Apache-2.0 License)
 * Source for block-color-values and block-captions (OpenRoberta): [https://github.com/OpenRoberta/] (Apache-2.0 License)
 */

/**
 * @fileoverview Variable blocks for Blockly.
 * @author nils@bob3.org (Nils Springob)
 */
'use strict';

//goog.provide('Blockly.Constants.SCB_Variables');
goog.provide('Blockly.BIB.Variables');

goog.require('Blockly');
goog.require('Blockly.Blocks');
goog.require('Blockly.FieldDropdown');
goog.require('Blockly.FieldImage');
goog.require('Blockly.FieldMultilineInput');
goog.require('Blockly.FieldTextInput');
goog.require('Blockly.FieldVariable');
goog.require('Blockly.Mutator');

goog.require('Blockly.BIB.lib');



// *********************************
// *          VARIABLE DEFINITION
// *********************************


Blockly.Blocks['variable_definition'] = {
    debug_out: Blockly.BIB.lib.DEBUG_OFF,
    
    init: function() {
        this.debug_out('init', this);

        Blockly.BIB.lib.initializeMutationData(this, {
            name: 'var',
            type: 'VOID',
            scope: '',
            initValue: false
        });

        this.setPreviousStatement(true, "VARDEF");
        this.setNextStatement(true, "VARDEF");
        this.setStyle("rblk_variable_blocks");
        
        this.onchange = Blockly.BIB.lib.EVENT_DISPATCHER;
        
    },
    
    manualInitialize: function(scope, type, name) {
        // new scopes:
        //   function:variable
        //   function:parameter
        //   global:variable
        
        this.debug_out('manualInitialize', scope, type, name);
        this.mutationData.scope = scope;
        this.mutationData.type = type;
        this.mutationData.name = name;
        
        this.updateShape_();
        
        this.setMovable(false);
        this.setDeletable(false);
    },
    
    
    createNewVariableBlock: function () {
        let rect = this.getBoundingRectangle();
        let xDelta = rect.right-rect.left+20;
        var block = this.workspace.newBlock('variable_value');
        block.manualInitialize(this.getFieldValue('NAME'), this.getFieldValue('TYPE'));
        this.debug_out('createNewVariableBlock', 'DELTA:', xDelta);
        Blockly.BIB.lib.moveBlockRelativeTo(block, this, xDelta, 0, true);
        block.bumpNeighbours();
    },

    createNewVariableSetBlock: function () {
        let rect = this.getBoundingRectangle();
        let xDelta = rect.right-rect.left+20;
        var block = this.workspace.newBlock('variable_set_direct');
        block.manualInitialize(this.getFieldValue('NAME'), this.getFieldValue('TYPE'));
        Blockly.BIB.lib.moveBlockRelativeTo(block, this, xDelta, 0, true);
        block.bumpNeighbours();
    },
    
    toggleInitValue: function(value) {
        this.debug_out('toggleInitValue', 'START', value);
        this.mutationData.initValue = value;
        this.updateShape_();
        this.markDirty();
        //this.render();
        this.debug_out('toggleInitValue', 'END');
    },
    
    on_buttonClicked: function(arg) {
        // MINUS button was clicked
        setTimeout(function(block){
            block.dispose(true);
        }, 10, this);
    },
    
    customContextMenu: function(menuitems) {
        let customItems = [];
        customItems.push({text: Blockly.BIB.TXT('%{BIB_VARIABLES_CMENU_CREATE_READ_BLOCK}'), enabled: 'true', callback: this.createNewVariableBlock.bind(this), weight: 2});
        customItems.push({text: Blockly.BIB.TXT('%{BIB_VARIABLES_CMENU_CREATE_WRITE_BLOCK}'), enabled: 'true', callback: this.createNewVariableSetBlock.bind(this), weight: 2});
        if (this.mutationData.scope!='function:parameter') {
            if (this.mutationData.initValue) {
                customItems.push({text: Blockly.BIB.TXT('%{BIB_VARIABLES_CMENU_USE_STANDARD}'), enabled: 'true', callback: this.toggleInitValue.bind(this, false), weight: 2});
            } else {
                customItems.push({text: Blockly.BIB.TXT('%{BIB_VARIABLES_CMENU_USE_SPECIAL}'), enabled: 'true', callback: this.toggleInitValue.bind(this, true), weight: 2});
            }
        }
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['comment', 'help'], customItems, false, this);
    },

    on_changeSelf: function(e) {
        this.debug_out('on_changeSelf', e);
        if (e.element=="field") {
            Blockly.Events.disable();
            let fieldName = e.name;
            let oldValue = e.oldValue;
            let newValue = e.newValue;
            
            if (fieldName=='NAME') {
                this.mutationData.name = newValue;
            } else if (fieldName=='TYPE') {
                this.mutationData.type = newValue;
                let name = this.mutationData.name;
                this.debug_out('on_changeSelf', oldValue, newValue);
                if (Blockly.BIB.lib.checkDefaultVarname(name, oldValue)) {
                    this.debug_out('on_changeSelf', 'we need a new name!');
                    let root = this.getRootBlock();
                    if (root) {
                        name = root.createNewVariableName(newValue);
                        this.debug_out('on_changeSelf', 'new name:', name);
                        this.mutationData.name = name;
                    }
                }
                this.updateShape_();
            } else if (fieldName=='VARPAR') {
                if (newValue=='PARAMETER') {
                    this.mutationData.scope = 'function:parameter';
                    this.toggleInitValue(false);
                } else {
                    this.mutationData.scope = 'function:variable';
                    this.toggleInitValue(true);
                }
            }
            Blockly.Events.enable();
            this.bib_fireVariableDefinitionChange_();
        }
    },
    
    updateInitDatatype_: function(newType) {
        this.debug_out('updateInitDatatype_', newType);
        let input = this.getInput('INITIALIZE');
        if (!input) return;
        if (!newType) newType=this.getFieldValue('TYPE');
        
        Blockly.BIB.lib.configureShadowBlock(input, newType, true);
        
    },
    
    
    onValidateName_: function(name) {
        let block = this.getSourceBlock();
        //console.log('onValidateName', name);
        name = name.trim();
        //name = Blockly.BIB.lib.normalizeSymbolname(name);
        if (name.match(/^\s*$/)) return null;

        if (block.getSurroundParent().validateVariableName) {
            return block.getSurroundParent().validateVariableName(name, block);
        }
    },
    
    beforeMutationToDom: function() {
        this.debug_out('beforeMutationToDom');
    },
    
    afterDomToMutation: function() {
        this.debug_out('afterDomToMutation');
        this.updateShape_(true);
    },
    
    bib_onFinishedLoading: function() {
        this.debug_out('bib_onFinishedLoading');
        this.updateShape_();
    },
    
    
    updateShape_: function(early) {
        this.debug_out('updateShape_');
        let jData = JSON.stringify(this.mutationData);
        if (jData === this.shapeJData) return;
        this.shapeJData = jData;
        
        this.debug_out('updateShape_', 'needs re-layout!', this.mutationData);
        let fullReshape = false;
        let dummyInput = this.getInput('DUMMY');
        let initializeInput = this.getInput('INITIALIZE');
        let varparField = this.getField('VARPAR');
        let nameField = this.getField('NAME');
        let typeField = this.getField('TYPE');
        let functionScope = ['function:variable', 'function:parameter'].includes(this.mutationData.scope);
        let varpar = (this.mutationData.scope=='function:parameter')?'PARAMETER':'VARIABLE';
        
        if (this.mutationData.initValue && !initializeInput) fullReshape = true;
        if (!this.mutationData.initValue && !dummyInput) fullReshape = true;
        if (functionScope && !varparField) fullReshape = true;
        if (!functionScope && !!varparField) fullReshape = true;
        
        if (fullReshape) {
            this.debug_out('updateShape_', 'fullReshape');
            const varparOptions = [["Parameter", "PARAMETER"], ["Variable", "VARIABLE"]];
            const vartypeOptions = [["Zahl", "Number"], ["Farbe", "Color"], ["Wahrheit", "Boolean"]];
            
            this.updateInitDatatype_('NULL');
            
            this.removeInput('DUMMY', true);
            this.removeInput('INITIALIZE', true);
            let input;
            
            if (this.mutationData.initValue) {
                input = this.appendValueInput('INITIALIZE');
            } else {
                input = this.appendDummyInput('DUMMY');
            }
            
            input.appendField(Blockly.BIB.lib.createButtonField('-', 'MINUS'), 'MINUS');
            if (functionScope) {
                varparField = new Blockly.FieldDropdown(varparOptions);
                Blockly.BIB.lib.disableSerializeFieldValue(varparField);
                varparField.setValue(varpar, false);
                input.appendField(varparField, 'VARPAR');
            } else {
                input.appendField('Variable');
                varparField = null;
            }
            nameField = new Blockly.FieldTextInput(this.mutationData.name);
            Blockly.BIB.lib.disableSerializeFieldValue(nameField);
            nameField.setValidator(this.onValidateName_);
            input.appendField(nameField, 'NAME');
            
            input.appendField('vom Typ');
            
            typeField = new Blockly.FieldDropdown(vartypeOptions);
            Blockly.BIB.lib.disableSerializeFieldValue(typeField);
            typeField.setValue(this.mutationData.type, false);
            input.appendField(typeField, 'TYPE');
            if (this.mutationData.initValue) {
                input.appendField(' • Startwert:');
            }
        } else {
            this.debug_out('updateShape_', 'partReshape');
            if (varparField) varparField.setValue(varpar, false);
            nameField.setValue(this.mutationData.name, false);
            typeField.setValue(this.mutationData.type, false);
            
        }
        if (!early) this.updateInitDatatype_(this.mutationData.type);
       
        this.bib_fireVariableDefinitionChange_();
    },
    
    getDefinition: function() {
        let varType = this.getFieldValue('TYPE');
        let varName = this.getFieldValue('NAME');
        let varClass = 'global';
        if (this.mutationData.scope=='function') {
            if (this.getFieldValue('VARPAR')=='PARAMETER') {
                varClass = 'parameter';
            } else {
                varClass = 'local';
            }
        }
        return {name: varName, varClass: varClass, type: varType, id: this.id};
    },
    
    bib_getVariableDefinition: function() {
        let definition = {
            name: this.getFieldValue('NAME'),
            type: this.getFieldValue('TYPE'),
            scope: this.mutationData.scope,
            kind: 'VARIABLE'
        };
        if (this.mutationData.scope=='function') definition.kind = this.getFieldValue('VARPAR');
        return definition;
    },
    
    bib_fireVariableDefinitionChange_: function() {
        let oldValue = 'TODO';
        let newValue = this.bib_getVariableDefinition();
        if (Blockly.Events.isEnabled()) {
            Blockly.Events.fire(new (Blockly.Events.get(Blockly.Events.BLOCK_CHANGE))(
                this, 'bib-variable-definition', '*', oldValue, newValue));
        }
    }
};



// *********************************
// *          GLOBALVAR DEFINITIONS
// *********************************
Blockly.Blocks['main_variables'] = {
    debug_out: Blockly.BIB.lib.DEBUG_OFF,
    
    init: function() {
        this.debug_out('init', this);

        Blockly.BIB.lib.initializeMutationData(this, {
            hasVariables: false
        });

        //console.log('*** INIT main_variables START', this);
        this.jsonInit({
            "message0": "%{BKY_BIB_VARIABLES_BLK_MAIN_START} %1",
            "args0": [
                {
                    "type": "input_dummy",
                    "name": "TITLE",
                },
            ],
            "style": "rblk_start_blocks",
            "tooltip": "",
            "helpUrl": "",
            "nextStatement": 'MAIN_LOOP'
        });
        this.getInput('TITLE').insertFieldAt(0, Blockly.BIB.lib.createButtonField('+', 'PLUS_VAR'), 'PLUS_VAR');
        //if (!this.isInFlyout) {
            this.adjustInputBlock_(false);
        //}
        this.onchange = Blockly.BIB.lib.EVENT_DISPATCHER;
        this.canStandAlone = true;
        this.setDeletable(false);
        //console.log('*** INIT main_variables END', this);
    },
    
    bib_getVariableScopeBlock: function() {
        return this;
    },
    
    bib_getAllVariableDefinitions: function() {
        let result = [];
        let conn = this.getInput('VARIABLES') && this.getInput('VARIABLES').connection;
        let block = conn && conn.targetBlock();
        while (block) {
            if (block.bib_getVariableDefinition) {
                let def = block.bib_getVariableDefinition();
                result.push(def);
            }
            block = block.nextConnection && block.nextConnection.targetBlock();
        }
        return result;
    },
    
    on_buttonClicked: function(arg) {
        //console.log('globalvar buttonClicked clicked!', arg);
        this.appendVariableDefinition_();
    },
    
    
    on_moveChild: function(e) {
        //console.log('*** main_variables on_moveChild', e);
        let conn = this.getInput('VARIABLES') && this.getInput('VARIABLES').connection;
        this.adjustInputBlock_(conn&&conn.isConnected());
    },
    
    
    
    appendVariableDefinitionInfo: function() {
        this.adjustInputBlock_(true);
        let conn = this.getInput('VARIABLES') && this.getInput('VARIABLES').connection;
        if (conn.targetBlock()) {
            return; // there is already a block!
        }
        Blockly.BIB.Variables.createVariableStartInfoBlock(this, conn);
    },
    
    
    
    appendVariableDefinition_: function() {
        this.adjustInputBlock_(true);
        let conn = this.getInput('VARIABLES') && this.getInput('VARIABLES').connection;
        
        // delete information block, if existing
        let first = conn.targetBlock();
        if (first && (first.type=='variable_start_info')) {
            first.dispose(true);
        }
        
        // goto last position
        while (conn.targetBlock()) {
            conn = conn.targetBlock().nextConnection;
        }
        let name = this.createNewVariableName('Number');
        if (name) {
            Blockly.BIB.Variables.createVariableDefinitionBlock(this, conn, name, 'global:variable', 'Number');
        }
    },
    
    symbolInUse: function(symbolName, ignoreBlock) {
        let block = this.getInputTargetBlock('VARIABLES');
        while (block) {
            let varName = block.getFieldValue('NAME');
            varName = Blockly.BIB.lib.normalizeSymbolname(varName);
            if ((block!=ignoreBlock) && (varName==symbolName)) return true;
            block = block.getNextBlock();
        }
        return false;
    },
    
    validateVariableName: function(name, ignoreBlock) {
        let symbol = Blockly.BIB.lib.normalizeSymbolname(name);
        if (!Blockly.Constants.SCB_Functions.CHECK_NEW_GLOBAL_SYMBOL(this.workspace, symbol, ignoreBlock, true)) return null;
        return name;
    },
    
    fillVariableArray: function(variables, type, name) {
        let conn = this.getInput('VARIABLES') && this.getInput('VARIABLES').connection;
        let block = conn && conn.targetBlock();
        while (block) {
            let def = block.getDefinition();
            if (((type==null) || (type===def.type)) && ((name==null) || (name===def.name))){
                variables.push(def);
            }
            block = block.nextConnection && block.nextConnection.targetBlock();
        }
    },
    
    
    createNewVariableName: function(type) {
        let basename = Blockly.BIB.lib.getDefaultVarnameBase(type);
        
        for (let i=1; i<1000; ++i) {
            let checkname = basename+i;
            checkname = this.validateVariableName(checkname, null);
            if (checkname) return checkname;
        }
        return null;
    },
    
    
    beforeMutationToDom: function() {
        const input = this.getInput('VARIABLES');
        const connection = input && input.connection;
        this.mutationData.hasVariables = !!(connection && connection.isConnected());
    },
    
    afterDomToMutation: function() {
        this.debug_out('afterDomToMutation', this.mutationData);
        this.adjustInputBlock_(this.mutationData.hasVariables);
    },
    
    adjustInputBlock_: function(hasVariables) {
        this.debug_out('adjustInputBlock_', hasVariables);
        
        if (hasVariables) {
            if (!this.getInput('VARIABLES')) this.appendStatementInput('VARIABLES').setCheck('VARDEF');
        } else {
            //let field = new Blockly.FieldImage(Blockly.BIB.Icons.ICON_GLOBE, 30, 30);
            if (this.getInput('VARIABLES')) this.removeInput('VARIABLES');
            //this.appendDummyInput('VARIABLES').appendField(field).setAlign(Blockly.constants.ALIGN.RIGHT).appendField('[noch keine]');
        }
    },
    
    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['help', 'comment', 'fold']);
    },

    
    bib_resolveVariable: function(name) {
        this.debug_out('bib_resolveVariable', name);
        let result = [];
        
        let conn = this.getInput('VARIABLES') && this.getInput('VARIABLES').connection;
        let block = conn && conn.targetBlock();
        while (block) {
            let def = block.bib_getVariableDefinition();
            if (def.name==name) {
                return block;
            }
            block = block.nextConnection && block.nextConnection.targetBlock();
        }
        return null;
    }
};


// *********************************
// *          VARIABLE CHANGE
// *********************************


Blockly.Blocks['variable_change'] = {
    init: function() {
        this.jsonInit({
            "message0": "%{BKY_BIB_VARIABLES_BLK_CHANGE}",
            "args0": [
                {
                    "type": "input_value",
                    "name": "VARIABLE",
                    "check": "VAR+Number"
                },
                {
                    "type": "input_value",
                    "name": "VALUE",
                    "check": "Number"
                }
            ],
            "inputsInline": true,
            "previousStatement": 'STATEMENT',
            "nextStatement": 'STATEMENT',
            "style": "rblk_variable_blocks",
            "tooltip": "",
            "helpUrl": ""
        });
        this.updateValueType_('Number');
    },
    
    updateValueType_: function(varType) {
        Blockly.Constants.SCB_Functions.CONNECT_OUTPUT_SHADOW(varType, this.getInput('VALUE'));
    },
    
    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help', 'comment', 'fold', 'deactivate'], null, false, this);
    },
    
};





// *********************************
// *          VARIABLE SET
// *********************************

/*
Blockly.Blocks['variable_set'] = {
    init: function() {
        
        Blockly.BIB.lib.initializeMutationData(this, {
            valueType: 'VOID'
        });

        
        this.jsonInit({
            "message0": "setze %1 auf %2",
            "args0": [
                {
                    "type": "input_value",
                    "name": "VARIABLE",
                    "check": "Variable"
                },
                {
                    "type": "input_value",
                    "name": "VALUE"
                }
            ],
            "inputsInline": true,
            "previousStatement": 'STATEMENT',
            "nextStatement": 'STATEMENT',
            "style": "rblk_variable_blocks",
            "tooltip": "",
            "helpUrl": ""
        });
        this.scb = {
            variableType: 'uninitialized',
            valueType: 'uninitialized'
        };
        
        this.onchange = Blockly.BIB.lib.EVENT_DISPATCHER;
        
        this.on_finishedLoading = this.updateTypes_;
        this.on_changeSelf = this.updateTypes_;
        this.on_moveChild = this.updateTypes_;
        this.on_changeRoot = this.updateTypes_;
        this.on_newRootBlock = this.updateTypes_;
        this.updateValueType_(null);
    },

    manualInitialize: function(varblock) {
        this.getInput('VARIABLE').connection.connect(varblock.outputConnection);
        this.initSvg();
        this.render();
    },
    
    calculateType_: function() {
        let variableBlock = this.getInputTargetBlock('VARIABLE');
        let valueBlock = this.getInputTargetBlock('VALUE');
        let types = [];
        if (valueBlock && valueBlock.isShadow()) valueBlock = null;
        if (variableBlock && variableBlock.isShadow()) variableBlock = null;

        if (variableBlock) {
            variableBlock.resolveVariable();
            if (variableBlock.scb.isBound) return variableBlock.scb.varType;
        }
        if (valueBlock && valueBlock.outputConnection) {
            let types = valueBlock.outputConnection.getCheck() || [];
            types = types.filter(function (s) { return !s.startsWith('Variable'); });
            return types.length?types[0]:null;
        }
        return null;
    },
    
    updateTypes_: function(_dummy) {
        let type = this.calculateType_();
        this.updateVariableType_(type);
        this.updateValueType_(type);
    },
    
    updateVariableType_: function(varType) {
        if (this.scb.variableType===varType) return;
        this.scb.variableType = varType;
        varType = 'Variable' + (varType?('+'+varType):'');
        console.log('VARIABLE SET updateVariableType_', varType);
        this.getInput('VARIABLE').setCheck(varType);
    },
        
    updateValueType_: function(varType) {
        if (!varType) varType = 'None';
        if (this.scb.valueType===varType) return;
        this.scb.valueType = varType;
        console.log('VARIABLE SET updateValueType_', varType);
        this.getInput('VALUE').connection.setShadowDom(null);
        Blockly.Constants.SCB_Functions.CONNECT_OUTPUT_SHADOW(varType, this.getInput('VALUE'));
    },
    
    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help', 'comment', 'fold', 'deactivate'], null, false, this);
    },
    
    beforeMutationToDom: function() {
        this.mutationData.valuetype = this.scb.valueType;
    },
    
    afterDomToMutation: function() {
        this.updateValueType_(this.mutationData.valuetype);
    },
    
};
*/



// *********************************
// *          VARIABLE SET DIRECT
// *********************************

Blockly.Blocks['variable_set_direct'] = {
    debug_out: Blockly.BIB.lib.DEBUG_OFF,
    
    init: function() {
        this.debug_out('init', this);
        
        Blockly.BIB.lib.initializeMutationData(this, {
            name: 'var',
            valueType: 'VOID'
        });
        
        this.jsonInit({
            "message0": "%{BKY_BIB_VARIABLES_BLK_SET_WRITE} %1",
            "args0": [
                {
                    "type": "input_value",
                    "name": "VALUE"
                }
            ],
            "previousStatement": 'STATEMENT',
            "nextStatement": 'STATEMENT',
            "style": "rblk_variable_blocks",
            "tooltip": "",
            "helpUrl": ""
        });
        
        this.getInput('VALUE').appendField(new Blockly.FieldDropdown(this.generateMenuItems_.bind(this)), 'NAME');
        if (!this.isInsertionMarker()) this.onchange = Blockly.BIB.lib.EVENT_DISPATCHER;
    },
    
    beforeMutationToDom: function() {
        this.debug_out('beforeMutationToDom');
    },
    
    afterDomToMutation: function() {
        this.debug_out('afterDomToMutation');
        this.bib_updateNameDropdown_(false);
        this.bib_updateVarName_();
    },
    
    generateMenuItems_: function() {
        this.debug_out('generateMenuItems_', this.mutationData);
        let valueBlock = this.getInputTargetBlock('VALUE');
        let strictType = !!valueBlock && !(valueBlock.isShadow());
        
        let vsb = this.bib_variableScopeBlock;
        let variables = [];
        if (vsb) {
            variables = vsb.bib_getAllVariableDefinitions();
        }
        
        let varname = this.mutationData.name;
        let valueType = this.mutationData.valueType;
        if (valueType=='VOID') strictType = false;
        let caption = varname;
        
        if (this.bib_variableScopeBlock && !this.bib_variableDefinitionBlock && !this.isInFlyout && !this.isInsertionMarker()) {
            //caption = '?? '+caption+' ??';
        }

        this.debug_out('generateMenuItems_', 'strictType', strictType, valueType);

        let options = [[caption, varname]];
        for (const variable of variables) {
            if (variable.name==varname) continue;
            if (strictType && valueType!=variable.type) continue;
            options.push([variable.name, variable.​​name]);
        }
        this.debug_out('generateMenuItems_', 'menu items:', options);
        return options;
    },
    
    manualInitialize: function(name, type) {
        this.initSvg();
        this.render();
        this.mutationData.name = name;
        //this.mutationData.valueType = type;
        this.bib_updateNameDropdown_(true);
        this.bib_updateVarName_();
        this.bib_updateValueType_(type);
    },
    
    bib_onBlockChange: function(event) {
        if (this.bib_variableDefinitionBlock && (event.blockId == this.bib_variableDefinitionBlock.id) && (event.element == 'bib-variable-definition')) {
            this.debug_out('bib_onBlockChange', 'change variableDefinitionBlock', event);
            this.bib_setVariableProperties_(event.newValue);
        }
        if (event.blockId == this.id) {
            if ((event.element=='field') && (event.name == 'NAME')) {
                this.debug_out('bib_onBlockChange', 'change self <field:NAME>', event);
                this.mutationData.name = event.newValue;
                this.bib_resolveVariable();
            }
        }
    },
    
    bib_onBlockDelete: function(event) {
        if (this.bib_variableDefinitionBlock && (event.blockId == this.bib_variableDefinitionBlock.id)) {
            this.bib_resolveVariable();
        }
    },

    bib_onFinishedLoading: function(event) {
        this.debug_out('bib_onFinishedLoading');
        this.bib_rootBlockChanged_();
    },
    
    bib_onBlockParentMove: function(event) {
        this.debug_out('bib_onBlockParentMove', 'BEGIN');
        this.bib_rootBlockChanged_();
        this.debug_out('bib_onBlockParentMove', 'END');
    },
    
    bib_onBlockParentPlugIn: function(event) {
        this.debug_out('bib_onBlockParentPlug', 'BEGIN');
        this.bib_rootBlockChanged_();
        this.debug_out('bib_onBlockParentPlug', 'END');
    },
        
    bib_rootBlockChanged_: function() {
        if (this.isInsertionMarker()) {
            this.debug_out('bib_rootBlockChanged_', 'isInsertionMarker()==true');
            return;
        }
        this.debug_out('bib_rootBlockChanged_');
        
        let newRoot = this.getRootBlock();
        Blockly.Events.disable();
        if (newRoot.bib_getVariableScopeBlock) {
            let newVariableScopeBlock = newRoot.bib_getVariableScopeBlock();
            if (this.bib_variableScopeBlock != newVariableScopeBlock) {
                this.bib_variableScopeBlock = newVariableScopeBlock;
                this.debug_out('bib_rootBlockChanged_', 'new variableScopeBlock.id', newVariableScopeBlock.id);
                this.bib_resolveVariable();
            }
        } else {
            if (this.bib_variableScopeBlock != null) {
                this.bib_variableScopeBlock = null;
                this.debug_out('bib_rootBlockChanged_', 'new variableScopeBlock = NULL');
                this.bib_resolveVariable();
            }
        }
        this.bib_updateNameDropdown_(true);
        this.bib_updateVarName_();
        this.markDirty();
        Blockly.Events.enable();
    },
    
    bib_updateNameDropdown_: function(forceRender) {
        let nameField=this.getField('NAME');
        nameField.getOptions(false);
        nameField.setValue(this.mutationData.name);
        if (forceRender) nameField.forceRerender();
    },
    
    bib_setVariableProperties_: function(data) {
        this.debug_out('bib_setVariableProperties_', data);
        try {
            Blockly.Events.disable();
            if (data) {
                this.debug_out('bib_setVariableProperties_', '### VALID VARIABLE!');
                this.mutationData.name = data.name;
                this.bib_updateNameDropdown_(true);
                this.bib_updateVarName_();
                this.bib_updateValueType_(data.type);
            } else {
                this.debug_out('bib_setVariableProperties_', '### INVALID VARIABLE!');
                this.bib_updateNameDropdown_(true);
                this.bib_updateVarName_();
            }
        } finally {
            Blockly.Events.enable();
        }
    },
    
    bib_resolveVariable: function() {
        this.debug_out('bib_resolveVariable');
        if (this.bib_variableScopeBlock) {
            let name = this.getFieldValue('NAME');
            let varDef = this.bib_variableScopeBlock.bib_resolveVariable(name);
            this.bib_variableDefinitionBlock = varDef;
            if (varDef) {
                this.bib_setVariableProperties_(varDef.bib_getVariableDefinition());
            } else {
                this.bib_setVariableProperties_(null);
            }
        }
        this.getField('NAME').markDirty();
    },
    
    bib_updateValueType_: function(varType) {
        this.debug_out('bib_updateValueType_', varType);
        let valueInput = this.getInput('VALUE');
        
        if (!varType) varType = 'VOID';
        //if (this.mutationData.valueType===varType) return;
        this.mutationData.valueType = varType;
        
        
        Blockly.BIB.lib.configureShadowBlock(valueInput, varType, false);
        
        //valueInput.connection.setShadowDom(null);
        //Blockly.Constants.SCB_Functions.CONNECT_OUTPUT_SHADOW(varType, valueInput);
        //if (varType=='VOID') varType=null;
        //valueInput.setCheck(varType);
    },
    
    bib_updateVarName_: function() {
        let caption = this.mutationData.name;
        const invalid = this.bib_variableScopeBlock && !this.bib_variableDefinitionBlock && !this.isInFlyout;
        if (invalid) {
            const msg = Blockly.BIB.TXT('%{BIB_VARIABLE_CONTEXT_ERROR}', caption);
            this.setWarningText(msg);
            this.setEnabled(false);
        } else {
            this.setWarningText(null);
            this.setEnabled(true);
        }
        
        this.debug_out('bib_updateVarName_', caption);
    },
    
    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help', 'comment', 'fold', 'deactivate'], null, false, this);
    },
    
};




// *********************************
// *          VARIABLE VALUE
// *********************************

Blockly.Blocks['variable_value'] = {
    debug_out: Blockly.BIB.lib.DEBUG_OFF,
    
    init: function() {
        this.debug_out('init', this);
        
        Blockly.BIB.lib.initializeMutationData(this, {
            name: 'var',
            valueType: 'VOID'
        });
        
        this.jsonInit({
            "message0": "%1",
            "args0": [
                {
                    "type": "field_label",
                    "name": "NAME",
                    "text": "variable name"
                }
            ],
            "output": null,
            "style": "rblk_variable_blocks",
            "tooltip": "",
            "helpUrl": ""
        });
        this.scb = {
            varName: null,
            varType: null,
            isBound: false,
            observedBlockIds: [null]
        };
        
        if (!this.isInsertionMarker()) this.onchange = Blockly.BIB.lib.EVENT_DISPATCHER;
    },
    
    customContextMenu: function(menuitems) {
        if (this.isInFlyout) return [];
        
        let outputBlock = this.outputConnection.targetBlock();
        let strictType = !!outputBlock;
        
        let vsb = this.bib_variableScopeBlock;
        let variables = [];
        if (vsb) {
            variables = vsb.bib_getAllVariableDefinitions();
        }
        
        let varname = this.mutationData.name;
        let valueType = this.mutationData.valueType;
        if (valueType=='VOID') strictType = false;

        this.debug_out('generateMenuItems_', 'strictType', strictType, valueType);

        let customItems = [{text: '?? '+varname+' ?? (ungültig)', enabled: 'true', callback: this.setVariableName_.bind(this, null, null), scope: this, weight: 2}];
        for (const variable of variables) {
            let item = {text: variable.name+' ('+variable.scope+')', enabled: 'true', callback: this.setVariableName_.bind(this, variable.name, variable.type), scope: this, weight: 2};
            if (strictType && valueType!=variable.type) continue;
            if (variable.name==varname) customItems[0]=item; else customItems.push(item);
        }
        this.debug_out('generateMenuItems_', 'customItems:', customItems);
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['comment', 'help'], customItems, true, this);
    },
    
    setVariableName_: function(varname, vartype) {
        this.debug_out('setVariableName_', varname, vartype);
        if (varname) {
            this.mutationData.name = varname;
            this.mutationData.valueType = vartype;
            this.bib_resolveVariable();
            this.bib_updateVarName_();
            this.bib_updateValueType_();
        }
    },
    
    manualInitialize: function(name, type) {
        this.initSvg();
        this.render();
        this.mutationData.name = name;
        this.mutationData.valueType = type;
        this.bib_updateVarName_();
        this.bib_updateValueType_();
    },

    bib_onBlockChange: function(event) {
        if (this.bib_variableDefinitionBlock && (event.blockId == this.bib_variableDefinitionBlock.id) && (event.element == 'bib-variable-definition')) {
            //console.log('*** variable_value::bib_onBlockChange - change variableDefinitionBlock', event);
            this.bib_setVariableProperties_(event.newValue);
        }
    },
    
    bib_onBlockDelete: function(event) {
        if (this.bib_variableDefinitionBlock && (event.blockId == this.bib_variableDefinitionBlock.id)) {
            this.bib_resolveVariable();
        }
    },

    bib_onFinishedLoading: function(event) {
        this.debug_out('bib_onFinishedLoading');
        this.bib_rootBlockChanged_();
    },
    
    bib_onBlockParentMove: function(event) {
        this.debug_out('bib_onBlockParentMove', event);
        this.bib_rootBlockChanged_();
        this.debug_out('bib_onBlockParentMove', 'END');
    },
    
    bib_onBlockParentPlugIn: function(event) {
        this.debug_out('bib_onBlockParentPlugIn', 'BEGIN', event);
        this.bib_rootBlockChanged_();
        this.debug_out('bib_onBlockParentPlugIn', 'END');
    },
    
    bib_rootBlockChanged_: function() {
        let newRoot = this.getRootBlock();
        this.debug_out('bib_rootBlockChanged_', newRoot);
        Blockly.Events.disable();
        if (newRoot.bib_getVariableScopeBlock) {
            let newVariableScopeBlock = newRoot.bib_getVariableScopeBlock();
            if (this.bib_variableScopeBlock != newVariableScopeBlock) {
                this.bib_variableScopeBlock = newVariableScopeBlock;
                //console.log('new variable scope - variableScopeBlock.id:', newVariableScopeBlock.id);
                this.bib_resolveVariable();
            }
        } else {
            if (this.bib_variableScopeBlock != null) {
                this.bib_variableScopeBlock = null;
                //console.log('new variable scope - variableScopeBlock = NULL');
                this.bib_resolveVariable();
            }
        }
        this.bib_updateVarName_();
        Blockly.Events.enable();
    },
    
    bib_setVariableProperties_: function(data) {
        this.debug_out('bib_setVariableProperties_', data);
        try {
            Blockly.Events.disable();
            if (data) {
                this.debug_out('bib_setVariableProperties_', '### VALID VARIABLE!');
                this.mutationData.name = data.name;
                this.mutationData.valueType = data.type;
                this.bib_updateVarName_();
                this.bib_updateValueType_();
                this.getField('NAME').forceRerender();
            } else {
                this.debug_out('bib_setVariableProperties_', '### INVALID VARIABLE!');
                this.bib_updateVarName_();
                this.getField('NAME').forceRerender();
            }
        } finally {
            Blockly.Events.enable();
        }
    },
        
    bib_resolveVariable: function() {
        this.debug_out('bib_resolveVariable');
        if (this.bib_variableScopeBlock) {
            let name = this.mutationData.name;
            let varDef = this.bib_variableScopeBlock.bib_resolveVariable(name);
            this.bib_variableDefinitionBlock = varDef;
            if (varDef) {
                this.bib_setVariableProperties_(varDef.bib_getVariableDefinition());
            } else {
                this.bib_setVariableProperties_(null);
            }
        }
        //this.getField('NAME').markDirty();
    },
    
    beforeMutationToDom: function() {
        this.debug_out('beforeMutationToDom');
        
    },
    
    afterDomToMutation: function() {
        this.debug_out('afterDomToMutation');
        this.bib_updateVarName_();
        this.bib_updateValueType_();
    },
    
    bib_updateVarName_: function() {
        let caption = this.mutationData.name;
        const invalid = this.bib_variableScopeBlock && !this.bib_variableDefinitionBlock && !this.isInFlyout;
        if (invalid) {
            const msg = Blockly.BIB.TXT('%{BIB_VARIABLE_CONTEXT_ERROR}', caption);
            this.setWarningText(msg);
            //caption = caption+' ??';
            this.setEnabled(false);
        } else {
            this.setWarningText(null);
            this.setEnabled(true);
        }
        
        this.debug_out('bib_updateVarName_', caption);
        let nameField = this.getField('NAME');

        nameField.setValue(caption);
        //nameField.invalidate();
        //this.setFieldValue(caption, 'NAME');
    },

    bib_updateValueType_: function() {
        let valueType = this.mutationData.valueType;
        this.debug_out('bib_updateValueType_', valueType);
        this.outputConnection.setCheck([valueType, 'VAR', 'VAR+'+valueType]);
    },
    
};




// *********************************
// *          VARIABLE INFO
// *********************************

Blockly.Blocks['variable_start_info'] = {
    init: function() {
        this.jsonInit({
            "nextStatement": "VARDEF",
            "previousStatement": "VARDEF",
            "style": "rblk_variable_blocks",
            "tooltip": "",
            "helpUrl": ""
        });
        this.appendDummyInput()
                .appendField(Blockly.BIB.TXT("%{BIB_VARIABLES_START_INFO1}"));
        this.appendDummyInput()
                .appendField(Blockly.BIB.TXT("%{BIB_VARIABLES_START_INFO2}"));
        this.appendDummyInput()
                .appendField(Blockly.BIB.lib.createButtonField('-', 'MINUS'), 'MINUS')
                .appendField(Blockly.BIB.TXT("%{BIB_VARIABLES_START_INFO3}"));
    },
    
    on_buttonClicked: function(arg) {
        // MINUS button was clicked
        setTimeout(function(block){
            block.dispose(true);
        }, 10, this);
    },
}




// *********************************
// *          GLOBALS
// *********************************

Blockly.BIB.Variables.getGlobalsBlock = function(workspace) {
    let blocks = workspace.getBlocksByType('main_variables', false);
    return blocks[0];
}

Blockly.BIB.Variables.createVariableStartInfoBlock = function(block, connection) {
    let newBlock = block.workspace.newBlock('variable_start_info');
    newBlock.previousConnection.connect(connection);
    newBlock.initSvg();
    if (block.rendered) {
        newBlock.render();
    }
    return newBlock;
}



Blockly.BIB.Variables.createVariableDefinitionBlock = function(block, connection, name, scope, type) {
    let newBlock = block.workspace.newBlock('variable_definition');
    newBlock.previousConnection.connect(connection);
    newBlock.manualInitialize(scope, type, name);
    newBlock.initSvg();
    if (block.rendered) {
        newBlock.render();
    }
    if (scope=='function:variable') newBlock.toggleInitValue(true);
    if (scope=='global:variable') newBlock.toggleInitValue(true);
    return newBlock;
}



Blockly.BIB.Variables.toolboxCategoryCallback = function(workspace) {
    const XML_NODE = Blockly.BIB.XML_NODE;

    let varCount = 0;
    let blocks = [];
    let definitions = [];
    let globalBlock = Blockly.BIB.Variables.getGlobalsBlock(workspace);
    if (globalBlock) definitions = globalBlock.bib_getAllVariableDefinitions();
    
    if (definitions.length) {
        blocks.push(XML_NODE('label', {'text':['%{BIB_VARIABLES_GLOBAL_VARIABLES}'], 'web-class':'myLabelStyle'}));
        let first = definitions[0];
        blocks.push(XML_NODE('block', {'type':'variable_set_direct', 'gap':16}, [ 
            XML_NODE('mutation', {'valueType':first.type, 'name':first.name}),
            XML_NODE('field', {'name':"NAME"}, first.name)
        ]));

        for (let vardef of definitions) {
            blocks.push(XML_NODE('block', {'type':'variable_value', 'gap':16}, [ 
                XML_NODE('mutation', {'valueType':vardef.type, 'name':vardef.name})
            ]));
            varCount++;
        }
    }

    let functionBlocks = Blockly.BIB.Functions.getFunctionBlocks(workspace);

    for (let functionBlock of functionBlocks) {
        let fnName = functionBlock.getFunctionName_();
        definitions = functionBlock.bib_getAllVariableDefinitions();
        if (definitions.length) {
            blocks.push(XML_NODE('label', {'text':['%{BIB_VARIABLES_FUNCTION_FNNAME}', fnName], 'web-class':'myLabelStyle'}));
            let first = definitions[0];
            blocks.push(XML_NODE('block', {'type':'variable_set_direct', 'gap':16}, [ 
                XML_NODE('mutation', {'valueType':first.type, 'name':first.name}),
                XML_NODE('field', {'name':"NAME"}, first.name)
            ]));
            for (let vardef of definitions) {
                blocks.push(XML_NODE('block', {'type':'variable_value', 'gap':16}, [ 
                    XML_NODE('mutation', {'valueType':vardef.type, 'name':vardef.name})
                ]));
                varCount++;
            }
        }
    }
    
    if (varCount == 0) {
        blocks.push(XML_NODE('label', {'text':['%{BIB_VARIABLES_NO_VARS_DEFINED}'], 'web-class':'myLabelStyle'}));
        blocks.push(XML_NODE('button', {'text':['%{BIB_VARIABLES_CREATE_VAR}'], 'callbackKey':'BIB_VARIABLES_BUTTON_PRESSED'}));
    } else {
        blocks.push(XML_NODE('label', {'text':['%{BIB_VARIABLES_GENERAL}'], 'web-class':'myLabelStyle'}));
        blocks.push(XML_NODE('block', {'type':'variable_change', 'gap':16}, [ 
            XML_NODE('value', {'name':'VARIABLE'}, [
                XML_NODE('shadow', {'type':"shadow-no-Variable"})
            ]),
        ]));
    }
    
    // generate List
    var xmlList = [];
    for (let block of blocks) {
        //block = block.replace('<block', '<block xmlns="https://developers.google.com/blockly/xml"');
        xmlList.push(Blockly.Xml.textToDom(block));
    }
    return xmlList;
}

Blockly.BIB.Variables.variableInfoButtonClick = function(button) {
    let workspace = button.getTargetWorkspace();
    //console.log('button clicked!', button, workspace);
    let globals = Blockly.BIB.Variables.getGlobalsBlock(workspace);
    if (globals) globals.appendVariableDefinitionInfo();
    Blockly.hideChaff();
}

Blockly.BIB.Variables.register = function(workspace) {
    workspace.registerToolboxCategoryCallback('BIB_VARIABLES', Blockly.BIB.Variables.toolboxCategoryCallback);
    workspace.registerButtonCallback("BIB_VARIABLES_BUTTON_PRESSED", Blockly.BIB.Variables.variableInfoButtonClick);
}
