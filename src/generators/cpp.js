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
 * @fileoverview Helper functions for generating CPP for blocks.
 * @author daarond@gmail.com (Daaron Dwyer)
 */
'use strict';

goog.provide('Blockly.CPP');
goog.provide('Blockly.CPP.fincodes');

goog.require('Blockly.Generator');
goog.require('Blockly.inputTypes');
goog.require('Blockly.utils.object');
goog.require('Blockly.utils.string');


/**
 * CPP code generator.
 * @type {!Blockly.Generator}
 */
Blockly.CPP = new Blockly.Generator('CPP');
Blockly.CPP.fincodes = [];

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.CPP.addReservedWords(
        // http://php.net/manual/en/reserved.keywords.php
    '__halt_compiler,abstract,and,array,as,break,callable,case,catch,class,' +
    'clone,const,continue,declare,default,die,do,echo,else,elseif,empty,' +
    'enddeclare,endfor,endforeach,endif,endswitch,endwhile,eval,exit,extends,' +
    'final,for,foreach,function,global,goto,if,implements,include,' +
    'include_once,instanceof,insteadof,interface,isset,list,namespace,new,or,' +
    'print,private,protected,public,require,require_once,return,static,' +
    'switch,throw,trait,try,unset,use,var,while,xor,' +
        // http://php.net/manual/en/reserved.constants.php
    'CPP_VERSION,CPP_MAJOR_VERSION,CPP_MINOR_VERSION,CPP_RELEASE_VERSION,' +
    'CPP_VERSION_ID,CPP_EXTRA_VERSION,CPP_ZTS,CPP_DEBUG,CPP_MAXPATHLEN,' +
    'CPP_OS,CPP_SAPI,CPP_EOL,CPP_INT_MAX,CPP_INT_SIZE,DEFAULT_INCLUDE_PATH,' +
    'PEAR_INSTALL_DIR,PEAR_EXTENSION_DIR,CPP_EXTENSION_DIR,CPP_PREFIX,' +
    'CPP_BINDIR,CPP_BINARY,CPP_MANDIR,CPP_LIBDIR,CPP_DATADIR,CPP_SYSCONFDIR,' +
    'CPP_LOCALSTATEDIR,CPP_CONFIG_FILE_PATH,CPP_CONFIG_FILE_SCAN_DIR,' +
    'CPP_SHLIB_SUFFIX,E_ERROR,E_WARNING,E_PARSE,E_NOTICE,E_CORE_ERROR,' +
    'E_CORE_WARNING,E_COMPILE_ERROR,E_COMPILE_WARNING,E_USER_ERROR,' +
    'E_USER_WARNING,E_USER_NOTICE,E_DEPRECATED,E_USER_DEPRECATED,E_ALL,' +
    'E_STRICT,__COMPILER_HALT_OFFSET__,TRUE,FALSE,NULL,__CLASS__,__DIR__,' +
    '__FILE__,__FUNCTION__,__LINE__,__METHOD__,__NAMESPACE__,__TRAIT__'
);

/**
 * Order of operation ENUMs.
 * http://php.net/manual/en/language.operators.precedence.php
 */
Blockly.CPP.ORDER_ATOMIC = 0;             // 0 "" ...
Blockly.CPP.ORDER_CLONE = 1;              // clone
Blockly.CPP.ORDER_NEW = 1;                // new
Blockly.CPP.ORDER_MEMBER = 2.1;           // []
Blockly.CPP.ORDER_FUNCTION_CALL = 2.2;    // ()
Blockly.CPP.ORDER_POWER = 3;              // **
Blockly.CPP.ORDER_INCREMENT = 4;          // ++
Blockly.CPP.ORDER_DECREMENT = 4;          // --
Blockly.CPP.ORDER_BITWISE_NOT = 4;        // ~
Blockly.CPP.ORDER_CAST = 4;               // (int) (float) (string) (array) ...
Blockly.CPP.ORDER_SUPPRESS_ERROR = 4;     // @
Blockly.CPP.ORDER_INSTANCEOF = 5;         // instanceof
Blockly.CPP.ORDER_LOGICAL_NOT = 6;        // !
Blockly.CPP.ORDER_UNARY_PLUS = 7.1;       // +
Blockly.CPP.ORDER_UNARY_NEGATION = 7.2;   // -
Blockly.CPP.ORDER_MULTIPLICATION = 8.1;   // *
Blockly.CPP.ORDER_DIVISION = 8.2;         // /
Blockly.CPP.ORDER_MODULUS = 8.3;          // %
Blockly.CPP.ORDER_ADDITION = 9.1;         // +
Blockly.CPP.ORDER_SUBTRACTION = 9.2;      // -
Blockly.CPP.ORDER_STRING_CONCAT = 9.3;    // .
Blockly.CPP.ORDER_BITWISE_SHIFT = 10;     // << >>
Blockly.CPP.ORDER_RELATIONAL = 11;        // < <= > >=
Blockly.CPP.ORDER_EQUALITY = 12;          // == != === !== <> <=>
Blockly.CPP.ORDER_REFERENCE = 13;         // &
Blockly.CPP.ORDER_BITWISE_AND = 13;       // &
Blockly.CPP.ORDER_BITWISE_XOR = 14;       // ^
Blockly.CPP.ORDER_BITWISE_OR = 15;        // |
Blockly.CPP.ORDER_LOGICAL_AND = 16;       // &&
Blockly.CPP.ORDER_LOGICAL_OR = 17;        // ||
Blockly.CPP.ORDER_IF_NULL = 18;           // ??
Blockly.CPP.ORDER_CONDITIONAL = 19;       // ?:
Blockly.CPP.ORDER_ASSIGNMENT = 20;        // = += -= *= /= %= <<= >>= ...
Blockly.CPP.ORDER_LOGICAL_AND_WEAK = 21;  // and
Blockly.CPP.ORDER_LOGICAL_XOR = 22;       // xor
Blockly.CPP.ORDER_LOGICAL_OR_WEAK = 23;   // or
Blockly.CPP.ORDER_COMMA = 24;             // ,
Blockly.CPP.ORDER_NONE = 99;              // (...)

/**
 * List of outer-inner pairings that do NOT require parentheses.
 * @type {!Array<!Array<number>>}
 */
Blockly.CPP.ORDER_OVERRIDES = [
    // (foo()).bar() -> foo().bar()
    // (foo())[0] -> foo()[0]
    [Blockly.CPP.ORDER_MEMBER, Blockly.CPP.ORDER_FUNCTION_CALL],
    // (foo[0])[1] -> foo[0][1]
    // (foo.bar).baz -> foo.bar.baz
    [Blockly.CPP.ORDER_MEMBER, Blockly.CPP.ORDER_MEMBER],
    // !(!foo) -> !!foo
    [Blockly.CPP.ORDER_LOGICAL_NOT, Blockly.CPP.ORDER_LOGICAL_NOT],
    // a * (b * c) -> a * b * c
    [Blockly.CPP.ORDER_MULTIPLICATION, Blockly.CPP.ORDER_MULTIPLICATION],
    // a + (b + c) -> a + b + c
    [Blockly.CPP.ORDER_ADDITION, Blockly.CPP.ORDER_ADDITION],
    // a && (b && c) -> a && b && c
    [Blockly.CPP.ORDER_LOGICAL_AND, Blockly.CPP.ORDER_LOGICAL_AND],
    // a || (b || c) -> a || b || c
    [Blockly.CPP.ORDER_LOGICAL_OR, Blockly.CPP.ORDER_LOGICAL_OR]
];

/**
 * Whether the init method has been called.
 * @type {?boolean}
 */
Blockly.CPP.isInitialized = false;

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.CPP.init = function(workspace) {
    // Call Blockly.Generator's init.
    Object.getPrototypeOf(this).init.call(this);

    if (!this.nameDB_) {
        this.nameDB_ = new Blockly.Names(this.RESERVED_WORDS_, '$');
    } else {
        this.nameDB_.reset();
    }

    this.nameDB_.setVariableMap(workspace.getVariableMap());
    this.nameDB_.populateVariables(workspace);
    this.nameDB_.populateProcedures(workspace);

    this.globalFunctions_ = '';
    this.globalVariables_ = '';
    this.globalDefinitions_ = '';
    this.isInitialized = true;
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.CPP.finish = function(code) {
    // Convert the definitions dictionary into a list.
    var definitions = Blockly.utils.object.values(this.definitions_);
    // Call Blockly.Generator's finish.
    code = Object.getPrototypeOf(this).finish.call(this, code);
    this.isInitialized = false;

    let globals = this.globalFunctions_ + this.globalVariables_;
    if (globals) globals += '\n\n';
    
    let head = ''
    head += '#include <BOB3.h>\n\n'
    head += 'typedef uint16_t color_t;\n\n';
    if (this.globalFunctions_) head += '// function declarations:\n' + this.globalFunctions_ + '\n';
    if (this.globalVariables_) head += '// global variables:\n' + this.globalVariables_ + '\n\n';
    
    //code += '\n\nvoid _alignFunction() __attribute__((aligned (2048))) __attribute__((used));\n';
    //code += '\nvoid _alignFunction() {}\n';
    
    this.globalFunctions_ = '';
    this.globalVariables_ = '';
    this.globalDefinitions_ = '';
    this.nameDB_.reset();
    return head + code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.CPP.scrubNakedValue = function(line) {
    return line + ';\n';
};

/**
 * Encode a string as a properly escaped CPP string, complete with
 * quotes.
 * @param {string} string Text to encode.
 * @return {string} CPP string.
 * @protected
 */
Blockly.CPP.quote_ = function(string) {
    string = string.replace(/\\/g, '\\\\')
                   .replace(/\n/g, '\\\n')
                   .replace(/'/g, '\\\'');
    return '"' + string + '"';
};

/**
 * Encode a string as a properly escaped multiline CPP string, complete with
 * quotes.
 * @param {string} string Text to encode.
 * @return {string} CPP string.
 * @protected
 */
Blockly.CPP.multiline_quote_ = function (string) {
    var lines = string.split(/\n/g).map(this.quote_);
    // Join with the following, plus a newline:
    // . "\n" .
    // Newline escaping only works in double-quoted strings.
    return lines.join(' . \"\\n\" .\n');
};

/**
 * Common tasks for generating CPP from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The CPP code created for this block.
 * @param {boolean=} opt_thisOnly True to generate code for only this statement.
 * @return {string} CPP code with comments and subsequent blocks added.
 * @protected
 */
Blockly.CPP.scrub_ = function(block, code, opt_thisOnly) {
    if (!block.getParent()) {
        if (!( (block.hasOwnProperty('canStandAlone') && block.canStandAlone) )) {
            return '// skipped orphan block!\n';
        }
    }

    var commentCode = '';
    // Only collect comments for blocks that aren't inline.
    if (!block.outputConnection || !block.outputConnection.targetConnection) {
        // Collect comment for this block.
        var comment = block.getCommentText();
        if (comment) {
            comment = Blockly.utils.string.wrap(comment, this.COMMENT_WRAP - 3);
            commentCode += this.prefixLines(comment, '// ') + '\n';
        }
        // Collect comments for all value arguments.
        // Don't collect comments for nested statements.
        for (var i = 0; i < block.inputList.length; i++) {
            if (block.inputList[i].type == Blockly.inputTypes.VALUE) {
                var childBlock = block.inputList[i].connection.targetBlock();
                if (childBlock) {
                    comment = this.allNestedComments(childBlock);
                    if (comment) {
                        commentCode += this.prefixLines(comment, '// ');
                    }
                }
            }
        }
    }
    
    var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    var nextCode = opt_thisOnly ? '' : this.blockToCode(nextBlock);
    
    var finCode='';
    if (!block.getParent() && block.hasOwnProperty('isProcedureHead') && block.isProcedureHead) { //; this.fincodes[block.type]) {
        finCode = '}\n'; //this.fincodes[block.type](block);
        if (nextCode!='') nextCode = this.prefixLines(nextCode, '  ');
    }
    
    return commentCode + code + nextCode + finCode;
};

/**
 * Gets a property and adjusts the value while taking into account indexing.
 * @param {!Blockly.Block} block The block.
 * @param {string} atId The property ID of the element to get.
 * @param {number=} opt_delta Value to add.
 * @param {boolean=} opt_negate Whether to negate the value.
 * @param {number=} opt_order The highest order acting on this value.
 * @return {string|number}
 */
Blockly.CPP.getAdjusted = function(block, atId, opt_delta, opt_negate, opt_order) {
    var delta = opt_delta || 0;
    var order = opt_order || this.ORDER_NONE;
    if (block.workspace.options.oneBasedIndex) {
        delta--;
    }
    var defaultAtIndex = block.workspace.options.oneBasedIndex ? '1' : '0';
    if (delta > 0) {
        var at = this.valueToCode(block, atId,
                this.ORDER_ADDITION) || defaultAtIndex;
    } else if (delta < 0) {
        var at = this.valueToCode(block, atId,
                this.ORDER_SUBTRACTION) || defaultAtIndex;
    } else if (opt_negate) {
        var at = this.valueToCode(block, atId,
                this.ORDER_UNARY_NEGATION) || defaultAtIndex;
    } else {
        var at = this.valueToCode(block, atId, order) ||
            defaultAtIndex;
    }

    if (Blockly.isNumber(at)) {
        // If the index is a naked number, adjust it right now.
        at = Number(at) + delta;
        if (opt_negate) {
            at = -at;
        }
    } else {
        // If the index is dynamic, adjust it in code.
        if (delta > 0) {
            at = at + ' + ' + delta;
            var innerOrder = this.ORDER_ADDITION;
        } else if (delta < 0) {
            at = at + ' - ' + -delta;
            var innerOrder = this.ORDER_SUBTRACTION;
        }
        if (opt_negate) {
            if (delta) {
                at = '-(' + at + ')';
            } else {
                at = '-' + at;
            }
            var innerOrder = this.ORDER_UNARY_NEGATION;
        }
        innerOrder = Math.floor(innerOrder);
        order = Math.floor(order);
        if (innerOrder && order >= innerOrder) {
            at = '(' + at + ')';
        }
    }
    return at;
};


Blockly.CPP.create_symbol_name = function (symbolName) {
    return Blockly.BIB.lib.normalizeSymbolname(symbolName);
    //return symbolName.replace(/\s/g,"_");
}

Blockly.CPP.get_datatype_ = function (type) {
    if (type=='Number') type='int';
    if (type=='Color') type='color_t';
    if (type=='Boolean') type='bool';
    if (type=='String') type='string_t';
    if (type=='VOID') type='void';
    return type;
}

Blockly.CPP.prefixTrimmedLines = function (lines, prefix) {
    return lines.replace(/^\s+/gm, prefix);
}


Blockly.CPP.stringValueToCode = function (block, name, order) {
    var text = Blockly.CPP.valueToCode(block, name, order) || '""';
    var types = block.getInputTargetBlock(name).outputConnection.getCheck();
    const relevantTypes = ['String', 'Number', 'Boolean', 'Color', 'Image'];
    types = types.filter(value => relevantTypes.includes(value));
    if (types.length==1) {
        let type = types[0];
        if (type=='Number') text = 'stringFromInteger('+text+')';
        if (type=='Boolean') text = 'stringFromBoolean('+text+')';
        if (type=='Color') text = 'stringFromColor('+text+')';
        if (type=='Image') text = 'stringFromBitmap('+text+')';
    }
    return text;
}


