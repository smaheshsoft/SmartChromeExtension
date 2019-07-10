$(document).ready(function () {

    $('.user-option').change(function () {
        var key = $(this).val();
        console.log(key);
        var checked = "0";
        if ($(this).is(":checked")) {
            checked = "1";
        }

        //chrome.cookies.set({ "value": checked }, function (cookie) {
        //    console.log(JSON.stringify(cookie));
        //    console.log(chrome.extension.lastError);
        //    console.log(chrome.runtime.lastError);
        //});

        //chrome.cookies.get({"value": checked }, function (cookie) {
        //    // do something with the cookie
        //    console.log(cookie);
        //    alert(cookie.name + ' found, value: ' + cookie.value);
        //});
        



        chrome.storage.sync.set({key:checked}, function () {
            console.log('key:' + key + " value: " + checked);
        });
        chrome.storage.sync.get(key, function (result) {
            console.log('VV key:' + key + " value: " + result);
        });
    });

    //chrome.storage.sync.set({ "1": "569" }, function () {
    //    console.log('Value currently is');        
    //});

    chrome.storage.sync.get("1", function (result) {
        console.log('Value currently is ' + result.key + " " + result.val);
    });

    var init = function () {
        var list = ["1", "2", "3"];
        for (var i = 0; i < list.length; i++) {
            chrome.storage.sync.get(list[i], function (result) {
                console.log(list[i] + ' Value currently is ' + result);
            });
        }
    };

    init();
    //chrome.storage.sync.set({ key: value }, function () {
    //    console.log('Value is set to ' + value);
    //});

    //chrome.storage.sync.get(['key'], function (result) {
    //    console.log('Value currently is ' + result.key);
    //});

});