var parsed = {};
var smths = [];
var string = '';
var arrayCount = 0;
var objectsCount = 9999;
var id = 0;
var objectKey = '';
var objectValue = '';
var arrayValue = '';

(function init() {
    if (localStorage.getItem('object')) {
        onCreate(JSON.parse(localStorage.getItem('object')))
    }
})()


function initDefaults() {
    document.getElementById('list').innerHTML = '';
    smths = [];
    string = '';
}

function onCreate(object) {
    initDefaults();
    parseObject(object);
    parsed = object;
    for (var i = 0; i < smths.length; i++) {
        string = string.concat(smths[i]);
    }
    document.getElementById('list').innerHTML = string;
}

function load(event) {
    var file = event;
    var reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = function () {
        onCreate(JSON.parse(reader.result));
    };
}

function parseObject(object) {
    for (var i = 0; i < Object.values(object).length; i++) {
        var element = Object.values(object)[i];
        var key = Object.keys(object)[i];
        if (typeof element === "string" || typeof element === "number") {
            var smth = '<li><span>' + key + '</span>: ' + element +  '</li>';
            smths.push(smth);
        } else if (typeof element === "object" && !Array.isArray(element)){
            var id = objectsCount++;
            smths.push('<button onclick="changeVisibility(' + id + ')">' + key + '</button><ul class="visible" id=' + id + '>');
            smths.push('<input id="' + id + '-input">');
            smths.push('<input id="' + id + '-inputValue">');
            smths.push('<button onclick="addObject(' + id + ')">ADD</button>');
            parseObject(element);
            smths.push('</ul>');
            Object.values(object)[i].__id = id
        } else if (Array.isArray(element)) {
            var id = arrayCount++;
            smths.push('<button onclick="changeVisibility(' + id + ')">' + key + '</button><ul class="visible" id=' + id + '>');
            smths.push('<input id="' + id + '-input">');
            smths.push('<button onclick="addElOfArray(' + id + ')">ADD</button>');
            parseObject(element);
            smths.push('</ul>');
            Object.values(object)[i].__id = id
        }
    }
}

function searchId(object) {
    for (var i = 0; i < Object.values(object).length; i++) {
        var element = Object.values(object)[i];
        var key = Object.keys(object)[i];
        if (typeof element === "string" || typeof element === "number") {
            //
        } else if (typeof element === "object" && !Array.isArray(element)) {
            if (element.__id == id) {
                element[objectKey] = objectValue;
            }
            searchId(element);
        } else if (Array.isArray(element)) {
            if (element['__id'] == id) {
                element.push(arrayValue);
            }
            searchId(element);
        }
    }
}

function deleteIdFromJson(object) {
    for (var i = 0; i < Object.values(object).length; i++) {
        var element = Object.values(object)[i];
        if (typeof element === "object" && !Array.isArray(element)) {
            delete element['__id'];
            deleteIdFromJson(element);
        } else if (Array.isArray(element)) {
            delete element['__id'];
            deleteIdFromJson(element);
        }
    }
}

function changeVisibility(id) {
    if (document.getElementById(id).className !== 'visible') {
        document.getElementById(id).className = 'visible'
    } else {
        document.getElementById(id).className = 'invisible'
    }
}

function addObject(_id) {
    id = _id;
    var input = document.getElementById(_id + '-input');
    var inputValue = document.getElementById(_id + '-inputValue');
    objectKey = input.value;
    objectValue = inputValue.value;
    var ul = document.getElementById(_id);
    var li = document.createElement("li");
    if (input.value && inputValue.value) {
//         li.appendChild(document.createTextNode(input.value + ': ' + inputValue.value));
//         ul.appendChild(li);
        input.value = '';
        inputValue.value = '';
        searchId(parsed);
        objectKey = '';
        objectValue = '';
        
        getJson();
        onCreate(JSON.parse(localStorage.getItem('object')))
    }
}

function addElOfArray(_id) {
    id = _id;
    var input = document.getElementById(_id + '-input');
    arrayValue = input.value;
    var ul = document.getElementById(_id);
    var li = document.createElement("li");
    if (input.value) {
//         li.appendChild(document.createTextNode(input.value));
//         ul.appendChild(li);
        input.value = '';
        searchId(parsed);
        arrayValue = '';
        
        getJson();
        onCreate(JSON.parse(localStorage.getItem('object')))
    }
}

function getJson() {
    deleteIdFromJson(parsed);
    localStorage.setItem('object', JSON.stringify(parsed));
}
