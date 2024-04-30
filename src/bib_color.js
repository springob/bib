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
 * @fileoverview BOB3 robot blocks for Blockly.
 * @author nils@bob3.org (Nils Springob)
 */
'use strict';

goog.provide('Blockly.BIB.Colors');
goog.require('Blockly.BIB.lib');


Blockly.Blocks['color_picker'] = {
    debug_out: Blockly.BIB.lib.DEBUG_OFF,
    
    init: function() {
        this.debug_out('init', this);
        
        Blockly.BIB.lib.initializeMutationData(this, {
            showCaption: false
        });

        this.jsonInit({
            // Block for color picker.
            "type": "color_picker",
            "message0": "%1",
            "args0": [
                {
                    "type": "bib_field_color",
                    "name": "COLOR",
                    "color": "#000000"
                }
            ],
            "inputsInline": true,
            "output": "Color",
            "helpUrl": "%{BKY_COLOR_PICKER_HELPURL}",
            "style": "rblk_color_blocks",
            "tooltip": "%{BKY_COLOR_PICKER_TOOLTIP}",
            "extensions": ["parent_tooltip_when_inline"]
        });
        
        let colorField = this.getField('COLOR');
        colorField.setColumns(6);
        colorField.setColorTable(Blockly.BIB.Colors.COLOR_TABLE);
        
    },
    
    onchange: function(event) {
        if (event.blockId == this.id) {
            this.debug_out('onchange', 'EVENT', event.type, event);
        }
    },
    
    afterDomToMutation: function(mutation) {
        this.setShowCaption_(this.mutationData.showCaption);
    },
    
    customContextMenu: function(menuitems) {
        let customItems = [];
        if (this.mutationData.showCaption) {
            customItems.push({text: "Farbnamen nicht mehr anzeigen", enabled: 'true', callback: this.setShowCaption_.bind(this, false), weight: 2});
        }else {
            customItems.push({text: "Farbnamen anzeigen", enabled: 'true', callback: this.setShowCaption_.bind(this, true), weight: 2});
        }
        Blockly.BIB.lib.filterCustomContextMenu(menuitems, ['comment', 'help'], customItems, false, this);
    },
    
    setShowCaption_: function(showCaption) {
        this.mutationData.showCaption = showCaption;
        let colorField = this.getField('COLOR');
        if (showCaption) {
            colorField.showCaption();
        } else {
            colorField.hideCaption();
        }
    },
    
};

Blockly.defineBlocksWithJsonArray([  // BEGIN JSON EXTRACT
  

  // Block for random color.
  {
    "type": "color_random",
    "message0": "%1 %{BKY_COLOR_RANDOM_TITLE}",
    "args0": [
      {
        "type": "field_image",
        "src": Blockly.Constants.SCB_ICONS.ICON_BROOM,
        "width": 18,
        "height": 18,
      }
    ],
    "output": "Color",
    "helpUrl": "%{BKY_COLOR_RANDOM_HELPURL}",
    "style": "rblk_color_blocks",
    "tooltip": "%{BKY_COLOR_RANDOM_TOOLTIP}"
  },

  // Block for composing a color from RGB components.
  {
    "type": "color_rgb",
    "message0": "%1 %{BKY_COLOR_RGB_TITLE} r:%2 g:%3 b:%4",
    "args0": [
      {
        "type": "field_image",
        "src": Blockly.Constants.SCB_ICONS.ICON_BROOM,
        "width": 18,
        "height": 18,
      }, {
        "type": "input_value",
        "name": "RED",
        "check": "Number",
        "align": "RIGHT"
      }, {
        "type": "input_value",
        "name": "GREEN",
        "check": "Number",
        "align": "RIGHT"
      }, {
        "type": "input_value",
        "name": "BLUE",
        "check": "Number",
        "align": "RIGHT"
      }
    ],
    "inputsInline": true,
    "output": "Color",
    "helpUrl": "%{BKY_COLOR_RGB_HELPURL}",
    "style": "rblk_color_blocks",
    "tooltip": "%{BKY_COLOR_RGB_TOOLTIP}"
  },

  // Block for composing a color from HSV components.
  {
    "type": "color_hsv",
    "message0": "%1 %{BKY_COLOR_HSV_TITLE} h:%2 s:%3 v:%4",
    "args0": [
      {
        "type": "field_image",
        "src": Blockly.Constants.SCB_ICONS.ICON_BROOM,
        "width": 18,
        "height": 18,
      }, {
        "type": "input_value",
        "name": "HUE",
        "check": "Number",
        "align": "RIGHT"
      }, {
        "type": "input_value",
        "name": "SAT",
        "check": "Number",
        "align": "RIGHT"
      }, {
        "type": "input_value",
        "name": "VAL",
        "check": "Number",
        "align": "RIGHT"
      }
    ],
    "inputsInline": true,
    "output": "Color",
    "helpUrl": "%{BKY_COLOR_HSV_HELPURL}",
    "style": "rblk_color_blocks",
    "tooltip": "%{BKY_COLOR_HSV_TOOLTIP}"
  },
  
  // Block for blending two colors together.
  {
    "type": "color_blend",
    "message0": "%1 mische %4 %2 mit Rest %3",
    "args0": [
      {
        "type": "field_image",
        "src": Blockly.Constants.SCB_ICONS.ICON_BROOM,
        "width": 18,
        "height": 18,
      }, {
        "type": "input_value",
        "name": "COLOR1",
        "check": "Color",
        "align": "RIGHT"
      }, {
        "type": "input_value",
        "name": "COLOR2",
        "check": "Color",
        "align": "RIGHT"
      }, {
        "type": "input_value",
        "name": "RATIO",
        "check": "Number",
        "align": "RIGHT"
      }
    ],
    "inputsInline": true,
    "output": "Color",
    "helpUrl": "%{BKY_COLOR_BLEND_HELPURL}",
    "style": "rblk_color_blocks",
    "tooltip": "%{BKY_COLOR_BLEND_TOOLTIP}"
  },
  
  {
    "type": "color_component",
    "message0": "%1 von %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "COMPONENT",
        "options": [
          ["R: Rot-Anteil", "RED"],
          ["G: Grün-Anteil", "GREEN"],
          ["B: Blau-Anteil", "BLUE"],
          ["H: Farbwinkel [°]", "HUE"],
          ["S: Farbsättigung [%]", "SAT"],
          ["V: Helligkeit [%]", "VAL"],
        ]
      }, {
        "type": "input_value",
        "name": "COLOR",
        "check": "Color",
        "align": "RIGHT"
      }
    ],
    "output": "Number",
    "style": "rblk_color_blocks",
    "tooltip": "%{BKY_LOGIC_BOOLEAN_TOOLTIP}",
    "helpUrl": "%{BKY_LOGIC_BOOLEAN_HELPURL}"
  },
  
  
  
]);  // END JSON EXTRACT (Do not delete this comment.)

Blockly.BIB.Colors.COLOR_TABLE = [
    // value     bgcolor    fgcolor   caption
    ['#ff0055', '#ff0055', '#ff55ff', 'Himbeerrot'],
    ['#ff0000', '#ee0000', '#880000', 'Erdbeerrot'], // was fg #22ff00
    ['#ffaa00', '#ffaa00', '#000000', 'Orange'],
    ['#ffee00', '#ffee00', '#dd8800', 'Sonnengelb'],
    ['#ddff00', '#ddff00', '#ffffcc', 'Zitronengelb'],
    ['#110000', '#330000', '#aa1100', 'Glutrot', true],

    ['#88ff00', '#88ff00', '#000000', 'Lindgrün'],
    ['#22ff00', '#22ff00', '#000000', 'Grasgrün'],
    ['#00ff00', '#00ff00', '#000000', 'Grün'],
    ['#009922', '#009922', '#ffffff', 'Tannengrün'],
    ['#00ff88', '#00ff88', '#000000', 'Moosgrün'],
    ['#00ffdd', '#00ffdd', '#000000', 'Türkis'],
    
    ['#66ccff', '#66ccff', '#99eeff', 'Himmelblau'],
    ['#0000ff', '#0000ff', '#ffffff', 'Blau'],
    ['#220099', '#220099', '#7755ff', 'Meerblau'],
    ['#aa00ff', '#aa00ff', '#ffffff', 'Lila'],
    ['#ff00ff', '#ff00ff', '#ffffff', 'Mangenta'],
    ['#ff66dd', '#ff66dd', '#aa00ff', 'Pink'],
    
    ['#ffffff', '#ffffff', '#000000', 'Weiß'],
    ['#000000', '#000000', '#ffffff', 'Schwarz'],
];


