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
 * @fileoverview Object representing a play icon.
 * (based on blockly zoom icon code)
 * @author nils@bob3.org (Nils Springob)
 */
'use strict';

goog.provide('Blockly.BIB.PlayButtonArea');

goog.require('Blockly.browserEvents');
goog.require('Blockly.ComponentManager');
/** @suppress {extraRequire} */
goog.require('Blockly.constants');
goog.require('Blockly.Css');
goog.require('Blockly.Events');
/** @suppress {extraRequire} */
goog.require('Blockly.Events.Click');
goog.require('Blockly.IPositionable');
goog.require('Blockly.Touch');
goog.require('Blockly.uiPosition');
goog.require('Blockly.utils');
goog.require('Blockly.utils.dom');
goog.require('Blockly.utils.Rect');
goog.require('Blockly.utils.Svg');

goog.requireType('Blockly.WorkspaceSvg');


/**
 * Class for a zoom controls.
 * @param {!Blockly.WorkspaceSvg} workspace The workspace to sit in.
 * @constructor
 * @implements {Blockly.IPositionable}
 */
Blockly.BIB.PlayButtonArea = function(workspace) {
    /**
     * @type {!Blockly.WorkspaceSvg}
     * @private
     */
    this.workspace_ = workspace;

    /**
     * The unique id for this component that is used to register with the
     * ComponentManager.
     * @type {string}
     */
    this.id = 'BIB.PlayButtonArea';

    /**
     * A handle to use to unbind the mouse down event handler for zoom reset
     *    button. Opaque data returned from Blockly.bindEventWithChecks_.
     * @type {?Blockly.browserEvents.Data}
     * @private
     */
    this.onPlayButtonClickWrapper_ = null;

    /**
     * The zoom reset svg <g> element.
     * @type {SVGGElement}
     * @private
     */
    this.playButtonGroup_ = null;
    
    this.playButtonStatus = '';
};

/**
 * Width of the zoom controls.
 * @type {number}
 * @const
 * @private
 */
Blockly.BIB.PlayButtonArea.prototype.WIDTH_ = 32;

/**
 * Height of each zoom control.
 * @type {number}
 * @const
 * @private
 */
Blockly.BIB.PlayButtonArea.prototype.HEIGHT_ = 32;

/**
 * Small spacing used between the zoom in and out control, in pixels.
 * @type {number}
 * @const
 * @private
 */
Blockly.BIB.PlayButtonArea.prototype.SMALL_SPACING_ = 2;

/**
 * Large spacing used between the zoom in and reset control, in pixels.
 * @type {number}
 * @const
 * @private
 */
Blockly.BIB.PlayButtonArea.prototype.LARGE_SPACING_ = 11;

/**
 * Distance between zoom controls and bottom or top edge of workspace.
 * @type {number}
 * @const
 * @private
 */
Blockly.BIB.PlayButtonArea.prototype.MARGIN_VERTICAL_ = 20;

/**
 * Distance between zoom controls and right or left edge of workspace.
 * @type {number}
 * @private
 */
Blockly.BIB.PlayButtonArea.prototype.MARGIN_HORIZONTAL_ = 20;

/**
 * The SVG group containing the zoom controls.
 * @type {SVGElement}
 * @private
 */
Blockly.BIB.PlayButtonArea.prototype.svgGroup_ = null;

/**
 * Left coordinate of the zoom controls.
 * @type {number}
 * @private
 */
Blockly.BIB.PlayButtonArea.prototype.left_ = 0;

/**
 * Top coordinate of the zoom controls.
 * @type {number}
 * @private
 */
Blockly.BIB.PlayButtonArea.prototype.top_ = 0;


/**
 * Whether this has been initialized.
 * @type {boolean}
 * @private
 */
Blockly.BIB.PlayButtonArea.prototype.initialized_ = false;


/**
 * Create the zoom controls.
 * @return {!SVGElement} The zoom controls SVG group.
 */
Blockly.BIB.PlayButtonArea.prototype.createDom = function() {
    this.svgGroup_ = Blockly.utils.dom.createSvgElement(Blockly.utils.Svg.G, {'class': 'BIB-PlayButtonArea'}, null);
    this.createPlayButtonSvg_();
    return this.svgGroup_;
};


/**
 * Initializes the zoom controls.
 */
Blockly.BIB.PlayButtonArea.prototype.init = function() {
    this.workspace_.getComponentManager().addComponent({
        component: this,
        weight: 0,
        capabilities: [Blockly.ComponentManager.Capability.POSITIONABLE]
    });
    this.initialized_ = true;
};


/**
 * Disposes of this zoom controls.
 * Unlink from all DOM elements to prevent memory leaks.
 */
Blockly.BIB.PlayButtonArea.prototype.dispose = function() {
    this.workspace_.getComponentManager().removeComponent('BIB.PlayButtonArea');
    if (this.svgGroup_) {
        Blockly.utils.dom.removeNode(this.svgGroup_);
    }
    if (this.onPlayButtonClickWrapper_) {
        Blockly.browserEvents.unbind(this.onPlayButtonClickWrapper_);
    }
};


/**
 * Returns the bounding rectangle of the UI element in pixel units relative to
 * the Blockly injection div.
 * @return {?Blockly.utils.Rect} The UI elements’s bounding box. Null if
 *   bounding box should be ignored by other UI elements.
 */
Blockly.BIB.PlayButtonArea.prototype.getBoundingRectangle = function() {
    var bottom = this.top_ + this.HEIGHT_;
    var right = this.left_ + this.WIDTH_;
    return new Blockly.utils.Rect(this.top_, bottom, this.left_, right);
};


/**
 * Positions the zoom controls.
 * It is positioned in the opposite corner to the corner the
 * categories/toolbox starts at.
 * @param {!Blockly.MetricsManager.UiMetrics} metrics The workspace metrics.
 * @param {!Array<!Blockly.utils.Rect>} savedPositions List of rectangles that
 *     are already on the workspace.
 */
Blockly.BIB.PlayButtonArea.prototype.position = function(metrics, savedPositions) {
    // Not yet initialized.
    if (!this.initialized_) {
        return;
    }

    var cornerPosition = Blockly.uiPosition.getCornerOppositeToolbox(this.workspace_, metrics);
    var startRect = Blockly.uiPosition.getStartPositionRect(
        cornerPosition, new Blockly.utils.Size(this.WIDTH_, this.HEIGHT_),
        this.MARGIN_HORIZONTAL_+100, this.MARGIN_VERTICAL_, metrics,
        this.workspace_);

    var verticalPosition = cornerPosition.vertical;
    var bumpDirection =
        verticalPosition === Blockly.uiPosition.verticalPosition.TOP ?
            Blockly.uiPosition.bumpDirection.DOWN :
            Blockly.uiPosition.bumpDirection.UP;
    var positionRect = Blockly.uiPosition.bumpPositionRect(
        startRect, this.MARGIN_VERTICAL_, bumpDirection, savedPositions);

    this.top_ = positionRect.top;
    this.left_ = positionRect.left;
    this.svgGroup_.setAttribute('transform', 'translate(' + this.left_ + ',' + this.top_ + ')');
};


/**
 * Create the zoom reset icon and its event handler.
 * @param {string} rnd The random string to use as a suffix in the clip path's
 *     ID.  These IDs must be unique in case there are multiple Blockly
 *     instances on the same page.
 * @private
 */
Blockly.BIB.PlayButtonArea.prototype.createPlayButtonSvg_ = function() {
    this.playButtonGroup_ = Blockly.utils.dom.createSvgElement(Blockly.utils.Svg.G, {'class': 'play-button'}, this.svgGroup_);
    
    // <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
    let image_svg = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="black" d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"></path></svg>';
    
    var playButtonImageSvg = Blockly.utils.dom.createSvgElement(
        Blockly.utils.Svg.IMAGE, {'height': 32 + 'px', 'width': 32 + 'px', 'alt': 'Run Program'}, this.playButtonGroup_);
    
    playButtonImageSvg.setAttributeNS(Blockly.utils.dom.XLINK_NS, 'xlink:href', image_svg);
    
    // Attach event listeners.
    this.onPlayButtonClickWrapper_ = Blockly.browserEvents.conditionalBind(this.playButtonGroup_, 'click', null, this.playButtonClick_.bind(this));
};


Blockly.BIB.PlayButtonArea.prototype.setPlayButtonStatus = function(status) {
    console.log('Blockly.BIB.PlayButtonArea.prototype.setPlayButtonStatus', status);
    this.playButtonStatus = status;
    if (status=='busy') {
        this.playButtonGroup_.setAttribute('class', 'play-button busy');
    } else if (status=='disabled') {
        this.playButtonGroup_.setAttribute('class', 'play-button disabled');
    } else {
        this.playButtonGroup_.setAttribute('class', 'play-button');
    }
};


/**
 * Handles a mouse down event on the reset zoom button on the workspace.
 * @param {!Event} e A mouse down event.
 * @private
 */
Blockly.BIB.PlayButtonArea.prototype.playButtonClick_ = function(e) {
    console.log('Blockly.BIB.PlayButtonArea.prototype.playButtonClick_');
    if (this.playButtonStatus=='busy') return;
    if (this.playButtonStatus=='disabled') return;
    this.firePlayButtonClickEvent_();
};

/**
 * Fires a zoom control UI event.
 * @private
 */
Blockly.BIB.PlayButtonArea.prototype.firePlayButtonClickEvent_ = function() {
  var uiEvent = new (Blockly.Events.get(Blockly.Events.CLICK))(
      null, this.workspace_.id, 'play-button');
  Blockly.Events.fire(uiEvent);
};

/**
 * CSS for zoom controls.  See css.js for use.
 */
Blockly.Css.register([
  /* eslint-disable indent */
  '.BIB-PlayButtonArea>.play-button, .BIB-PlayButtonArea>svg>.play-button {',
    'opacity: .7;',
  '}',

  '.BIB-PlayButtonArea>.play-button:hover, .BIB-PlayButtonArea>svg>.play-button:hover {',
    'opacity: 1;',
  '}',

  '.BIB-PlayButtonArea>.play-button:active, .BIB-PlayButtonArea>svg>.play-button:active {',
    'opacity: 1;',
  '}',

  '.BIB-PlayButtonArea>.play-button.busy, .BIB-PlayButtonArea>svg>.play-button.busy {',
    'opacity: .2;',
    'cursor: wait;',
  '}',

  '.BIB-PlayButtonArea>.play-button.disabled, .BIB-PlayButtonArea>svg>.play-button.disabled {',
    'opacity: .2;',
    'cursor: not-allowed;',
  '}'
  /* eslint-enable indent */
]);
