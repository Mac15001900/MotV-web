//=============================================================================
// GraphicalDesignMode.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.10.3 2019/11/02 Fixed prevent message window by clicking when design mode is on
// 2.10.2 2019/02/27 Corrected an issue where initial display of scrolling is shifted when line height of the window being scrolled
// 2.10.1 2018/11/06 Resolved conflict with BattleFormation.js
// 2.10.0 2018/08/18 Added setting to prevent message window and sub window from being touched by this plugin
// 2.9.1 2018/07/10 Fixed an issue that caused an error when starting equipment screen with the equipment slot window moved in core script 1.6.1 or later
// 2.9.0 2018/06/27 When GDM_LOCK_MESSAGE_WINDOW is executed while the window is closed, it will wait until it finishes closing
// 2.8.2 2018/05/20 Using with YEP_BattleEngineCore.js, fixed an issue where switching to transparent window stops working in design mode
// 2.8.1 2018/01/30 Modified to work with the latest NW.js
// 2.8.0 2017/07/26 Added a function that can change position of edited window by using a function from the console
// 2.7.0 2017/04/11 Fixed the problem about position change of the additional window- 
//                  Added a plugin command to temporarily disable position changes for the choice window
// 2.6.0 2017/04/07 Added a function that can be displayed when any switch is ON for the added picture or window
// 2.5.0 2017/03/11 Added the ability to hide window
// 2.4.0 2017/01/09 Added a function that can specify the alignment of the custom window.
// 2.3.1 2016/11/30 Fixed an issue where the screen may not advance from NowLoading in RPG Maker
// 2.3.0 2016/11/25 Added a function to fix the display of the message window background
// 2.2.1 2016/11/12 For Mac, added help to use option key instead of Ctrl key
// 2.2.0 2016/11/03 Added a function to set the font for each window
// 2.1.0 2016/09/28 Added a function to automatically scale the icon size according to font size
//                  Added a function to change the frame when focusing on the target window
//                  Applied JavaScript formulas when setting the properties of numeric items
// 2.0.0 2016/08/22 Window transparency was changed to coordinate with v1.3.0
// 1.1.3 2016/08/05 Less warnings displayed on v1.3.0
// 1.1.2 2016/07/20 Fixed an issue where content was not recreated after loading in certain windows
// 1.1.1 2016/07/17 Fixed an issue that changing margin and font size is restored after switching the screen
// 1.1.0 2016/07/11 Added a plugin command that temporarily disables the position of the message window
// 1.0.2 2016/04/02 Resolve conflict with liply_memoryleak_patch.js
// 1.0.1 2016/03/28 Corrected an error when trying to change the properties of certain windows
// 1.0.0 2016/03/13 First edition
// 0.9.0 2016/03/05 Beta
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc GUI screen design mode-
 * To save changes "Save Project" (Ctrl + S)
 * @author Triacontane
 *
 * @param Design mode
 * @desc Launches the game in design mode. (ON / OFF)
 * You can adjust position by drag & drop while in mode.
 * @default true
 * @type boolean
 *
 * @param Autosave
 * @desc Saves changes automatically when position is changed. (ON / OFF)
 * Normally save with Ctrl + S.
 * @default false
 * @type boolean
 *
 * @param Mobile make
 * @desc Creates a mobile window layout separately. (ON / OFF)
 * Turn this ON only when you want to change the window layout 
 * @default false
 * @type boolean
 *
 * @param Fake mobile
 * @desc Impersonates mobile execution. (ON / OFF)
 * Turn On when creating mobile version windows or testing.
 * @default false
 * @type boolean
 *
 * @param Window through
 * @desc Transparent when windows overlap. (ON / OFF)
 * OFF if other plugins have similar functions.
 * @default false
 * @type boolean
 *
 * @param Grid size
 * @desc Displays grid at the specified size during window adjustment.
 * 0 to hide.
 * @default 48
 * @type number
 *
 * @param Padding
 * @desc Default value for window margin. Default: 18
 * @default 0
 * @type number
 *
 * @param Font size
 * @desc Default window font size. Default: 28
 * @default 0
 * @type number
 *
 * @param Line height
 * @desc Default window line height. Default: 36
 * @default 0
 * @type number
 *
 * @param Background transparency
 * @desc Default window background transparency. Default: 192
 * @default 0
 * @type number
 *
 * @param Icon size scale
 * @desc Automatically adjusts icon size when font size is changed.
 * @default false
 * @type boolean
 *
 * @param Background fixed
 * @desc Ignores the background setting specified for each event command
 * in the message window etc., and fixes it with the plug-in setting value.
 * @default false
 * @type boolean
 *
 * @param Right click hide
 * @desc Hides the window when right-clicking in design mode.
 * (If OFF, only the frame is deleted)
 * @default false
 * @type boolean
 *
 * @param Ignore message window
 * @desc Do not touch messages, choices, and numeric input windows.
 * Changed position is not reset.
 * @default false
 * @type boolean
 *
 * @help Display position of windows and images on each screen. (Menu and battle screen)
 * You can change the appearance of the screen graphically by dragging and dropping.
 * Width, height, margin, background image, etc. can also be changed on the screen.
 *
 * In addition to the default screen, screens added by plugins- Position can be altered.
 * (Operation is not guaranteed, it depends on the implementation of the other party.)
 *
 * Please follow the steps below.
 *
 * 1. Set the parameter “Design Mode” to “ON”.
 *   - “ON” by default.
 *
 * 2. Start testplay, battle test, and event test.
 *
 * 3. Grab the object with a mouse and place it where you want.
 *   - Normal window operation with the mouse is disabled.
 *   - Automatically snaps to other windows and screen edges. (Disable with Shift key)
 *   - Press Ctrl to snap to the grid. (Option key for Mac)
 *   - Undo the last change with Ctrl + Z.
 *   - Ctrl + Shift + Enter initializes all changes in the current scene.
 *   - Right-click in the window to toggle the transparency of the frame.
 *     If the parameter is changed, the entire window is displayed / hidden.
 *     Once hidden, it cannot be redisplayed unless the entire screen resets.
 *   - Each property can be changed by pressing the number key (*) in the window.
 *   - If you type "changePos(x,y);" (x: X coordinate, y: Y coordinate) in console-
 *     You can change the position of the last edited window.
 *
 * 4. Save the customized position with Ctrl + S.
 *
 * 5. Set “Design Mode” to “OFF” for normal testplay. (Design Mode "ON" for deployment)
 *
 * ※Correspondence between numbers and properties (number keys that are not numeric keys)
 *
 * 1. Window width (※1)
 * 2. Window height (directly specified) (※1)
 * 3. Window margin(※2)
 * 4. Window font size(※2)
 * 5. Height per line of the window (※2)
 * 6. Window background transparency (※2)
 * 7. Number of lines in the window (※2)
 * 8. Window background image filename
 * 9. Window font name (※3)
 *
 * ※1 JS calculation formula can be applied. The calculation formula is evaluated only on the spot you entered.
 * ※2 JS calculation formula can be applied. The formula is saved and re-evaluated when displayed on the screen.
 * If you don't know, you can set the value like before.
 * ※3 Fonts must be loaded. Please use "Font Load Plugin".
 * Download: raw.githubusercontent.com/triacontane/RPGMakerMV/master/FontLoad.js
 * ※4 For Mac, use the option key instead of the Ctrl key. (The command key does not respond)
 *
 * In addition, any picture or window can be displayed additionally.
 * For details, refer to “User rewrite area” in the source code.
 * The position of the additional display can also be adjusted by drag and drop.
 *
 * The contents displayed in the window can be changed with the following control characters.
 * \\AL[left]   # Left align (If blank, left)
 * \\AL[0]      # Same as above
 * \\AL[center] # Center
 * \\AL[1]      # Same as above
 * \\AL[right]  # Right align
 * \\AL[2]      # Same as above
 *
 * Saved contents are saved in “data / ContainerProperties.json”.
 * Editing with a JSON editor is also possible.
 *
 * You can also define different window layouts for mobile devices.
 * Placement information for mobile is saved in “data / ContainerPropertiesMobile.json”.
 *
 * Enable Mobile Impersonation option to run on mobile device on PC
 * Can be reproduced. When reproducing mobile execution, the format of audio and video files-
 * May change the audio file or not play.
 *
 * You cannot change the position of a window that's changed with this plugin.
 * Therefore, this plugin can be used for window positions change during the game.
 * If the position is fixed, it may not displayed correctly.
 *
 * If the display ends up looking strange,
 * Use Ctrl+Shift+Enter to initialize all windows in the screen.
 *
 * Be careful! The picture added at the time of deployment
 * It may be excluded as an unused file.
 * In that case, it is necessary to re-install the deleted file.
 *
 * Caution!
 * Window position and size may vary depending on usage of other plugins
 * It may not saved correctly.
 *
 * Plugin command details
 *  Execute from event command "Plugin Command".
 *  (Separate parameters with a space)
 *
 * unlock message
 * GDM_UNLOCK_MESSAGE_WINDOW
 *  Temporarily cancel the message window position change.
 *  Coordinates changed becomes invalid
 *  The window position specified in the event “Message Display” is enabled.
 *
 * lock message
 * GDM_LOCK_MESSAGE_WINDOW
 *  Re-enable message window repositioning.
 *  Coordinates changed are valid
 *  The window position specified in the event “Message Display” is ignored.
 *
 * unlock choice
 * GDM_UNLOCK_CHOICE_WINDOW
 *  Temporarily cancel the position change of the choice window.
 *  Coordinates changed becomes invalid
 *  The window position specified in the event “Show choices” is enabled.
 *
 * lock choice
 * GDM_LOCK_CHOICE_WINDOW
 *  Re-enable message window repositioning.
 *  Coordinates changed are valid
 *  The window position specified in the event “Show choice” is ignored.
 *
 * This plugin is released under the MIT License.
 */
var $dataContainerProperties = null;

(function() {
    'use strict';
    //=============================================================================
    // ユーザ書き換え領域 - 開始 -
    //  pictures : 各画面で表示するピクチャ情報
    //  windows  : 各画面で表示するウィンドウ情報
    // （ここで指定したファイル名は、デプロイメント時に
    // 　未使用ファイルとして除外される可能性があります）
    // ※コピー＆ペーストしやすくするために最後の項目にもカンマを付与しています。
    //=============================================================================
    var settings = {
        /* タイトル画面の追加情報 */
        Scene_Title   : {
            /* pictures:シーンに追加表示する画像です。無条件で表示されます。 */
            pictures: [
                /* file:「img/pictures/」以下のファイルを拡張子なしで指定します  switchId: 表示条件となるスイッチIDです*/
                {file: '', switchId: 0},
            ],
            /* windows:シーンに追加表示するウィンドウです。*/
            windows : [
                /* lines:表示内容の配列です。 制御文字が利用できます。「\\i[n]」と「\」をひとつ多く指定してください。*/
                /* switchId:出現条件となるスイッチIDです */
                /* 位置を調整後に新しいウィンドウを追加する場合は、必ず「配列の末尾に追加」してください */
                {lines: [], switchId: 0},
            ],
        },
        /* メインメニュー画面の追加情報 */
        Scene_Menu    : {
            pictures: [
                {file: '', switchId: 0},
            ],
            windows : [
                {lines: [], switchId: 0},
            ],
        },
        /* 戦闘画面の追加情報 */
        Scene_Battle  : {
            pictures: [
                {file: '', switchId: 0},
            ],
            windows : [
                {lines: [], switchId: 0},
            ],
        },
        /* アイテムメニュー画面の追加情報 */
        Scene_Item    : {
            pictures: [
                {file: '', switchId: 0},
            ],
            windows : [
                {lines: [], switchId: 0},
            ],
        },
        /* スキルメニュー画面の追加情報 */
        Scene_Skill   : {
            pictures: [
                {file: '', switchId: 0},
            ],
            windows : [
                {lines: [], switchId: 0},
            ],
        },
        /* 装備メニュー画面の追加情報 */
        Scene_Equip   : {
            pictures: [
                {file: '', switchId: 0},
            ],
            windows : [
                {lines: [], switchId: 0},
            ],
        },
        /* ステータスメニュー画面の追加情報 */
        Scene_Status  : {
            pictures: [
                {file: '', switchId: 0},
            ],
            windows : [
                {lines: [], switchId: 0},
            ],
        },
        /* オプション画面の追加情報 */
        Scene_Options : {
            pictures: [
                {file: '', switchId: 0},
            ],
            windows : [
                {lines: [], switchId: 0},
            ],
        },
        /* セーブ画面の追加情報 */
        Scene_Save    : {
            pictures: [
                {file: '', switchId: 0},
            ],
            windows : [
                {lines: [], switchId: 0},
            ],
        },
        /* ロード画面の追加情報 */
        Scene_Load    : {
            pictures: [
                {file: '', switchId: 0},
            ],
            windows : [
                {lines: [], switchId: 0},
            ],
        },
        /* ショップ画面の追加情報 */
        Scene_Shop    : {
            pictures: [
                {file: '', switchId: 0},
            ],
            windows : [
                {lines: [], switchId: 0},
            ],
        },
        /* 名前入力画面の追加情報 */
        Scene_Name    : {
            pictures: [
                {file: '', switchId: 0},
            ],
            windows : [
                {lines: [], switchId: 0},
            ],
        },
        /* ゲームオーバー画面の追加情報 */
        Scene_Gameover: {
            pictures: [
                {file: '', switchId: 0},
            ],
            windows : [
                {lines: [], switchId: 0},
            ],
        },
    };
    //=============================================================================
    // ユーザ書き換え領域 - 終了 -
    //=============================================================================
    var pluginName    = 'GraphicalDesignMode';
    var metaTagPrefix = 'GDM';

    if (!Utils.RPGMAKER_VERSION || Utils.RPGMAKER_VERSION.match(/^1\.2./)) {
        alert('!!!このプラグインは本体バージョン1.3系以降でないと使用できません。!!!');
        return;
    }

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (value == null) return null;
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return value.toUpperCase() === 'ON' || value.toUpperCase() === 'TRUE';
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getArgString = function(arg, upperFlg) {
        arg = convertEscapeCharacters(arg);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getArgEval = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (eval(convertEscapeCharacters(arg)) || 0).clamp(min, max);
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var window = SceneManager._scene._windowLayer.children[0];
        return window ? window.convertEscapeCharacters(text) : text;
    };

    var checkTypeFunction = function(value) {
        return checkType(value, 'Function');
    };

    var checkType = function(value, typeName) {
        return Object.prototype.toString.call(value).slice(8, -1) === typeName;
    };

    var getClassName = function(object) {
        return object.constructor.toString().replace(/function\s+(.*)\s*\([\s\S]*/m, '$1');
    };

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var paramDesignMode      = getParamBoolean(['DesignMode', 'Design mode']);
    var paramThroughWindow   = getParamBoolean(['ThroughWindow', 'Window through']);
    var paramAutoSave        = getParamBoolean(['AutoSave', 'Autosave']);
    var paramGridSize        = getParamNumber(['GridSize', 'Grid size'], 0) || 0;
    var paramPadding         = getParamNumber(['Padding', 'Padding']);
    var paramFontSize        = getParamNumber(['FontSize', 'Font size']);
    var paramLineHeight      = getParamNumber(['LineHeight', 'Line height']);
    var paramBackOpacity     = getParamNumber(['LineHeight', 'Background transparency']);
    var paramMobileMake      = getParamBoolean(['MobileMake', 'Mobile make']);
    var paramFakeMobile      = getParamBoolean(['FakeMobile', 'Fake mobile']);
    var paramIconSizeScale   = getParamBoolean(['IconSizeScale', 'Icon size scale']);
    var paramBackgroundFixed = getParamBoolean(['BackgroundFixed', 'Background fixed']);
    var paramRightClickHide  = getParamBoolean(['RightClickHide', 'Right click hide']);
    var paramIgnoreMesWindow = getParamBoolean(['IgnoreMesWindow', 'Ignore message window']);

    //=============================================================================
    // Utils
    //  デザインモード判定を追加します。
    //=============================================================================
    Utils.isDesignMode = function() {
        return (this.isOptionValid('test') || this.isOptionValid('btest') || this.isOptionValid('etest')) &&
            this.isNwjs() && paramDesignMode;
    };

    //=============================================================================
    // デザインモードの場合のみ実装する
    //=============================================================================
    if (Utils.isDesignMode()) {

        //=============================================================================
        // グローバル関数
        //=============================================================================
        window.changePos = function(x, y) {
            SceneManager.setLastWindowPosition(x, y);
        };

        //=============================================================================
        // Input
        //  コピーと上書き保存用のボタンを追加定義します。
        //=============================================================================
        Input.keyMapper[67] = 'copy';
        Input.keyMapper[83] = 'save';
        for (var i = 49; i < 58; i++) {
            Input.keyMapper[i] = 'num' + (i - 48);
        }

        var _Input__wrapNwjsAlert = Input._wrapNwjsAlert;
        Input._wrapNwjsAlert      = function() {
            _Input__wrapNwjsAlert.apply(this, arguments);
            var _prompt   = window.prompt;
            window.prompt = function() {
                var gui    = require('nw.gui');
                var win    = gui.Window.get();
                var result = _prompt.apply(this, arguments);
                win.focus();
                Input.clear();
                return result;
            };
        };

        var _Input_isRepeated = Input.isRepeated;
        Input.isRepeated      = function(keyName) {
            if (keyName === 'ok' && this.isPressed('control')) {
                return false;
            }
            return _Input_isRepeated.apply(this, arguments);
        };

        //=============================================================================
        // TouchInput
        //  ポインタ位置を常に記憶します。
        //=============================================================================
        TouchInput._onMouseMove = function(event) {
            var x = Graphics.pageToCanvasX(event.pageX);
            var y = Graphics.pageToCanvasY(event.pageY);
            this._onMove(x, y);
        };

        //=============================================================================
        // SceneManager
        //  ウィンドウポジションをjson形式で保存する処理を追加定義します。
        //=============================================================================
        SceneManager.controlNumber = 0;

        var _SceneManager_initialize = SceneManager.initialize;
        SceneManager.initialize      = function() {
            _SceneManager_initialize.call(this);
            this.lastWindowX            = null;
            this.lastWindowY            = null;
            this._lastWindow            = null;
            this._windowPositionChanged = false;
            this.infoWindow             = '';
            this.infoExtend             = '';
            this._copyCount             = 0;
            this._infoHelp              = 'Starting design mode. ';
            this._documentTitle         = '';
            this._changeStack           = [];
            this.showDevToolsForGdm();
        };

        SceneManager.setLastWindow = function(windowObject) {
            this._lastWindow = windowObject;
        };

        SceneManager.setLastWindowPosition = function(x, y) {
            if (!this._lastWindow) {
                this.setInfoExtend('This operation is invalid because the object does not exist.', 0);
                return;
            }
            this._lastWindow.position.x = x;
            this._lastWindow.position.y = y;
            this._windowPositionChanged = true;
        };

        SceneManager.isWindowPositionChanged = function(windowObject) {
            if (this._windowPositionChanged && windowObject === this._lastWindow) {
                this._windowPositionChanged = false;
                return true;
            }
            return false;
        };

        SceneManager.showDevToolsForGdm = function() {
            var nwWin = require('nw.gui').Window.get();
            if (nwWin.isDevToolsOpen) {
                if (!nwWin.isDevToolsOpen()) {
                    var devTool = nwWin.showDevTools();
                    devTool.moveTo(0, 0);
                    devTool.resizeTo(window.screenX + window.outerWidth, window.screenY + window.outerHeight);
                    nwWin.focus();
                }
            } else {
                nwWin.showDevTools();
            }
            this.outputStartLog();
        };

        SceneManager.outputStartLog = function() {
            var logValue = [
                '☆☆☆Getting started.☆☆☆\n',
                'In design mode, you can set or arrange objects properties and design the screen ingame during playtest. \n',
                '--------------------Controls----------------------------------------------------------------------\n',
                'Drag and drop: Grab windows and images and rearrange them where you want.\n',
                'Ctrl + mouse: The window or image snaps to the grid. (Option key on Mac) \n',
                'Shift + mouse: Windows and images will not snap to objects or screen edge.\n',
                'If you type "changePos(x,y);" (x: X coordinate, y: Y coordinate) in the console, you can change window position.\n',
                'Ctrl + S: Save all changes.\n',
                'Ctrl + C: Copies the coordinates into a clipboard.\n',
                'Ctrl + Z: Undo the last operation.\n',
                'Ctrl + Shift + Enter: Resets all screen layouts and reloads. \n',
                'Right-click: Displays / hides the window frame (or the entire window).\n',
                'Numeric key: When pressed within the window, the corresponding properties can be changed as follows.\n',
                ' 1. Window width (※1)\n',
                ' 2. Window height (directly specified) (※1)\n',
                ' 3. Window margin (※2)\n',
                ' 4. Window font size (※2)\n',
                ' 5. Height per line of the window (※2)\n',
                ' 6. Window background transparency (※2)\n',
                ' 7. Number of lines in the window (※2)\n',
                ' 8. Window background image filename\n',
                ' 9. Window font name (※3)\n',
                '※1 JS calculation formula can be applied. The calculation formula is evaluated once on the spot you enter.\n',
                '※2 JS calculation formula can be applied. The formula is saved and re-evaluated when displayed on the screen.\n',
                'If you want to know, you can set the value like before.\n',
                '※3 Fonts must be loaded. Please use "Font Load Plugin".\n',
                'Download: raw.githubusercontent.com/triacontane/RPGMakerMV/master/FontLoad.js\n',
                '※4 For Mac, use the option key instead of Ctrl key. (The command key does not respond)\n',
                '-----------------------------------------------------------------------------------------------------\n',
                'The following Controls are shown.\n'
            ];
            console.log.apply(console, logValue);
        };

        var _SceneManager_onSceneCreate = SceneManager.onSceneCreate;
        SceneManager.onSceneCreate      = function() {
            _SceneManager_onSceneCreate.apply(this, arguments);
            this._changeStack = [];
        };

        SceneManager.pushChangeStack = function(child) {
            var index = child.parent.getChildIndex(child);
            var info  = {parent: child.parent, index: index};
            child.saveProperty(info);
            this._changeStack.push(info);
        };

        SceneManager.popChangeStack = function() {
            var info = this._changeStack.pop();
            if (info) {
                var child = info.parent.children[info.index];
                if (child) {
                    child.loadProperty(info);
                    child.saveContainerInfo();
                    return true;
                }
            }
            return false;
        };

        var _SceneManager_update = SceneManager.updateMain;
        SceneManager.updateMain  = function() {
            _SceneManager_update.apply(this, arguments);
            this.updateDragInfo();
        };

        SceneManager.updateDragInfo = function() {
            if (Input.isPressed('control') && Input.isTriggered('copy')) {
                SoundManager.playOk();
                if (this.lastWindowX == null || this.lastWindowY == null) return;
                var clipboard = require('nw.gui').Clipboard.get();
                var copyValue = '';
                if (this._copyCount % 2 === 0) {
                    copyValue = this.lastWindowX.toString();
                    this.setInfoExtend('X coordinate[' + copyValue + ']Copied to clipboard.', 0);
                } else {
                    copyValue = this.lastWindowY.toString();
                    this.setInfoExtend('Y coordinate[' + copyValue + ']Copied to clipboard.', 0);
                }
                clipboard.set(copyValue, 'text');
                this._copyCount++;
            }
            if (Input.isPressed('control') && Input.isTriggered('save')) {
                SoundManager.playSave();
                DataManager.saveDataFileWp();
                this.setInfoExtend('All changes have been saved.', 0);
            }
            if (Input.isPressed('control') && Input.isTriggered('ok')) {
                if (this.popChangeStack()) {
                    SoundManager.playCancel();
                    this.setInfoExtend('The operation of the number on the left has been restored.', -1);
                    if (paramAutoSave) DataManager.saveDataFileWp();
                }
            }
            if (Input.isPressed('control') && Input.isPressed('shift') && Input.isPressed('ok')) {
                $dataContainerProperties[this.getSceneName()] = {};
                DataManager.saveDataFileWp();
                location.reload();
            }
            var docTitle        = this._infoHelp + this.infoWindow + this.infoExtend;
            document.title      = docTitle;
            this._documentTitle = docTitle;
        };

        SceneManager.setInfoExtend = function(value, add) {
            this.controlNumber += add;
            this.infoExtend = ' ' + value;
            console.log(add ? this.controlNumber + (add < 0 ? 1 : 0) + ' : ' + value : value);
            if (paramAutoSave && add !== 0) {
                console.log('Your changes have been saved by auto-save.');
            }
        };

        //=============================================================================
        // DataManager
        //  ウィンドウポジションをjson形式で保存する処理を追加定義します。
        //=============================================================================
        DataManager.saveDataFileWp = function() {
            StorageManager.saveToLocalDataFile(this._databaseFileCp.src, window[this._databaseFileCp.name]);
        };

        //=============================================================================
        // StorageManager
        //  ウィンドウポジションをjson形式で保存する処理を追加定義します。
        //=============================================================================
        StorageManager.saveToLocalDataFile = function(fileName, json) {
            var data     = JSON.stringify(json);
            var fs       = require('fs');
            var dirPath  = this.localDataFileDirectoryPath();
            var filePath = dirPath + fileName;
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }
            fs.writeFileSync(filePath, data);
        };

        StorageManager.localDataFileDirectoryPath = function() {
            var path = require('path');
            var base = path.dirname(process.mainModule.filename);
            return path.join(base, 'data/');
        };

        //=============================================================================
        // Scene_Base
        //  ウィンドウをドラッグ＆ドロップします。
        //=============================================================================
        var _Scene_Base_update      = Scene_Base.prototype.update;
        Scene_Base.prototype.update = function() {
            _Scene_Base_update.apply(this, arguments);
            if (this._windowLayer) this.updateDrag();
        };

        Scene_Base.prototype.updateDrag = function() {
            this._windowLayer.isFrameChanged = false;

            var result = this._windowLayer.children.clone().reverse().some(function(container) {
                return checkTypeFunction(container.processDesign) && container.processDesign();
            }, this);
            if (result) return;
            this.children.clone().reverse().some(function(container) {
                return checkTypeFunction(container.processDesign) && container.processDesign();
            }, this);
        };

        var _Scene_Base_createWindowLayer      = Scene_Base.prototype.createWindowLayer;
        Scene_Base.prototype.createWindowLayer = function() {
            if (!(this instanceof Scene_Boot) && !(this instanceof Scene_Map)) this.createGridSprite();
            _Scene_Base_createWindowLayer.apply(this, arguments);
        };

        Scene_Base.prototype.createGridSprite = function() {
            var size = paramGridSize;
            if (size === 0) return;
            var width        = Graphics.boxWidth;
            var height       = Graphics.boxHeight;
            this._gridSprite = new Sprite();
            this._gridSprite.setFrame(0, 0, width, height);
            var bitmap = new Bitmap(width, height);
            for (var x = 0; x < width; x += size) {
                bitmap.fillRect(x, 0, 1, height, 'rgba(255,255,255,1.0)');
            }
            for (var y = 0; y < height; y += size) {
                bitmap.fillRect(0, y, width, 1, 'rgba(255,255,255,1.0)');
            }
            this._gridSprite.bitmap      = bitmap;
            this._gridSprite.moveDisable = true;
            this.addChild(this._gridSprite);
        };

        //=============================================================================
        // PIXI.Container およびそのサブクラス
        //  コンテナをドラッグ＆ドロップします。
        //=============================================================================
        var _PIXI_DisplayObjectContainer_initialize = PIXI.Container.prototype.initialize;
        PIXI.Container.prototype.initialize         = function(x, y, width, height) {
            _PIXI_DisplayObjectContainer_initialize.apply(this, arguments);
            this._holding      = false;
            this._dx           = 0;
            this._dy           = 0;
            this.moveDisable   = false;
            this._positionLock = false;
        };

        PIXI.Container.prototype.processDesign = function() {
            var result = false;
            if (!this.moveDisable) {
                if (this.processPosition()) {
                    var info                 = 'X:[' + this.x + '] Y:[' + this.y + ']';
                    SceneManager.lastWindowX = this.x;
                    SceneManager.lastWindowY = this.y;
                    SceneManager.infoWindow  = info;
                    SceneManager.infoCopy    = '';
                    if (!this._holding) SceneManager.setInfoExtend('The position has been changed. ' + info, 1);
                    result = true;
                }
                if (this.processOpacity()) {
                    SceneManager.setInfoExtend('The display / non-display of the background was changed. ', 1);
                    result = true;
                }
                if (this.processInput()) {
                    SceneManager.setInfoExtend(this._propLabel + 'The value of' + this._propValue + 'has changed. ', 1);
                    result = true;
                }
                this.processFrameChange();
            }
            return result;
        };

        if (paramIgnoreMesWindow) {
            Window_Message.prototype.processDesign = function() {};
            Window_NumberInput.prototype.processDesign = function() {};
            Window_ChoiceList.prototype.processDesign = function() {};
        }

        PIXI.Container.prototype.processPosition = function() {
            if (SceneManager.isWindowPositionChanged(this)) {
                return true;
            }
            if (this.isTouchEvent(TouchInput.isTriggered) || (this._holding && TouchInput.isPressed())) {
                if (!this._holding) this.hold();
                var x = TouchInput.x - this._dx;
                var y = TouchInput.y - this._dy;
                if (Input.isPressed('control')) {
                    var size = paramGridSize;
                    if (size !== 0) {
                        x += (x % size > size / 2 ? size - x % size : -(x % size));
                        y += (y % size > size / 2 ? size - y % size : -(y % size));
                    }
                } else if (!Input.isPressed('shift') && !this.isAnchorChanged()) {
                    x = this.updateSnapX(x);
                    y = this.updateSnapY(y);
                }
                this.position.x    = x;
                this.position.y    = y;
                this._positionLock = true;
                return true;
            } else if (this._holding) {
                this.release();
                return true;
            }
            return false;
        };

        PIXI.Container.prototype.processFrameChange = function() {};

        Window_Base.prototype.processFrameChange = function() {
            if (this._holding || !TouchInput.isMoved()) return;
            if (this.isPreparedEvent() && !this.parent.isFrameChanged) {
                this._windowFrameSprite.setBlendColor([255, 128, 0, 192]);
                this.parent.isFrameChanged = true;
                SceneManager.setLastWindow(this);
            } else {
                this._windowFrameSprite.setBlendColor([0, 0, 0, 0]);
            }
        };

        PIXI.Container.prototype.processOpacity = function() {};

        Window_Base.prototype.processOpacity = function() {
            if (this.isTouchEvent(TouchInput.isCancelled)) {
                SoundManager.playMiss();
                SceneManager.pushChangeStack(this);
                if (paramRightClickHide) {
                    this.visible = !this.visible;
                } else {
                    this.opacity = (this.opacity === 255 ? 0 : 255);
                }
                this.saveContainerInfo();
                return true;
            }
            return false;
        };

        PIXI.Container.prototype.processInput = function() {};

        Window_Base.prototype.processInput = function() {
            if (this.isPreparedEvent()) {
                var params = [
                    ['num1', 'Width', 'width', 1, 2000, null],
                    ['num2', 'Height', 'height', 1, 2000, null],
                    ['num3', 'Padding', '_customPadding', 1, 100, this.updatePadding.bind(this), true],
                    ['num4', 'Font size', '_customFontSize', 1, 100, this.resetFontSettings.bind(this), true],
                    ['num5', 'Line height', '_customLineHeight', 1, 2000, this.setFittingHeight.bind(this), true],
                    ['num6', 'Background transparency', '_customBackOpacity', 0, 255, this.updateBackOpacity.bind(this), true],
                    ['num7', 'Line number', '_customLineNumber', 0, 999, this.setFittingHeight.bind(this), true],
                    ['num8', 'Background image filename', '_customBackFileName', null, null, this.createBackSprite.bind(this), true],
                    ['num9', 'Font name', '_customFontFace', null, null, this.resetFontSettings.bind(this), true]
                ];
                return params.some(function(param) {
                    return this.processSetProperty.apply(this, param);
                }.bind(this));
            }
            return false;
        };

        Window_Base.prototype.setFittingHeight = function() {
            if (this._customLineNumber) this.height = this.fittingHeight(this._customLineNumber);
        };

        Window_Base.prototype.processSetProperty = function(keyCode, propLabel, propName, min, max,
                                                            callBack, stringFlg) {
            if (this[propName] === undefined) return null;
            if (Input.isTriggered(keyCode)) {
                var result = window.prompt(propLabel + 'Please enter', this[propName].toString());
                if (result || (stringFlg && result === '')) {
                    this._windowFrameSprite.setBlendColor([0, 0, 0, 0]);
                    SceneManager.pushChangeStack(this);
                    this[propName] = stringFlg ? getArgString(result) : getArgEval(result, min, max);
                    if (callBack) callBack();
                    this.reDrawContents();
                    SoundManager.playMagicEvasion();
                    this.saveContainerInfo();
                    this._propLabel = propLabel;
                    this._propValue = this[propName];
                    return true;
                }
            }
            return null;
        };

        Window_Base.prototype.reDrawContents = function() {
            this.createContents();
            this.refresh();
        };

        Window_Selectable.prototype.reDrawContents = function() {
            Window_Base.prototype.reDrawContents.apply(this, arguments);
            this.updateCursor();
        };

        PIXI.Container.prototype.isAnchorChanged = function() {
            return false;
        };

        Sprite.prototype.isAnchorChanged = function() {
            return this.anchor.x !== 0 || this.anchor.y !== 0;
        };

        PIXI.Container.prototype.hold = function() {
            this._holding = true;
            this._dx      = TouchInput.x - this.x;
            this._dy      = TouchInput.y - this.y;
            SceneManager.pushChangeStack(this);
        };

        Window_Base.prototype.hold = function() {
            PIXI.Container.prototype.hold.call(this);
            this._windowBackSprite.setBlendColor([255, 255, 255, 192]);
            this._windowContentsSprite.setBlendColor([255, 128, 0, 192]);
        };

        Sprite.prototype.hold = function() {
            PIXI.Container.prototype.hold.call(this);
            this.setBlendColor([255, 255, 255, 192]);
        };

        PIXI.Container.prototype.release = function() {
            this._holding = false;
            this.saveContainerInfo();
        };

        Window_Base.prototype.release = function() {
            PIXI.Container.prototype.release.call(this);
            this._windowBackSprite.setBlendColor([0, 0, 0, 0]);
            this._windowContentsSprite.setBlendColor([0, 0, 0, 0]);
        };

        Sprite.prototype.release = function() {
            PIXI.Container.prototype.release.call(this);
            this.setBlendColor([0, 0, 0, 0]);
        };

        PIXI.Container.prototype.updateSnapX = function(x) {
            var minDistanceL = 16, minIndexL = -1, minDistanceR = 16, minIndexR = -1;
            var children     = this.parent.children, endX = x + this.width;
            for (var i = 0, n = children.length; i < n; i++) {
                var child = children[i];
                if (child !== this && this.isSameInstance(child) && child.isTouchable() && child.isOverlapY(this)) {
                    var distanceL = Math.abs(x - child.endX);
                    if (minDistanceL > distanceL) {
                        minDistanceL = distanceL;
                        minIndexL    = i;
                    }
                    var distanceR = Math.abs(endX - child.x);
                    if (minDistanceR > distanceR) {
                        minDistanceR = distanceR;
                        minIndexR    = i;
                    }
                }
            }
            if (minDistanceL > Math.abs(x)) return 0;
            if (minDistanceR > Math.abs(Graphics.boxWidth - endX)) return Graphics.boxWidth - this.width;
            if (minDistanceR > minDistanceL) {
                return minIndexL === -1 ? x : children[minIndexL].endX;
            } else {
                return minIndexR === -1 ? x : children[minIndexR].x - this.width;
            }
        };

        PIXI.Container.prototype.updateSnapY = function(y) {
            var minDistanceU = 16, minIndexU = -1, minDistanceD = 16, minIndexD = -1;
            var children     = this.parent.children, endY = y + this.height;
            for (var i = 0, n = children.length; i < n; i++) {
                var child = children[i];
                if (child !== this && this.isSameInstance(child) && child.isTouchable() && child.isOverlapX(this)) {
                    var distanceU = Math.abs(y - child.endY);
                    if (minDistanceU > distanceU) {
                        minDistanceU = distanceU;
                        minIndexU    = i;
                    }
                    var distanceD = Math.abs(endY - child.y);
                    if (minDistanceD > distanceD) {
                        minDistanceD = distanceD;
                        minIndexD    = i;
                    }
                }
            }
            if (minDistanceU > Math.abs(y)) return 0;
            if (minDistanceD > Math.abs(Graphics.boxHeight - endY)) return Graphics.boxHeight - this.height;
            if (minDistanceD > minDistanceU) {
                return minIndexU === -1 ? y : children[minIndexU].endY;
            } else {
                return minIndexD === -1 ? y : children[minIndexD].y - this.height;
            }
        };

        PIXI.Container.prototype.isSameInstance = function() {
            return false;
        };

        Window_Base.prototype.isSameInstance = function(objectContainer) {
            return objectContainer instanceof Window_Base;
        };

        Sprite.prototype.isSameInstance = function(objectContainer) {
            return objectContainer instanceof Sprite;
        };

        PIXI.Container.prototype.isTouchPosInRect = function() {
            var tx = TouchInput.x;
            var ty = TouchInput.y;
            return (tx >= this.x && tx <= this.endX &&
            ty >= this.y && ty <= this.endY);
        };

        Sprite.prototype.isTouchPosInRect = function() {
            if (this.isTransparent()) return false;
            var dx  = TouchInput.x - this.x;
            var dy  = TouchInput.y - this.y;
            var sin = Math.sin(-this.rotation);
            var cos = Math.cos(-this.rotation);
            var rx  = this.x + Math.floor(dx * cos + dy * -sin);
            var ry  = this.y + Math.floor(dx * sin + dy * cos);
            return (rx >= this.minX() && rx <= this.maxX() &&
            ry >= this.minY() && ry <= this.maxY());
        };

        Sprite.prototype.isTransparent = function() {
            var dx  = TouchInput.x - this.x;
            var dy  = TouchInput.y - this.y;
            var sin = Math.sin(-this.rotation);
            var cos = Math.cos(-this.rotation);
            var bx  = Math.floor(dx * cos + dy * -sin) / this.scale.x + this.anchor.x * this.width;
            var by  = Math.floor(dx * sin + dy * cos) / this.scale.y + this.anchor.y * this.height;
            return this.bitmap.getAlphaPixel(bx, by) === 0;
        };

        Sprite.prototype.screenWidth = function() {
            return (this.width || 0) * this.scale.x;
        };

        Sprite.prototype.screenHeight = function() {
            return (this.height || 0) * this.scale.y;
        };

        Sprite.prototype.screenX = function() {
            return (this.x || 0) - this.anchor.x * this.screenWidth();
        };

        Sprite.prototype.screenY = function() {
            return (this.y || 0) - this.anchor.y * this.screenHeight();
        };

        Sprite.prototype.minX = function() {
            return Math.min(this.screenX(), this.screenX() + this.screenWidth());
        };

        Sprite.prototype.minY = function() {
            return Math.min(this.screenY(), this.screenY() + this.screenHeight());
        };

        Sprite.prototype.maxX = function() {
            return Math.max(this.screenX(), this.screenX() + this.screenWidth());
        };

        Sprite.prototype.maxY = function() {
            return Math.max(this.screenY(), this.screenY() + this.screenHeight());
        };

        PIXI.Container.prototype.isTouchable = function() {
            return false;
        };

        Window_Base.prototype.isTouchable = function() {
            return (this.opacity > 0 || this.contentsOpacity > 0) && this.visible && this.isOpen();
        };

        Window_BattleLog.prototype.isTouchable = function() {
            return Window.prototype.isTouchable.call(this) && this._lines.length > 0;
        };

        Sprite.prototype.isTouchable = function() {
            return this.visible && this.bitmap != null && this.scale.x !== 0 && this.scale.y !== 0;
        };

        PIXI.Container.prototype.isTouchEvent = function(triggerFunc) {
            return this.isTouchable() && triggerFunc.call(TouchInput) && this.isTouchPosInRect();
        };

        PIXI.Container.prototype.isPreparedEvent = function() {
            return this.isTouchable() && this.isTouchPosInRect();
        };

        PIXI.Container.prototype.isRangeX = function(x) {
            return this.x <= x && this.endX >= x;
        };

        PIXI.Container.prototype.isRangeY = function(y) {
            return this.y <= y && this.endY >= y;
        };

        PIXI.Container.prototype.isOverlapX = function(win) {
            return this.isRangeX(win.x) || this.isRangeX(win.endX) || win.isRangeX(this.x) || win.isRangeX(this.endX);
        };

        PIXI.Container.prototype.isOverlapY = function(win) {
            return this.isRangeY(win.y) || this.isRangeY(win.endY) || win.isRangeY(this.y) || win.isRangeY(this.endY);
        };

        Object.defineProperty(PIXI.Container.prototype, 'endX', {
            get: function() {
                return this.x + this.width;
            },
            set: function(value) {
                this.x = value - this.width;
            },

            configurable: true
        });

        Object.defineProperty(PIXI.Container.prototype, 'endY', {
            get: function() {
                return this.y + this.height;
            },
            set: function(value) {
                this.y = value - this.height;
            },

            configurable: true
        });

        //=============================================================================
        //  Window_Selectable
        //   通常のタッチ操作を無効化します。
        //=============================================================================
        Window_Selectable.prototype.processTouch = function() {};
        Window_BattleActor.prototype.processTouch = function() {};
        Window_BattleEnemy.prototype.processTouch = function() {};

        var _Window_Message_isTriggered = Window_Message.prototype.isTriggered;
        Window_Message.prototype.isTriggered = function() {
            if (TouchInput.isRepeated()) {
                return false;
            } else {
                return _Window_Message_isTriggered.apply(this, arguments);
            }
        };
    }

    //=============================================================================
    // ウィンドウを透過して重なり合ったときの表示を自然にします。
    //=============================================================================
    if (paramThroughWindow && !WindowLayer.throughWindow) {
        WindowLayer.throughWindow = true;
        //=============================================================================
        //  WindowLayer
        //   ウィンドウのマスク処理を除去します。
        //=============================================================================
        WindowLayer.prototype._maskWindow = function(window) {};

        WindowLayer.prototype._canvasClearWindowRect = function(renderSession, window) {};
    }

    if (paramFakeMobile) {
        Utils.isMobileDevice = function() {
            return true;
        };
    }

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        if (!command.match(new RegExp('^' + metaTagPrefix))) return;
        this.pluginCommandGraphicalDesignMode(command.replace(metaTagPrefix, ''), args);
    };

    Game_Interpreter.prototype.pluginCommandGraphicalDesignMode = function(command) {
        switch (getCommandName(command)) {
            case 'unlock message' :
            case '_UNLOCK_MESSAGE_WINDOW':
                SceneManager._scene._messageWindow.unlockPosition();
                break;
            case 'lock message' :
            case '_LOCK_MESSAGE_WINDOW':
                var win = SceneManager._scene._messageWindow;
                if (win.isClosing()) {
                    win.setCloseListener(win.lockPosition)
                } else {
                    win.lockPosition();
                }
                break;
            case 'unlock choice' :
            case '_UNLOCK_CHOICE_WINDOW':
                SceneManager._scene._messageWindow._choiceWindow.unlockPosition();
                break;
            case 'lock choice' :
            case '_LOCK_CHOICE_WINDOW':
                var win = SceneManager._scene._messageWindow._choiceWindow;
                if (win.isClosing()) {
                    win.setCloseListener(win.lockPosition)
                } else {
                    win.lockPosition();
                }
                break;
        }
    };

    //=============================================================================
    // DataManager
    //  ContainerProperties.jsonの読み込み処理を追記します。
    //=============================================================================
    DataManager._databaseFileCp = {name: '$dataContainerProperties', src: 'ContainerProperties.json'};
    if (paramMobileMake && Utils.isMobileDevice()) {
        DataManager._databaseFileCp.src = 'ContainerPropertiesMobile.json';
    }

    var _DataManager_loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase      = function() {
        _DataManager_loadDatabase.apply(this, arguments);
        var errorMessage = this._databaseFileCp.src + 'was not found.';
        this.loadDataFileAllowError(this._databaseFileCp.name, this._databaseFileCp.src, errorMessage);
    };

    DataManager.loadDataFileAllowError = function(name, src, errorMessage) {
        var xhr = new XMLHttpRequest();
        var url = 'data/' + src;
        xhr.open('GET', url);
        xhr.overrideMimeType('application/json');
        xhr.onload   = function() {
            if (xhr.status < 400) {
                window[name] = JSON.parse(xhr.responseText);
                DataManager.onLoad(window[name]);
            } else {
                DataManager.onDataFileNotFound(name, errorMessage);
            }
        };
        xhr.onerror  = function() {
            DataManager.onDataFileNotFound(name, errorMessage);
        };
        window[name] = null;
        xhr.send();
    };

    DataManager.onDataFileNotFound = function(name, errorMessage) {
        window[name] = {};
        console.warn(errorMessage);
    };

    var _DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded      = function() {
        return _DataManager_isDatabaseLoaded.apply(this, arguments) && window[this._databaseFileCp.name];
    };

    //=============================================================================
    // SceneManager
    //  現在のシーン名を返します。
    //=============================================================================
    SceneManager.getSceneName = function() {
        return getClassName(this._scene);
    };

    var _SceneManager_updateScene = SceneManager.updateScene;
    SceneManager.updateScene      = function() {
        _SceneManager_updateScene.apply(this, arguments);
        if (this._scene) {
            this._scene.updateCustomContainer();
        }
    };

    //=============================================================================
    // Scene_Base
    //  ウィンドウ追加時に位置をロードします。
    //=============================================================================
    var _Scene_Base_addWindow      = Scene_Base.prototype.addWindow;
    Scene_Base.prototype.addWindow = function(child) {
        _Scene_Base_addWindow.apply(this, arguments);
        child.loadContainerInfo();
    };

    var _Scene_Base_addChild      = Scene_Base.prototype.addChild;
    Scene_Base.prototype.addChild = function(child) {
        _Scene_Base_addChild.apply(this, arguments);
        child.loadContainerInfo();
    };

    var _Scene_Base_createWindowLayer2     = Scene_Base.prototype.createWindowLayer;
    Scene_Base.prototype.createWindowLayer = function() {
        this.createCustomPicture();
        _Scene_Base_createWindowLayer2.apply(this, arguments);
        this.createCustomWindow();
    };

    Scene_Base.prototype.createCustomPicture = function() {
        var setting = settings[getClassName(this)];
        if (setting) {
            var pictures         = setting.pictures;
            this._customPictures = [];
            if (pictures) {
                pictures.forEach(function(picture) {
                    if (!picture.file) return;
                    var sprite    = new Sprite();
                    sprite.bitmap = ImageManager.loadPicture(picture.file, 0);
                    this._customPictures.push(sprite);
                    this.addChild(sprite);
                    sprite.switchId = picture.switchId || 0;
                }.bind(this));
            }
        }
    };

    Scene_Base.prototype.createCustomWindow = function() {
        var setting = settings[getClassName(this)];
        if (setting) {
            var windows         = setting.windows;
            this._customWindows = [];
            if (windows) {
                windows.forEach(function(windowItem) {
                    if (!windowItem.lines || windowItem.lines.length < 1) return;
                    var win = new Window_Custom(windowItem.lines);
                    this._customWindows.push(win);
                    win.switchId = windowItem.switchId || 0;
                }.bind(this));
            }
            this.updateCustomWindowVisible();
        }
    };

    Scene_Base.prototype.updateCustomContainer = function() {
        if (this._customPictures) {
            this.updateCustomPicture();
        }
        if (this._customWindows) {
            this.updateCustomWindow();
        }
    };

    Scene_Base.prototype.updateCustomPicture = function() {
        this._customPictures.forEach(function(picture) {
            if (picture.switchId > 0) {
                picture.visible = $gameSwitches.value(picture.switchId);
            }
        });
    };

    Scene_Base.prototype.updateCustomWindow = function() {
        this.updateCustomWindowVisible();
        if (!this._windowAdd) {
            this._customWindows.forEach(function(windowItem) {
                this.addWindow(windowItem);
            }, this);
            this._windowAdd = true;
        }
    };

    Scene_Base.prototype.updateCustomWindowVisible = function() {
        this._customWindows.forEach(function(windowItem) {
            if (windowItem.switchId > 0) {
                if ($gameSwitches.value(windowItem.switchId)) {
                    windowItem.show();
                } else {
                    windowItem.hide();
                }
            }
        }, this);
    };

    //=============================================================================
    // PIXI.Container
    //  表示位置のセーブとロードを行います。
    //=============================================================================
    Object.defineProperty(PIXI.Container.prototype, 'x', {
        get: function() {
            return this.position.x;
        },
        set: function(value) {
            if (this._positionLock) return;
            this.position.x = value;
        }
    });

    Object.defineProperty(PIXI.Container.prototype, 'y', {
        get: function() {
            return this.position.y;
        },
        set: function(value) {
            if (this._positionLock) return;
            this.position.y = value;
        }
    });

    PIXI.Container.prototype.loadContainerInfo = function() {
        var sceneName  = SceneManager.getSceneName();
        var parentName = getClassName(this.parent);
        var sceneInfo  = $dataContainerProperties[sceneName];
        if (sceneInfo) {
            var containerInfo = sceneInfo[parentName];
            var key           = [this.parent.getChildIndex(this), getClassName(this)];
            if (containerInfo && containerInfo[key]) {
                this.loadProperty(containerInfo[key]);
                this._positionLock = true;
            }
        }
    };

    PIXI.Container.prototype.unlockPosition = function() {
        this._positionLock    = false;
        this._customPositionX = this.position.x;
        this._customPositionY = this.position.y;
    };

    PIXI.Container.prototype.lockPosition = function() {
        this._positionLock = true;
        if (this._customPositionX) {
            this.position.x = this._customPositionX;
        }
        if (this._customPositionY) {
            this.position.y = this._customPositionY;
        }
    };

    PIXI.Container.prototype.loadProperty = function(containerInfo) {
        this.position.x = containerInfo.x;
        this.position.y = containerInfo.y;
    };

    Window_Base.prototype.loadProperty = function(containerInfo) {
        PIXI.Container.prototype.loadProperty.apply(this, arguments);
        this.width               = containerInfo.width;
        this.height              = containerInfo.height;
        this.opacity             = containerInfo.opacity;
        this.visible             = this.visible && !containerInfo.hidden;
        this._customFontSize     = containerInfo._customFontSize;
        this._customPadding      = containerInfo._customPadding;
        this._customLineHeight   = containerInfo._customLineHeight;
        this._customBackOpacity  = containerInfo._customBackOpacity;
        this._customBackFileName = containerInfo._customBackFileName;
        this._customFontFace     = containerInfo._customFontFace;
        this.updatePadding();
        this.resetFontSettings();
        this.updateBackOpacity();
        this.createContents();
        this.refresh();
        this.createBackSprite();
    };

    Window_Base.prototype.refresh = function() {};

    Window_Selectable.prototype.loadProperty = function(containerInfo) {
        var row;
        if (this._scrollY !== 0) {
            row = this.topRow();
        }
        Window_Base.prototype.loadProperty.apply(this, arguments);
        this.updateCursor();
        if (row) {
            this.setTopRow(row);
        }
    };

    PIXI.Container.prototype.saveContainerInfo = function() {
        var sceneName  = SceneManager.getSceneName();
        var parentName = getClassName(this.parent);
        if (!$dataContainerProperties[sceneName]) $dataContainerProperties[sceneName] = {};
        var sceneInfo = $dataContainerProperties[sceneName];
        if (!sceneInfo[parentName]) sceneInfo[parentName] = {};
        var containerInfo = sceneInfo[parentName];
        var key           = [this.parent.getChildIndex(this), getClassName(this)];
        if (!containerInfo[key]) containerInfo[key] = {};
        this.saveProperty(containerInfo[key]);
        if (paramAutoSave) {
            DataManager.saveDataFileWp();
        }
    };

    PIXI.Container.prototype.saveProperty = function(containerInfo) {
        containerInfo.x = this.x;
        containerInfo.y = this.y;
    };

    Window_Base.prototype.saveProperty = function(containerInfo) {
        PIXI.Container.prototype.saveProperty.apply(this, arguments);
        containerInfo.width               = this.width;
        containerInfo.height              = this.height;
        containerInfo.opacity             = this.opacity;
        containerInfo.hidden              = !this.visible;
        containerInfo._customFontSize     = this._customFontSize;
        containerInfo._customPadding      = this._customPadding;
        containerInfo._customLineHeight   = this._customLineHeight;
        containerInfo._customBackOpacity  = this._customBackOpacity;
        containerInfo._customBackFileName = this._customBackFileName;
        containerInfo._customFontFace     = this._customFontFace;
    };

    //=============================================================================
    // Window_Base
    //  プロパティの値をカスタマイズします。
    //=============================================================================
    var _Window_Base_initialize      = Window_Base.prototype.initialize;
    Window_Base.prototype.initialize = function(x, y, width, height) {
        _Window_Base_initialize.apply(this, arguments);
        this._customFontSize     = this.standardFontSize();
        this._customPadding      = this.standardPadding();
        this._customLineHeight   = this.lineHeight();
        this._customLineNumber   = 0;
        this._customBackOpacity  = this.standardBackOpacity();
        this._customBackSprite   = null;
        this._customBackFileName = '';
        this._customFontFace     = '';
    };

    Window_Base.prototype.createBackSprite = function() {
        if (this._customBackFileName) {
            if (!this._customBackSprite) {
                this._customBackSprite = new Sprite();
                this.addChildToBack(this._customBackSprite);
            }
            this._customBackSprite.bitmap = ImageManager.loadPicture(this._customBackFileName, 0);
        } else if (this._customBackSprite) {
            this.removeChild(this._customBackSprite);
            this._customBackSprite = null;
        }
        if (Utils.isDesignMode() && this._customBackSprite && this._customBackSprite.bitmap) {
            var bitmap            = this._customBackSprite.bitmap;
            bitmap._image.onerror = function() {
                this._customBackFileName                 = '';
                this._customBackSprite.bitmap._isLoading = false;
                this._customBackSprite.bitmap            = null;
                this._customBackSprite                   = null;
                SceneManager.popChangeStack();
                SceneManager.setInfoExtend('Since the file was not found, the number change on the left was returned.', -1);
            }.bind(this);
        }
    };

    var _Window_Selectable_initialize      = Window_Selectable.prototype.initialize;
    Window_Selectable.prototype.initialize = function(x, y, width, height) {
        _Window_Selectable_initialize.apply(this, arguments);
        // Resolve conflict for BattleFormation.js
        this._customLineNumber = this.maxRows ? this.maxRows() : 0;
    };

    var _Window_Base_standardFontFace      = Window_Base.prototype.standardFontFace;
    Window_Base.prototype.standardFontFace = function() {
        return this._customFontFace ? this._customFontFace : _Window_Base_standardFontFace.apply(this, arguments);
    };

    var _Window_Base_standardFontSize      = Window_Base.prototype.standardFontSize;
    Window_Base.prototype.standardFontSize = function() {
        return this._customFontSize ? eval(this._customFontSize) :
            paramFontSize ? paramFontSize : _Window_Base_standardFontSize.apply(this, arguments);
    };

    var _Window_Base_standardPadding      = Window_Base.prototype.standardPadding;
    Window_Base.prototype.standardPadding = function() {
        return this._customPadding ? eval(this._customPadding) :
            paramPadding ? paramPadding : _Window_Base_standardPadding.apply(this, arguments);
    };

    var _Window_Base_lineHeight      = Window_Base.prototype.lineHeight;
    Window_Base.prototype.lineHeight = function() {
        return this._customLineHeight ? eval(this._customLineHeight) :
            paramLineHeight ? paramLineHeight : _Window_Base_lineHeight.apply(this, arguments);
    };

    var _Window_Base_standardBackOpacity      = Window_Base.prototype.standardBackOpacity;
    Window_Base.prototype.standardBackOpacity = function() {
        return this._customBackOpacity ? eval(this._customBackOpacity) :
            paramBackOpacity ? paramBackOpacity : _Window_Base_standardBackOpacity.apply(this, arguments);
    };

    Window_Base._iconSrcWidth  = Window_Base._iconWidth;
    Window_Base._iconSrcHeight = Window_Base._iconHeight;

    Window_Base.prototype.getIconScale = function() {
        var defaultFontSize = _Window_Base_standardFontSize.apply(this, arguments);
        var fontSize        = this.contents.fontSize;
        return paramIconSizeScale && defaultFontSize !== fontSize ? fontSize / defaultFontSize : null;
    };

    Window_Base.prototype.changeIconSize = function() {
        var iconScale = this.getIconScale();
        if (iconScale) {
            Window_Base._iconWidth *= iconScale;
            Window_Base._iconHeight *= iconScale;
        }
    };

    Window_Base.prototype.restoreIconSize = function() {
        var iconScale = this.getIconScale();
        if (iconScale) {
            Window_Base._iconWidth  = Window_Base._iconSrcWidth;
            Window_Base._iconHeight = Window_Base._iconSrcHeight;
        }
    };

    var _Window_Base_drawActorIcons      = Window_Base.prototype.drawActorIcons;
    Window_Base.prototype.drawActorIcons = function(actor, x, y, width) {
        this.changeIconSize();
        _Window_Base_drawActorIcons.apply(this, arguments);
        this.restoreIconSize();
    };

    var _Window_Base_drawItemName      = Window_Base.prototype.drawItemName;
    Window_Base.prototype.drawItemName = function(item, x, y, width) {
        this.changeIconSize();
        _Window_Base_drawItemName.apply(this, arguments);
        this.restoreIconSize();
    };

    var _Window_Base_processDrawIcon      = Window_Base.prototype.processDrawIcon;
    Window_Base.prototype.processDrawIcon = function(iconIndex, textState) {
        this.changeIconSize();
        _Window_Base_processDrawIcon.apply(this, arguments);
        this.restoreIconSize();
    };

    var _Window_Base_drawIcon      = Window_Base.prototype.drawIcon;
    Window_Base.prototype.drawIcon = function(iconIndex, x, y) {
        var iconScale = this.getIconScale();
        if (iconScale) {
            var bitmap = ImageManager.loadSystem('IconSet');
            var pw     = Window_Base._iconSrcWidth;
            var ph     = Window_Base._iconSrcHeight;
            var sx     = iconIndex % 16 * pw;
            var sy     = Math.floor(iconIndex / 16) * ph;
            var dw     = Math.floor(pw * iconScale);
            var dh     = Math.floor(ph * iconScale);
            var dx     = x;
            var dy     = y + (this.lineHeight() - dh) / 2 - 2;
            this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy, dw, dh);
        } else {
            _Window_Base_drawIcon.apply(this, arguments);
        }
    };

    var _Window_Base_setBackgroundType      = Window_Base.prototype.setBackgroundType;
    Window_Base.prototype.setBackgroundType = function(type) {
        if (!paramBackgroundFixed) {
            _Window_Base_setBackgroundType.apply(this, arguments);
        }
    };

    var _Window_Base_updateClose = Window_Base.prototype.updateClose;
    Window_Base.prototype.updateClose = function() {
        var prevClose = this.isClosing();
        _Window_Base_updateClose.apply(this, arguments);
        if (this._callBack && prevClose && !this.isClosing()) {
            this._callBack();
            this._callBack = null;
        }
    };

    Window_Base.prototype.setCloseListener = function(callBack) {
        this._callBack = callBack;
    };

    // for RPG MV 1.6.1
    var _Window_EquipItem_refresh = Window_EquipItem.prototype.refresh;
    Window_EquipItem.prototype.refresh = function() {
        if (!this._actor) {
            return;
        }
        _Window_EquipItem_refresh.apply(this, arguments);
    };

    /**
     * Window_Custom
     * 任意配置可能なウィンドウです。
     * @constructor
     */
    function Window_Custom() {
        this.initialize.apply(this, arguments);
    }

    Window_Custom._textAligns = {
        'left'  : 0,
        '0'     : 0,
        'center': 1,
        '1'     : 1,
        'right' : 2,
        '2'     : 2
    };

    Window_Custom.prototype             = Object.create(Window_Selectable.prototype);
    Window_Custom.prototype.constructor = Window_Custom;

    Window_Custom.prototype.initialize = function(lines) {
        this._lines = lines || [];
        Window_Selectable.prototype.initialize.call(this, 0, 0, 320, this.fittingHeight(this._lines.length));
        this.refresh();
    };

    Window_Custom.prototype.refresh = function() {
        this.createContents();
        Window_Selectable.prototype.refresh.apply(this, arguments);
    };

    Window_Custom.prototype.drawItem = function(index) {
        var rect = this.itemRectForText(index);
        var text = this._lines[index];
        this.resetTextColor();
        text = this.changeTextAlign(text);
        if (this._textAlign > 0) {
            rect.x = this.getTextAlignStartX(text);
        }
        this.drawTextEx(text, rect.x, rect.y);
    };

    Window_Custom.prototype.getTextAlignStartX = function(text) {
        var width = this.drawTextEx(text, this.contentsWidth(), 0);
        if (this._textAlign === 1) {
            return this.contentsWidth() / 2 - width / 2;
        } else {
            return this.contentsWidth() - width;
        }
    };

    Window_Custom.prototype.maxItems = function() {
        return this._lines.length;
    };

    Window_Custom.prototype.changeTextAlign = function(text) {
        this._textAlign = 0;
        text            = text.replace(/\\al\[(.*)]/gi, function() {
            this._textAlign = Window_Custom._textAligns[arguments[1].toLowerCase()] || 0;
            return '';
        }.bind(this));
        return text;
    };

//    var _Scene_File_createListWindow = Scene_File.prototype.createListWindow;
//    Scene_File.prototype.createListWindow = function() {
//        _Scene_File_createListWindow.apply(this, arguments);
//        this._listWindow.setTopRow(this.firstSavefileIndex() - 2);
//    };
})();
