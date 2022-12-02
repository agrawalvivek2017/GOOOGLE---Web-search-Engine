var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function makeRequest(url, method, content, headers) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(url, {
                        method: method,
                        body: content,
                        headers: headers
                    })];
                case 1:
                    response = _a.sent();
                    if (response == null || !response.ok || response.body == null) {
                        console.log("Error in making a network call");
                    }
                    return [2 /*return*/, response.json()];
            }
        });
    });
}
function makePlainRequest(url, method, content, headers) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(url, {
                        method: method,
                        body: content,
                        headers: headers
                    })];
                case 1:
                    response = _a.sent();
                    if (response == null || !response.ok || response.body == null) {
                        console.log("Error in making a network call");
                    }
                    return [2 /*return*/, response.text()];
            }
        });
    });
}
var url = '';
function performSearch() {
    var userInput = document.getElementById('inputArea');
    performShuffle(userInput);
    url = "page2.html?search=" + userInput.value;
    var operator = document.getElementById('operator');
    var op = operator.value;
    console.log('selected value =' + op);
    url += "&operator=" + op;
    //      location.assign(url)
}
function performShuffle(userInput) {
    //     let dropdown = <HTMLInputElement>document.getElementById('dropdownSearch');
    if (userInput) {
        var data = userInput.value;
        if (data == null || data == '') {
            userInput.value = '';
        }
        //         console.log(dropdown.value)
        var saveResponse = makePlainRequest("http://localhost:8080/query/saveInput", 'POST', data, { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, GET,OPTIONS ", "Access-Control-Allow-Headers": "X-PINGOTHER", 'Content-Type': 'application/text; charset=UTF-8' });
        saveResponse.then(function (resp) {
            console.log(resp);
        })["catch"](function (err) {
            console.log(err); // 👉️ "An error occurred"
        });
        var shuffleResponse = makeRequest("http://localhost:8080/query/getCircularShiftedLine", 'POST', data, { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, GET,OPTIONS ", "Access-Control-Allow-Headers": "X-PINGOTHER", 'Content-Type': 'application/json; charset=UTF-8' });
        shuffleResponse.then(function (resp) {
            console.log(resp);
            var lines = extractAndDisplayShiftedLines(resp);
            performSort(lines);
        })["catch"](function (err) {
            console.log(err); // 👉️ "An error occurred"
        });
    }
}
function performSort(lines) {
    if (lines) {
        var sortedResponse = makeRequest("http://localhost:8080/query/alpha-eliminate-noise", 'POST', lines, { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, GET,OPTIONS ", "Access-Control-Allow-Headers": "X-PINGOTHER", 'Content-Type': 'application/json; charset=UTF-8' });
        sortedResponse.then(function (resp) {
            console.log('AlphabetizedResponse=' + resp);
            var sortedLines = displayAlphabetizedResponse(resp);
            console.log('FinalKWIC=' + sortedLines);
            url = url + '&KWIC=' + sortedLines;
            location.assign(url);
        })["catch"](function (err) {
            console.log(err); // 👉️ "An error occurred"
        });
    }
}
function extractAndDisplayShiftedLines(response) {
    var result = '';
    var circularShiftedSentences = response.shuffledInput;
    for (var i = 0; i < circularShiftedSentences.length; i++) {
        var lines = circularShiftedSentences[i].circularShiftedLines;
        for (var j = 0; j < lines.length; j++) {
            result += lines[j].line + '\n';
        }
    }
    return result;
}
function displayAlphabetizedResponse(alphabetizedLines) {
    var sortedSentences = alphabetizedLines.sortedLines;
    var result = '';
    for (var i = 0; i < sortedSentences.length; i++) {
        result += sortedSentences[i].line;
        if (i != sortedSentences.length - 1) {
            result += ",\n";
        }
    }
    return result;
}
