/**
 * @license
 * Copyright 2024 Nils Springob
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Modifications: BIB - Bob's Improved Blockly
 * Source for base code (Blockly): [https://github.com/google/blockly] (Apache-2.0 License)
 * Source for block-color-values and block-captions (OpenRoberta): [https://github.com/OpenRoberta/] (Apache-2.0 License)
 */
'use strict';

goog.provide('blocks.toolbox.bob3');


blocks.toolbox.bob3 = {
    "kind": "categoryToolbox",
    "contents": [{
        "kind": "category",
        "block-level": 1,
        "name": "Aktion",
        "colour": "#f29400",
        "cssconfig": {"container": "blocklyToolboxCategory category-bob3"},
        "contents": [{
            "kind": "block",
            "block-level": 1,
            "blockxml": '<block type="block_bob3_seteye"><field name="EYE">EYE_2</field><value name="COLOR"><block type="color_picker"><field name="COLOR">#ff0000</field></block></value></block>'
        }, {
            "kind": "block",
            "block-level": 1,
            "blockxml": '<block type="block_bob3_seteye_off"><field name="EYE">EYE_2</field></block>'
        }, {
            "kind": "block",
            "block-level": 1,
            "blockxml": '<block type="block_bob3_setwled"><field name="LED">LED_4</field><field name="VAL">ON</field></block>'
        }, {
            "kind": "block",
            "block-level": 2,
            "blockxml": "<block type=\"block_bob3_setled\"><value name=\"INDEX\"><shadow type=\"shadow_INT_1_2_3_4\"><field name=\"NUM\">1</field></shadow></value><value name=\"COLOR\"><shadow type=\"shadow-no-Color\"></shadow></value></block>"
        }, {
            "kind": "block",
            "block-level": 2,
            "blockxml": "<block type=\"block_bob3_getled\"><value name=\"INDEX\"><shadow type=\"shadow_INT_1_2_3_4\"><field name=\"NUM\">1</field></shadow></value></block>"
        }, {
            "kind": "block",
            "block-level": 2,
            "blockxml": "<block type=\"block_bob3_remember\"><value name=\"VAL\"><shadow type=\"shadow_INT16\"><field name=\"NUM\">0</field></shadow></value></block>"
        }, {
            "kind": "block",
            "block-level": 2,
            "blockxml": "<block type=\"block_bob3_recall\"></block>"
        }]
    }, {
        "kind": "category",
        "block-level": 1,
        "name": "Sensoren",
        "colour": "#8fa402",
        "cssconfig": {"container": "blocklyToolboxCategory category-sensors"},
        "contents": [{
            "kind": "block",
            "block-level": 1,
            "blockxml": "<block type=\"block_bob3_touched\"><field name=\"ARM\">ARM2</field><field name=\"WHERE\">TOP</field></block>"
        }, {
            "kind": "block",
            "block-level": 1,
            "blockxml": "<block type=\"block_bob3_getIR\"><field name=\"SENSOR\">IR_REFLECT</field></block>"
        }, {
            "kind": "block",
            "block-level": 1,
            "blockxml": "<block type=\"block_bob3_getIR\"><field name=\"SENSOR\">IR_LIGHT</field></block>"
        }, {
            "kind": "block",
            "block-level": 2,
            "blockxml": "<block type=\"block_bob3_getTemperature\"></block>"
        }, {
            "kind": "block",
            "block-level": 2,
            "blockxml": "<block type=\"block_bob3_getMillivolt\"></block>"
        }, {
            "kind": "block",
            "block-level": 2,
            "blockxml": "<block type=\"block_bob3_getID\"></block>"
        }, {
            "kind": "block",
            "block-level": 2,
            "blockxml": "<block type=\"block_bob3_getarm\"><value name=\"INDEX\"><shadow type=\"shadow_INT_1_2\"><field name=\"NUM\">1</field></shadow></value></block>"
        }]
    
    }, {
        "kind": "category",
        "block-level": 1,
        "name": "Kontrolle",
        "colour": "#eb6a0a",
        "cssconfig": {"container": "blocklyToolboxCategory category-control"},
        "contents": [{
            "kind": "block",
            "block-level": 1,
            "blockxml": '<block type="block_bob3_delay"><value name="VAL"><block type="math_number"><field name="NUM">500</field></block></value></block>'
        },{
            "kind": "sep",
            "block-level": 1
        }, {
            "kind": "block",
            "block-level": 1,
            "blockxml": "<block type=\"controls_if\"></block>"
        }, {
            "kind": "block",
            "block-level": 1,
            "blockxml": "<block type=\"controls_if\"><mutation elseif=\"0\" else=\"1\"></mutation></block>"
        }, {
            "kind": "block",
            "block-level": 1,
            "blockxml": '<block type="controls_repeat_ext"><value name="TIMES"><shadow type=\"shadow-no-Number\"></shadow><block type="math_number"><field name="NUM">10</field></block></value></block>'
        }, {
            "kind": "block",
            "block-level": 1,
            "blockxml": "<block type=\"controls_repeat_forever\"></block>"
        }, {
            "kind": "block",
            "block-level": 2,
            "blockxml": "<block type=\"controls_loop_break\"></block>"
        }, {
            "kind": "block",
            "block-level": 2,
            "blockxml": "<block type=\"controls_repeat_until\"></block>"
        }, {
            "kind": "block",
            "block-level": 2,
            "blockxml": "<block type=\"controls_wait_until\"></block>"
        }]

    }, {
        "kind": "category",
        "block-level": 1,
        "name": "Logik",
        "colour": "#33b8ca",
        "cssconfig": {"container": "blocklyToolboxCategory category-control"},
        "contents": [
            {
                "kind": "block",
                "block-level": 1,
                "blockxml": "<block type=\"operator_bool_num2\"><mutation operator=\"EQ\"></mutation><value name=\"A\"><shadow type=\"shadow-no-Number\"></shadow></value><value name=\"B\"><shadow type=\"shadow-no-Number\"></shadow></value></block>"
            }, {
                "kind": "block",
                "block-level": 1,
                "blockxml": "<block type=\"operator_bool_num2\"><mutation operator=\"LT\"></mutation><value name=\"A\"><shadow type=\"shadow-no-Number\"></shadow></value><value name=\"B\"><shadow type=\"shadow-no-Number\"></shadow></value></block>"
            }, {
                "kind": "block",
                "block-level": 1,
                "blockxml": "<block type=\"operator_bool_num2\"><mutation operator=\"GT\"></mutation><value name=\"A\"><shadow type=\"shadow-no-Number\"></shadow></value><value name=\"B\"><shadow type=\"shadow-no-Number\"></shadow></value></block>"
            },{
                "kind": "sep",
                "block-level": 2
            }, {
                "kind": "block",
                "block-level": 2,
                "blockxml": '<block type="operator_logic_bool"><value name="A"><shadow type="shadow-no-Boolean"></shadow></value><field name="OP">AND</field><value name="B"><shadow type="shadow-no-Boolean"></shadow></value></block>'
            }, {
                "kind": "block",
                "block-level": 2,
                "blockxml": '<block type="operator_logic_bool"><value name="A"><shadow type="shadow-no-Boolean"></shadow></value><field name="OP">OR</field><value name="B"><shadow type="shadow-no-Boolean"></shadow></value></block>'
            }, {
                "kind": "block",
                "block-level": 2,
                "blockxml": "<block type=\"operator_not\"></block>"
            }, {
                "kind": "block",
                "block-level": 2,
                "blockxml": "<block type=\"logic_boolean\"><field name=\"BOOL\">TRUE</field></block>"
            }
        ]

    }, {
        "kind": "category",
        "block-level": 1,
        "name": "Mathematik",
        "colour": "#005a94",
        "cssconfig": {"container": "blocklyToolboxCategory category-control"},
        "contents": [
            {
                "kind": "block",
                "block-level": 1,
                "blockxml": '<block type="math_number"><field name="NUM">0</field></block>'
            }, {
                "kind": "block",
                "block-level": [1],
                "blockxml": '<block type="math_number"><field name="NUM">3</field></block>'
            }, {
                "kind": "block",
                "block-level": [1],
                "blockxml": '<block type="math_number"><field name="NUM">99</field></block>'
            }, {
                "kind": "block",
                "block-level": 1,
                "blockxml": '<block type="math_number"><field name="NUM">1000</field></block>'
            }, {
                "kind": "block",
                "block-level": 1,
                "blockxml": "<block type=\"operator_num_num2\"><mutation operator=\"ADD\"></mutation><value name=\"A\"><shadow type=\"shadow-no-Number\"></shadow></value><value name=\"B\"><shadow type=\"shadow-no-Number\"></shadow></value></block>"
            }, {
                "kind": "block",
                "block-level": 1,
                "blockxml": "<block type=\"operator_num_num2\"><mutation operator=\"SUB\"></mutation><value name=\"A\"><shadow type=\"shadow-no-Number\"></shadow></value><value name=\"B\"><shadow type=\"shadow-no-Number\"></shadow></value></block>"
            }, {
                "kind": "block",
                "block-level": 1,
                "blockxml": "<block type=\"operator_num_num2\"><mutation operator=\"MUL\"></mutation><value name=\"A\"><shadow type=\"shadow-no-Number\"></shadow></value><value name=\"B\"><shadow type=\"shadow-no-Number\"></shadow></value></block>"
            }, {
                "kind": "block",
                "block-level": 1,
                "blockxml": "<block type=\"operator_num_num2\"><mutation operator=\"DIV\"></mutation><value name=\"A\"><shadow type=\"shadow-no-Number\"></shadow></value><value name=\"B\"><shadow type=\"shadow-no-Number\"></shadow></value></block>"
            }, {
                "kind": "block",
                "block-level": 2,
                "blockxml": "<block type=\"operator_num_num2\"><mutation operator=\"MOD\"></mutation><value name=\"A\"><shadow type=\"shadow-no-Number\"></shadow></value><value name=\"B\"><shadow type=\"shadow-no-Number\"></shadow></value></block>"
            }, {
                "kind": "block",
                "block-level": 2,
                "blockxml": '<block type="operator_random_number"><value name="LOWER"><shadow type="shadow-no-Number"></shadow><block type="math_number"><field name="NUM">1</field></block></value><value name="UPPER"><shadow type="shadow-no-Number"></shadow><block type="math_number"><field name="NUM">100</field></block></value></block>'
            }, {
                "kind": "block",
                "block-level": 2,
                "blockxml": "<block type=\"math_single\"></block>"
            }
        ]

    }, {
        "kind": "category",
        "block-level": 1,
        "name": "Farben",
        "colour": "#ebc300",
        "cssconfig": {"container": "blocklyToolboxCategory category-colours"},
        "contents": [{
            "kind": "block",
            "block-level": 2,
            "blockxml": "<block type=\"color_rgb\"><value name=\"RED\"><shadow type=\"shadow_UINT4\"><field name=\"NUM\">15</field></shadow></value><value name=\"GREEN\"><shadow type=\"shadow_UINT4\"><field name=\"NUM\">15</field></shadow></value><value name=\"BLUE\"><shadow type=\"shadow_UINT4\"><field name=\"NUM\">15</field></shadow></value></block>"
        }, {
            "kind": "block",
            "block-level": 2,
            "blockxml": "<block type=\"color_hsv\"><value name=\"HUE\"><shadow type=\"shadow_INT_unit\"><field name=\"NUM\">360</field><field name=\"UNIT\">°</field></shadow></value><value name=\"SAT\"><shadow type=\"shadow_INT_unit\"><field name=\"NUM\">100</field><field name=\"UNIT\">%</field></shadow></value><value name=\"VAL\"><shadow type=\"shadow_INT_unit\"><field name=\"NUM\">100</field><field name=\"UNIT\">%</field></shadow></value></block>"
        }, {
            "kind": "block",
            "block-level": 1,
            "blockxml": "<block type=\"color_random\"></block>"
        }, {
            "kind": "block",
            "block-level": 2,
            "blockxml": "<block type=\"color_blend\"><value name=\"COLOR1\"><shadow type=\"color_picker\"><field name=\"COLOR\">#3333ff</field></shadow></value><value name=\"COLOR2\"><shadow type=\"color_picker\"><field name=\"COLOR\">#ff9900</field></shadow></value><value name=\"RATIO\"><shadow type=\"shadow_INT_unit\"><field name=\"NUM\">50</field><field name=\"UNIT\">%</field></shadow></value></block>"
        }, {
            "kind": "block",
            "block-level": 2,
            "blockxml": "<block type=\"color_component\"><field name=\"COMPONENT\">VAL</field><value name=\"COLOR\"><shadow type=\"color_picker\"><field name=\"COLOR\">#bbbbbb</field></shadow></value></block>"
        }, {
            "kind": "block",
            "block-level": 1,
            "gap": 12,
            "blockxml": "<block type=\"color_picker\"><mutation showCaption=\"true\"/><field name=\"COLOR\">#ff0000</field></block>"
        }, {
            "kind": "block",
            "block-level": 1,
            "gap": 12,
            "blockxml": "<block type=\"color_picker\"><mutation showCaption=\"true\"/><field name=\"COLOR\">#ff0055</field></block>"
        }, {
            "kind": "block",
            "block-level": 1,
            "gap": 12,
            "blockxml": "<block type=\"color_picker\"><mutation showCaption=\"true\"/><field name=\"COLOR\">#ffee00</field></block>"
        }, {
            "kind": "block",
            "block-level": 1,
            "gap": 12,
            "blockxml": "<block type=\"color_picker\"><mutation showCaption=\"true\"/><field name=\"COLOR\">#ddff00</field></block>"
        }, {
            "kind": "block",
            "block-level": 1,
            "gap": 12,
            "blockxml": "<block type=\"color_picker\"><mutation showCaption=\"true\"/><field name=\"COLOR\">#220099</field></block>"
        }, {
            "kind": "block",
            "block-level": 1,
            "gap": 12,
            "blockxml": "<block type=\"color_picker\"><mutation showCaption=\"true\"/><field name=\"COLOR\">#66ccff</field></block>"
        }, {
            "kind": "block",
            "block-level": 1,
            "gap": 12,
            "blockxml": "<block type=\"color_picker\"><mutation showCaption=\"true\"/><field name=\"COLOR\">#000000</field></block>"
        }, {
            "kind": "block",
            "block-level": 1,
            "gap": 12,
            "blockxml": "<block type=\"color_picker\"><mutation showCaption=\"true\"/><field name=\"COLOR\">#ffffff</field></block>"
        }]
        
        
    }, {
        "kind": "category",
        "block-level": [2],
        "name": "Variablen",
        "custom": "BIB_VARIABLES",
        "colour": "#9085ba",
        "cssconfig": {"container": "blocklyToolboxCategory category-variables"},
    
    }, {
        "kind": "category",
        "block-level": [3],
        "name": "Variablen",
        "colour": "#9085ba",
        "disabled": "true",
        "cssconfig": {"container": "blocklyToolboxCategory category-variables"},
        "contents": [{
            "kind": "label",
            "text": "Variablen bekommst du im Experten Modus!",
            "web-class": "expert-mode-hint"
        }]
    
    }, {
        "kind": "category",
        "block-level": [2],
        "name": "Funktionen",
        "custom": "BIB_FUNCTIONS",
        "colour": "#179c7d",
        "cssconfig": {"container": "blocklyToolboxCategory category-functions"},
    }, {
        "kind": "category",
        "block-level": [3],
        "name": "Funktionen",
        "colour": "#179c7d",
        "disabled": "true",
        "cssconfig": {"container": "blocklyToolboxCategory category-functions"},
        "contents": [{
            "kind": "label",
            "text": "Funktionen bekommst du im Experten Modus!",
            "web-class": "expert-mode-hint"
        }]
    }, {
        "kind": "category",
        "block-level": [1,2],
        "name": "Nachrichten",
        "colour": "#ff69b4",
        "cssconfig": {"container": "blocklyToolboxCategory category-messages"},
        "contents": [{
            "kind": "block",
            "blockxml": "<block type=\"block_bob3_txMessage\"><value name=\"VAL\"><shadow type=\"shadow_INT16\"><field name=\"NUM\">0</field></shadow></value></block>"
        }, {
            "kind": "block",
            "blockxml": "<block type=\"block_bob3_rxMessageVoid\"><value name=\"TIMEOUT\"><shadow type=\"shadow_INT16\"><field name=\"NUM\">1000</field></shadow></value></block>"
        }, {
            "kind": "block",
            "blockxml": "<block type=\"block_bob3_lastMessageSuccess\"></block>"
        }, {
            "kind": "block",
            "blockxml": "<block type=\"block_bob3_lastMessage\"></block>"
        }]
    }, {
        "kind": "category",
        "block-level": [3],
        "name": "Nachrichten",
        "colour": "#ff69b4",
        "disabled": "true",
        "cssconfig": {"container": "blocklyToolboxCategory category-messages"},
        "contents": [{
            "kind": "label",
            "text": "Nachrichten bekommst du im Experten Modus!",
            "web-class": "expert-mode-hint"
        }]
    }, {
        "kind": "sep"
    }]

};

/*

    USED BLOCKS
    ===========

block_bob3_seteye
block_bob3_seteye_off
block_bob3_setwled
block_bob3_setled
block_bob3_getled
block_bob3_remember
block_bob3_recall
block_bob3_touched
block_bob3_getIR
block_bob3_getTemperature
block_bob3_getMillivolt
block_bob3_getID
block_bob3_getarm
block_bob3_delay
block_bob3_txMessage
block_bob3_lastMessageSuccess
block_bob3_lastMessage

controls_if
controls_repeat_ext
controls_repeat_forever
controls_loop_break
controls_repeat_until
controls_wait_until

operator_bool_num2
operator_num_num2
operator_logic_bool
operator_not
operator_random_number

logic_boolean

math_number
math_single

color_rgb
color_hsv
color_random
color_blend
color_component
color_picker

shadow_INT_1_2
shadow_INT_1_2_3_4
shadow_UINT4
shadow_INT16
shadow-no-Color
shadow-no-Number
shadow-no-Boolean
shadow_INT_unit

*/
