var APP_URL = 'http://10.250.4.177:3001';
var API_URL = 'http://10.250.4.177:3001';

// Parse query string
var query = {};
location.search.substr(1).split("&").forEach(function(item) {
  query[item.split("=")[0]] = item.split("=")[1] && decodeURIComponent(item.split("=")[1]);
});

var appUrl = query.appUrl || APP_URL;
var apiUrl = query.apiUrl || API_URL;

angular.module('formioApp').constant('AppConfig', {
  appUrl: appUrl,
  apiUrl: apiUrl,
  forms: {
    userForm: appUrl + '/user',
    viewallform: appUrl + '/viewformlist',
    userLoginForm: appUrl + '/user/login'
  }
});
