$.fn.hoverBeforeClick = function(x){
    return this.each(function () {
        addon(this)
    });
};
function inputy(element, string) {
    string.split('').forEach(key => {
        eventKeyboard(element, 'keyup', key);
        eventKeyboard(element, 'keydown', key);
    });
}
function addon(element, mouseover) {
    let tagname = element.tagName.toLowerCase();
    if (!mouseover) {
        eventMouse(element.parentNode, 'mouseover')
    }
    eventMouse(element, 'mouseover')
    if (['input', 'select'].includes(tagname)) {
        fireEv(element, 'focus')
    }
    switch (tagname) {
        case 'input':
            eventMouse(element, 'click')
            inputy(element, element.value)
            if (['text', 'email', 'number'].includes(element.getAttribute('type'))) {
                input(element)
            }
            fireEv(element, 'change')
            break;
        case 'select':
            eventMouse(element, 'click')
            options(element.querySelectorAll('option'));
            fireEv(element, 'change')
            break;
        case 'option':
            eventMouse(element, 'click')
            break;
    }
    eventMouse(element, 'blur');
}
function fireEv(element, event) {
    var d;
    if (element.ownerDocument) d = element.ownerDocument;
    else if (element.nodeType === 9) d = element;
    else throw new Error("Invalid node passed to fireEvent: " + element.id);
    if (element.dispatchEvent) {
        var e = "";
        switch (event) {
            case "click":
            case "mousedown":
            case "mouseup":
            case "mouseover":
                eventMouse(d, event);
                break;
            case "focus":
            case "change":
            case "blur":
                var f = d.createEvent("HTMLEvents");
                var g = event !== "change" || false;
                f.initEvent(event, g, true);
                f.synthetic = true;
                if (element) element.dispatchEvent(f, true);
                break;
            case "keyup":
            case "keydown":
                e = "KeyboardEvent";
                break;
            default:
                throw "fireEvent: Couldn't find an event class for event '" + event + "'.";
        }
    }
}
function rounder(up, down) {
    return Math.floor(Math.random()*(Math.floor(down) - Math.ceil(up))) + Math.ceil(up);
}
function input(element) {
    let data = new Event('input', {
        'bubbles': true,
        'cancelable': true
    });
    element.dispatchEvent(data);
}
function options(element) {
    element.forEach((option, index) => {
        if (rounder(0, element.length-1) <= index) {
            addon(option, true);
        }
    });
}
function elementInfo(element) {
    var data = {};
    data.left = 0;
    data.top = 0;
    try {
        data = $(element).offset();
    } catch (error) {}
    return {
        'screenX': data.left + rounder(1, $(element).width() || 5),
        'screenY': data.top + rounder(1, $(element).height() || 5)
    };
}
function eventKeyboard(element, event, key) {
    var elementData = elementInfo(element);
    var ifshift = /W|s/ .test(key);
    var data = new KeyboardEvent(event, {
        'bubbles': true,
        'cancelable': true,
        'code': key.charCodeAt(0),
        'key': key,
        'screenX': elementData.screenX,
        'screenY': elementData.screenY,
        'clientX': elementData.screenX,
        'clientY': elementData.screenY,
        'ctrlKey': false,
        'altKey': false,
        'shiftKey': ifshift,
        'metaKey': false,
        'button': 0,
        'relatedTarget': null
    });
    if (['text', 'number', 'email'].includes(element.getAttribute('type'))) {
        element.dispatchEvent(data);
    }
}
function eventMouse(element, eventType) {
    var elementData = elementInfo(element);
    var event = new MouseEvent(eventType, {
        'bubbles': true,
        'cancelable': true,
        'view': window,
        'detail': 0,
        'screenX': elementData.screenX,
        'screenY': elementData.screenY,
        'clientX': elementData.screenX,
        'clientY': elementData.screenY,
        'ctrlKey': false,
        'altKey': false,
        'shiftKey': false,
        'metaKey': false,
        'button': 0,
        'relatedTarget': null
    });
    element.dispatchEvent(event);
}