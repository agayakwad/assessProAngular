

var serviceCallMethodNames = new Array();
var IsLocalStorageAvailable = false;

try {
  if (localStorage)
    IsLocalStorageAvailable = true;
  else
    IsLocalStorageAvailable = false;
}
catch (ex) {
  IsLocalStorageAvailable = false;
}
//------------------------------------------ common far all ---------------------------------------------------------//
/*
 Utility Object Name :  setDate.
 Author : Syed Juned
 Description : Used to set current date on the master layout.
 */
 var setDate =function(){
  var date = new Date();
  $('#currentDate').html(date.toDateString());
};
/*
 Utility Object Name :  setTestName.
 Author : Syed Juned
 Description : Used to set test name on the master layout.
 */
 var setTestName = function(){
  var testName;
  if (storageMgr.get("TestName") && $.getQueryString("alias") && $.getQueryString("alias") != "hp")
    testName =  storageMgr.get("TestName");
  $('#test_name').html(testName);
};
/*
 Utility Object Name :  setCandidateName.
 Author : Syed Juned
 Description : Used to set candidate name on the master layout.
 */
 var setCandidateName = function(candidateName){
  var candidateName;
  if (storageMgr.get("CandidateName"))
    candidateName = storageMgr.get("CandidateName");
  $('#candidate_name_span').append(candidateName);
};
/*
 Utility Object Name :  setClientLogo.
 Author : Syed Juned
 Description : Used to set client logo on the master layout.
 */
 var setClientLogo = function(){
  var logoPath = '/assets/Images/Default_Logo.gif';
  $('#imgCompanyLog').attr('src', logoPath);
};
$(document).ready(function () {
  utils.initPlugins();
    // date
    setDate();
    // Test Name
    setTestName();
    // Candidate Name
    setCandidateName();
    // Company Logo
    setClientLogo();
  });

// Right Click disable.
$(document).bind("contextmenu", function (e) {
  jAlert("Right click disabled", "Information");
  return false;
});
//------------------------------------------EndRegion : common far all  ---------------------------------------------------------//

//------------------------------- Service Calls ------------------------------------------------------------------------------//

function setServiceCallMethods() {
  var virtualPath = "../../";
    serviceCallMethodNames["GetTenantByIdOrAlias"] =  "/tenant";//virtualPath + "JSONServices/JSONTenantManagementService.svc/GetTenantByIdOrAlias";
    serviceCallMethodNames["LoginToTest"] = "/login"; // virtualPath + "JSONServices/JSONAssessmentManagementService.svc/LoginToTest";
    serviceCallMethodNames["GetQuestionsForOnlineAssessment"] =  "/getquestionPaper";//    virtualPath + "JSONServices/JSONAssessmentManagementService.svc/GetQuestionsForOnlineAssessment";
    serviceCallMethodNames["SubmitTestResult"] = "/submit"; //virtualPath + "JSONServices/JSONAssessmentManagementService.svc/SubmitTestResult";
    //serviceCallMethodNames["SubmitTestResult"] =  "http://qaserver/htmltest/JsonServices/JSONAssessmentManagementService.svc/SubmitTestResult";
    serviceCallMethodNames["GetTestResult"] = virtualPath + "JSONServices/JSONAssessmentManagementService.svc/GetTestResult";
    serviceCallMethodNames["GetCandidateResults"] = virtualPath + "JSONServices/JSONAssessmentManagementService.svc/ViewCandidateScoreByCandidateId";
    serviceCallMethodNames["GetOnlineTestBasicInfo"] = virtualPath + "JSONServices/JSONAssessmentManagementService.svc/GetOnlineTestBasicInfo";
    serviceCallMethodNames["SaveTestCandidate"] = virtualPath + "JSONServices/JSONCandidateManagementService.svc/SaveTestCandidate";
    serviceCallMethodNames["GetLightCatalogValues"] = virtualPath + "JSONServices/JSONCommonManagementService.svc/GetLightCatalogValues";
  }

  setServiceCallMethods();

  function callAjaxService(serviceCallMethodName, request, successHandler, errorHandler, dataType) {
    var returnDataType = "json";
    if (dataType) {
      returnDataType = dataType;
    }
    if(serviceCallMethodName == "GetTenantByIdOrAlias")
    {
      var ajaxValue = {
        "type": "GET",
        "url": serviceCallMethodNames[serviceCallMethodName] + "/" + request.TenantAlias,
            //"data": $.stringify(request),
            "contentType": "application/json; charset=utf-8",
            "dataType": returnDataType,
            "success": successHandler,
            "error": errorHandler,
            "complete": function (XMLHttpRequest, textStatus) {
                this; // the options for this ajax request
              }
            }
          }
          else if(serviceCallMethodName == "LoginToTest")
          {
            var ajaxValue = {
              "type": "GET",
              "url": serviceCallMethodNames[serviceCallMethodName] + "/" + request.LoginName + "/" + request.Password,
            //"data": $.stringify(request),
            "contentType": "application/json; charset=utf-8",
            "dataType": returnDataType,
            "success": successHandler,
            "error": errorHandler,
            "complete": function (XMLHttpRequest, textStatus) {
                this; // the options for this ajax request
              }
            }
          }
          else if(serviceCallMethodName == "GetQuestionsForOnlineAssessment")
          {
            var ajaxValue = {
              "type": "GET",
            "url": serviceCallMethodNames[serviceCallMethodName] + "/" + testIdForCandidate +"/" + candidateIdForTest + "",// + request.TestId,
            //"data": $.stringify(request),
            "contentType": "application/json; charset=utf-8",
            "dataType": returnDataType,
            "success": successHandler,
            "error": errorHandler,
            "complete": function (XMLHttpRequest, textStatus) {
                this; // the options for this ajax request
              }
            }
          }
    /*else if(serviceCallMethodName == "SubmitTestResult")
     {
     var ajaxValue = {
     "type": "GET",
     "url": serviceCallMethodNames[serviceCallMethodName],
     //"data": $.stringify(request),
     "contentType": "application/json; charset=utf-8",
     "dataType": returnDataType,
     "success": successHandler,
     "error": errorHandler,
     "complete": function (XMLHttpRequest, textStatus) {
     this; // the options for this ajax request
     }
     }
   }  */
   else
   {
    var ajaxValue = {
      "type": "POST",
      "url": serviceCallMethodNames[serviceCallMethodName],
      "data": $.stringify(request),
      "contentType": "application/json; charset=utf-8",
      "dataType": returnDataType,
      "success": successHandler,
      "error": errorHandler,
      "complete": function (XMLHttpRequest, textStatus) {
                this; // the options for this ajax request
              }
            }
          }
          if ($.ajax) {
            $.ajax(ajaxValue);
          } else {
            jQuery.ajax(ajaxValue);
          }
        }

//-------------------------------End Region : Service Calls ------------------------------------------------------------------------//

/*
 Utility Object Name : StorageMgr.
 Author : Syed Juned.
 Description : Used to Get and Set name value pair in localstorage if browser supports html5/ in Cookie, Contains two functions
 1. set sets value in localstorage if Browser supports html5 else it stores it in cookie,It takes two parameters a.name, b.value.
 2. get returns value for the name passed as parameter, present either on localstorage if browser supports html5 else from cookie.
 Note:* Cookie expiration time has been set to 6 hours and path is by default '/'
 */
 var storageMgr = {
  set : function(name,value){
    if (IsLocalStorageAvailable && localStorage) {
      localStorageMgr.set(name, value);
    }
    else {
      cookieMgr.set(name,value);
    }
  },
  get : function(name){
    var value = "";
    if (IsLocalStorageAvailable && localStorage) {
      value = localStorageMgr.get(name);
      if(!value)
      {
        value = cookieMgr.get(name);
      }
    }
    else {
      value = cookieMgr.get(name);
    }
    return value;
  }
};
var createCookie = function (name, value) {
  storageMgr.set(name,value);
};


var readCookie = function (name) {
  return storageMgr.get(name);
};

/*
 Utility Object Name : CookieMgr.
 Author: Syed Juned.
 Description : Used to Get and Set name value pair in Cookie, Contains two functions
 1. set sets cookie,It takes two parameters a.name, b.value.
 2. get returns cookie value for the name passed as parameter.
 Note:* Cookie expiration time has been set to 6 hours and path is by default '/'
 */
 var cookieMgr = {
  set : function(name,value){
    var date = new Date();
    date.setTime(date.getTime() + (6 * 60 * 60 * 1000));
    var expires = date;
    var path = '; path=/';
    if ($.browser.mozilla || $.browser.msie)
      document.cookie = [name, '=', value, expires, path].join('');
    else
      document.cookie = [name, '=', utils.lzw.encode(value), expires, path].join('');
  },
  get : function(name){
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        if (cookie.substring(0, name.length + 1) == (name + '=')) {
          if ($.browser.mozilla || $.browser.msie)
            cookieValue = cookie.substring(name.length + 1);
          else
            cookieValue = utils.lzw.decode(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
};
//--------------------------------------EndRegion : For Cookie Read And Write-------------------------------------------------------------------//

/*
 Utility Object Name : LocalStorageMgr.
 Author : Syed Juned.
 Description : Used to Get and Set name value pair in localStorage. Contains 2 functions
 1. SetLocalStorage sets name/value pair,It takes two parameters a.name, b.value.
 2. GetLocalStorage returns value for the name passed as parameter.
 */
 var localStorageMgr = {
  set:function(name,value){
    if (IsLocalStorageAvailable && localStorage) {
      try {
        localStorage.setItem(name, value);
      }
      catch (ex) {
        if (ex.code == 22) {
          if (localStorage.clear) {
            localStorage.clear();
          }
          else {
            for (var i = 0; i < localStorage.length; i++) {
              localStorage.removeItem(localStorage.name(i));
            }
          }
        }
      }
    }
  },
  get:function(name){
    var item;
    if (IsLocalStorageAvailable && localStorage) {
      try {
        var itemTemp = localStorage.getItem(name);
        if (itemTemp != null && itemTemp != undefined) {
          item = itemTemp;
        }
      }
      catch (ex) {
        item = null;
      }
    }
    return item;
  }
};

//------------------------------------------EndRegion : Read And Write Local Storage ---------------------------------------------------------//

//-----------------------------------------Set Page Height-----------------------------------------------------------------------------------//
var setPageHeight = function (idArray, minHeight, fixedSubHeight) {
  var pageHeight = $(window).height() - fixedSubHeight;
  var height = (pageHeight < minHeight) ? minHeight : pageHeight;
  if (idArray != null && idArray.length != 0) {
    for (var i = 0; i < idArray.length; i++) {
      $('#' + idArray[i]).css({ 'overflow': 'auto', 'height': height + 'px' });
    }
  }
  $('textarea').css({ 'height': '95%', 'width': '96%' });
};

//------------------------------------------EndRegion : Set Page Height ---------------------------------------------------------//

//------------------------------------------ Page Navigation Proccess ---------------------------------------------------------//

var goToUrl = function (oldPage, newPage, replaceAll) {
  storageMgr.set("RefreshCount", 0);
  storageMgr.set("setPage", newPage);
  if(replaceAll)
  {
    window.location.replace(newPage + "?alias="+storageMgr.get("TenantAlias"))
  }
  else
  {
    var url = window.location.href;
    if(!$.getQueryString("alias")|| $.getQueryString("alias")==""){
      var queryStringVal =url.split("?")[1];
      if(queryStringVal && queryStringVal.length > 0){
        url = url+"?alias="+storageMgr.get("TenantAlias");
      }
      else{
        url = url+"?alias="+storageMgr.get("TenantAlias");
      }
    }
    window.location.replace(url.replace(oldPage, newPage));
  }
};

var currentPage = window.location.href.substring(window.location.href.lastIndexOf("/"), window.location.href.lastIndexOf("?") > -1 ? window.location.href.lastIndexOf("?") : window.location.href.length).split(".")[0];
var setPage = storageMgr.get("setPage");
var loginPage = "/login";
/*
 if (loginPage != currentPage) {
 if (setPage && currentPage.search(setPage) != -1) {
 var RefreshCount = parseInt(storageMgr.get("RefreshCount"));
 if (RefreshCount) {
 if (RefreshCount >= 1) {
 window.onbeforeunload = "";
 goToUrl(currentPage, loginPage);
 }
 else {
 RefreshCount = RefreshCount + 1;
 storageMgr.set("RefreshCount", RefreshCount);
 }
 }
 else {
 storageMgr.set("RefreshCount", 1);
 }
 }
 else {
 window.onbeforeunload = "";
 goToUrl(currentPage, loginPage);
 }
} */
//------------------------------------------EndRegion : Page Navigation Proccess ---------------------------------------------------------//

//------------------------------------------ Online preview variables ---------------------------------------------------------//
var isOnlinePreview = false;
var onlinePreviewTestId = 0;


//------------------------------------------EndRegion : Online preview variables ---------------------------------------------------------//

var utils = {
  lzw : {
    encode: function (s){
      if (s) {
        var dict = {};
        var data = (s + "").split("");
        var out = [];
        var currChar;
        var phrase = data[0];
        var code = 256;
        for (var i = 1; i < data.length; i++) {
          currChar = data[i];
          if (dict[phrase + currChar] != null) {
            phrase += currChar;
          }
          else {
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            dict[phrase + currChar] = code;
            code++;
            phrase = currChar;
          }
        }
        out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
        for (var i = 0; i < out.length; i++) {
          out[i] = String.fromCharCode(out[i]);
        }
        return out.join("");
      }
      return "";
    },
    decode: function (s){
      if (s) {
        var dict = {};
        var data = (s + "").split("");
        var currChar = data[0];
        var oldPhrase = currChar;
        var out = [currChar];
        var code = 256;
        var phrase;
        for (var i = 1; i < data.length; i++) {
          var currCode = data[i].charCodeAt(0);
          if (currCode < 256) {
            phrase = data[i];
          }
          else {
            phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
          }
          out.push(phrase);
          currChar = phrase.charAt(0);
          dict[code] = oldPhrase + currChar;
          code++;
          oldPhrase = phrase;
        }
        return out.join("");
      }
      return "";
    }
  },
  initPlugins: function (){
        //------------------------------------------ jQuery alert ---------------------------------------------------------//
        (function ($) { $.alerts = { verticalOffset: -75, horizontalOffset: 0, repositionOnResize: true, overlayOpacity: .01, overlayColor: '#FFF', draggable: false, okButton: '&nbsp;OK&nbsp;', cancelButton: '&nbsp;Cancel&nbsp;', dialogClass: null, alert: function (message, title, callback) { if (title == null) title = 'Alert'; $.alerts._show(title, message, null, 'alert', function (result) { if (callback) callback(result) }) }, confirm: function (message, title, callback) { if (title == null) title = 'Confirm'; $.alerts._show(title, message, null, 'confirm', function (result) { if (callback) callback(result) }) }, prompt: function (message, value, title, callback) { if (title == null) title = 'Prompt'; $.alerts._show(title, message, value, 'prompt', function (result) { if (callback) callback(result) }) }, _show: function (title, msg, value, type, callback) { $.alerts._hide(); $.alerts._overlay('show'); $("BODY").append('<div id="popup_container">' + '<h1 id="popup_title"></h1>' + '<div id="popup_content">' + '<div id="popup_message"></div>' + '</div>' + '</div>'); if ($.alerts.dialogClass) $("#popup_container").addClass($.alerts.dialogClass); var pos = ($.browser.msie && parseInt($.browser.version) <= 6) ? 'absolute' : 'fixed'; $("#popup_container").css({ position: pos, zIndex: 99999, padding: 0, margin: 0 }); $("#popup_title").text(title); $("#popup_content").addClass(type); $("#popup_message").text(msg); $("#popup_message").html($("#popup_message").text().replace(/\n/g, '<br />')); $("#popup_container").css({ minWidth: $("#popup_container").outerWidth(), maxWidth: $("#popup_container").outerWidth() }); $.alerts._reposition(); $.alerts._maintainPosition(true); switch (type) { case 'alert': $("#popup_message").after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" class="button" /></div>'); $("#popup_ok").click(function () { $.alerts._hide(); callback(true) }); $("#popup_ok").focus().keypress(function (e) { if (e.keyCode == 13 || e.keyCode == 27) $("#popup_ok").trigger('click') }); break; case 'confirm': $("#popup_message").after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" class="button" /> <input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" class="button" /></div>'); $("#popup_ok").click(function () { $.alerts._hide(); if (callback) callback(true) }); $("#popup_cancel").click(function () { $.alerts._hide(); if (callback) callback(false) }); $("#popup_ok").focus(); $("#popup_ok, #popup_cancel").keypress(function (e) { if (e.keyCode == 13) $("#popup_ok").trigger('click'); if (e.keyCode == 27) $("#popup_cancel").trigger('click') }); break; case 'prompt': $("#popup_message").append('<br /><input type="text" size="30" id="popup_prompt" />').after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /> <input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" /></div>'); $("#popup_prompt").width($("#popup_message").width()); $("#popup_ok").click(function () { var val = $("#popup_prompt").val(); $.alerts._hide(); if (callback) callback(val) }); $("#popup_cancel").click(function () { $.alerts._hide(); if (callback) callback(null) }); $("#popup_prompt, #popup_ok, #popup_cancel").keypress(function (e) { if (e.keyCode == 13) $("#popup_ok").trigger('click'); if (e.keyCode == 27) $("#popup_cancel").trigger('click') }); if (value) $("#popup_prompt").val(value); $("#popup_prompt").focus().select(); break } if ($.alerts.draggable) { try { $("#popup_container").draggable({ handle: $("#popup_title") }); $("#popup_title").css({ cursor: 'move' }) } catch (e) { } } }, _hide: function () { $("#popup_container").remove(); $.alerts._overlay('hide'); $.alerts._maintainPosition(false) }, _overlay: function (status) { switch (status) { case 'show': $.alerts._overlay('hide'); $("BODY").append('<div id="popup_overlay"></div>'); $("#popup_overlay").css({ position: 'absolute', zIndex: 99998, top: '0px', left: '0px', width: '100%', height: $(document).height(), background: $.alerts.overlayColor, opacity: $.alerts.overlayOpacity }); break; case 'hide': $("#popup_overlay").remove(); break } }, _reposition: function () { var top = (($(window).height() / 2) - ($("#popup_container").outerHeight() / 2)) + $.alerts.verticalOffset; var left = (($(window).width() / 2) - ($("#popup_container").outerWidth() / 2)) + $.alerts.horizontalOffset; if (top < 0) top = 0; if (left < 0) left = 0; if ($.browser.msie && parseInt($.browser.version) <= 6) top = top + $(window).scrollTop(); $("#popup_container").css({ top: top + 'px', left: left + 'px' }); $("#popup_overlay").height($(document).height() - 100) }, _maintainPosition: function (status) { if ($.alerts.repositionOnResize) { switch (status) { case true: $(window).bind('resize', $.alerts._reposition); break; case false: $(window).unbind('resize', $.alerts._reposition); break } } } }; jAlert = function (message, title, callback) { $.alerts.alert(message, title, callback) }; jConfirm = function (message, title, callback) { $.alerts.confirm(message, title, callback) }; jPrompt = function (message, value, title, callback) { $.alerts.prompt(message, value, title, callback) } })(jQuery);
        //------------------------------------------ EndRegion : jQuery alert ---------------------------------------------------------//
        //------------------------------------------ to read Query string ---------------------------------------------------------//
        (function ($) {
          $.extend({
            getQueryString: function (name) {
              function parseParams() {
                var params = {},
                e,
                a = /\+/g,
                r = /([^&=]+)=?([^&]*)/g,
                d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
                q = window.location.search.substring(1);
                while (e = r.exec(q))
                  params[d(e[1])] = d(e[2]);
                return params;
              }
              if (!this.queryStringParams)
                this.queryStringParams = parseParams();
              return this.queryStringParams[name];
            }
          });
        })(jQuery);
        //------------------------------------------EndRegion : to read Query string  ---------------------------------------------------------//
        //------------------------------------------ jQuery Stringify  ---------------------------------------------------------//
        jQuery.extend({
          stringify: function stringify(obj) {
            if ("JSON" in window) {
              return JSON.stringify(obj);
            }
            var t = typeof (obj);
            if (t != "object" || obj === null) {
                    // simple data type
                    if (t == "string") obj = '"' + obj + '"';
                    return String(obj);
                  } else {
                    // recurse array or object
                    var n, v, json = [], arr = (obj && obj.constructor == Array);
                    for (n in obj) {
                      v = obj[n];
                      t = typeof (v);
                      if (obj.hasOwnProperty(n)) {
                        if (t == "string") {
                          v = '"' + v + '"';
                        } else if (t == "object" && v !== null) {
                          v = jQuery.stringify(v);
                        }
                        json.push((arr ? "" : '"' + n + '":') + String(v));
                      }
                    }
                    return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
                  }
                }
              });
        //------------------------------------------EndRegion : jQuery Stringify  ---------------------------------------------------------//
        //------------------------------------------ Set value for jQuery.browser  ---------------------------------------------------------//
        jQuery.browser = {};
        jQuery.browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase());
        jQuery.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
        jQuery.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
        jQuery.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
        //------------------------------------------EndRegion : Set value for jQuery.browser  ---------------------------------------------------------//
        //------------------------------------------ atob/btoa functions  ---------------------------------------------------------//
        if (typeof btoa == 'undefined') { function btoa(str) { var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='; var encoded = []; var c = 0; while (c < str.length) { var b0 = str.charCodeAt(c++); var b1 = str.charCodeAt(c++); var b2 = str.charCodeAt(c++); var buf = (b0 << 16) + ((b1 || 0) << 8) + (b2 || 0); var i0 = (buf & (63 << 18)) >> 18; var i1 = (buf & (63 << 12)) >> 12; var i2 = isNaN(b1) ? 64 : (buf & (63 << 6)) >> 6; var i3 = isNaN(b2) ? 64 : (buf & 63); encoded[encoded.length] = chars.charAt(i0); encoded[encoded.length] = chars.charAt(i1); encoded[encoded.length] = chars.charAt(i2); encoded[encoded.length] = chars.charAt(i3) } return encoded.join('') } }
        if (typeof atob == 'undefined') { function atob(str) { var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='; var invalid = { strlen: (str.length % 4 != 0), chars: new RegExp('[^' + chars + ']').test(str), equals: (/=/.test(str) && (/=[^=]/.test(str) || /={3}/.test(str))) }; if (invalid.strlen || invalid.chars || invalid.equals) throw new Error('Invalid base64 data'); var decoded = []; var c = 0; while (c < str.length) { var i0 = chars.indexOf(str.charAt(c++)); var i1 = chars.indexOf(str.charAt(c++)); var i2 = chars.indexOf(str.charAt(c++)); var i3 = chars.indexOf(str.charAt(c++)); var buf = (i0 << 18) + (i1 << 12) + ((i2 & 63) << 6) + (i3 & 63); var b0 = (buf & (255 << 16)) >> 16; var b1 = (i2 == 64) ? -1 : (buf & (255 << 8)) >> 8; var b2 = (i3 == 64) ? -1 : (buf & 255); decoded[decoded.length] = String.fromCharCode(b0); if (b1 >= 0) decoded[decoded.length] = String.fromCharCode(b1); if (b2 >= 0) decoded[decoded.length] = String.fromCharCode(b2) } return decoded.join('') } }
        //------------------------------------------EndRegion : atob/btoa functions  ---------------------------------------------------------//

        if ($.getQueryString("isOnlinePreview") && $.getQueryString("isOnlinePreview") != null && atob($.getQueryString("isOnlinePreview")) == "true") {
          isOnlinePreview = true;
          onlinePreviewTestId = atob($.getQueryString("testId"));
        }
      },
      serviceCallMethodNames:[]
    }
