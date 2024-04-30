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
 * @fileoverview Function blocks for Blockly.
 * @author nils@bob3.org (Nils Springob)
 */
'use strict';

goog.provide('Blockly.Constants.SCB_Functions');
goog.provide('Blockly.BIB.Functions');

goog.require('Blockly');
goog.require('Blockly.Blocks');
goog.require('Blockly.FieldDropdown');
goog.require('Blockly.FieldImage');
goog.require('Blockly.FieldMultilineInput');
goog.require('Blockly.FieldTextInput');
goog.require('Blockly.FieldVariable');
goog.require('Blockly.Mutator');


// *********************************
// *          MAIN LOOP
// *********************************


Blockly.Blocks['main_loop'] = {
    debug_out: Blockly.BIB.lib.DEBUG_OFF,
    
    init: function() {
        this.debug_out('init', this);
        this.jsonInit({
            "message0": "%{BKY_BIB_FUNCTIONS_BLK_MAIN0}",
            "args0": [{
                "type": "input_dummy",
            }],
            "message1": "%{BKY_BIB_FUNCTIONS_BLK_MAIN1}",
            "args1": [
                {
                    "type": "input_statement",
                    "name": "DO",
                    "check": "STATEMENT"
                }
            ],
            "previousStatement": "MAIN_LOOP",
            "style": "rblk_start_blocks",
            "tooltip": "",
            "helpUrl": ""
        });
        this.onchange = Blockly.BIB.lib.EVENT_DISPATCHER;
        
        this.on_finishedLoading = this.updateTypes_;
        this.on_changeSelf = this.updateTypes_;
        this.on_moveChild = this.updateTypes_;
        this.on_changeRoot = this.updateTypes_;
        this.on_newRootBlock = this.updateTypes_;
        this.setDeletable(false);
        this.setMovable(false);
        //console.log('*** INIT main_loop END', this);
    },

    bib_getVariableScopeBlock: function() {
        return this.getPreviousBlock();
    },
    
    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['help', 'comment', 'fold']);
    },
    
    
};



// *********************************
// *          FUNCTION DEFINITION
// *********************************

Blockly.Blocks['function_definition'] = {
    debug_out: Blockly.BIB.lib.DEBUG_OFF,
    
    init: function() {
        this.debug_out('init', this);
        
        Blockly.BIB.lib.initializeMutationData(this, {
            variables: false,
            hideResult: true,
            staticFunction: false,
            resultType: 'VOID'
        });

        this.jsonInit({
            "nextStatement": 'STATEMENT',
            "style": "rblk_function_blocks",
            "tooltip": "",
            "helpUrl": ""
        });
        
        this.returnTypes_ = [
            ["Farbe", "Color"],
            ["Zahl", "Number"],
            ["Wahrheit", "Boolean"],
        ];
        
        this.scb = {
            variables: 0,
            resultType: 'VOID'
        }
        
        this.appendDummyInput('HEAD')
            .appendField(Blockly.BIB.lib.createButtonField('+', 'PLUS_VAR'), 'PLUS_VAR')
            .appendField(Blockly.BIB.TXT('%{BIB_FUNCTIONS_FUNCTION}'), 'NAME_LABEL')
            .appendField(new Blockly.FieldTextInput(Blockly.Msg['PROCEDURES_DEFNORETURN_PROCEDURE']), 'NAME');
        
        if (!this.isInFlyout) this.setFieldValue(Blockly.Constants.SCB_Functions.CREATE_NEW_GLOBAL_SYMBOL(this.workspace, 'funktion'), 'NAME');
        
        this.onchange = Blockly.BIB.lib.EVENT_DISPATCHER;
        this.canStandAlone = true;
        this.isProcedureHead = true;
        this.updateShape_();
        this.getField('NAME').setValidator(this.onValidateName_);
        this.debug_out('init', 'END');
    },
    
    bib_getAllVariableDefinitions: function() {
        let localVars = [];
        let conn = this.getInput('VARIABLES') && this.getInput('VARIABLES').connection;
        let block = conn && conn.targetBlock();
        while (block) {
            let def = block.bib_getVariableDefinition();
            localVars.push(def);
            block = block.nextConnection && block.nextConnection.targetBlock();
        }
        
        let globalVars = [];
        // and global Vars:
        let globalBlock = Blockly.BIB.Variables.getGlobalsBlock(this.workspace);
        if (globalBlock) {
            globalVars = globalBlock.bib_getAllVariableDefinitions();
        }
        
        return localVars.concat(globalVars);
    },
    
    bib_getVariableScopeBlock: function() {
        return this;
    },
    
    createNewFunctionCallBlock_: function() {
        var block = this.workspace.newBlock('function_call');
        block.manualInitialize(this.getFunctionName_());
        Blockly.BIB.lib.moveBlockRelativeTo(block, this, 400, 0, true);
    },

    createNewReturnBlock_: function() {
        var block = this.workspace.newBlock('function_return');
        block.manualInitialize(this.getFunctionResultType_());
        Blockly.BIB.lib.moveBlockRelativeTo(block, this, 400, 0, true);
    },
    
    
    doToggleResult_: function(val) {
        this.scb.resultType = val?'Number':'VOID';
        this.updateShape_();
    },
    
    onMenuItemHideSystemBlock_ : function() {
        //console.log('onMenuItemHideSystemBlock_');
        this.dispose(false);
    },

    onMenuItemShowSystemBlock_ : function(staticFunction) {
        //console.log('onMenuItemShowSystemBlock_ '+type);
        //let block = '<block type="function_definition" x="'+xpos+'" y="100"><mutation variables="0" hideResult="true" staticFunction="'+type+'"><\/mutation><\/block>';
        const XML_NODE = Blockly.BIB.XML_NODE;
        let xpos = (staticFunction=='setup')?200:700;
        let block = XML_NODE('block', {'type':'function_definition', 'x':xpos, 'y':100}, [ 
            XML_NODE('mutation', {'variables':0, 'hideResult':true, 'staticFunction':staticFunction})
        ]);
        Blockly.Constants.SCB_Functions.APPEND_BLOCK_TO_WORKSPACE(this.workspace, block);
    },


    
    customContextMenu: function(menuitems) {
        const TXT = Blockly.BIB.TXT;
        let customItems = [];
        customItems.push({text: TXT('%{BIB_FUNCTIONS_CMENU_CREATE_CALL_BLOCK}'), enabled: 'true', callback: function(scope) {scope.createNewFunctionCallBlock_();}, scope: this, weight: 2});
        
        if (this.scb.resultType=='VOID') {
            customItems.push({text: TXT('%{BIB_FUNCTIONS_CMENU_WITH_RETURN}'), enabled: 'true', callback: function(scope) {scope.doToggleResult_(true);}, scope: this, weight: 2});
        } else {
            customItems.push({text: TXT('%{BIB_FUNCTIONS_CMENU_CREATE_RETURN_BLOCK}'), enabled: 'true', callback: function(scope) {scope.createNewReturnBlock_();}, scope: this, weight: 2});
            customItems.push({text: TXT('%{BIB_FUNCTIONS_CMENU_WITHOUT_RETURN}'), enabled: 'true', callback: function(scope) {scope.doToggleResult_(false);}, scope: this, weight: 2});
        }
        
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['fold', 'comment', 'help', 'delete', 'comment'], customItems, true, this);
    },
    
    
    on_buttonClicked: function(arg) {
        //console.log('function buttonClicked clicked!', arg);
        if (arg=='PLUS_VAR') {
            this.scb.variables++;
            this.updateShape_();
            this.appendVariableDefinition_();
        }
    },
    
    
    on_moveChild: function(e) {
        //console.log('FUNCTION DEFINITION on_moveChild', e);
        if (this.updateBlockCount_()) {
            this.updateShape_();
        }
    },
    
    on_changeSelf: function(e) {
        this.debug_out('on_changeSelf', e);
        if ((e.element=="field") && (e.name=='RTYPE')) {
            this.debug_out('***', e.oldValue, e.newValue);
            this.updateShape_();
        }
    },

    
    appendVariableDefinition_: function() {
        let connection = this.getInput('VARIABLES').connection;
        while (connection.targetBlock()) {
            connection = connection.targetBlock().nextConnection;
        }
        let name = this.createNewVariableName('Number');
        if (name) {
            Blockly.BIB.Variables.createVariableDefinitionBlock(this, connection, name, 'function:parameter', 'Number');
        }
    },
    
    symbolInUse: function(symbolName, ignoreBlock, checkDeep) {
        if (this!=ignoreBlock) {
            let fnName = Blockly.BIB.lib.normalizeSymbolname(this.getFunctionName_());
            if (fnName==symbolName) return true;
        }
        if (!checkDeep) return false;
        let block = this.getInputTargetBlock('VARIABLES');
        while (block) {
            let varName = block.getFieldValue('NAME');
            varName = Blockly.BIB.lib.normalizeSymbolname(varName);
            if ((block!=ignoreBlock) && (varName==symbolName)) return true;
            block = block.getNextBlock();
        }
        return false;
    },
    
    onValidateName_: function(name) {
        if (this.isInFlyout) return;
        let block = this.getSourceBlock();
        let symbolName = Blockly.BIB.lib.normalizeSymbolname(name);
        if (!Blockly.Constants.SCB_Functions.CHECK_NEW_GLOBAL_SYMBOL(block.workspace, symbolName, block)) return null;
    },
    
    validateVariableName: function(name, ignoreBlock, checkFunctions) {
        name = name.trim();
        let symbolName = Blockly.BIB.lib.normalizeSymbolname(name);
        if (!Blockly.Constants.SCB_Functions.CHECK_NEW_GLOBAL_SYMBOL(this.workspace, symbolName, ignoreBlock)) return null;
        if (this.symbolInUse(symbolName, ignoreBlock, true)) return null;
        return name;
    },
    
    fillVariableArray: function(variables, type, name) {
        let block = this.getInputTargetBlock('VARIABLES');
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
        this.updateBlockCount_();
        this.mutationData.variables = this.scb.variables?this.scb.variables:0;
        this.mutationData.hideResult = this.scb.hideResult;
        this.mutationData.staticFunction = this.scb.staticFunction;
        this.mutationData.resultType = this.getFunctionResultType_();
    },
    
    afterDomToMutation: function() {
        let variables = this.mutationData.variables;
        let resultType = this.mutationData.resultType;
        let hideResult = this.mutationData.hideResult || (resultType=='VOID');
        let staticFunction = this.mutationData.staticFunction;
        
        if (this.updateShapeStatus_(variables, hideResult, staticFunction, resultType)) this.updateShape_();
        if (resultType!='VOID') {
            this.debug_out('afterDomToMutation', '*** ***', resultType);
            this.setFieldValue(resultType, 'RTYPE');
            this.updateShape_();
        }
    },
    
    updateShapeStatus_: function(variables, hideResult, staticFunction, resultType) {
        if (variables===undefined) variables=this.scb.variables;
        if (hideResult===undefined) hideResult=this.scb.hideResult;
        if (staticFunction===undefined) staticFunction=this.scb.staticFunction;
        if (resultType===undefined) resultType=this.scb.resultType;
        
        let needsUpdate =
               (variables!=this.scb.variables)
            || (hideResult!=this.scb.hideResult)
            || (staticFunction!=this.scb.staticFunction)
            || (resultType!=this.scb.resultType)
            ;
        this.scb.variables = variables;
        this.scb.hideResult = hideResult;
        this.scb.staticFunction = staticFunction;
        this.scb.resultType = resultType;
        return needsUpdate;
    },

    updateBlockCount_: function() {
        let variables = 0;
        for (let block = this.getInputTargetBlock('VARIABLES'); block; block = block.getNextBlock()) variables++;
        return this.updateShapeStatus_(variables);
    },
    
    updateShape_: function() {
        this.debug_out('updateShape_', this);
        
        let variables = this.scb.variables;
        let hideResult = this.scb.hideResult;
        let resultType = this.scb.resultType;
        let staticFunction = false;
        //console.log(variables);
        
        let needUpdate = false;
        needUpdate |= ( !this.getInput('LINE2') );
        needUpdate |= ( (variables==0) && (this.getInput('LINE3')) );
        needUpdate |= ( (variables>0) == (this.getInput('VARIABLES')==null) );
        needUpdate |= ( hideResult == (this.getField('RTYPE')!=null) );
        
        if (!needUpdate) return;

        if (this.scb.updatingShape) return;
        this.scb.updatingShape = true;

        //console.log('FUNCTION DEFINITION updateShape_ ****');
        
        //let headInput = this.getInput('HEAD');
        
        this.removeInput('LINE2', true);
        this.removeInput('LINE3', true);
        
        if (variables==0) {
            this.removeInput('VARIABLES', true);
        } else if (!this.getInput('VARIABLES')) {
            let input = this.appendStatementInput('VARIABLES');
            input.connection.setCheck('VARDEF');
        }
        
        if (!this.getInput('DO')) {
            this.appendStatementInput('DO').setCheck('STATEMENT');
        }
        
        if (resultType=='VOID') {
            this.removeInput('RESULT', true);
        } else if (!this.getField('RTYPE')) {
            this.appendValueInput('RESULT')
                    .appendField(Blockly.BIB.TXT('%{BIB_FUNCTIONS_RETURN_VALUE} '), 'RTYPE_LABEL')
                    .appendField(new Blockly.FieldDropdown(this.returnTypes_), 'RTYPE');
        }
        if (this.getInput('RESULT')) {
            resultType = this.getFunctionResultType_();
            //console.log('***', resultType);
            if (!this.isInFlyout) Blockly.BIB.lib.configureShadowBlock(this.getInput('RESULT'), this.getFunctionResultType_(), false);
        }
        
        this.setNextStatement(false);
        
        Blockly.BIB.lib.sortBlockInputs(this, ['HEAD', 'LINE2', 'VARIABLES', 'LINE3', 'DO', 'LOOP']);
        this.scb.updatingShape = false;
        
        this.debug_out('updateShape_', 'END', this);
        this.sendChangeEvent();
    },
    
    
    getFunctionCallXml: function() { 
        const XML_NODE = Blockly.BIB.XML_NODE;
        let sig = this.getFunctionSignature();
        this.debug_out('getFunctionCallXml', 'SIGNATURE', sig);
        
        let res = XML_NODE('block', {'type':'function_call', 'gap':16}, [ 
            XML_NODE('mutation', {'result':sig.result, 'parameters':sig.parameters.length}),
            XML_NODE('field', {'name':"NAME"}, sig.name)
        ]);
        
        this.debug_out('getFunctionCallXml', res);
        return res;
    },

    getFunctionResultType_: function() {
        return this.getFieldValue('RTYPE')||'VOID';
    },

    getFunctionName_: function() {
        return this.scb.staticFunction || this.getFieldValue('NAME');
    },
    
    getFunctionSignature: function() {
        let result = {'result': this.getFieldValue('RTYPE')||'VOID', 'name': this.getFunctionName_()};
        let parameters = [];
        let block = this.getInputTargetBlock('VARIABLES');
        while (block) {
            if (block.getFieldValue('VARPAR') == "PARAMETER") {
                parameters.push(block.getFieldValue('TYPE'));
            }
            block = block.getNextBlock();
        }
        result.parameters = parameters;
        return result;
    },
    
    getFunctionBlockIDs: function() {
        let result = [this.id];
        let block = this.getInputTargetBlock('VARIABLES');
        while (block) {
            result.push(block.id);
            block = block.getNextBlock();
        }
        return result;
    },
    
    sendChangeEvent: function() {
        let newValue = this.getFunctionSignature();
        let oldValue = 'TODO';
        if (Blockly.Events.isEnabled()) {
            Blockly.Events.fire(new (Blockly.Events.get(Blockly.Events.BLOCK_CHANGE))(
                this, 'function', 'signature', oldValue, newValue));
        }
    },
    
    bib_resolveVariable: function(name) {
        //console.log('function_definition::bib_resolveVariable', name);
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
        
        let globalBlock = this.workspace.getBlocksByType('main_variables')[0];
        if (globalBlock) return globalBlock.bib_resolveVariable(name);
        
        return null;
    }
};


// *********************************
// *          FUNCTION CALL
// *********************************


Blockly.Blocks['function_call'] = {
    debug_out: Blockly.BIB.lib.DEBUG_OFF,
    
    init: function() {
        this.debug_out('init', this);

        Blockly.BIB.lib.initializeMutationData(this, {
            result: 'VOID',
            parameters: 0
        });
        
        this.jsonInit({
            "inputsInline": true,
            "style": "rblk_function_blocks",
            "tooltip": "",
            "helpUrl": ""
        });
        this.scb = {};
        this.scb.parameters = 0;
        this.scb.result = 'VOID';
        
        this.onchange = Blockly.BIB.lib.EVENT_DISPATCHER;

        this.on_finishedLoading = this.resolveFunction_;
        //this.on_changeSelf = this.resolveFunction_;
        this.on_moveChild = this.resolveFunction_;
        this.on_changeRoot = this.resolveFunction_;
        this.on_newRootBlock = this.resolveFunction_;
        this.on_changeObserved = this.resolveFunction_;
        this.on_deleteObserved = this.resolveFunction_;
        
        this.resolveFunction_();
        this.updateShape_();
        
    },
    
    updateTypes_: function(parameterTypes) {
        let i = 0;
        for (let pt of parameterTypes) {
            let input = this.getInput('INPUT'+i);
            //input.setCheck(pt);
            Blockly.Constants.SCB_Functions.CONNECT_OUTPUT_SHADOW(pt, input);
            i++;
        }
        
    },
    
    resolveFunction_: function(event) {
        if (event && event.type=='change' && this.scb.observedBlockIds && (event.blockId==this.scb.observedBlockIds[0]) && event.element=='field' && event.name=='NAME' ) {
            //console.log('resolveFunction_ CHANGE NAME', event);
            this.setFieldValue(event.newValue, 'NAME');
            return;
        }
        let defBlock = Blockly.Constants.SCB_Functions.GET_FUNCTION_DEFINITION_BLOCK(this.workspace, this.getFieldValue('NAME'));
        //console.log('FUNCTION CALL resolveFunction_', defBlock);
        if (defBlock) {
            let signature = defBlock.getFunctionSignature();
            //console.log('FUNCTION CALL signature', signature);
            this.scb.observedBlockIds = defBlock.getFunctionBlockIDs();
            let needsShapeUpdate = false;
            needsShapeUpdate |= (signature.result != this.scb.result);
            needsShapeUpdate |= (signature.parameters.length != this.scb.parameters);
            
            this.scb.result = signature.result;
            this.scb.parameters = signature.parameters.length;
            if (needsShapeUpdate) this.updateShape_();
            this.updateTypes_(signature.parameters);
        } else {
            this.scb.observedBlockIds = null;
        }
    },
    

    customContextMenu: function(menuitems) {
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['copy', 'delete', 'help', 'comment', 'fold', 'deactivate'], null, false, this);
    },
    
    
    manualInitialize: function(name) {
        this.initSvg();
        this.render();
        this.setFieldValue(name, 'NAME');
        this.resolveFunction_();
    },
    
    beforeMutationToDom: function() {
        this.mutationData.result = this.scb.result;
        this.mutationData.parameters = this.scb.parameters;
    },

    afterDomToMutation: function() {
        let result = this.mutationData.result;
        let parameters = this.mutationData.parameters;
        
        if ((this.scb.parameters != parameters) || (this.scb.result != result)) {
            this.scb.parameters = parameters;
            this.scb.result = result;
            this.updateShape_();
        }
    },
    
    
    updateShape_: function() {
        if (this.scb.result == 'VOID') {
            if (this.outputConnection && this.outputConnection.isConnected()) { this.unplug(); this.bumpNeighbours(); }
            this.setOutput(false);
            this.setNextStatement(true, 'STATEMENT');
            this.setPreviousStatement(true, 'STATEMENT');
        } else {
            if (this.getNextBlock() || this.getPreviousBlock()) { this.unplug(true); this.bumpNeighbours(); }
            this.setNextStatement(false);
            this.setPreviousStatement(false);
            this.setOutput(true, this.scb.result);
        }
        
        let fName=this.getFieldValue('NAME');
        
        let removeStart = this.scb.parameters;
        while (1) {
            if (!this.removeInput('INPUT'+removeStart++, true)) break;
        }
        
        if (this.scb.parameters==0) {
            if (!this.getInput('DUMMY')) this.appendDummyInput('DUMMY').appendField(new Blockly.FieldLabelSerializable(fName), 'NAME');
        } else {
            this.removeInput('DUMMY', true);
            for (let i=0; i<this.scb.parameters; i++) {
                if (!this.getInput('INPUT'+i)) {
                    let input = this.appendValueInput('INPUT'+i);
                    if (i==0) {
                        input.appendField(new Blockly.FieldLabelSerializable(fName), 'NAME');
                    }
                }
            }
        }
        this.markDirty();
        
    },
};




// *********************************
// *          FUNCTION RETURN
// *********************************


Blockly.Blocks['function_return'] = {
    debug_out: Blockly.BIB.lib.DEBUG_OFF,
    
    init: function() {
        this.debug_out('init', this);
        
        Blockly.BIB.lib.initializeMutationData(this, {
            valueType: 'VOID'
        });
        
        this.setPreviousStatement(true, 'STATEMENT');
        this.setStyle('rblk_function_blocks');

        this.onchange = Blockly.BIB.lib.EVENT_DISPATCHER;
        this.bib_onFinishedLoading = this._checkBlockContext;
        this.bib_onBlockParentPlug = this._checkBlockContext;

        this.updateValueType_(this.mutationData.valueType);
    },
    
    manualInitialize: function(valueType) {
        this.initSvg();
        this.render();
        this.updateValueType_(valueType);
    },
    
    bib_onBlockChange: function(event) {
        this.debug_out('bib_onBlockChange', this, event);
        if ((event.element=='function') && (event.name=='signature')) {
            if (event.blockId == this.getRootBlock().id) {
                this._checkBlockContext(event);
            }
        }
    },
    
    _checkBlockContext: function(e) {
        this.debug_out('_checkBlockContext', this);
        let varRootBlock = this.getRootBlock();
        let inFunction = (varRootBlock.type=='function_definition');
        let warning = null;
        if (inFunction) {
            let sig = varRootBlock.getFunctionSignature();
            this.debug_out('_checkBlockContext', this, sig);
            let valueType = sig.result;
            if (valueType != this.mutationData.valueType) {
                this.updateValueType_(valueType);
            }
        } else {
            warning = Blockly.Msg['BIB_RETURN_NEEDS_FUNCTION_CONTEXT_ERROR'];
        }
        
        this.setWarningText(warning);
        if (!this.isInFlyout) {
            var group = Blockly.Events.getGroup();
            Blockly.Events.setGroup(e.group);
            this.setEnabled(inFunction);
            Blockly.Events.setGroup(group);
        }
    },
    
    updateValueType_: function(valueType) {
        this.debug_out('updateValueType_', this, valueType);
        this.mutationData.valueType = valueType;

        let valueInput = this.getInput('VALUE');
        
        if (valueType == 'VOID') {
            if (valueInput) Blockly.BIB.lib.configureShadowBlock(valueInput, 'NULL', false);
            if (!valueInput || (valueInput.type == Blockly.connectionTypes.INPUT_VALUE)) {
                if (valueInput) this.removeInput('VALUE');
                valueInput = this.appendDummyInput('VALUE').appendField('return');
            }
        } else {
            if (!valueInput || (valueInput.type != Blockly.connectionTypes.INPUT_VALUE)) {
                if (valueInput) this.removeInput('VALUE');
                valueInput = this.appendValueInput('VALUE').appendField('return');
            }
            if (!this.isInFlyout) Blockly.BIB.lib.configureShadowBlock(valueInput, valueType, false);
        }
    },
    
    beforeMutationToDom: function() {
        this.debug_out('beforeMutationToDom', this);
    },
    
    afterDomToMutation: function() {
        this.debug_out('afterDomToMutation', this);
        this.updateValueType_(this.mutationData.valueType);
    },

};




// *********************************
// *********************************
// *********************************

/* *** GLOBAL FUNCTIONS *** */

Blockly.BIB.Functions.getFunctionBlocks = function(workspace) {
    let blocks = workspace.getBlocksByType('function_definition', false);
    return blocks;
}


Blockly.Constants.SCB_Functions.GET_FUNCTION_DEFINITION_BLOCK = function(workspace, name) {
    let functions = workspace.getBlocksByType('function_definition', false);
    for (let block of functions) {
        if (block.getFunctionName_()==name) return block;
    }
    return null;
}


Blockly.Blocks['log_block'] = {
    init: function() {
        this.jsonInit({
            "message0": "LogBlock %1 blockEvents %2 viewportEvents",
            "args0": [
                {
                    "type": "field_checkbox",
                    "name": "ENABLED"
                }, {
                    "type": "field_checkbox",
                    "name": "VIEWPORT"
                }
            ],
            "style": "rblk_variable_blocks",
            "tooltip": "",
            "helpUrl": ""
        });
        this.canStandAlone = true;
    },
    
    onchange: function(e) {
        
        if (e.type=='viewport_change') {
            if (this.getFieldValue('VIEWPORT')=='TRUE') {
                console.log("VIEWPORT EVENT type="+e.type, e);
            }
        } else {
            if (this.getFieldValue('ENABLED')=='TRUE') {
                if (this.isInFlyout) {
                    console.log("FLYOUT EVENT type="+e.type, e);
                } else {
                    console.log("EVENT type="+e.type, e);
                }
            }
        }
    },
};

Blockly.Constants.SCB_Functions.CHECK_PARENT_BLOCKS_FOR_ID = function(block, parent_id) {
    while (block) {
        if (block.id==parent_id) return true;
        block = block.getParent();
    }
    return false;
}




Blockly.Constants.SCB_Functions.CHECK_NEW_GLOBAL_SYMBOL = function(workspace, name, ignoreBlock, checkDeep) {
    if (!name) return false;
    if (['setup', 'loop', 'run', 'bob3'].includes(name)) return false;
    if (name.match(/^\s*$/)) return false;
    
    for (let block of workspace.getBlocksByType('main_variables', false)) {
        if (block.symbolInUse(name, ignoreBlock)) return false;
    }
    
    for (let block of workspace.getBlocksByType('function_definition', false)) {
        if (block.symbolInUse(name, ignoreBlock, checkDeep)) return false;
    }
    return true;
}



Blockly.Constants.SCB_Functions.CREATE_NEW_GLOBAL_SYMBOL = function(workspace, name) {
    for (let i=1; i<1000; ++i) {
        let checkname = name+i;
        if (Blockly.Constants.SCB_Functions.CHECK_NEW_GLOBAL_SYMBOL(workspace, checkname, null, true)==true) return checkname;
    }
    return null;
}


Blockly.Constants.SCB_Functions.GET_SHADOW_DOM = function(dtype) {
    const shadows = {
        'None': '<shadow type="shadow-no-Value">',
        'Color': '<shadow type="shadow-no-Color">',
        'Number': '<shadow type="shadow-no-Number">',
        'Boolean': '<shadow type="shadow-no-Boolean">',
    };
    if (dtype===null) dtype = 'None';
    return Blockly.Xml.textToDom(shadows[dtype]+'</shadow>');
}


Blockly.Constants.SCB_Functions.CONNECT_OUTPUT_SHADOW = function(dtype, input) {
    //console.log('CONNECT_OUTPUT_SHADOW');
    if (dtype===null) dtype = 'None';
    
    let shadow = input.connection.getShadowDom();
    if (shadow) shadow = Blockly.Xml.domToText(shadow);
    
    let check = input.connection.getCheck();
    
    if (shadow && check && check.length && check[0]==dtype) return; // we already have the right shadow...
    //if (!shadow && (!check || !check.length) && !dtype) return; // we don't have a shadow and we don't need one...

    /*if (dtype)*/
    input.connection.setShadowDom(null); // remove old shadow
    
    input.setCheck(dtype=='None'?null:dtype);
    if (dtype) {
        input.connection.setShadowDom(Blockly.Constants.SCB_Functions.GET_SHADOW_DOM(dtype));
    }
    input.getSourceBlock().bumpNeighbours();
}


Blockly.Constants.SCB_Functions.STATIC_FUNCTION_NAME_TABLE = {
    'setup': 'Mache einmal am Anfang',
    'loop': 'Mache immer wieder',
    'run': 'Mache folgendes:',
};


Blockly.Constants.SCB_Functions.APPEND_BLOCK_TO_WORKSPACE = function (ws, xml) {
    let code = "<xml xmlns=\"https:\/\/developers.google.com\/blockly\/xml\">"+xml+"<\/xml>";
    let dom = Blockly.Xml.textToDom(code);
    Blockly.Xml.domToWorkspace(dom, ws);
}


Blockly.Constants.SCB_Functions.TOOLBOX_CALLBACK_FUNCTIONS = function(workspace) {
    const XML_NODE = Blockly.BIB.XML_NODE;
    let blocks = [];
    //console.log('TOOLBOX_CALLBACK_FUNCTIONS');
    let functionDefs = Blockly.BIB.Functions.getFunctionBlocks(workspace);
    
    if (functionDefs.length) {
        blocks.push(XML_NODE('label', {'text':['%{BIB_FUNCTIONS_OWN_FUNCTIONS}'], 'web-class':'myLabelStyle'}));
        for (let fun of functionDefs) {
            if (!fun.scb.staticFunction) {
                blocks.push(fun.getFunctionCallXml());
            }
        }
    }

    blocks.push(XML_NODE('label', {'text':['%{BIB_FUNCTIONS_CREATE_FUNCTION}'], 'web-class':'myLabelStyle'}));
    let fname = Blockly.Msg['PROCEDURES_DEFNORETURN_PROCEDURE'];

    blocks.push(XML_NODE('block', {'type':'function_definition', 'gap':16}, [ 
        XML_NODE('field', {'name':"NAME"}, fname), 
        XML_NODE('mutation', {'variables':0}) 
    ]));
    blocks.push(XML_NODE('block', {'type':'function_definition', 'gap':16}, [ 
        XML_NODE('field', {'name':"NAME"}, fname), 
        XML_NODE('mutation', {'variables':0, 'resultType':'Number'})
    ]));
    if (functionDefs.length) {
        blocks.push(XML_NODE('label', {'text':['%{BIB_FUNCTIONS_GENERAL}'], 'web-class':'myLabelStyle'}));
        blocks.push(XML_NODE('block', {'type':'function_return', 'gap':32}, [ 
            XML_NODE('mutation', {'valueType':''})
        ]));
    }


    // finish
    let xmlList = [];
    for (let block of blocks) {
        block = block.replace('<block', '<block xmlns="https://developers.google.com/blockly/xml"');
        xmlList.push(Blockly.Xml.textToDom(block));
    }
    return xmlList;
}

Blockly.BIB.Functions.register = function(workspace) {
    workspace.registerToolboxCategoryCallback('BIB_FUNCTIONS', Blockly.Constants.SCB_Functions.TOOLBOX_CALLBACK_FUNCTIONS);
}



Blockly.Constants.SCB_Functions.REGISTER_TOOLBOX = function(workspace) {
    Blockly.BIB.Functions.register(workspace);
    Blockly.BIB.Variables.register(workspace);
}

Blockly.Css.register(['.zelos-renderer.rblk-theme .blocklyText.special-style {fill:#888;}']);

