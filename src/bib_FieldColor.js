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
 * @fileoverview Color input field. based on original Blockly Colour input field
 * @author fraser@google.com (Neil Fraser)
 * @author nils@bob3.org (Nils Springob)
 */
'use strict';

goog.provide('Blockly.BIB.FieldColor');

goog.require('Blockly.browserEvents');
goog.require('Blockly.Css');
goog.require('Blockly.DropDownDiv');
/** @suppress {extraRequire} */
goog.require('Blockly.Events.BlockChange');
goog.require('Blockly.Field');
goog.require('Blockly.fieldRegistry');
goog.require('Blockly.utils.aria');
goog.require('Blockly.utils.colour');
goog.require('Blockly.utils.dom');
goog.require('Blockly.utils.IdGenerator');
goog.require('Blockly.utils.KeyCodes');
goog.require('Blockly.utils.object');
goog.require('Blockly.utils.Size');


/**
 * Class for a color input field.
 * @param {string=} opt_value The initial value of the field. Should be in
 *    '#rrggbb' format. Defaults to the first value in the default color array.
 * @param {Function=} opt_validator A function that is called to validate
 *    changes to the field's value. Takes in a color string & returns a
 *    validated color string ('#rrggbb' format), or null to abort the change.
 * @param {Object=} opt_config A map of options used to configure the field.
 *    See the [field creation documentation]{@link https://developers.google.com/blockly/guides/create-custom-blocks/fields/built-in-fields/colour}
 *    for a list of properties this parameter supports.
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.BIB.FieldColor = function(opt_value, opt_validator, opt_config) {
    Blockly.BIB.FieldColor.superClass_.constructor.call(
        this, opt_value, opt_validator, opt_config);

    /**
    * The field's color picker element.
    * @type {?Element}
    * @private
    */
    this.picker_ = null;

    /**
    * Index of the currently highlighted element.
    * @type {?number}
    * @private
    */
    this.highlightedIndex_ = null;

    /**
    * Mouse click event data.
    * @type {?Blockly.browserEvents.Data}
    * @private
    */
    this.onClickWrapper_ = null;

    /**
    * Mouse move event data.
    * @type {?Blockly.browserEvents.Data}
    * @private
    */
    this.onMouseMoveWrapper_ = null;

    /**
    * Mouse enter event data.
    * @type {?Blockly.browserEvents.Data}
    * @private
    */
    this.onMouseEnterWrapper_ = null;

    /**
    * Mouse leave event data.
    * @type {?Blockly.browserEvents.Data}
    * @private
    */
    this.onMouseLeaveWrapper_ = null;

    /**
    * Key down event data.
    * @type {?Blockly.browserEvents.Data}
    * @private
    */
    this.onKeyDownWrapper_ = null;
    
    
    this.textColor_ = '#ffffff';
    this.backgroundColor_ = '#000000';
    this.colorCaption_ = '+';
    this.captionsVisible_ = false;

};
Blockly.utils.object.inherits(Blockly.BIB.FieldColor, Blockly.Field);

/**
 * Construct a FieldColor from a JSON arg object.
 * @param {!Object} options A JSON object with options (color).
 * @return {!Blockly.BIB.FieldColor} The new field instance.
 * @package
 * @nocollapse
 */
Blockly.BIB.FieldColor.fromJson = function(options) {
    return new Blockly.BIB.FieldColor(options['color'], undefined, options);
};

/**
 * Serializable fields are saved by the XML renderer, non-serializable fields
 * are not. Editable fields should also be serializable.
 * @type {boolean}
 */
Blockly.BIB.FieldColor.prototype.SERIALIZABLE = true;

/**
 * Mouse cursor style when over the hotspot that initiates the editor.
 */
Blockly.BIB.FieldColor.prototype.CURSOR = 'default';

/**
 * Number of color columns used by this field.  If 0, use the global setting.
 * By default use the global constants for columns.
 * @type {number}
 * @private
 */
Blockly.BIB.FieldColor.prototype.columns_ = 0;

/**
 * Configure the field based on the given map of options.
 * @param {!Object} config A map of options to configure the field based on.
 * @protected
 * @override
 */
Blockly.BIB.FieldColor.prototype.configure_ = function(config) {
    Blockly.BIB.FieldColor.superClass_.configure_.call(this, config);
    if (config['columns']) {
        this.columns_ = config['columns'];
    }
};

/**
 * Create the block UI for this color field.
 * @package
 */
Blockly.BIB.FieldColor.prototype.initView = function() {
    this.size_ = new Blockly.utils.Size(
        this.getConstants().FIELD_COLOUR_DEFAULT_WIDTH,
        this.getConstants().FIELD_COLOUR_DEFAULT_HEIGHT);
    if (!this.getConstants().FIELD_COLOUR_FULL_BLOCK) {
        this.createBorderRect_();
        this.borderRect_.style['fillOpacity'] = '1';
    } else {
        this.clickTarget_ = this.sourceBlock_.getSvgRoot();
    }
    this.createTextElement_();
    this.updateSize_(5);
};

/**
 * @override
 * function is called from Blockly
 */
Blockly.BIB.FieldColor.prototype.applyColour = function() { // applyColour SIC!
    if (!this.getConstants().FIELD_COLOUR_FULL_BLOCK) {
        if (this.borderRect_) {
            this.borderRect_.style.fill = this.backgroundColor_;
            this.textElement_.style.fill = this.textColor_;
        }
    } else {
        this.sourceBlock_.pathObject.svgPath.setAttribute('fill', this.backgroundColor_);
        this.sourceBlock_.pathObject.svgPath.setAttribute('stroke', '#fff');
    }
};

/**
 * Ensure that the input value is a valid color.
 * @param {*=} opt_newValue The input value.
 * @return {?string} A valid color, or null if invalid.
 * @protected
 */
Blockly.BIB.FieldColor.prototype.doClassValidation_ = function(opt_newValue) {
    if (typeof opt_newValue != 'string') {
        return null;
    }
    return Blockly.utils.colour.parse(opt_newValue);
};

/**
 * Update the value of this color field, and update the displayed color.
 * @param {*} newValue The value to be saved. The default validator guarantees
 * that this is a color in '#rrggbb' format.
 * @protected
 */
Blockly.BIB.FieldColor.prototype.doValueUpdate_ = function(newValue) {
    //console.log(this);
    let row = this.getColorRow_(newValue);
    let bg = row[1];
    let fg = row[2];
    let caption = row[3];
    let showDot = row[4] || false;
    if (!this.captionsVisible_) {
        caption = '  •  ';
        if (!showDot) fg = bg;
    }
    this.colorCaption_ = caption;
    this.backgroundColor_ = bg;
    this.textColor_ = fg;
    this.value_ = newValue;
    if (this.borderRect_) {
        this.borderRect_.style.fill = bg;
        this.textElement_.style.fill = fg;
    } else if (this.sourceBlock_ && this.sourceBlock_.rendered) {
        this.sourceBlock_.pathObject.svgPath.setAttribute('fill', bg);
        this.sourceBlock_.pathObject.svgPath.setAttribute('stroke', fg);
    }
    this.isDirty_ = true;
};

/**
 * Get the text for this field.
 * @return {string} Text representing the value of this field.
 */
Blockly.BIB.FieldColor.prototype.getText = function() {
    return this.colorCaption_;
};




/**
 * Number of columns in the palette.
 * All color pickers use this unless overridden with setColumns.
 */
Blockly.BIB.FieldColor.COLUMNS = 7;


/**
 * Set a custom grid size for this field.
 * @param {number} columns Number of columns for this block,
 *     or 0 to use default (Blockly.BIB.FieldColor.COLUMNS).
 * @return {!Blockly.BIB.FieldColor} Returns itself (for method chaining).
 */
Blockly.BIB.FieldColor.prototype.setColumns = function(columns) {
    this.columns_ = columns;
    return this;
};

/**
 * Create and show the color field's editor.
 * @protected
 */
Blockly.BIB.FieldColor.prototype.showEditor_ = function() {
    this.dropdownCreate_();
    Blockly.DropDownDiv.getContentDiv().appendChild(this.picker_);

    Blockly.DropDownDiv.showPositionedByField(
        this, this.dropdownDispose_.bind(this));

    // Focus so we can start receiving keyboard events.
    this.picker_.focus({preventScroll:true});
};

/**
 * Handle a click on a color cell.
 * @param {!MouseEvent} e Mouse event.
 * @private
 */
Blockly.BIB.FieldColor.prototype.onClick_ = function(e) {
    var cell = /** @type {!Element} */ (e.target);
    var color = cell && cell.label;
    if (color !== null) {
        this.setValue(color);
        Blockly.DropDownDiv.hideIfOwner(this);
    }
};

/**
 * Handle a key down event. Navigate around the grid with the
 * arrow keys. Enter selects the highlighted color.
 * @param {!KeyboardEvent} e Keyboard event.
 * @private
 */
Blockly.BIB.FieldColor.prototype.onKeyDown_ = function(e) {
    var handled = false;
    if (e.keyCode === Blockly.utils.KeyCodes.UP) {
        this.moveHighlightBy_(0, -1);
        handled = true;
    } else if (e.keyCode === Blockly.utils.KeyCodes.DOWN) {
        this.moveHighlightBy_(0, 1);
        handled = true;
    } else if (e.keyCode === Blockly.utils.KeyCodes.LEFT) {
        this.moveHighlightBy_(-1, 0);
        handled = true;
    } else if (e.keyCode === Blockly.utils.KeyCodes.RIGHT) {
        this.moveHighlightBy_(1, 0);
        handled = true;
    } else if (e.keyCode === Blockly.utils.KeyCodes.ENTER) {
        // Select the highlighted color.
        var highlighted = this.getHighlighted_();
        if (highlighted) {
            var color = highlighted && highlighted.label;
            if (color !== null) {
                this.setValue(color);
            }
        }
        Blockly.DropDownDiv.hideWithoutAnimation();
        handled = true;
    }
    if (handled) {
        e.stopPropagation();
    }
};

/**
 * Move the currently highlighted position by dx and dy.
 * @param {number} dx Change of x
 * @param {number} dy Change of y
 * @private
 */
Blockly.BIB.FieldColor.prototype.moveHighlightBy_ = function(dx, dy) {
    var columns = this.columns_ || Blockly.BIB.FieldColor.COLUMNS;
    let colorTable = this.colorTable_;


    // Get the current x and y coordinates
    var x = this.highlightedIndex_ % columns;
    var y = Math.floor(this.highlightedIndex_ / columns);

    // Add the offset
    x += dx;
    y += dy;

    if (dx < 0) {
        // Move left one grid cell, even in RTL.
        // Loop back to the end of the previous row if we have room.
        if (x < 0 && y > 0) {
            x = columns - 1;
            y--;
        } else if (x < 0) {
            x = 0;
        }
    } else if (dx > 0) {
        // Move right one grid cell, even in RTL.
        // Loop to the start of the next row, if there's room.
        if ((x > columns - 1) && (y < Math.floor(colorTable.length / columns) - 1)) {
            x = 0;
            y++;
        } else if (x > columns - 1) {
            x--;
        }
    } else if (dy < 0) {
        // Move up one grid cell, stop at the top.
        if (y < 0) {
            y = 0;
        }
    } else if (dy > 0) {
        // Move down one grid cell, stop at the bottom.
        if (y > Math.floor(colorTable.length / columns) - 1) {
            y = Math.floor(colorTable.length / columns) - 1;
        }
    }

    // Move the highlight to the new coordinates.
    var cell = /** @type {!Element} */ (this.picker_.childNodes[y].childNodes[x]);
    var index = (y * columns) + x;
    this.setHighlightedCell_(cell, index);
};

/**
 * Handle a mouse move event. Highlight the hovered color.
 * @param {!MouseEvent} e Mouse event.
 * @private
 */
Blockly.BIB.FieldColor.prototype.onMouseMove_ = function(e) {
    var cell = /** @type {!Element} */ (e.target);
    var index = cell && Number(cell.getAttribute('data-index'));
    if (index !== null && index !== this.highlightedIndex_) {
        this.setHighlightedCell_(cell, index);
    }
};

/**
 * Handle a mouse enter event. Focus the picker.
 * @private
 */
Blockly.BIB.FieldColor.prototype.onMouseEnter_ = function() {
    this.picker_.focus({preventScroll:true});
};

/**
 * Handle a mouse leave event. Blur the picker and unhighlight
 * the currently highlighted color.
 * @private
 */
Blockly.BIB.FieldColor.prototype.onMouseLeave_ = function() {
    this.picker_.blur();
    var highlighted = this.getHighlighted_();
    if (highlighted) {
        Blockly.utils.dom.removeClass(highlighted, 'blocklyBIBColorHighlighted');
    }
};

/**
 * Returns the currently highlighted item (if any).
 * @return {?HTMLElement} Highlighted item (null if none).
 * @private
 */
Blockly.BIB.FieldColor.prototype.getHighlighted_ = function() {
    var columns = this.columns_ || Blockly.BIB.FieldColor.COLUMNS;
    var x = this.highlightedIndex_ % columns;
    var y = Math.floor(this.highlightedIndex_ / columns);
    var row = this.picker_.childNodes[y];
    if (!row) {
        return null;
    }
    var col = /** @type {HTMLElement} */ (row.childNodes[x]);
    return col;
};

/**
 * Update the currently highlighted cell.
 * @param {!Element} cell the new cell to highlight
 * @param {number} index the index of the new cell
 * @private
 */
Blockly.BIB.FieldColor.prototype.setHighlightedCell_ = function(cell, index) {
    // Unhighlight the current item.
    var highlighted = this.getHighlighted_();
    if (highlighted) {
        Blockly.utils.dom.removeClass(highlighted, 'blocklyBIBColorHighlighted');
    }
    // Highlight new item.
    Blockly.utils.dom.addClass(cell, 'blocklyBIBColorHighlighted');
    // Set new highlighted index.
    this.highlightedIndex_ = index;

    // Update accessibility roles.
    Blockly.utils.aria.setState(/** @type {!Element} */ (this.picker_),
        Blockly.utils.aria.State.ACTIVEDESCENDANT, cell.getAttribute('id'));
};

/**
 * Create a color picker dropdown editor.
 * @private
 */
Blockly.BIB.FieldColor.prototype.dropdownCreate_ = function() {
    var columns = this.columns_ || Blockly.BIB.FieldColor.COLUMNS;
    let colorTable = this.colorTable_;
    
    var selectedColor = this.getValue();
    // Create the palette.
    var table = document.createElement('table');
    table.className = 'blocklyBIBColorTable';
    table.tabIndex = 0;
    table.dir = 'ltr';
    Blockly.utils.aria.setRole(table, Blockly.utils.aria.Role.GRID);
    Blockly.utils.aria.setState(table, Blockly.utils.aria.State.EXPANDED, true);
    Blockly.utils.aria.setState(table, Blockly.utils.aria.State.ROWCOUNT,
        Math.floor(colorTable.length / columns));
    Blockly.utils.aria.setState(table, Blockly.utils.aria.State.COLCOUNT,
        columns);
    var row;
    for (var i = 0; i < colorTable.length; i++) {
        if (i % columns == 0) {
            row = document.createElement('tr');
            Blockly.utils.aria.setRole(row, Blockly.utils.aria.Role.ROW);
            table.appendChild(row);
        }
        let colorRow = colorTable[i];
        
        var cell = document.createElement('td');
        row.appendChild(cell);
        cell.innerText = '•';
        cell.label = colorRow[0];  // This becomes the value, if clicked.
        cell.title = colorRow[3];
        cell.id = Blockly.utils.IdGenerator.getNextUniqueId();
        cell.setAttribute('data-index', i);
        Blockly.utils.aria.setRole(cell, Blockly.utils.aria.Role.GRIDCELL);
        Blockly.utils.aria.setState(cell,
            Blockly.utils.aria.State.LABEL, colorRow[0]);
        Blockly.utils.aria.setState(cell,
            Blockly.utils.aria.State.SELECTED, colorRow[0] == selectedColor);
        cell.style.backgroundColor = colorRow[1];
        if (colorRow[4]) {
            cell.style.color = colorRow[2];
        } else {
            cell.style.color = colorRow[1];
        }
        if (colorRow[0] == selectedColor) {
            cell.className = 'blocklyBIBColorSelected';
            this.highlightedIndex_ = i;
        }
    }

    // Configure event handler on the table to listen for any event in a cell.
    this.onClickWrapper_ = Blockly.browserEvents.conditionalBind(
        table, 'click', this, this.onClick_, true);
    this.onMouseMoveWrapper_ = Blockly.browserEvents.conditionalBind(
        table, 'mousemove', this, this.onMouseMove_, true);
    this.onMouseEnterWrapper_ = Blockly.browserEvents.conditionalBind(
        table, 'mouseenter', this, this.onMouseEnter_, true);
    this.onMouseLeaveWrapper_ = Blockly.browserEvents.conditionalBind(
        table, 'mouseleave', this, this.onMouseLeave_, true);
    this.onKeyDownWrapper_ = Blockly.browserEvents.conditionalBind(
        table, 'keydown', this, this.onKeyDown_);

    this.picker_ = table;
};

/**
 * Disposes of events and DOM-references belonging to the color editor.
 * @private
 */
Blockly.BIB.FieldColor.prototype.dropdownDispose_ = function() {
    if (this.onClickWrapper_) {
        Blockly.browserEvents.unbind(this.onClickWrapper_);
        this.onClickWrapper_ = null;
    }
    if (this.onMouseMoveWrapper_) {
        Blockly.browserEvents.unbind(this.onMouseMoveWrapper_);
        this.onMouseMoveWrapper_ = null;
    }
    if (this.onMouseEnterWrapper_) {
        Blockly.browserEvents.unbind(this.onMouseEnterWrapper_);
        this.onMouseEnterWrapper_ = null;
    }
    if (this.onMouseLeaveWrapper_) {
        Blockly.browserEvents.unbind(this.onMouseLeaveWrapper_);
        this.onMouseLeaveWrapper_ = null;
    }
    if (this.onKeyDownWrapper_) {
        Blockly.browserEvents.unbind(this.onKeyDownWrapper_);
        this.onKeyDownWrapper_ = null;
    }
    this.picker_ = null;
    this.highlightedIndex_ = null;
};


Blockly.BIB.FieldColor.prototype.showCaption = function() {
    this.captionsVisible_ = true;
    this.doValueUpdate_(this.value_);
    this.forceRerender();
}

Blockly.BIB.FieldColor.prototype.hideCaption = function() {
    this.captionsVisible_ = false;
    this.doValueUpdate_(this.value_);
    this.forceRerender();
}


Blockly.BIB.FieldColor.prototype.getColorRow_ = function(color) {
    for (const row of this.colorTable_) {
        if (row[0]===color) return row;
    }
    return [color, color, '#ffffff', '?'];
}

Blockly.BIB.FieldColor.prototype.setColorTable = function(colorTable) {
    this.colorTable_ = colorTable;
    this.doValueUpdate_(this.value_);
    this.forceRerender();
}

Blockly.BIB.FieldColor.COLOR_TABLE = [
    // value     bgcolor    fgcolor   caption
    ['#000000', '#000000', '#ffffff', 'black'],
    ['#ffffff', '#ffffff', '#000000', 'white'],
    ['#ff0000', '#ff0000', '#000000', 'red'],
    ['#00ff00', '#00ff00', '#000000', 'green'],
    ['#0000ff', '#0000ff', '#ffffff', 'blue'],
];

/**
 * The default value for this field.
 * @type {*}
 * @protected
 */
Blockly.BIB.FieldColor.prototype.DEFAULT_VALUE = Blockly.BIB.FieldColor.COLOR_TABLE[0][0];


Blockly.BIB.FieldColor.prototype.colorTable_ = Blockly.BIB.FieldColor.COLOR_TABLE;

/**
 * CSS for color picker.  See css.js for use.
 */
Blockly.Css.register([
    /* eslint-disable indent */
    '.blocklyBIBColorTable {',
        'border-collapse: collapse;',
        'display: block;',
        'outline: none;',
        'padding: 1px;',
    '}',

    '.blocklyBIBColorTable>tr>td {',
        'border: .5px solid #888;',
        'box-sizing: border-box;',
        'cursor: pointer;',
        'display: inline-block;',
        'height: 40px;',
        'padding: 0;',
        'width: 40px;',
        'margin: 4px;',
        'border-radius: 30%;',
        'font-size: 27px;',
        'text-align: center;',
        'user-select: none;',
    '}',

    '.blocklyBIBColorTable>tr>td.blocklyBIBColorHighlighted {',
        'border-color: #eee;',
        'box-shadow: 2px 2px 7px 2px rgba(0,0,0,.3);',
        'position: relative;',
    '}',

    '.blocklyBIBColorSelected, .blocklyBIBColorSelected:hover {',
        'border-color: #eee !important;',
        'outline: 1px solid #333;',
        'position: relative;',
    '}'
    /* eslint-enable indent */
]);

Blockly.fieldRegistry.register('bib_field_color', Blockly.BIB.FieldColor);
