
$(document).ready(function(){new htmlLogin();});     //      to call main starting function
function htmlLogin (){
    //----------------[start] "Modal" part for login module
    var modal = {
      aliasId:0,
      loginValidateCount:0,
      loginValidateMsgTimer:0,
        // loginToTest service call request object
        loginRequest: {
          "LoginName": "",
          "Password": "",
          "TenantId": "",
          "IsOnlinePreview": false,
          "TestId": 0
        },
        // getTenant service call request object
        getTenantByAliasRequest:{
          "TenantAlias":""
        },
        loginResponse:{
        }
      };
    //----------------[End] "Modal" part for login module
    //----------------[start] "View" part for login module
    var view = {
        /* This function is starting function for Login Module
         It will set Height for divs, sets button click action, css related to text box, checks if alias info is present
         Request: null
         Response: null
         */
         onViewReady:function(){
          var idArray = ["contentTextLeft", "candidate_login_div"];
          setPageHeight(idArray, 150, 320);
//            $('#login_btn').button({ disabled: false });
$('#login_btn').click(function(){controller.login();});
if ($.getQueryString("isOnlinePreview") && $.getQueryString("isOnlinePreview") != null && atob($.getQueryString("isOnlinePreview")) == "true") {
  modal.loginRequest.IsOnlinePreview=true;
  modal.loginRequest.TestId=atob($.getQueryString("testId"));
  $('#txtAlias').val($.getQueryString("alias"));
  $('#login_btn').click();
}
if($.getQueryString("alias") && readCookie("TenantAlias") && $.getQueryString("alias")!="" && $.getQueryString("alias")== readCookie("TenantAlias")){
  $('#dlAlias').css('display', 'none');
  modal.aliasId = readCookie("TenantId");
}
else{
  modal.aliasId=0;
  if($.getQueryString("alias") && $.getQueryString("alias")!=""){
    $('#txtAlias').val($.getQueryString("alias"));
  }
  else{
    $('#dlAlias').css('display', '');
  }
}
},
        /*
         This function will show validation message when loginToTest service is called
         Request: null
         Response: null
         */
         showLoginValid: function () {
          var TimeInSeconds = (120 / 4) * 1000;
          var validationMessage = ["Validating", "Authenticating", "Logging In"];
          $('#success_msg').html(validationMessage[modal.loginValidateCount]).css('display', '');
          if (modal.loginValidateCount == 0) {
            $('#loadingicon').attr('src', '/assets/images/ajax-loader1.gif').css('display', '');
          }
          if (modal.loginValidateCount < 2){
            modal.loginValidateMsgTimer = setTimeout(this.showLoginValid, TimeInSeconds);
            modal.loginValidateCount++;
          }
          else{
            modal.loginValidateCount=0;
          }
        },
        setLoginRequest:function(){
          $('#login_btn').button({ disabled: true });
          modal.loginRequest.LoginName = jQuery.trim($('#txtUserName').val());
          modal.loginRequest.Password = jQuery.trim($('#txtPassword').val());
          modal.getTenantByAliasRequest.TenantAlias = jQuery.trim($('#txtAlias').val());

          if (modal.loginRequest.LoginName == "" && !modal.loginRequest.IsOnlinePreview) {
            $('#error_msg').html('Enter UserName');
            $('#login_btn').button({ disabled: false });
            return false;
          }
          else if (modal.loginRequest.Password == "" && !modal.loginRequest.IsOnlinePreview) {
            $('#error_msg').html('Enter Password');
            $('#login_btn').button({ disabled: false });
            return false;
          }
          else if (modal.aliasId==0 && modal.getTenantByAliasRequest.TenantAlias == "" && !modal.loginRequest.IsOnlinePreview) {
            $('#error_msg').html('Enter Alias');
            $('#login_btn').button({ disabled: false });
            return false;
          }

          modal.loginRequest.TenantId=modal.aliasId;
        },
        /*
         This function to reset UI elements[text box, buttons, labels]
         Called if service fails.
         Request: null
         Response: null
         */
         reset: function (){
          $('#loadingicon, #success_msg').css('display', 'none');
          $('#txtUserName, #txtPassword, #txtAlias').val('');
          if (modal.loginValidateMsgTimer) {
            clearTimeout(modal.loginValidateMsgTimer);
            modal.loginValidateMsgTimer = 0;
          }
          $('#login_btn').button({ disabled: false });
        }
      };
    //----------------[End] "View" part for login module
    //----------------[start] "Controller" part for login module
    var controller = {
        /*
         This function is called when user clicks login button on UI
         It takes values from UI and sets to request objects created in "Modal" part,
         Calls loginToTest function present in "Controller" part if aliasId is present
         Calls getTenantByAlias function present in "Controller" part if aliasId is not present
         Request: null
         Response: null
         */
         login: function(){
          view.setLoginRequest();
          if(modal.aliasId!=0){
                sync.loginToTest(modal.loginRequest);        //if aliasId is present it will call loginToTest service
              }
              else if (modal.aliasId==0) {
                sync.getTenantByAlias(modal.getTenantByAliasRequest);            //if aliasId is not present it will call getTenantByAlias service
              }
            }
          };
    //----------------[End] "Controller" part for login module
    //----------------[start] "Sync" part for login module
    var sync={
        /*
         Function to call loginToTest service
         function is called from "View" part,
         Request: LoginName, Password, TenantId, IsOnlinePreview, TestId -- as Object
         Response: null
         */
         loginToTest: function(loginRequest){
          view.showLoginValid();
          console.log(loginRequest);
          utils.serviceCallMethodNames["LoginToTest"] = "/login";
          callAjaxService("LoginToTest", loginRequest, this.callBackLoginToTest, this.errorHandler);
        },
        /*
         CallBack of loginToTest service call
         Sets all information in cookies
         Request: response from service -- as Object
         Response: null
         */
         callBackLoginToTest:function(response){
          if (response.IsFailure == false && (!response.Message || response.Message == "")) {
            var enableLastSession = true;
            var Alogin = readCookie("ALoginId");
            if (Alogin != modal.loginRequest.LoginName || modal.loginRequest.IsOnlinePreview) {
              enableLastSession = false;
              createCookie("CandidateAnswers", "");
              createCookie("TimeRemaining", "");
              createCookie("CandidateAnswersTimeStamp", "");
              createCookie("TimeSpent", "");
              createCookie("ALoginId", modal.loginRequest.LoginName);
            }
            createCookie("CandidateId", response.CandidateId);
            createCookie("CandidateName", response.CandidateName);
            if(response.Config)
            {
              var config = $.parseJSON(response.Config);
              if (config && config.browserNavigation && config.browserNavigation > 0) {
                createCookie("IsBrowserNavigationEnabled", false);
                createCookie("navigationLimit", config.browserNavigation);
              } else {
                createCookie("IsBrowserNavigationEnabled", true);
                createCookie("navigationLimit", 0);
              }
              if (config && config.pageRefresh && config.pageRefresh > 0) {
                createCookie("pageRefreshLimit", config.pageRefresh);
                createCookie("IsPageRefreshEnabled", false);
              } else {
                createCookie("pageRefreshLimit", 0);
                createCookie("IsPageRefreshEnabled", true);
              }
            }
            createCookie("IsInstantResult", response.IsInstantResult);
            createCookie("IsStaticTest", response.IsStaticTest);
            createCookie("PresentationURL", response.PresentationURL);
            createCookie("ReactivatedCount", response.ReactivatedCount);
            createCookie("TestDuration", response.TestDuration);
            createCookie("TestId", response.TestId);
            createCookie("TestName", response.TestName);
            createCookie("TimeSpent", response.TimeSpent);
            createCookie("TypeOfTestType", response.TypeOfTestType);
            if (response.TestInstructions && response.TestInstructions.trim().length > 0) {
              createCookie("IsTestInstructions", "true");
            }
            else {
              createCookie("IsTestInstructions", "false");
            }
            if (IsLocalStorageAvailable)
              localStorageMgr.set("TestInstructions", response.TestInstructions);
            createCookie("enableLastSession", enableLastSession);
            if (response.AssessmentCatalogMaster != null || response.AssessmentCatalogMaster == "") {
              goToUrl("/login", "/registeration");
            }
            else if (response.PresentationURL == null || response.PresentationURL == "") {
              goToUrl("/login", "/instructions");
            } else {
              goToUrl("/login", "/demo");
            }
          }
          else {
            $('#error_msg').html(response.Message);
            view.reset();
          }
        },
        /*
         Function to call getTenant service
         function is called from "View" part,
         Request: Tenant Alias Name-- as Object
         Response: null
         */
         getTenantByAlias:function(alias){
           utils.serviceCallMethodNames["GetTenantByIdOrAlias"] =  "/tenant";
           callAjaxService("GetTenantByIdOrAlias", alias, this.getTenantByIdOrAliasCallBack, this.errorHandler);
         },
        /*
         CallBack of getTenantByIdOrAlias service
         Sets tenantId in cookie and calls loginToTest function in "Controller" part
         Request: Response from service-- as Object
         Response: null
         */
         getTenantByIdOrAliasCallBack: function(response){
          if (response != null && response.Tenant != null && response.Tenant.Id != 0) {
            modal.loginRequest.TenantId=response.Tenant.Id;
            createCookie("TenantId", response.Tenant.Id);
            createCookie("TenantAlias", response.Tenant.Alias);
            console.log(modal.loginRequest);
            sync.loginToTest(modal.loginRequest);
          }
          else{
            view.reset();
          }
        },
        /*
         Common callback Error function
         */
         errorHandler: function(response){
          view.reset();
            //console.log(response);
          }
        };
    //----------------[End] "Sync" part for login module
    view.onViewReady();                      // main starting function call
  }
