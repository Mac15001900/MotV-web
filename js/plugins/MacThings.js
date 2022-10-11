//=============================================================================
// MacThings.js
//=============================================================================

/*:
 * @plugindesc Various misc things
 * @author Mac15001900
 *
 * @help This plugin does things. Hopefully.
 */

//===================================== JavaScript upgrades =====================================

String.prototype.replaceAll = function (pattern, value) {
    return this.split(pattern).join(value);
}

//===================================== Initialisation =====================================

//Make sure we have a modern enough version of JavaScript
try {
    let test = BigInt(1);
} catch (e) {
    throw "The JavaScript version is too old.";
}

const MAC_DEBUG = false;
const VERBOSE_LOGS = false;
const DEBUG_STAGE = 0; //If debug is on, game stage will be set to this
window.g = window.g || {}
g.gameInitialised = false;
//Shorhands for $gameVariables and $gameSwitches. Filled in by macThingsInit
let $gv;
let $gs;

const GAME_VERSION = "Alpha 1.0.0";
const SECRET_KEYS = ["otoczenie", "nokianazawsze", "całkiemjakżycie", "kalkulacja", "charleskrum", "rakietakiwitęcza", "iksytonawiasy", "nowesrebro", "deuteranopia", "akumulatron", "pierwiastekcotam", "powodzenia", "semikonteneryzacja", "czekoladapizzawiewiórkasparta", "miódmalina", "delatorcukrzenia", "bojadrukfigahartmenuopiswiza", "obracańko", "grynszpany", "eulerowsko", "945", "terazmyśliszparzystością", "zaznaczacz", "banachowo", "wielkaunifikacjahaseł", "zaczynamy", "kjf947fosi yu094", "zacezarowane", "wykładniczowością", "odcyrklowywanie"]
const AUTOSAVE_DELAY = 300 * 1000; //How often to autosave (in miliseconds)
const AUTOSAVE_RETRY = 5 * 1000; //If autosave fails, wait this long to try again
const VOLUME_INCREMENT = 5; //How many % to change the volume by from one button-press
const ROOM_UNCLOKS = [1, 2, 3, 4, 6, 9, 12, 15, 19]; //How many keys are needed for each unlock stage
const ENCRYPT_LIST = "aąbcćdeęfghijklłmnńoóprsśtuwyzźż[]";
const PRIMES = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n, 53n, 59n, 61n, 67n, 71n, 73n, 79n, 83n, 89n, 97n, 101n, 103n, 107n, 109n, 113n, 127n, 131n, 137n, 139n, 149n, 151n, 157n, 163n, 167n, 173n, 179n, 181n, 191n, 193n, 197n, 199n, 211n, 223n, 227n, 229n, 233n, 239n, 241n, 251n, 257n, 263n, 269n, 271n, 277n, 281n, 283n, 293n, 307n, 311n, 313n, 317n, 331n, 337n, 347n, 349n, 353n, 359n, 367n, 373n, 379n, 383n, 389n, 397n, 401n, 409n, 419n, 421n, 431n, 433n, 439n, 443n, 449n, 457n, 461n, 463n, 467n, 479n, 487n, 491n, 499n, 503n, 509n, 521n, 523n, 541n];
var _Scene_Map_loaded = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function () {
    _Scene_Map_loaded.call(this);
    if (VERBOSE_LOGS) console.log("Map loaded!");
    if (!g.gameInitialised) macThingsInit();
    macUpdateForeground();
};

macUpdateForeground = function () {
    let foregroundName = $gameMap._parallaxName + '-F';
    if (foregroundName === "-F") return; //We're in testland
    if ($gameMap._parallaxName && g.ocramLayers[0]._imgName !== foregroundName || !g.gameInitialised) {
        if (VERBOSE_LOGS) console.log("Loading new foreground: " + foregroundName);
        g.interpteter.pluginCommand('oc_layer', ['0', foregroundName]);
    } else {
        if (VERBOSE_LOGS) console.log(foregroundName + " already correct");
    }
}

macThingsInit = function () {
    $gv = new Proxy($gameVariables._data, {
        get: function (target, name) {
            return $gameVariables.value(name);
        },
        set: function (obj, prop, value) {
            $gameVariables.setValue(prop, value);
        }
    });
    $gs = new Proxy($gameSwitches._data, {
        get: function (target, name) {
            return $gameSwitches.value(name);
        },
        set: function (obj, prop, value) {
            $gameSwitches.setValue(prop, value);
        }
    });

    $gs[1] = true; //Set the 'True' switch to always be true

    if ($gv[1] === 0) {
        g.data = initialiseGData();
        $gv[1] = g.data;
    } else {
        g.data = $gv[1];
    }
    $gamePlayer.setMoveSpeed(4.5);
    if (MAC_DEBUG) {
        $gs[2] = true; //Set the debug switch
        $gv[41] = DEBUG_STAGE;
        $gamePlayer.setMoveSpeed(5);
    }
    g.interpteter = new Game_Interpreter();
    g.gameInitialised = true;
    g.saveWorker = new Worker("./js/plugins/compressor.js");
    scheduleAutosave(true);
    console.log("MacThings init complete", $gv[1]);
}

initialiseGData = function () {
    let res = { keysCurrent: 0, keysTotal: 0, test: "TOAST!", gameVersion: GAME_VERSION };
    res.keysCollected = {};
    for (let i = 0; i < SECRET_KEYS.length; i++) {
        res.keysCollected[SECRET_KEYS[i]] = false;
    }
    res.lastCollected = null;
    return res;
}


//=====================================Puzzle logic=====================================

checkKey = function (input) {
    if (input === 0) return 0;
    console.assert(typeof input === 'string' || input instanceof String, input);
    if (MAC_DEBUG && input === 'k') {
        g.data.keysTotal += 1;
        return 3;
    }

    let lowered = input.toLowerCase().replaceAll(' ', '');
    if (lowered.substr(0, 6) !== "klucz[" || lowered[lowered.length - 1] !== ']') return 0; //Invalid format
    let key = lowered.substr(6, lowered.length - 7);
    $gv[11] = key;
    if (!(key in g.data.keysCollected)) return 1; //There is no such key
    if (g.data.keysCollected[key]) return 2; //Correct, but already collected
    if (!g.data.keysCollected[key]) {
        g.data.keysCollected[key] = true;
        g.data.keysCurrent += 1;
        g.data.keysTotal += 1;
        g.data.lastCollected = key;
        return 3; //Correct, and not collected yet!
    }
}

processNewKey = function (inp) {
    let currentKeys = g.data.keysTotal;
    let newStage = ROOM_UNCLOKS.indexOf(currentKeys) + 1;
    if (newStage > 0) {
        $gv[41] = newStage;
        let message = "Nowy obszar odbklowowany."
        if (newStage > 2) AudioManager.playSe({ name: "Ice2", volume: 100, pitch: 90 });
        else AudioManager.playSe({ name: "Darkness1", volume: 100, pitch: 100 });
        g.showMessage(inp, message);
    }
    if ($gv[41] < ROOM_UNCLOKS.length) {
        g.showMessage(inp, "Do odblokowania kolejnego obszaru zdobyć trzeba jeszcze " + displayKeys(ROOM_UNCLOKS[$gv[41]] - currentKeys) + ".");
    } else if (currentKeys === SECRET_KEYS.length) {
        AudioManager.playMe({ name: "Victory1", volume: 100, pitch: 100 });
        g.showMessage(inp, "Udało Ci się zdobyć wszystkie klucze dostępne w tej wersji gry.\n\\c[4]Gratulacje!");
        //TODO: rolls credits?
    } else {
        g.showMessage(inp, "Do zdobycia jeszcze " + displayKeys(SECRET_KEYS.length - currentKeys) + ".");
    }
}

keyReactions = function (inp) {
    let currentKeys = g.data.keysTotal;
    let newStage = ROOM_UNCLOKS.indexOf(currentKeys) + 1;
    let keyName = g.data.lastCollected;
    let randomMessages = [
        "Kolejny klucz do kolekcji.",
        "I kolejny!",
        "Ładna się robi ta moja mała kolekcja kluczy.",
        "Zostało o jeden mniej.",
        `${currentKeys} to ładna liczba. Ale ${currentKeys + 1} będzie lepszą!`,
        "Tak!",
        "Ha, mam cię!",
        "Ta zagadka nie była taka zła.",
        "Zaczyna mi to iść coraz lepiej.",
    ];

    if ($gv[41] < ROOM_UNCLOKS.length) randomMessages.push("Ciekawe, ile ich tu jeszcze jest.\\.\nPrzynajmniej teraz na pewno o jeden mniej!");
    else if (currentKeys < SECRET_KEYS.length) randomMessages.push(`Jakoś powinno mi się udać zdobyć te pozostałe ${SECRET_KEYS.length - currentKeys}.`);
    else {
        //Just one left
        if (g.data.keysCollected["iksytonawiasy"]) g.showMessage(inp, "Jeszcze tylko ten ostatni. Idę po ciebie!.", 0);
        else g.showMessage(inp, "No dobra, tylko gdzie jest ten jeden pozostały klucz?\nChyba musi być ukryty nieco inaczej niż pozostałe.", 0);
        return;
    }

    switch (newStage) {
        case 1: g.showMessage(inp, "O, to brzmi przydatnie. Zobaczymy, co tu teraz mamy.", 0); break;
        case 2: g.showMessage(inp, "Ha, to chyba koniec potencjalnie zabójczych laserów!", 0); break;
        case 3:
            //TODO: Support for multiple messages from a script. Temporarily, this message is in the event
            //g.showMessage(inp, "\\{AAA!\\.\\.\\.", 3);
            //g.showMessage(inp, "Ok, w sumie to nie wiem, czego dokładnie się spodziewałam\\..\nAle raczej nie tego, że ściana obok mnie sobie nagle zniknie.", 0);
            break;
        //case 4: g.showMessage(inp, "Tym razem pewną zagadką jest samo określenie, co właściwie się \nteraz otworzyło.", 0); break;
        case 6: g.showMessage(inp, `W sumie to ciekawe, do czego te klucze właściwie służą.\nTych zagadek rozwiązałam już ${ROOM_UNCLOKS[5]}, ale dalej jak nie miałam, tak \nw dalszym ciągu nie mam zielonego pojęcia, czym jest to miejsce. \nMam nadzieję, że gdzieś dalej będzie jakaś odpowiedź.`, 0); break;
        default: switch (keyName) {
            case "czekoladapizzawiewiórkasparta": g.showMessage(inp, "No, w pewnym sensie udało mi się zagrać w Decrypto.", 1); break;
            case "miódmalina": g.showMessage(inp, "Trochę robię się teraz głodna przez tę zagadkę.", 1); break;
            case "nokianazawsze": g.showMessage(inp, "Zdecydowanie nie spodziewałam się, że ta umiejętność jeszcze\nkiedykolwiek mi się w życiu przyda.", 1); break;
            case "rakietakiwitęcza": g.showMessage(inp, 'Z cyklu \\fi"Rzeczy, Których Zdecydowanie Się Nie Spodziewałam \nW Tym Miejscu"\\fi: emoji.', 1); break;
            default: g.showMessage(inp, randomMessages[Math.floor(Math.random() * randomMessages.length)], Math.random() < 0.66 ? 0 : 1);
        }
    }
}

wrongKeyReactions = function (inp, key) {
    //Decrypto partial hints
    let keyWords = ["czekolada", "pizza", "wiewiórka", "sparta"];
    let correct = 0;
    for (let i = 0; i < keyWords.length; i++) {
        if (key.contains(keyWords[i])) correct++;
    }
    if (correct === 2) g.showMessage(inp, "Niektóre z tych słów zdecydowanie mają sens,\nno ale chyba jeszcze nie wszystkie.", 0);
    else if (correct === 3) {
        let wrongPart = key;
        for (let i = 0; i < keyWords.length; i++) wrongPart = wrongPart.replace(keyWords[i], '');
        wrongPart = wrongPart[0].toUpperCase() + wrongPart.substring(1);
        g.showMessage(inp, "To musi być już blisko! " + wrongPart + " tu chyba najmniej pasuje.", 0);
    }

}

function displayKeys(amount, color = false) {
    let name = "klucze";
    if (amount === 1) name = "klucz";
    else if (useDopełniacz(amount)) name = "kluczy";
    return (color ? "\\c[4]" : "") + amount + (color ? "\\c[0] " : " ") + name;
}

function useDopełniacz(amount) {
    if (amount % 100 - amount % 10 === 10) return true;
    if ([2, 3, 4].includes(amount % 10)) return false;
    return true;
}

g.encrypterPuzzle = function (text) {
    text = text + "";
    if (text.length > 100) return "Maksymalna długość to 100 znaków";
    if (Array.from(text).find(c => !ENCRYPT_LIST.includes(c))) return "Dozwolone znaki to: " + ENCRYPT_LIST;


    let values = text.split("").map(c => ENCRYPT_LIST.indexOf(c) + 1);
    let sum = values.reduce((a, b) => a + b, 0);
    let encrypted = [];
    for (let i = 0; i < values.length; i++) {
        encrypted[i] = ENCRYPT_LIST[(values[i] - 1 + sum * (i + 1)) % (ENCRYPT_LIST.length)];
    }
    return encrypted.join("") + "-" + sum;
}

g.calculatorPuzzle = function (text) { //For testing: https://www.alpertron.com.ar/ECM.HTM
    text = text + "";
    if (text.length > 50) return "Maksymalna długość to 50 znaków";
    if (Array.from(text).find(c => !ENCRYPT_LIST.includes(c))) return "Dozwolone znaki to: " + ENCRYPT_LIST;

    let values = text.split("").map(c => ENCRYPT_LIST.indexOf(c) + 1);
    let sum = 1n;
    for (let i = 0; i < values.length; i++) {
        sum = sum * PRIMES[i] ** BigInt(values[i]);
    }
    return g.breakString(sum + "", 125);
}


//===================================== Event functions =====================================

runNearbyEvent = function (inp, dx, dy) {
    let events = $gameMap._events;
    let { x, y } = events[inp.eventId()];
    let targetId = $gameMap.eventIdXy(x + dx, y + dy);
    if (targetId === 0) throw new Error(`No event found at x:${x + xd}, y:${y + dy}.`);
    else {
        let targetEvent = $gameMap._events[targetId];
        //let targetEvent = events.filter(e => e && e.x === x + dx && e.y === y + dy);
        inp.setupChild(targetEvent.list(), targetEvent.eventId());
    }
}

runEvent = function (inp, eventId) {
    let event = $gameMap._events[eventId];
    if (event) inp.setupChild(event.list(), eventId);
    else console.warn(`No event with id ${eventId} found.`);
}

//===================================== Autosave system =====================================

//Schedules and autosave to happen a configurable amount of time from now. Parameters indicate if previous attempt was successful.
scheduleAutosave = function (wasSuccess = true) {
    if (g.autosaveTimeout) clearTimeout(g.autosaveTimeout); //In case we end up with two of them
    if (wasSuccess) g.autosaveTimeout = setTimeout(autosaveAttempt, AUTOSAVE_DELAY);
    else g.autosaveTimeout = setTimeout(autosaveAttempt, AUTOSAVE_RETRY);
}

/*
Will attempt to autosave. Successful or not, it will then schedule the next autosave based on configured delay.
The synchronouse parameter dictates whether to handle over the task of compressing data to a worker or do it synchronously
If synchronous is false, it will only save if we're on the map and not in an event.
If it is true, it will save immidiately (blocking the main thread). We assume the caller ensured this is a good moment to autosave
*/
autosaveAttempt = function (synchronous = false) {
    if (SceneManager.getSceneName() === 'Scene_Map' && !g.getInterpreter().isRunning() || synchronous) {
        $gameSystem.onBeforeSave();
        if (synchronous) autosave(LZString.compressToBase64(JsonEx.stringify(DataManager.makeSaveContents())), true);
        else {
            g.saveWorker.addEventListener('message', autosave);
            g.saveWorker.postMessage({ saveData: JsonEx.stringify(DataManager.makeSaveContents()) })
        }
    } else {
        scheduleAutosave(false);
    }
}

//Will autosave the game, and call scheduleAutosave afterwards to schedule the next one
autosave = function (message, synchronous = false, index = 1) {
    if (DataManager.saveGame(index, message.data)) {
        StorageManager.cleanBackup(index);
        if (VERBOSE_LOGS) console.log("Saved at " + new Date().getSeconds());
        scheduleAutosave(true);
    } else {
        console.warn("Saving failed");
        scheduleAutosave(false);
    }
}

window.onunload = () => {
    if (!g.getInterpreter().isRunning()) {
        g.data.test = "On unload!";
        autosaveAttempt(true);
    }
};


//===================================== Multi image display =====================================

g.MultiDisplay = function (rows, columns, wrap, filename, description, text) {
    let self = this;
    text = text || ["Strzałka w lewo", "Strzałka w prawo", "Strzałka w górę", "Strzałka w dół", "Odejdź"];
    let x = 0;
    let y = 0;
    let imageTexts = {};
    $gv[3] = 0; //Clear player choice

    this.moveUp = function (amount = 1) {
        if (y + amount < columns && y + amount >= 0) y += amount;
        else if (wrap) y = (y + amount) % columns;
        else console.error("Invalid operation at MultiDisplay");
    };
    this.moveDown = (amount = 1) => self.moveUp(-amount);
    this.moveRight = function (amount = 1) {
        if (x + amount < rows && x + amount >= 0) x += amount;
        else if (wrap) x = (x + amount) % rows;
        else debugger; // console.error("Invalid operation at MultiDisplay");
    };
    this.moveLeft = (amount = 1) => self.moveRight(-amount);

    this.showChoices = function (inp) {
        let choices = [];

        if (wrap || y < columns - 1) choices.push(2); //Up
        if (wrap || x > 0) choices.push(0); //Left
        if (wrap || x < rows - 1) choices.push(1); //Right
        if (wrap || y > 0) choices.push(3); //Down

        textOptions = choices.map(n => text[n]);

        if (imageTexts[x + "-" + y]) {
            textOptions.push("Kopiuj");
            choices.push(-1);
        }

        textOptions.push(text[text.length - 1]);
        choices.push(-2); //The cancel option

        let startingOption = choices.indexOf($gv[3]); //If previously chosen option is available, it will start selected
        if (startingOption < 0) startingOption = 0; //Otheriwse use the first option

        $gameMessage.setChoices(textOptions, startingOption, choices.length - 1);
        $gameMessage.setChoiceBackground(0);
        $gameMessage.setChoicePositionType(2);
        $gameMessage.setChoiceCallback(n => $gv[3] = choices[n]);
        if (description) $gameMessage.add(description);
        inp.setWaitMode('message');
    };

    this.processResponse = function (inp) {
        let choice = $gv[3];
        switch (choice) {
            case -2: break;
            case -1:
                copyTextToClipboard(imageTexts[x + "-" + y]);
                g.showMessage("Skopiowano do schowka.");
                break;
            case 0: self.moveLeft(); break;
            case 1: self.moveRight(); break;
            case 2: self.moveUp(); break;
            case 3: self.moveDown(); break;
            default: console.error("Invalid player input for MultiDisplay: ", choice);
        }
    };

    this.showImage = function (size = 100) {
        $gameScreen.erasePicture(1);
        $gameScreen.showPicture(1, `${filename}/${filename}-${x}-${y}`, 1, 960, 375, size, size, 255, 0);
    }

    this.getCoords = () => console.log(x, y);

    this.setOptions = function (options) { text = options; };
    this.setDescription = function (desc) { description = "\\>" + desc.replaceAll('\n', '\n\\>'); };

    this.addImageText = function (x, y, text) {
        imageTexts[x + "-" + y] = text;
    }
}

//=====================================Misc utility functions=====================================

g.getInterpreter = function () {
    let res = $gameMap._interpreter;
    while (res._childInterpreter && res._childInterpreter.isRunning()) res = res._childInterpreter;
    return res;
}

g.screenWidth = function () {
    return Number(document.querySelector("#GameCanvas").style.width.slice(0, -2));
}

g.screenHeight = function () {
    return Number(document.querySelector("#GameCanvas").style.height.slice(0, -2));
}

g.showPicture = function (name, id = 1, scale = 100, x = 960, y = 375) {
    $gameScreen.showPicture(id, name, 1, x, y, scale, scale, 255, 0);
}

g.showMessage = function (inp, message, face, faceFile = 'mc') {
    if (face !== undefined) $gameMessage.setFaceImage(faceFile, face);
    $gameMessage.setBackground(0);
    $gameMessage.setPositionType(2);
    $gameMessage.add(message);
    inp.setWaitMode('message');
}

g.padToLength = function (string, targetLength, side = 'both') {
    let lines = string.split('\n');
    let maxLength = lines.map(g.simpleUnescape).map(l => l.length).reduce((a, b) => a > b ? a : b);
    if (maxLength >= targetLength) return string;
    let padding = ' '.repeat(Math.ceil((targetLength - maxLength) / 2));
    switch (side) {
        case 'both':
        case 'center': return lines.map(l => padding + l + padding).join('\n');
        case 'left': return lines.map(l => padding + padding + l).join('\n');
        case 'right': return lines.map(l => l + padding + padding).join('\n');
    }
}

//Breaks up a string into multiple lines. Rather crude, does not look at spaces
g.breakString = function (string, length = 100) {
    if (string.length <= length) return string;

    let res = [];
    let resLine = "";
    let j = 0;
    for (let i = 0; i < string.length; i++) {
        resLine += string[i];
        if (resLine.length >= length) {
            res.push(resLine);
            resLine = "";
        }
    }
    if (resLine.length > 0) res.push(resLine);

    return res.join('\n');
}

//Removes or converts some special escape characters, for saving strings as plain text. Might not handle everything
//TODO: remove text shaking stuff as well
g.simpleUnescape = function (string) {
    return Window_Base.prototype.convertEscapeCharacters(string).replace(/\x1b\w\[(\d+)\]/g, '').replace(/\x1b\w/g, '');
}

//Text to clipboard, function by Dean Taylor taken from https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
function copyTextToClipboard(text, escapeSpecial = true) {
    var textArea = document.createElement("textarea");
    //Some styling shenanigans in case the element renders for some reason
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';

    textArea.value = escapeSpecial ? g.simpleUnescape(text) : text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        var success = document.execCommand('copy');
        //console.log('Copying text to clipboard was ' + (success ? 'successful' : 'unsuccessful'));
    } catch (err) {
        console.warn('Failed to copy to clipboard');
    }
    document.body.removeChild(textArea);
}

//=====================================Various engine changes=====================================

var _Scene_Title_start = Scene_Title.prototype.start;
Scene_Title.prototype.start = function () {
    _Scene_Title_start.call(this);
    if (VERBOSE_LOGS) console.log("Scene title started");
    if (g) {
        g.gameInitialised = false;
        if (g.autosaveTimeout) clearTimeout(g.autosaveTimeout);
    }
};

Input.keyMapper["81"] = "quit"; //Setting for the 'q' key
var _Scene_Base_update = Scene_Base.prototype.update;
Scene_Base.prototype.update = function () {
    _Scene_Base_update.apply(this);
    if (MAC_DEBUG && Input.isTriggered("quit")) SceneManager.exit(); //TODO QInpit prevents this, find out why
}


Window_Options.prototype.volumeOffset = () => VOLUME_INCREMENT;

var _DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
DataManager.makeSavefileInfo = function () {
    var res = _DataManager_makeSavefileInfo.call(this);
    ///res.title = SceneManager.getSceneName() === 'Scene_Map' ? "Zapis automatyczny: " : ""; //Autosave only happens on the map
    res.title = "";
    if (g.data.keysTotal === 0) res.title += "Początek";
    else if (g.data.keysTotal === SECRET_KEYS.length) res.title += "Wszystkie klucze!";
    else res.title += displayKeys(g.data.keysTotal);
    res.title += " | " + (new Date()).toLocaleString();
    return res;
};

DataManager.maxSavefiles = () => 11;

var _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
Game_Interpreter.prototype.updateWaitMode = function () {
    if (this._waitMode === 'indefinite') {
        return true;
    }
    return _Game_Interpreter_updateWaitMode.apply(this, arguments);
};

Scene_Title.prototype.commandExit = function () {
    this._commandWindow.close();
    SceneManager.exit();
};

var _Window_Message_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter;
Window_Message.prototype.processEscapeCharacter = function (code, textState) {
    switch (code) {
        case ',': this.startWait(7); break;
        default: _Window_Message_processEscapeCharacter.call(this, code, textState);
    }
}

//From https://forums.rpgmakerweb.com/index.php?threads/how-to-remove-blur.47504/
ImageManager.loadBitmap = function (folder, filename, hue, smooth) {
    //let doSmoothing = false;
    //if (["img/faces/", "img/pictures/"].indexOf(folder) >= 0) doSmoothing = true;

    if (filename) {
        var path = folder + encodeURIComponent(filename) + '.png';
        var bitmap = this.loadNormalBitmap(path, hue || 0);
        //if(VERBOSE_LOGS) console.log("disabling smoothing for " + path);
        bitmap.smooth = false; //TODO: choose when to smooth
        return bitmap;
    } else {
        return this.loadEmptyBitmap();
    }
}
