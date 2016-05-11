
var APIS = require('./apis');

var React = require('react-native');
var {Actions} = require('react-native-router-flux');

var {
    ToastAndroid,
} = React;

APIS.addAfterActions(function(response) {

    console.log("after action:>>>>");
    console.log(response);

    return response;

});

// // check status
APIS.addAfterActions(function(response) {

    if (response.status === 401) {
        // console.log("here??!!")
        // Actions.login();
        throw { message: 'login please!' };
    }

    if (response.status !== 200 && response.status !== 201) {
        var text = JSON.parse(response._bodyText).message || 'unknown error';

        ToastAndroid.show(text, ToastAndroid.LONG);

        throw text;
    }

    if (response.status === 200) {
        // console.log("response:",response._bodyText)
        // var text = JSON.parse(response._bodyText);
        // return text;
        return response.json();
    }

    return response;

});