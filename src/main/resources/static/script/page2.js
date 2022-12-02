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
var results = [];
var totalPages = 1;
window.onload = function () {
    var url = decodeURI(document.location.href);
    var params = url.split('?')[1].split('&');
    var data = {}, tmp;
    for (var i = 0, l = params.length; i < l; i++) {
        tmp = params[i].split('=');
        data[tmp[0]] = tmp[1];
    }
    console.log(data);
    loadInput(data);
    var kwicData = data['KWIC'].replaceAll(",", "\n");
    getSearchResults(kwicData, data['operator']);
};
function loadHomePage() {
    location.assign("index2.html");
}
function loadInput(data) {
    var fixedSearch = document.getElementById('fixedUserSearch');
    if (data['search']) {
        fixedSearch.value = data['search'];
    }
    else {
        console.log('No field found');
    }
}
var currentPage = 1;
function getBackendUrl(op) {
    if (op == "not") {
        return "http://localhost:8080/query/search/not";
    }
    else if (op == "or") {
        return "http://localhost:8080/query/search/or";
    }
    else {
        return "http://localhost:8080/query/search/and";
    }
}
function getSearchResults(data, op) {
    var searchResults = makeRequest(getBackendUrl(op), 'POST', data, { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, GET,OPTIONS ", "Access-Control-Allow-Headers": "X-PINGOTHER", 'Content-Type': 'application/json; charset=UTF-8' });
    searchResults.then(function (resp) {
        console.log(resp);
        results = resp.searchResults;
        totalPages = Math.max(Math.floor((results.length) / 5), 1);
        handlePagination();
    })["catch"](function (err) {
        console.log(err); // 👉️ "An error occurred"
    });
}
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
function addPageNumbers() {
    var listElement = document.getElementById('page-numbers');
    var nextElement = document.getElementById('page-next');
    var _loop_1 = function (i) {
        var li = document.createElement('li');
        li.classList.add('page-item');
        li.classList.add('page-link');
        li.value = i;
        li.textContent = i + '';
        li.addEventListener('click', function handleClick() {
            loadResults(i);
        });
        listElement.insertBefore(li, nextElement);
    };
    for (var i = 1; i <= totalPages; i++) {
        _loop_1(i);
    }
}
function handlePagination() {
    addPageNumbers();
    var previousElement = document.getElementById('page-prev');
    if (previousElement) {
        previousElement.addEventListener('click', function handlePrevious(event) {
            if (currentPage > 1) {
                loadResults(currentPage - 1);
            }
            else {
                console.log('Already on page 1');
            }
        });
    }
    var nextElement = document.getElementById('page-next');
    if (nextElement) {
        nextElement.addEventListener('click', function handleNext(event) {
            if (totalPages > currentPage) {
                loadResults(currentPage + 1);
            }
            else {
                console.log('No more results available');
            }
        });
    }
    loadResults(1);
}
function loadResults(pageNumber) {
    var resultSpace = document.getElementById('search-data');
    clearChildren(resultSpace);
    var previousElement = document.getElementById('page-prev');
    var nextElement = document.getElementById('page-next');
    var startIndex = pageNumber - 1;
    var limt = Math.min(5 * pageNumber, results.length);
    for (var i = startIndex * 5; i < limt; i++) {
        var res = getSearchElement(results[i]);
        resultSpace.appendChild(res);
        resultSpace.appendChild(document.createElement('br'));
        resultSpace.appendChild(document.createElement('br'));
    }
    currentPage = pageNumber;
    if (currentPage == 1) {
        previousElement.classList.add('disabled');
    }
    else if (currentPage != 1 && currentPage < totalPages) {
        previousElement.classList.remove('disabled');
    }
    if (currentPage == totalPages) {
        nextElement.classList.add('disabled');
    }
    else if (currentPage < totalPages && totalPages > 1) {
        nextElement.classList.remove('disabled');
    }
}
function clearChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.lastChild);
    }
}
function getSearchElement(searchResult) {
    var el = document.createElement('div');
    el.classList.add('row');
    el.id = 'search-result';
    var header = document.createElement('h4');
    header.classList.add('row');
    var anchor = document.createElement('a');
    anchor.setAttribute('href', searchResult.url);
    anchor.textContent = searchResult.title;
    anchor.id = 'search-title';
    header.appendChild(anchor);
    el.appendChild(header);
    var span = document.createElement('p');
    span.classList.add('row');
    span.classList.add('ms-1');
    var descText = searchResult.description;
    if (descText.length > 347) {
        descText = descText.substring(0, 347) + '...';
    }
    span.textContent = descText;
    el.appendChild(span);
    return el;
}
