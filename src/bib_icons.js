/**
 * @license
 * The following icons from Font Awesome Free are licensed under the CC BY 4.0 License!
 * Font Awesome Free Icons: https://fontawesome.com/license/free
 * SPDX-License-Identifier: CC-BY-4.0
 *
 * BIB - Bob's Improved Blockly
 * Copyright 2024 Nils Springob
 */

/**
 * @fileoverview Icons for the blockly
 * @author nils@bob3.org (Nils Springob)
 */
'use strict';

goog.provide('Blockly.Constants.SCB_ICONS');
goog.provide('Blockly.BIB.Icons');

goog.require('Blockly');
goog.require('Blockly.Blocks');
goog.require('Blockly.FieldDropdown');
goog.require('Blockly.FieldImage');
goog.require('Blockly.FieldMultilineInput');
goog.require('Blockly.FieldTextInput');
goog.require('Blockly.FieldVariable');
goog.require('Blockly.Mutator');





// *********************************************************************************
// SVG data from Font Awesome Free Icons: https://fontawesome.com/license/free

Blockly.BIB.Icons.ICON_PALETTE = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="white" d="M204.3 5C104.9 24.4 24.8 104.3 5.2 203.4c-37 187 131.7 326.4 258.8 306.7 41.2-6.4 61.4-54.6 42.5-91.7-23.1-45.4 9.9-98.4 60.9-98.4h79.7c35.8 0 64.8-29.6 64.9-65.3C511.5 97.1 368.1-26.9 204.3 5zM96 320c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm32-128c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128-64c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 64c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"></path></svg>';

Blockly.BIB.Icons.ICON_TINT = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="white" d="M205.22 22.09c-7.94-28.78-49.44-30.12-58.44 0C100.01 179.85 0 222.72 0 333.91 0 432.35 78.72 512 176 512s176-79.65 176-178.09c0-111.75-99.79-153.34-146.78-311.82zM176 448c-61.75 0-112-50.25-112-112 0-8.84 7.16-16 16-16s16 7.16 16 16c0 44.11 35.89 80 80 80 8.84 0 16 7.16 16 16s-7.16 16-16 16z"></path></svg>';

Blockly.BIB.Icons.ICON_COMMENT_IMAGE = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="white" d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32zM128 272c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"></path></svg>';

Blockly.BIB.Icons.ICON_PLUS = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>';

Blockly.BIB.Icons.ICON_MINUS = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>';

Blockly.BIB.Icons.ICON_TIMES = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="white" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>';

Blockly.BIB.Icons.ICON_DIVIDE = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M224 352c-35.35 0-64 28.65-64 64s28.65 64 64 64 64-28.65 64-64-28.65-64-64-64zm0-192c35.35 0 64-28.65 64-64s-28.65-64-64-64-64 28.65-64 64 28.65 64 64 64zm192 48H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>';

Blockly.BIB.Icons.ICON_MULTIPLY_DOT = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="m287.72 256c0-35.194-28.53-63.724-63.724-63.724s-63.724 28.53-63.724 63.724 28.53 63.724 63.724 63.724 63.724-28.53 63.724-63.724z"/></svg>';

Blockly.BIB.Icons.ICON_DIVIDE_DOTS = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="m224 92.275c-35.194 0-63.725 28.53-63.725 63.725s28.53 63.725 63.725 63.725 63.725-28.53 63.725-63.725-28.53-63.725-63.725-63.725zm0 200c-35.194 0-63.725 28.53-63.725 63.725s28.53 63.725 63.725 63.725 63.725-28.53 63.725-63.725-28.53-63.725-63.725-63.725z"/></svg>';

Blockly.BIB.Icons.ICON_EQUAL = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M416 304H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32zm0-192H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>';

Blockly.BIB.Icons.ICON_NOT_EQUAL = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M416 208c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32h-23.88l51.87-66.81c5.37-7.02 4.04-17.06-2.97-22.43L415.61 3.3c-7.02-5.38-17.06-4.04-22.44 2.97L311.09 112H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h204.56l-74.53 96H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h55.49l-51.87 66.81c-5.37 7.01-4.04 17.05 2.97 22.43L64 508.7c7.02 5.38 17.06 4.04 22.43-2.97L168.52 400H416c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32H243.05l74.53-96H416z"></path></svg>';

Blockly.BIB.Icons.ICON_LESS_THAN_EQUAL = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M54.98 214.2l301.41 119.87c18.39 6.03 38.71-2.54 45.38-19.15l12.09-30.08c6.68-16.61-2.82-34.97-21.21-41l-175.44-68.05 175.56-68.09c18.29-6 27.74-24.27 21.1-40.79l-12.03-29.92c-6.64-16.53-26.86-25.06-45.15-19.06L54.98 137.89C41.21 142.41 32 154.5 32 168.07v15.96c0 13.56 9.21 25.65 22.98 30.17zM424 400H24c-13.25 0-24 10.74-24 24v48c0 13.25 10.75 24 24 24h400c13.25 0 24-10.75 24-24v-48c0-13.26-10.75-24-24-24z"></path></svg>';

Blockly.BIB.Icons.ICON_GREATER_THAN_EQUAL = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M55.22 107.69l175.56 68.09-175.44 68.05c-18.39 6.03-27.88 24.39-21.2 41l12.09 30.08c6.68 16.61 26.99 25.19 45.38 19.15L393.02 214.2c13.77-4.52 22.98-16.61 22.98-30.17v-15.96c0-13.56-9.21-25.65-22.98-30.17L91.3 17.92c-18.29-6-38.51 2.53-45.15 19.06L34.12 66.9c-6.64 16.53 2.81 34.79 21.1 40.79zM424 400H24c-13.25 0-24 10.74-24 24v48c0 13.25 10.75 24 24 24h400c13.25 0 24-10.75 24-24v-48c0-13.26-10.75-24-24-24z"></path></svg>';

Blockly.BIB.Icons.ICON_GREATER_THAN = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="white" d="M365.52 209.85L59.22 67.01c-16.06-7.49-35.15-.54-42.64 15.52L3.01 111.61c-7.49 16.06-.54 35.15 15.52 42.64L236.96 256.1 18.49 357.99C2.47 365.46-4.46 384.5 3.01 400.52l13.52 29C24 445.54 43.04 452.47 59.06 445l306.47-142.91a32.003 32.003 0 0 0 18.48-29v-34.23c-.01-12.45-7.21-23.76-18.49-29.01z"></path></svg>';

Blockly.BIB.Icons.ICON_LESS_THAN = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="white" d="M365.46 357.74L147.04 255.89l218.47-101.88c16.02-7.47 22.95-26.51 15.48-42.53l-13.52-29C360 66.46 340.96 59.53 324.94 67L18.48 209.91a32.014 32.014 0 0 0-18.48 29v34.24c0 12.44 7.21 23.75 18.48 29l306.31 142.83c16.06 7.49 35.15.54 42.64-15.52l13.56-29.08c7.49-16.06.54-35.15-15.53-42.64z"></path></svg>';

Blockly.BIB.Icons.ICON_LEVEL_UP_ALT = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="white" d="M313.553 119.669L209.587 7.666c-9.485-10.214-25.676-10.229-35.174 0L70.438 119.669C56.232 134.969 67.062 160 88.025 160H152v272H68.024a11.996 11.996 0 0 0-8.485 3.515l-56 56C-4.021 499.074 1.333 512 12.024 512H208c13.255 0 24-10.745 24-24V160h63.966c20.878 0 31.851-24.969 17.587-40.331z"></path></svg>';

Blockly.BIB.Icons.ICON_PLUS_SQUARE = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-32 252c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92H92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"></path></svg>';

Blockly.BIB.Icons.ICON_MINUS_SQUARE = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM92 296c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h264c6.6 0 12 5.4 12 12v56c0 6.6-5.4 12-12 12H92z"></path></svg>';

Blockly.BIB.Icons.ICON_EXCLAMATION_CIRCLE = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="white" d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path></svg>';

Blockly.BIB.Icons.ICON_GLOBE = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="white" d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z"></path></svg>';

Blockly.BIB.Icons.ICON_FLAG = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="white" d="M349.565 98.783C295.978 98.783 251.721 64 184.348 64c-24.955 0-47.309 4.384-68.045 12.013a55.947 55.947 0 0 0 3.586-23.562C118.117 24.015 94.806 1.206 66.338.048 34.345-1.254 8 24.296 8 56c0 19.026 9.497 35.825 24 45.945V488c0 13.255 10.745 24 24 24h16c13.255 0 24-10.745 24-24v-94.4c28.311-12.064 63.582-22.122 114.435-22.122 53.588 0 97.844 34.783 165.217 34.783 48.169 0 86.667-16.294 122.505-40.858C506.84 359.452 512 349.571 512 339.045v-243.1c0-23.393-24.269-38.87-45.485-29.016-34.338 15.948-76.454 31.854-116.95 31.854z"></path></svg>';

Blockly.BIB.Icons.ICON_REDO_ALT = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="white" d="M256.455 8c66.269.119 126.437 26.233 170.859 68.685l35.715-35.715C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.75c-30.864-28.899-70.801-44.907-113.23-45.273-92.398-.798-170.283 73.977-169.484 169.442C88.764 348.009 162.184 424 256 424c41.127 0 79.997-14.678 110.629-41.556 4.743-4.161 11.906-3.908 16.368.553l39.662 39.662c4.872 4.872 4.631 12.815-.482 17.433C378.202 479.813 319.926 504 256 504 119.034 504 8.001 392.967 8 256.002 7.999 119.193 119.646 7.755 256.455 8z"></path></svg>';

Blockly.BIB.Icons.ICON_BROOM = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="white" d="M256.47 216.77l86.73 109.18s-16.6 102.36-76.57 150.12C206.66 523.85 0 510.19 0 510.19s3.8-23.14 11-55.43l94.62-112.17c3.97-4.7-.87-11.62-6.65-9.5l-60.4 22.09c14.44-41.66 32.72-80.04 54.6-97.47 59.97-47.76 163.3-40.94 163.3-40.94zM636.53 31.03l-19.86-25c-5.49-6.9-15.52-8.05-22.41-2.56l-232.48 177.8-34.14-42.97c-5.09-6.41-15.14-5.21-18.59 2.21l-25.33 54.55 86.73 109.18 58.8-12.45c8-1.69 11.42-11.2 6.34-17.6l-34.09-42.92 232.48-177.8c6.89-5.48 8.04-15.53 2.55-22.44z"></path></svg>';


Blockly.BIB.Icons.DATATYPE_DE_COLOR = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 384"><path fill="white" d="m352.02 157.47q5.0167 7.2984 11.781 9.3452 6.7642 2.0469 14.136-1.7864 4.8074-2.4999 8.1531-5.4612 3.2902-3.0681 5.9825-6.5039l6.5209 7.0591q-2.9014 3.8159-7.1532 7.3841-4.2518 3.5682-10.234 6.679-5.9823 3.1109-11.79 3.6878-5.8628 0.47013-11.17-1.3843-5.256-2.0168-9.8498-6.4139-4.6492-4.5037-8.2601-11.448-3.222-6.196-4.1836-12.482-0.96159-6.286 0.35037-11.854 1.2563-5.6747 4.7387-10.2 3.4271-4.6322 9.0888-7.5763 5.9823-3.1109 11.525-3.4143 5.5423-0.30345 10.367 1.6662 4.8243 1.9698 8.7643 5.8925 3.9399 3.9228 6.6618 9.1572 1.9443 3.7389 3.4571 7.4311zm2.2302-32.51q-6.3028 3.2776-8.1402 9.6616-1.7305 6.3285 1.7478 15.106l30.446-15.832q-4.2219-8.1189-10.559-10.388-6.3371-2.269-13.495 1.453zm-100.47 13.432 9.6147-4.9998 15.221 29.271q0.45721-1.7306 1.393-3.8459 0.93582-2.1152 2.3586-4.0766 1.4742-2.1238 3.598-4.0424 2.1238-1.9187 5.0083-3.4186 4.8073-2.4999 10.187-2.8546 5.4867-0.41029 10.687 1.4997 5.3071 1.8545 10.114 6.1406 4.8074 4.2861 8.307 11.016 3.4442 6.6234 4.1407 13.182 0.69651 6.5591-0.77313 12.345-1.5254 5.6789-5.008 10.204-3.3758 4.4698-8.0763 6.9141-4.8073 2.4999-9.9693 3.0127-5.0551 0.45726-9.1104-0.55536l2.3888 4.5936-8.9736 4.6664zm66.828 30.12q-2.4999-4.8073-5.8329-7.8241-3.2818-3.1791-7.0207-4.6278-3.6322-1.5041-7.4525-1.2818-3.7134 0.16667-7.1319 1.9443-4.5937 2.3888-7.1104 6.6832-2.4655 4.1321-2.9995 7.8028l15.443 29.698q3.457 0.6452 7.3796 0.0983 3.9228-0.54699 7.6618-2.4914 3.8457-1.9998 6.3799-5.2176 2.534-3.2177 3.4953-7.1105 0.90586-3.9997 0.24338-8.4052-0.61105-4.5679-3.0554-9.2684zm-62.211 9.1424q-2.4742 0.20087-5.2518 1.6453-2.9912 1.5554-5.2088 4.3372-2.1109 2.7263-3.0212 6.4567-0.80332 3.6749-0.081 8.4565 0.77346 4.6192 3.6067 10.068l13.499 25.959-9.6147 4.9998-28.886-55.549 9.2942-4.8331 6.2773 12.071q-0.37177-3.0638-0.0471-6.3543 0.3247-3.2903 1.5168-6.2174 1.299-2.9827 3.628-5.5509 2.2733-2.675 5.7986-4.5082 1.6024-0.83327 3.2091-1.3974 1.658-0.72647 2.9997-1.017zm-90.019 70.7q-3.222-6.196-4.0768-12.537-0.91016-6.448 0.45294-12.179 1.4698-5.7857 5.1106-10.529 3.7476-4.7988 9.5162-7.7986 4.8074-2.4999 9.5419-2.7905 4.7859-0.45296 8.948 0.50408l-2.3332-4.4868 8.7599-4.5553 21.888 42.091q2.111 4.0594 4.7006 4.3416 2.6408 0.11963 4.991-1.1025l1.859 8.5336q-10.255 5.3329-16.725-1.8886-0.39311 2.3759-1.2136 4.9738-0.76915 2.4357-2.239 4.8286-1.4699 2.393-3.7518 4.5296-2.2818 2.1366-5.4866 3.8031-5.2347 2.7221-10.884 3.081-5.5423 0.30344-10.905-1.6578-5.256-2.0168-10.008-6.1959-4.7006-4.3416-8.1446-10.965zm37.634 6.0805q4.0594-2.111 6.6916-5.9226 2.6321-3.8116 3.4781-8.1875l-15.499-29.805q-3.9399-0.52984-8.0762 0.12827-4.085 0.49565-7.9311 2.4957-3.8457 1.9998-6.273 5.1621-2.4271 3.1622-3.3328 7.1618-0.8546 3.8373-0.13654 8.3497 0.71807 4.5124 3.1066 9.106 2.3332 4.4868 5.615 7.6659 3.2262 3.0723 7.0207 4.6278 3.739 1.4486 7.6146 1.3332 3.9826-0.17096 7.7216-2.1153zm-109.18-28.997 44.332-23.053 4.5553 8.7599-34.184 17.776 11.888 22.861 28.523-14.832 4.333 8.3326-28.523 14.832 18.111 34.827-10.149 5.2774z"/></svg>';

Blockly.BIB.Icons.DATATYPE_DE_NUMBER = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 384"><path fill="white" d="m360.32 163.18q2.9997 5.7686 6.7944 7.3241 3.9014 1.4998 8.1746-0.72227 2.0298-1.0555 3.7304-2.4827 1.6451-1.5341 2.8073-2.9527l6.4054 6.5762q-1.4785 1.8546-4.0296 3.9955-2.4442 2.0853-5.8627 3.863-3.7389 1.9443-7.4994 2.5426-3.6536 0.54273-7.1702-0.47862-3.5166-1.0214-6.7386-3.8243-3.1151-2.8586-5.7261-7.8796l-32.053-61.64 9.6147-4.9998zm-77.405 4.2879q0.71355-5.9354 3.7005-11.153 3.0938-5.2731 9.3966-8.5507 9.401-4.8886 16.939-1.6156 7.6447 3.2174 12.478 12.512l18.833 36.216-9.6147 4.9998-18.277-35.148q-3.1664-6.0892-7.7773-8.1703-4.5594-2.2432-9.687 0.42317-2.4571 1.2777-4.4142 3.5169-1.9058 2.0768-3.2091 4.7903t-2.1152 5.8498q-0.81185 3.1364-1.0852 6.2644l19.11 36.749-9.6147 4.9998-41.108-79.052 9.6147-4.9998zm-69.288 60.459q-3.222-6.196-4.0768-12.537-0.91016-6.448 0.45294-12.179 1.4698-5.7857 5.1106-10.529 3.7476-4.7988 9.5162-7.7986 4.8073-2.4999 9.5419-2.7905 4.7859-0.45299 8.948 0.50408l-2.3332-4.4868 8.7599-4.5553 21.888 42.091q2.111 4.0594 4.7006 4.3416 2.6408 0.11963 4.991-1.1025l1.859 8.5336q-10.255 5.3329-16.725-1.8886-0.39311 2.3759-1.2136 4.9738-0.76915 2.4357-2.239 4.8286-1.4699 2.393-3.7518 4.5296-2.2818 2.1366-5.4866 3.8031-5.2347 2.7221-10.884 3.081-5.5423 0.30345-10.905-1.6578-5.256-2.0168-10.008-6.1959-4.7006-4.3416-8.1446-10.965zm37.634 6.0805q4.0594-2.111 6.6915-5.9226 2.6321-3.8116 3.4782-8.1875l-15.499-29.805q-3.9399-0.52984-8.0762 0.12827-4.085 0.49565-7.9311 2.4957-3.8457 1.9998-6.273 5.1621-2.4271 3.1622-3.3328 7.1618-0.85461 3.8373-0.13654 8.3497 0.71806 4.5124 3.1066 9.106 2.3332 4.4868 5.615 7.6659 3.2262 3.0723 7.0207 4.6278 3.739 1.4486 7.6146 1.3332 3.9826-0.17096 7.7216-2.1153zm-89.345 45.645 9.5215-78.78-37.925 19.721-4.5553-8.7599 49.57-25.777 3.9997 7.6915-9.5215 78.78 41.235-21.443 4.6664 8.9736-52.88 27.498z"/></svg>';

Blockly.BIB.Icons.DATATYPE_DE_BOOLEAN = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 384"><g transform="matrix(3.3705 -1.7527 1.7527 3.3705 -3.9842 -741.37)" color="#000000" fill="white" stroke-width="2.3771px"><path d="m6.3983 239.63h2.187v5.198h4.5641v2.4722h-4.5641v7.9555q0 0.91916 0.19017 1.5531 0.22187 0.6339 0.57051 1.0142 0.34865 0.38034 0.82407 0.57051 0.50712 0.15848 1.0459 0.15848 0.79238 0 1.4897-0.25356t1.3312-0.60221l0.79238 2.282q-0.6339 0.38035-1.7115 0.72899-1.0776 0.38034-2.2503 0.38034-2.3771 0-3.7717-1.5531-1.3629-1.553-1.3629-4.5007v-7.7336h-2.8526v-2.4722h2.9159zm-6.3707 21.08h-2.8526v-16.481h2.8526zm-1.4263-19.302q-0.82407 0-1.4263-0.57052-0.57051-0.6022-0.57051-1.4263 0-0.91916 0.53882-1.458 0.53882-0.53882 1.458-0.53882 0.82407 0 1.3946 0.60221 0.60221 0.57051 0.60221 1.3946 0 0.91915-0.53882 1.458-0.53882 0.53882-1.458 0.53882zm-16.891 12.232q0.28526 2.3137 1.6164 3.6132t3.5182 1.2995q1.4263 0 2.5673-0.28526 1.141-0.31695 2.187-0.79237l0.6656 2.4405q-1.141 0.53882-2.5673 0.85577t-3.2012 0.31695-3.2012-0.57051q-1.4263-0.60221-2.4405-1.6798-0.98255-1.1093-1.5214-2.6941-0.53882-1.6164-0.53882-3.6766 0-1.8383 0.53882-3.4231t1.5214-2.7258q0.98255-1.1727 2.3454-1.8066 1.3629-0.6656 3.0427-0.6656 1.7749 0 3.1061 0.60221t2.2187 1.6481q0.88746 1.0459 1.3312 2.4405t0.44373 2.9476q0 1.1093-0.095085 2.1553zm4.469-7.3216q-1.87 0-3.0744 1.2678-1.1727 1.2678-1.4263 3.74h9.0331q0-2.4088-1.2044-3.7083t-3.328-1.2995zm-22.18 0.5416q0.88746-1.2995 2.2187-2.1553 1.3629-0.85577 3.2329-0.85577 2.7892 0 4.1521 1.6798 1.3946 1.6798 1.3946 4.4373v10.745h-2.8526v-10.428q0-1.8066-0.82407-2.8526-0.79238-1.0776-2.3137-1.0776-0.72899 0-1.458 0.28526-0.69729 0.25356-1.3312 0.72898-0.6339 0.47543-1.2044 1.1093t-1.0142 1.3312v10.903h-2.8526v-23.454h2.8526zm-6.543 0.13q-0.60221-0.25356-1.4263-0.25356-0.88746 0-1.7432 0.38034-0.82407 0.38035-1.4897 1.141-0.6339 0.76068-1.0459 1.9651-0.38034 1.1727-0.38034 2.7892v7.7019h-2.8526v-16.481h2.7575v3.5816q0.28526-0.76069 0.76068-1.4897 0.47543-0.72899 1.1093-1.2678 0.6656-0.53882 1.5214-0.85577 0.85577-0.34865 1.9017-0.34865 0.47543 0 0.91916 0.0634 0.47542 0.0317 0.82407 0.12678zm-24.842-0.13q0.88746-1.2995 2.2187-2.1553 1.3629-0.85577 3.2329-0.85577 2.7892 0 4.1521 1.6798 1.3946 1.6798 1.3946 4.4373v10.745h-2.8526v-10.428q0-1.8066-0.82407-2.8526-0.79238-1.0776-2.3137-1.0776-0.72899 0-1.458 0.28526-0.69729 0.25356-1.3312 0.72898-0.6339 0.47543-1.2044 1.1093-0.57051 0.6339-1.0142 1.3312v10.903h-2.8526v-23.454h2.8526zm-23.524 5.7q0-1.8383 0.57051-3.4231 0.57051-1.6164 1.5848-2.7892 1.0459-1.1727 2.4722-1.8383 1.458-0.6656 3.1695-0.6656 1.4263 0 2.5673 0.50713 1.1727 0.47542 2.0285 1.2044v-1.3312h2.599v12.488q0 1.2044 0.57051 1.5848 0.60221 0.34864 1.2995 0.34864l-0.60221 2.2187q-3.0427 0-3.6766-2.4722-0.38034 0.50712-0.88746 1.0142-0.47542 0.47543-1.1093 0.85577t-1.4263 0.60221q-0.79238 0.22186-1.7432 0.22186-1.5531 0-2.9159-0.6022-1.3312-0.60221-2.3454-1.7115-0.98255-1.1093-1.5848-2.6624-0.57051-1.5848-0.57051-3.5498zm8.0505 5.9904q1.2044 0 2.282-0.57051t1.8066-1.4897v-8.8429q-0.85577-0.60221-1.9017-0.95085-1.0142-0.38034-2.1553-0.38034-1.141 0-2.0919 0.44373-0.95085 0.44373-1.6481 1.2678-0.6656 0.79238-1.0459 1.9334-0.38034 1.141-0.38034 2.5039 0 1.3312 0.38034 2.4722 0.38034 1.1093 1.0776 1.9334 0.69729 0.79238 1.6164 1.2361 0.95085 0.44373 2.0602 0.44373zm-37.97-19.3 2.9793-0.95085 5.0078 19.207 4.7226-16.672h3.7717l4.6909 16.672 4.9761-19.112 2.7892 0.85576-5.9904 21.458h-3.74l-4.6909-16.672-4.7543 16.672h-3.74z"/></g></svg>';


Blockly.Constants.SCB_ICONS = Blockly.BIB.Icons;
