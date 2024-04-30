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
 * BIB - Bob's Improved Blockly
 * 
 * @fileoverview Text blocks for Blockly.
 * @author nils@bob3.org (Nils Springob)
 */
'use strict';

goog.provide('Blockly.BIB.lib');

goog.require('Blockly');
goog.require('Blockly.Blocks');
goog.require('Blockly.FieldDropdown');
goog.require('Blockly.FieldImage');
goog.require('Blockly.FieldMultilineInput');
goog.require('Blockly.FieldTextInput');
goog.require('Blockly.FieldVariable');
goog.require('Blockly.Mutator');
goog.require('Blockly.BIB.Icons');


Blockly.BIB.lib.filterCustomContextMenu = function(menuitems, wanted, customItems, createSeparator, debugElement) {
    let filters = [];
    if (wanted.includes('copy')) filters.push(Blockly.Msg["DUPLICATE_BLOCK"]);
    if (wanted.includes('delete'))  filters.push(Blockly.Msg["DELETE_BLOCK"]);
    if (wanted.includes('delete'))  filters.push(Blockly.Msg["DELETE_X_BLOCKS"].replace('%1', '#'));
    if (wanted.includes('help'))  filters.push(Blockly.Msg["HELP"]);
    if (wanted.includes('comment'))  filters.push(Blockly.Msg["ADD_COMMENT"]);
    if (wanted.includes('comment'))  filters.push(Blockly.Msg["REMOVE_COMMENT"]);
    if (wanted.includes('fold'))  filters.push(Blockly.Msg["COLLAPSE_BLOCK"]);
    if (wanted.includes('fold'))  filters.push(Blockly.Msg["EXPAND_BLOCK"]);
    if (wanted.includes('deactivate'))  filters.push(Blockly.Msg["DISABLE_BLOCK"]);
    if (wanted.includes('deactivate'))  filters.push(Blockly.Msg["ENABLE_BLOCK"]);

    let regex = /[0-9]+/ig;
    
    let newMenu = [];
    for (let item of menuitems) {
        let str = item.text.replace (regex, "#");
        if (filters.includes(str)) newMenu.push(item);
    }
    
    menuitems.length = 0;
    if (customItems) {
        for(let item of customItems) menuitems.push(item);
        if (menuitems.length && createSeparator) menuitems.push({text: '--------', enabled: false, weight: 2});
    }
    while (newMenu.length) menuitems.push(newMenu.shift());
    
    /*
    if (debugElement) {
        menuitems.push({text: 'DEBUG log console', enabled: true, callback: function() {console.log('DEBUG', debugElement)}, weight: 2});
    }
    */
    return menuitems;
}


Blockly.BIB.lib.moveBlockRelativeTo = function(block, referenceBlock, dx, dy, bumpNeighbours) {
    let pos = Blockly.utils.Coordinate.difference(referenceBlock.getRelativeToSurfaceXY(), block.getRelativeToSurfaceXY());
    block.moveBy(pos.x+dx, pos.y+dy);
    if (bumpNeighbours) block.bumpNeighbours();
};


Blockly.BIB.lib.sortBlockInputs = function(block, order) {
    let inputs = [];
    for (let name of order) {
        if (block.getInput(name)) inputs.push(name);
    }
    let next = null;
    while (inputs.length) {
        let act = inputs.pop();
        if (next) block.moveInputBefore(act, next);
        next = act;
    }
}

Blockly.BIB.lib.checkDefaultVarname = function(name, type) {
    let reg_variable = /^variable\d+$/;
    let reg_color = /^farbe\d+$/;
    let reg_number = /^zahl\d+$/;
    let reg_boolean = /^wahrheit\d+$/;
    
    if ((!type || type=="None") && reg_variable.test(name)) return true;
    if ((!type || type=="Color") && reg_color.test(name)) return true;
    if ((!type || type=="Number") && reg_number.test(name)) return true;
    if ((!type || type=="Boolean") && reg_boolean.test(name)) return true;
    return false;
}

Blockly.BIB.lib.getDefaultVarnameBase = function(type) {
    if (type=="Color") return 'farbe';
    if (type=="Number") return 'zahl';
    if (type=="Boolean") return 'wahrheit';
    return 'variable';
}

Blockly.BIB.lib.normalizeSymbolname = function(name) {
    //console.log('Blockly.BIB.lib.normalizeSymbolname', name);
    if (!name) return name;
    // liefert den normalisierten Namen zurück, NULL falls der Name ungültig ist.
    name = name.trim();
    let res = '';
    for (let c of name) {
        switch (c) {
            case 'Ä': c='Ae'; break;
            case 'Ö': c='Oe'; break;
            case 'Ü': c='Ue'; break;
            case 'ä': c='ae'; break;
            case 'ö': c='oe'; break;
            case 'ü': c='ue'; break;
            case 'ß': c='ss'; break;
            case 'å': c='aa'; break;
            case 'æ': c='ae'; break;
            case 'ø': c='oe'; break;
            case 'þ': c='th'; break;
            case 'ð': c='d'; break;
            case 'đ': c='dj'; break;
            case ' ': c='_'; break;
            case '!': c='_'; break;
            case '#': c='_hash_'; break;
            case '$': c='_dollar_'; break;
            case '%': c='_percent_'; break;
            case '&': c='_and_'; break;
            case '\'': c='_'; break;
            case '*': c='_'; break;
            case '+': c='_plus_'; break;
            case '-': c='_minus_'; break;
            case '=': c='_'; break;
            case '?': c='_'; break;
            case '^': c='_'; break;
            case '_': c='_'; break;
            case '`': c='_'; break;
            case '{': c='_'; break;
            case '|': c='_'; break;
            case '}': c='_'; break;
            case '~': c='_'; break;
            case '@': c='_at_'; break;
            case '.': c='_'; break;
            case '[': c='_'; break;
            case ']': c='_'; break;
            case '€': c='_euro_'; break;
        }
        res += c;
    }
    res = res.replace(/[^a-zA-Z0-9_]/gm, '');
    if (res=='') return null;
    if ((res[0]>='0') && (res[0]<='9')) return null;
    return res;
}

Blockly.BIB.lib.eventDispatcher = function(event) {
    const block = this;
    if (block.isInFlyout) return;
    const scb = block.scb || {};
    const type = event.type;
    let checkNewRoot=false;
    if (type=='finished_loading') {
        if (block.on_finishedLoading) block.on_finishedLoading(event);
        checkNewRoot = true;
    } else if (type=='change') {
        const blockId = event.blockId;
        if ((block.on_changeObserved) && scb.observedBlockIds && (scb.observedBlockIds.includes(blockId) )) block.on_changeObserved(event);
        if ((block.on_changeRoot) && (blockId==scb.rootBlockId) && (blockId!=block.id)) block.on_changeRoot(event);
        if ((block.on_changeSelf) && (blockId==block.id)) block.on_changeSelf(event);
        if (block.on_change) block.on_change(event); // obsolete
    } else if (type=='move') {
        const blockId = event.blockId;
        if (block.on_move) block.on_move(event);
        if ((block.on_moveRoot) && (blockId==scb.rootBlockId) && (blockId != block.id)) block.on_moveRoot(event);
        if ((block.on_moveSelf) && (blockId==block.id)) block.on_moveSelf(event);
        if ((block.on_moveChild) && (event.oldParentId==block.id)) block.on_moveChild(event);
        if ((block.on_moveChild) && (event.newParentId==block.id)) block.on_moveChild(event);
        checkNewRoot = true;
    } else if (type=='delete') {
        const blockId = event.blockId;
        if ((block.on_deleteObserved) && scb.observedBlockIds && (scb.observedBlockIds.includes(blockId) )) block.on_deleteObserved(event);
        checkNewRoot = true;
    } else if (type=='create') {
        const blockId = event.blockId;
        if ((block.on_createSelf) && (blockId==block.id)) block.on_createSelf(event);
    } else {
        if (event.blockId == block.id) {
            //console.log('SELF EVENT:', event.type, event);
        }
    }
    if (checkNewRoot) {
        let rb = block.getRootBlock();
        let rbid = rb && rb.id;
        if (rbid != scb.rootBlockId) {
            scb.rootBlockId = rbid;
            if (block.on_newRootBlock) block.on_newRootBlock(event, rb);
        }
    }
}



Blockly.BIB.lib.mutationDataToDom = function(mutationData) {
    // store local data to XML node
    console.log('*** > mutationDataToDom START', mutationData);
    var mutationNode = Blockly.utils.xml.createElement('mutation');
    for (var key in mutationData) {
        let val = mutationData[key];
        if (val === null) continue;
        if (val === undefined) continue;
        //if (typeof val == "boolean") { val = val?'true':'false'; }
        //else if (typeof val == "number") { val = val.toString(); }
        mutationNode.setAttribute(key, val.toString());
        console.log('  >'+key+': '+val.toString());
    }
    console.log('*** > mutationDataToDom END', mutationData, mutationNode, mutationNode.attributes.length);
    return mutationNode.attributes.length?mutationNode:null;
}

Blockly.BIB.lib.domToMutationData = function(mutationNode, mutationData) {
    // load local data from XML node
    console.log('*** < domToMutationData START', mutationData, mutationNode);
    for (var key in mutationData) {
        console.log('key:', key);
        let domVal = mutationNode.getAttribute(key);
        console.log('domVal:', domVal);
        let val = null;
        if (domVal!==null) {
            val = mutationData[key];
            console.log('val:', val);
            if (val===null) {
                if (domVal==='true') val = true;
                else if (domVal==='false') val = false;
                else if (domVal!=='null') val = domVal;
            } else if (typeof val == "boolean") {
                val = (domVal==='true'); 
            } else if (typeof val == "number") {
                val = Number.parseFloat(domVal); 
            } else {
                val = domVal;
            }
        }
        console.log('val-out:', val);
        console.log('mutationData[key]:', mutationData[key]);
        mutationData[key] = val;
        //console.log('  <'+key+': '+val.toString());
    }
    console.log('*** < domToMutationData END', mutationData);
}


/* 
    New events:
    * bib_onFinishedLoading: loading has finished
    * bib_onBlockParentPlug: parent connection or ancester parent block connection has changed (block or surrounding block was plugged)
    * bib_onBlockChange: a block on the workspace triggered a change event
    * bib_onBlockDelete: a block on the workspace was deleted
*/


Blockly.BIB.lib.EVENT_DISPATCHER = function(event) {
    if (this.isInFlyout) return;
    const scb = this.scb || {};
    const type = event.type;
    let checkNewRoot=false;
    if (type=='finished_loading') {
        if (this.on_finishedLoading) this.on_finishedLoading(event);
        if (this.bib_onFinishedLoading) this.bib_onFinishedLoading(event);
        checkNewRoot = true;
    } else if (type=='change') {
        const blockId = event.blockId;
        if ((this.on_changeObserved) && scb.observedBlockIds && (scb.observedBlockIds.includes(blockId) )) this.on_changeObserved(event);
        if ((this.on_changeRoot) && (blockId==scb.rootBlockId) && (blockId!=this.id)) this.on_changeRoot(event);
        if ((this.on_changeSelf) && (blockId==this.id)) this.on_changeSelf(event);
        if (this.on_change) this.on_change(event); // obsolete
        if (this.bib_onBlockChange) this.bib_onBlockChange(event);
    } else if (type=='move') {
        const blockId = event.blockId;
        if (this.on_move) this.on_move(event);
        if ((this.on_moveRoot) && (blockId==scb.rootBlockId) && (blockId != this.id)) this.on_moveRoot(event);
        if ((this.on_moveSelf) && (blockId==this.id)) this.on_moveSelf(event);
        if ((this.on_moveChild) && (event.oldParentId==this.id)) this.on_moveChild(event);
        if ((this.on_moveChild) && (event.newParentId==this.id)) this.on_moveChild(event);

        let parentEvent =  Blockly.Constants.SCB_Functions.CHECK_PARENT_BLOCKS_FOR_ID(this, event.blockId);
        if (parentEvent) {
            if ((event.newParentId != event.oldParentId) || (event.newInputName != event.oldInputName)) {
                checkNewRoot = true;
                if (!event.oldParentId && this.bib_onBlockParentPlugIn) this.bib_onBlockParentPlugIn(event);
                if (!event.newParentId && this.bib_onBlockParentPlugOut) this.bib_onBlockParentPlugOut(event);
                if (event.oldParentId && event.newParentId && this.bib_onBlockParentPlugBeam) this.bib_onBlockParentPlugBeam(event);
                if (this.bib_onBlockParentPlug) this.bib_onBlockParentPlug(event);
            } else {
                if (this.bib_onBlockParentMove) this.bib_onBlockParentMove(event);
            }
        }
        
    } else if (type=='delete') {
        const blockId = event.blockId;
        if ((this.on_deleteObserved) && scb.observedBlockIds && (scb.observedBlockIds.includes(blockId) )) this.on_deleteObserved(event);
        if (this.bib_onBlockDelete) this.bib_onBlockDelete(event);
        checkNewRoot = true;
    } else if (type=='create') {
        const blockId = event.blockId;
        if ((this.on_createSelf) && (blockId==this.id)) this.on_createSelf(event);
    } else {
        if (event.blockId == this.id) {
            //console.log('SELF EVENT:', event.type, event);
        }
    }
    if (checkNewRoot) {
        let rb = this.getRootBlock();
        if (rb.id != scb.rootBlockId) {
            scb.rootBlockId = rb.id;
            if (this.on_newRootBlock) this.on_newRootBlock(event, rb);
        }
    }
}




// NEW BEGIN

Blockly.BIB.lib.DEBUG_OFF = function() {
}

Blockly.BIB.lib.DEBUG_OUT = function(method, data0, data1, data2, data3) {
    let msg = '*** '+this.type+'['+this.id+']::'+method;
    if (data0===undefined) console.log(msg);
    else if (data1===undefined) console.log(msg, data0);
    else if (data2===undefined) console.log(msg, data0, data1);
    else if (data3===undefined) console.log(msg, data0, data1, data2);
    else console.log(msg, data0, data1, data2, data3);
},



Blockly.BIB.lib.initializeMutationData = function(block, defaultData) {
    block.mutationDefault = {};
    block.mutationData = {};
    for (let key in defaultData) {
        let val = defaultData[key];
        block.mutationDefault[key]=val;
        block.mutationData[key]=val;
    }
    block.mutationToDom = Blockly.BIB.lib.mutationToDom_;
    block.domToMutation = Blockly.BIB.lib.domToMutation_;
}

Blockly.BIB.lib.mutationToDom_ = function() {
    if (this.beforeMutationToDom) this.beforeMutationToDom.call(this);
    // store local data to XML node
    //console.log('*** > mutationToDom START', this.mutationData);
    var mutationNode = Blockly.utils.xml.createElement('mutation');
    for (var key in this.mutationDefault) {
        let defVal = this.mutationDefault[key];
        let val = this.mutationData[key];
        if (val === defVal) continue;
        
        if (typeof defVal == "boolean") val = val?'true':'false';
        else if (typeof defVal == 'number') val = (typeof val == 'number')? val:0;
        else if (typeof defVal == 'string') val = (typeof val == 'string')? val:'';
        else {
            console.log('TYPE ERROR!'); continue;
        }
        mutationNode.setAttribute(key, val);
    }
    //console.log('*** > mutationToDom END', this.mutationData, mutationNode, mutationNode.attributes.length);
    return mutationNode.attributes.length?mutationNode:null;
}

Blockly.BIB.lib.domToMutation_ = function(mutationNode) {
    // load local data from XML node
    //console.log('*** < domToMutation START', this.mutationData, mutationNode);
    for (var key in this.mutationDefault) {
        let defVal = this.mutationDefault[key];
        let domVal = mutationNode.getAttribute(key);
        let val = defVal;
        
        if (domVal!==null) {
            val = this.mutationData[key];
            //console.log('val:', val);
            if (typeof defVal == "boolean") {
                val = (domVal==='true');
            } else if (typeof defVal == "number") {
                val = Number.parseFloat(domVal);
            } else if (typeof defVal == "string") {
                val = domVal;
            } else {
                console.log('TYPE ERROR!'); continue;
            }
        }
        this.mutationData[key] = val;
    }
    //console.log('*** < domToMutation END', this.mutationData);
    if (this.afterDomToMutation) this.afterDomToMutation.call(this);
}

// NEW END



Blockly.BIB.lib.getShadowDom = function(type) {
    const shadows = {
        'NULL': 'shadow-no-Value',
        'VOID': 'shadow-no-Value',
        'VALUE': 'shadow-no-Value',     // any value
        'VAR': 'shadow-no-Variable',    // any variable
        'Color': 'shadow-no-Color',     // a color
        'Number': 'shadow-no-Number',   // a number
        'Boolean': 'shadow-no-Boolean', // a boolean
    };
    if (type===null) dtype = 'VOID';
    return Blockly.Xml.textToDom('<shadow type="'+shadows[type]+'"></shadow>');
}



Blockly.BIB.lib.createTypeDefaultBlock = function(workspace, typename) {
    if (typename=='Number') return workspace.newBlock('math_number');
    if (typename=='Boolean') return workspace.newBlock('logic_boolean');
    if (typename=='Color') return workspace.newBlock('color_picker');
    console.log('Blockly.BIB.lib.getTypeDefaultBlock: ERROR - unknown type '+typename);
    return null;
}



Blockly.BIB.lib.checkTypeDefaultBlock = function(block) {
    if (block.type=='logic_boolean') return 'Boolean';
    if (block.type=='math_number') return 'Number';
    if (block.type=='color_picker') return 'Color';
    return null;
}


// VOID: any type may connect, if wantsDefaultBlock -> no standard block
// NULL: nothing can connect, if wantsDefaultBlock -> remove standard block
// Number/Color/Boolean: value can connect, if wantsDefaultBlock -> add standard block
Blockly.BIB.lib.configureShadowBlock = function(input, type, wantsDefaultBlock) {
    //console.log('Blockly.BIB.lib.configureShadowBlock', input, type, wantsDefaultBlock);
    if (!input.connection) return; // seems to be dummy input...
    
    if (type===null) type = 'VOID';
    if (type==='') type = 'VOID';
    
    let sourceBlock = input.getSourceBlock();
    let connectedBlock = input.connection.targetBlock();
    
    // if necessary, remove connected block
    if (connectedBlock && type!='VOID') {
        let check = connectedBlock.outputConnection.getCheck();
        if (check) {
            if (!check.includes(type)) {
                if (wantsDefaultBlock && Blockly.BIB.lib.checkTypeDefaultBlock(connectedBlock)) {
                    //console.log('Blockly.BIB.lib.configureShadowBlock', '*** remove old standard block');
                    connectedBlock.dispose();
                } else {
                    //console.log('Blockly.BIB.lib.configureShadowBlock', '*** unplug old block');
                    connectedBlock.unplug();
                }
                connectedBlock = null;
            }
        }
    }
    
    // if necessary, remove old shadow
    let newShadow = Blockly.BIB.lib.getShadowDom(type);
    let oldShadow = input.connection.getShadowDom();
    if (oldShadow) {
        if (oldShadow.getAttribute('type')!=newShadow.getAttribute('type')) {
            input.connection.setShadowDom(null);
            oldShadow = null;
        }
    }

    // change accepted type:
    input.setCheck(type==='VOID'?null:type);
    
    // if necessary, add new shadow
    if (!oldShadow) {
        input.connection.setShadowDom(newShadow);
    }
    
    // if necessary, add default value block
    if (wantsDefaultBlock && !connectedBlock) {
        //console.log('Blockly.BIB.lib.configureShadowBlock', '*** need new standard block');

        let newBlock = Blockly.BIB.lib.createTypeDefaultBlock(sourceBlock.workspace, type);
        if (newBlock) {
            input.connection.connect(newBlock.outputConnection);
            newBlock.initSvg();
            if (sourceBlock.rendered) {
                newBlock.render();
            }
        }
    }
    
    // finally clean up....
    sourceBlock.bumpNeighbours();
}

Blockly.BIB.lib.fnReturnFalse_ = function() {
    return false;
}

Blockly.BIB.lib.disableSerializeFieldValue = function(field) {
    field.isSerializable = Blockly.BIB.lib.fnReturnFalse_;
}


Blockly.BIB.lib.getAncesterBlockOfType = function(block, types) {
    do {
        if (types.indexOf(block.type) != -1) {
            return block;
        }
        block = block.getSurroundParent();
    } while (block);
    return null;
}





// create plus/minus button
Blockly.BIB.lib.createButtonField = function(kind, args = undefined) {
    const icons = {
        '+': Blockly.Constants.SCB_ICONS.ICON_PLUS_SQUARE,
        '-': Blockly.Constants.SCB_ICONS.ICON_MINUS_SQUARE,
    }
    const button = new Blockly.FieldImage(icons[kind], 20, 20, undefined, Blockly.BIB.lib.buttonFieldClicked_);
    button.args_ = args;
    return button;
}


Blockly.BIB.lib.buttonFieldClicked_ = function(button) {
    const block = button.getSourceBlock();

    if (block.isInFlyout) {
        return;
    }

    if (!block.on_buttonClicked) return;
    
    if (block.mutationToDom) {
        Blockly.Events.setGroup(true);
        const oldMutationDom = block.mutationToDom && block.mutationToDom();
        const oldMutation = oldMutationDom && Blockly.Xml.domToText(oldMutationDom);

        block.on_buttonClicked(button.args_);

        const newMutationDom = (!block.disposed) && block.mutationToDom && block.mutationToDom();
        const newMutation = newMutationDom && Blockly.Xml.domToText(newMutationDom);

        if ((!block.disposed) && (oldMutation != newMutation)) {
//             Blockly.Events.fire(new Blockly.Events.BlockChange( block, 'mutation', null, oldMutation, newMutation));
        }
        Blockly.Events.setGroup(false);
    } else {
        block.on_buttonClicked(button.args_);
    }
}

Blockly.BIB.XML_ESCAPE = function(val) {
    return (''+val).replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

// returns text with replaced symbols: 
// example: let txt = Blockly.BIB.TXT("%{BIB_DEMOTEXT}: %1", counter);
Blockly.BIB.TXT = function() {
    let msg = arguments[0];
    // replace '%{BKY_name}' by Blockly.Msg[name]
    msg = msg.replaceAll(/\%\{(BKY|BIB)_(\w*)\}/g, function(match, p1, p2) {
        if (p1==='BKY') return Blockly.Msg[p2];
        if (p1==='BIB') return Blockly.Msg['BIB_'+p2];
    });
    // replace arguents
    for (let i=1; i<arguments.length; i++) {
        msg = msg.replaceAll('%'+i, arguments[i]);
    }
    // replace variable strings in arguments
    msg = msg.replaceAll(/\%\{(BKY|BIB)_(\w*)\}/g, function(match, p1, p2) {
        if (p1==='BKY') return Blockly.Msg[p2];
        if (p1==='BIB') return Blockly.Msg['BIB_'+p2];
    });
    return msg;
}

// same as Blockly.BIB.TXT, but with XML/HTML-escaped characters
// example: let xml = Blockly.BIB.XTXT("%{BIB_DEMOTEXT}: %1", counter);
Blockly.BIB.XTXT = function() {
    return Blockly.BIB.XML_ESCAPE(Blockly.BIB.TXT.apply(null, arguments));
}

Blockly.BIB.XML_NODE = function(name, attributes, content) {
    let txt = '<'+name;
    if (attributes) {
        for (const property in attributes) {
            let value=attributes[property];
            if (value.constructor === Array) value=Blockly.BIB.TXT.apply(null, value);
            txt += ' ' + property + '="' + Blockly.BIB.XML_ESCAPE(value) + '"';
        }
    }
    if (content) {
        txt += '>';
        if (content.constructor === Array) {
            for (const child of content) {
                txt += child;
            }
        } else {
            txt += Blockly.BIB.XML_ESCAPE(content);
        }
        txt += '</' + name + '>';
    } else {
        txt += '/>';
    }
    return txt;
}
