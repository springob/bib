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
 * @fileoverview point matrix input field (9x7)
 * @author nils@bob3.org (Nils Springob)
 */

goog.provide('Blockly.BIB.FieldImageMatrix');
goog.provide('Blockly.BIB.EditorImageMatrix');


goog.require('Blockly.Css');
goog.require('Blockly.Events');
goog.require('Blockly.Field');
goog.require('Blockly.fieldRegistry');
goog.require('Blockly.utils.dom');
goog.require('Blockly.utils.object');
goog.require('Blockly.utils.string');


Blockly.BIB.EditorImageMatrix = function() {
    
}

Blockly.BIB.EditorImageMatrix.prototype.render = function(parentDiv) {
    let $element = jQuery("<div class=\"image-matrix-editor\">");
    
    for (let y=0; y<7; y++) {
        let $div = jQuery('<div>');
        for (let x=0; x<9; x++) {
            $div.append('<input type=\"checkbox\">');
        }
        $element.append($div);
    }

    this.$element_ = $element;
    jQuery(parentDiv).append($element);
    
    $element.find('input').on('change', this.onChange_.bind(this));
    
    this.showMatrix_();
}


Blockly.BIB.EditorImageMatrix.prototype.setMatrix = function(matrix) {
    this.matrix_ = matrix;
    this.showMatrix_();
}

Blockly.BIB.EditorImageMatrix.prototype.showMatrix_ = function() {
    if (!this.matrix_ || !this.$element_) return;

    for (let y=0; y<7; y++) {
        let $div = this.$element_.find('div:eq('+y+')');
        for (let x=0; x<9; x++) {
            let val = this.matrix_[y][x];
            let $cb = $div.find('input:eq('+x+')');
            $cb.prop('checked', val!=0);
        }
    }
}

Blockly.BIB.EditorImageMatrix.prototype.onChange_ = function() {
    if (!this.matrix_ || !this.$element_) return;

    for (let y=0; y<7; y++) {
        let $div = this.$element_.find('div:eq('+y+')');
        for (let x=0; x<9; x++) {
            let $cb = $div.find('input:eq('+x+')');
            this.matrix_[y][x] = $cb.prop('checked')?1:0;
        }
    }
}

/**
 * Class for a date input field.
 * @param {string=} value The initial value of the field. Should be in
 *    'YYYY-MM-DD' format. Defaults to the current date.
 * @param {Function=} validator A function that is called to validate
 *    changes to the field's value. Takes in a date string & returns a
 *    validated date string ('YYYY-MM-DD' format), or null to abort the change.
 * @param {?(boolean|string)=} textEdit Whether to enable text editor.
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.BIB.FieldImageMatrix = function(opt_value = undefined, opt_validator = undefined, opt_config = undefined) {
    /**
    * The default value for this field (current date).
    * @type {*}
    * @protected
    */
    Blockly.FieldImageMatrix.prototype.DEFAULT_VALUE = '0x00, 0x0c, 0x1e, 0x3e, 0x7c, 0x3e, 0x1e, 0x0c, 0x00'; // heart

    this.matrix_ = [
            [0,0,0,0,0,0,0,0,0],
            [0,0,1,1,0,1,1,0,0],
            [0,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,1,0,0],
            [0,0,0,1,1,1,0,0,0],
            [0,0,0,0,1,0,0,0,0]
    ];

    
    Blockly.BIB.FieldImageMatrix.superClass_.constructor.call(this, opt_value, opt_validator, opt_config);
    
    
    // Initialize other properties.
    /**
    * The size of the area rendered by the field.
    * @type {Blockly.utils.Size}
    * @protected
    * @override
    */
    this.size_ = new Blockly.utils.Size(54,
        42 + Blockly.FieldImageMatrix.Y_PADDING);
    
    // "/media/matrix_heart2.svg"
    //Blockly.FieldImageMatrix.superClass_.constructor.call(this, this.createSVG_(), 54, 42, "*");

    
};
Blockly.utils.object.inherits(Blockly.BIB.FieldImageMatrix, Blockly.Field);


/**
 * Constructs a FieldImageMatrix from a JSON arg object.
 * @param {!Object} options A JSON object with options (date).
 * @return {!Blockly.FieldImageMatrix} The new field instance.
 * @package
 * @nocollapse
 */
Blockly.BIB.FieldImageMatrix.fromJson = function(options) {
  return new Blockly.FieldImageMatrix(options['value'], undefined, options);
};

/**
 * Serializable fields are saved by the XML renderer, non-serializable fields
 * are not. Editable fields should also be serializable.
 * @type {boolean}
 */
Blockly.BIB.FieldImageMatrix.prototype.SERIALIZABLE = true;

/**
 * Mouse cursor style when over the hotspot that initiates the editor.
 */
Blockly.BIB.FieldImageMatrix.prototype.CURSOR = 'text';

/**
 * Border colour for the dropdown div showing the date picker. Must be a CSS
 * string.
 * @type {string}
 * @private
 */
Blockly.BIB.FieldImageMatrix.prototype.DROPDOWN_BORDER_COLOUR = 'silver';

/**
 * Background colour for the dropdown div showing the date picker. Must be a
 * CSS string.
 * @type {string}
 * @private
 */
Blockly.BIB.FieldImageMatrix.prototype.DROPDOWN_BACKGROUND_COLOUR = '#3d3479';

/**
 * Vertical padding below the image, which is included in the reported height of
 * the field.
 * @type {number}
 * @private
 */
Blockly.BIB.FieldImageMatrix.Y_PADDING = 1;

/**
 * Ensures that the input value is a valid date.
 * @param {*=} newValue The input value.
 * @return {?string} A valid date, or null if invalid.
 * @protected
 */
Blockly.BIB.FieldImageMatrix.prototype.doClassValidation_ = function(newValue = undefined) {
    if (!newValue) {
        return null;
    }
    /*
    // Check if the new value is parsable or not.
    var date = goog.date.Date.fromIsoString(newValue);
    if (!date || date.toIsoString(true) != newValue) {
        return null;
    }
    */
    return newValue;
};

/**
 * Renders the field. If the picker is shown make sure it has the current
 * date selected.
 * @protected
 */
Blockly.BIB.FieldImageMatrix.prototype.render_ = function() {
    Blockly.BIB.FieldImageMatrix.superClass_.render_.call(this);
    if (this.picker_ && this.isTextValid_) {
        //this.picker_.setDate(goog.date.Date.fromIsoString(this.getValue()));
        this.updateEditor_();
    }
};

/**
 * Updates the field's colours to match those of the block.
 * @package
 */
Blockly.BIB.FieldImageMatrix.prototype.applyColour = function() {
  this.todayColour_ = this.sourceBlock_.style.colourPrimary;
  this.selectedColour_ = this.sourceBlock_.style.colourSecondary;
  this.updateEditor_();
};

/**
 * Create the block UI for this image.
 * @package
 */
Blockly.BIB.FieldImageMatrix.prototype.initView = function() {
    
    this.imageElement_ = Blockly.utils.dom.createSvgElement(
        Blockly.utils.Svg.IMAGE,
        {
            'height': 42 + 'px',
            'width': 54 + 'px',
            'alt': 'image matrix'
        },
        this.fieldGroup_);
    
    this.doValueUpdate_(this.value_);
    
    //  this.imageElement_.setAttributeNS(Blockly.utils.dom.XLINK_NS,
    //      'xlink:href', this.createSVG_());

    if (this.clickHandler_) {
        this.imageElement_.style.cursor = 'pointer';
    }
};

/**
 * @override
 */
Blockly.BIB.FieldImageMatrix.prototype.updateSize_ = function() {
    // NOP
};

/**
 * Update the value of this image field, and update the displayed image.
 * @param {*} newValue The value to be saved. The default validator guarantees
 * that this is a string.
 * @protected
 */
Blockly.BIB.FieldImageMatrix.prototype.doValueUpdate_ = function(newValue) {
    //console.log('doValueUpdate_', newValue);
    this.value_ = newValue;
    this.setHexArray(newValue);
    this.updateEditor_();

    if (this.imageElement_) {
        this.imageElement_.setAttributeNS(Blockly.utils.dom.XLINK_NS, 'xlink:href', this.createSVG_());
    }
};

/**
 * Updates the picker to show the current date and currently selected date.
 * @private
 */
Blockly.BIB.FieldImageMatrix.prototype.updateEditor_ = function() {
    if (!this.picker_) {
        // Nothing to update.
        return;
    }
    this.picker_.setMatrix(this.matrix_);
};

/**
 * Shows the inline free-text editor on top of the text along with the date
 * editor.
 * @param {Event=} e Optional mouse event that triggered the field to
 *     open, or undefined if triggered programmatically.
 * @param {boolean=} _quietInput Quiet input.
 * @protected
 * @override
 */
Blockly.BIB.FieldImageMatrix.prototype.showEditor_ = function(e = undefined, _quietInput = undefined) {
  if (this.textEditEnabled_) {
    // Mobile browsers have issues with in-line textareas (focus & keyboards).
    const noFocus =
        Blockly.utils.userAgent.MOBILE ||
        Blockly.utils.userAgent.ANDROID ||
        Blockly.utils.userAgent.IPAD;
    Blockly.BIB.FieldImageMatrix.superClass_.showEditor_.call(this, e, noFocus);
  }
  // Build the DOM.
  this.showDropdown_();
};

/**
 * Shows the date dropdown editor.
 * @private
 */
Blockly.BIB.FieldImageMatrix.prototype.showDropdown_ = function() {
  if (this.picker_) {
    // Already visible.
    return;
  }
  this.picker_ = this.dropdownCreate_();
  this.picker_.render(Blockly.DropDownDiv.getContentDiv());
  Blockly.DropDownDiv.setColour(
      this.DROPDOWN_BACKGROUND_COLOUR, this.DROPDOWN_BORDER_COLOUR);
  Blockly.DropDownDiv.showPositionedByField(
      this, this.dropdownDispose_.bind(this));

  this.updateEditor_();
};

/**
 * Creates the date dropdown editor.
 * @return {!goog.ui.DatePicker} The newly created date picker.
 * @private
 */
Blockly.BIB.FieldImageMatrix.prototype.dropdownCreate_ = function() {
    return new Blockly.BIB.EditorImageMatrix();

};

/**
 * Handles a click on the text input.
 * @param {!MouseEvent} e Mouse event.
 * @private
 */
Blockly.BIB.FieldImageMatrix.prototype.onClick_ = function(e) {
    if (this.isTextValid_) {
        this.showDropdown_();
    }
};

/**
 * Binds handlers for user input on the text input field's editor.
 * @param {!HTMLElement} htmlInput The htmlInput to which event
 *    handlers will be bound.
 * @protected
 * @override
 */
Blockly.BIB.FieldImageMatrix.prototype.bindInputEvents_ = function(htmlInput) {
  Blockly.BIB.FieldImageMatrix.superClass_.bindInputEvents_.call(this, htmlInput);

  this.onClickWrapper_ = Blockly.bindEventWithChecks_(htmlInput,
      'click', this, this.onClick_, true);
};

/**
 * Unbinds handlers for user input and workspace size changes.
 * @private
 * @override
 */
Blockly.BIB.FieldImageMatrix.prototype.unbindInputEvents_ = function() {
  Blockly.BIB.FieldImageMatrix.superClass_.unbindInputEvents_.call(this);
  if (this.onClickWrapper_) {
    Blockly.unbindEvent_(this.onClickWrapper_);
    this.onClickWrapper_ = null;
  }
};

/**
 * Disposes of references to DOM elements and events belonging
 * to the date editor.
 * @private
 */
Blockly.BIB.FieldImageMatrix.prototype.dropdownDispose_ = function() {
    this.picker_ = null;
    this.setValue(this.getHexArray());
    /*
    if (this.imageElement_) {
        this.imageElement_.setAttributeNS(Blockly.utils.dom.XLINK_NS,
            'xlink:href', this.createSVG_());
    }
    */
};

/**
 * Handles a CHANGE event in the date picker.
 * @param {!Event} event The CHANGE event.
 * @private
 */
Blockly.BIB.FieldImageMatrix.prototype.onDateSelected_ = function(event) {
  if (this.isDirty_) {
    // Ignores date changes triggered during text edit.
    return;
  }
  var date = event.date ? event.date.toIsoString(true) : '';
  this.setValue_(date);
  Blockly.WidgetDiv.hide();
  Blockly.DropDownDiv.hideIfOwner(this);
};


Blockly.BIB.FieldImageMatrix.prototype.createSVG_ = function() {
    const style_0 = 'fill:none;stroke:white;stroke-width:1;stroke-opacity:0.5;';
    const style_1 = 'fill:white;stroke:white;stroke-width:1;stroke-opacity:1;';
    
    let data = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 54 42"><g>';
  
    for (let y=0; y<7; y++) {
        for (let x=0; x<9; x++) {
            let style = (this.matrix_[y][x]==0) ? style_0 : style_1;
            data += '<circle style="'+style+'" cx="'+(6*x+3)+'" cy="'+(6*y+3)+'" r="1.5" />';
        }
    }
    data += '</g></svg>';
    return data;
}


Blockly.BIB.FieldImageMatrix.prototype.getHexArray = function() {
    let result = [];
  
    for (let x=0; x<9; x++) {
        let sum = 0;
        let value = 1;
        for (let y=0; y<7; y++) {
            sum += (this.matrix_[y][x]) * value;
            value *= 2;
        }
        sum = Number(sum).toString(16);
        if(sum.length<2) sum = '0'+sum;
        result.push('0x'+sum);
    }
    
    result = result.join(', ');
    //console.log('getHexArray', result);
    return result;
}

Blockly.BIB.FieldImageMatrix.prototype.setHexArray = function(data) {
    //console.log('setHexArray', data);
    data = data.split(',');
    if (data.length!=9) {
        //console.log('invalid array length', data.length);
        return;
    }
    
    for (let x=0; x<9; x++) {
        let val = parseInt(data[x].trim());
        let value = 1;
        for (let y=0; y<7; y++) {
            this.matrix_[y][x] = (value & val)?1:0;
            value *= 2;
        }
    }
}



/**
 * CSS for date picker.  See css.js for use.
 */
Blockly.Css.register([
  /* eslint-disable indent */

  '.image-matrix-editor {',
    'line-height: 0px;',
    'margin: 5px;',
  '}',
  
  '.image-matrix-editor [type="checkbox"] {',
    'appearance: none;',
    'width: 20px;',
    'height: 20px;',
    'margin: 2px;',
    'border-radius: 50%;',
    'border: 2px solid #9583c6;',
  '}',

  '.image-matrix-editor [type="checkbox"]:checked {',
    'appearance: none;',
    'background-color: white;',
  '}',
  
 
  /* eslint-enable indent */
]);

Blockly.fieldRegistry.register('field_imageMatrix', Blockly.BIB.FieldImageMatrix);


