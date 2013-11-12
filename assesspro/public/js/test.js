$(document).ready(function () {new htmlTest();});

//**********************************************************************************************************************
function htmlTest (){
    //----------------[start] "Modal" part for Test module
    var modal = {
      test:{
        testId: storageMgr.get("TestId"),
        isReactivated: (parseInt(storageMgr.get("ReactivatedCount")) > 0) ? true : false,
        isPsychometricTestType: storageMgr.get("TypeOfTestType") == 1 ? true : false,
        isStaticTest: storageMgr.get("IsStaticTest"),
        testInstructionForHP: localStorageMgr.get("TestInstructions"),
        totalTime: storageMgr.get("TestDuration"),
        navigationLimit: storageMgr.get("navigationLimit") ? storageMgr.get("navigationLimit") : 0,
        pageRefreshLimit: storageMgr.get("pageRefreshLimit") ? storageMgr.get("pageRefreshLimit") : 0,
        currentQuestionNo: 0,
        sectionIndex: 0,
        optionalSectionIndex: 0,
        questionStartTime:0,
        isSectionWiseTiming: false,
        isOptionalGroup: false,
        optionRandomize: false,
        isIntermediateSaveEnabled: true,
            isBrowserNavigationEnabled: (storageMgr.get("IsBrowserNavigationEnabled") && storageMgr.get("IsBrowserNavigationEnabled") == "false")?false:true,//this.navigationLimit > 0 ? false : true,
            isPageRefreshEnabled: (storageMgr.get("IsPageRefreshEnabled") && storageMgr.get("IsPageRefreshEnabled") == "false")?false:true,//this.pageRefreshLimit > 0 ? false : true,
            enableLastSession: (storageMgr.get("enableLastSession") && storageMgr.get("enableLastSession") == "true")?true:false,
            answerArray: []
          },
          questionPaper: {
            mandatoryCollection: {},
            nonMandatoryCollection: {},
            responseArray: [],
            sectionWiseTiming: []
          },
          candidateId: storageMgr.get("CandidateId"),
          tenantId: storageMgr.get("TenantId"),
          tenantAlias: $.getQueryString("alias"),
          loginName: storageMgr.get("ALoginId"),
          questionIndexer: 0,
          timerID: 0,
          intermediateIntervalInSec: 900,
          intermediateTimerId: 0,
          testSubmissionFailure: 0,
          autoProctoringTimer: 0,
          navigationCounter: 0,
          pageRefreshCounter: 0,
          totalElapsedSeconds: storageMgr.get("TimeSpent")?storageMgr.get("TimeSpent"):0,
          testSubmissionIntervalInSec: 60,
          testSubmissionTimerId: 0,
          totalTimeSpent: storageMgr.get("TimeSpent")?storageMgr.get("TimeSpent"):0,
          ctrlDown: false,
          isRefresh: false,
          encString: "",
          intermediateAnswerCollection: {},
          intermediateGroupCollection: {},
          lostSessionGroupObj: {},

          QuestionTypeObj: {
            "Boolean": 1,
            "MCQ": 7,
            "Subjective": 8,
            "RTC": 10,
            "Psychometric": 15
          },
          Ids: {
            Image: {
              "loadTestPaper": "imgLoadTest",
              "instructionHelp": "toolTipIMg"
            },
            Label: {
              "leftHeader": "headerTextLeft",
              "leftContent": "contentTextLeft",
              "sectionAndSubsectionName": "secSubSecDiv",
              "testTiming": "timerDiv",
              "flagButton": "FlagButtonDiv",
              "currentQuestionNo": "questionSpan",
              "totalTime": "spanDuration",
              "answerOptions": "optionsDiv",
              "sectionName": "lblSection",
              "subSectionName": "lblSubsection",
              "elapsedTime": "spanElapsed",
              "remainingTime": "spanRemaining",
              "innerDivCount": ""
            },
            Button: {
              "flagUnflag": "flagUnflag",
              "previous": "btnBack",
              "next": "btnNext",
              "clearAnswer": "clearAnswer",
              "submitTest": "submit_btn",
              "previewQuestions": "btnQuestionPreview"
            }
          },
          jsonGetResultRequest: {
            "TestId": storageMgr.get("TestId"),
            "CandidateId": storageMgr.get("CandidateId"),
            "TenantId": storageMgr.get("TenantId"),
            "UserId": "0"
          },
          jsonQuestionRequest: {
            "IsStaticTest":storageMgr.get("IsStaticTest"),
            "IsOnlinePreview": isOnlinePreview
          },
          JsonSubmitResult: {
            "TestId": storageMgr.get("TestId"),
            "TenantId": storageMgr.get("TenantId"),
            "UserId": "0",
            "TestUserId": storageMgr.get("CandidateId"),
            "IsPartialSubmission": true,
            "TotalTimeSpent": 0,
            "TimeStamp": 0,
            "Answers":{},
            "TestUserGroupInfoCollection":{}
          }
        };
    //----------------[End] "Modal" part for Test module
    //----------------[start] "View" part for Test module
    var view = {
      onViewReady:function(){
        $('#' + modal.Ids.Image.loadTestPaper).attr('src', '/assets/Images/ajax-start-loader.gif').css('display', '');
        utility.onUtilityReady();
        var idArray = ["contentTextLeft", "optionsDiv"];
        setPageHeight(idArray, 150, 374);
        window.onbeforeunload = view.askConfirm;
        this.setElementOnlineTest();
        view.masterPageSetting();
        controller.loadQuestions();
      },
      setElementOnlineTest: function () {
        $('#' + modal.Ids.Image.loadTestPaper).css('display', 'none');
        $('#' + modal.Ids.Label.leftHeader).html("Question No :").append($('<span />').attr('id', 'questionSpan'));
            $('#' + modal.Ids.Button.flagUnflag).click(function(){view.FlagQuestion(this);}).css('display', '') //.button({ icons: { primary: "ui-icon-flag"} });
            $('#' + modal.Ids.Button.previous).click(function(){view.viewPreviousQuestion();}).css('display', '') //.button({ disabled: true, icons: { primary: "ui-icon-seek-prev"} });
            $('#' + modal.Ids.Button.next).click(function(){view.viewNextQuestion();}).css('display', '') //.button({ icons: { secondary: "ui-icon-seek-next"} });
            $('#' + modal.Ids.Button.clearAnswer).click(function(){view.clearAnswers();}).css('display', '') //.button();
            $('#' + modal.Ids.Button.submitTest).click(function(){view.SubmitResultOnclick();}).css('display', '') //.button({ disabled: true });
            $('#' + modal.Ids.Image.instructionHelp).attr('src', '/assets/Images/help.gif');

            if (!modal.test.isPsychometricTestType) {
              var sectionDiv = $('#' + modal.Ids.Label.sectionAndSubsectionName).html('');
              var sectionSpan = $('<span />').addClass('font_a').html('Group: ').appendTo(sectionDiv);
              var lblSection = $('<span />').html('&nbsp;').attr('id', 'lblSection').css('color', 'black').appendTo(sectionDiv);
              var subSectionSpan = $('<span />').addClass('font_a').html(' | Section: ').appendTo(sectionDiv);
              var lblSubsection = $('<span />').attr('id', 'lblSubsection').html('&nbsp').css('color', 'black').appendTo(sectionDiv);
            }
            else {
              $('#label_strik').css('height', '108px');
            }
            var timerString = " [Total Time: <span id=\"spanDuration\">" + $("#test_duration").val() + "</span>  |  Time Elapsed: <span id=\"spanElapsed\"></span>  |  Time Remaining: <span id=\"spanRemaining\"></span>]";
            $('#' + modal.Ids.Label.testTiming).html('&nbsp;&nbsp;').append($('<img />').attr('src', '/assets/Images/Timmer.png').css('vertical-align', 'middle')).append(timerString);
          },
          masterPageSetting: function () {
            modal.testSubmissionFailure = 0;
            var activeElement = document.activeElement;
            var navigationAlert = function () {
              if (activeElement != document.activeElement) {
                activeElement = document.activeElement;
              }
              if (!modal.test.isBrowserNavigationEnabled && this != document.activeElement && !modal.isRefresh) {
                modal.navigationCounter++;
                if (modal.navigationCounter > modal.test.navigationLimit) {
                  controller.questionTimeUpdate(modal.test.currentQuestionNo);
                  controller.addAnswerArrayToCookie();
                  controller.saveIntimidate();
                  window.onblur = '';
                  alert("You are logged out of Test");
                  window.onbeforeunload = "";
                  goToUrl("/test", "/login");
                }
                else {
                  var navigationcount = modal.test.navigationLimit - modal.navigationCounter + 1;
                  window.onblur = '';
                  if (!modal.isRefresh) {
                    var errormsg = "Please don't navigate away from test. Navigating " + navigationcount + " more time will disable your login.";
                    alert(errormsg);
                  }
                }
                this.focus;
                window.focus();
              }
              window.onblur = navigationAlert;
            };
            window.onblur = navigationAlert;
            if ($.browser.msie && !modal.test.isBrowserNavigationEnabled) {
              var focusIE = true;
              var masterPageSettingIEQ = null;
              var masterPageSettingIE = function () {
                if (!modal.test.isBrowserNavigationEnabled && !$("*").is(":focus") && focusIE && !modal.isRefresh) {
                  modal.navigationCounter++
                  focusIE = false;
                  if (modal.navigationCounter > modal.test.navigationLimit) {
                    controller.questionTimeUpdate(modal.test.currentQuestionNo);
                    controller.addAnswerArrayToCookie();
                    controller.saveIntimidate();
                    masterPageSettingIEQ = null;
                    alert("You are logged out of Test");
                    window.onbeforeunload = "";
                    goToUrl("/test", "/login");
                  }
                  else {
                    var navigationcount = modal.test.navigationLimit - modal.navigationCounter + 1;
                    var errormsg = "Please don't navigate away from test. Navigating " + navigationcount + " more time will disable your login.";
                    alert(errormsg);
                  }
                  masterPageSettingIEQ = null;
                  this.focus;
                  window.focus();
                }
              };
              masterPageSettingIEQ = masterPageSettingIE;
              modal.autoProctoringTimer = window.setInterval(masterPageSettingIE, 100);
              $(window).focus(function () {
                modal.isRefresh = false;
                focusIE = true;
                masterPageSettingIEQ = masterPageSettingIE;
              });
            }
            $(window).resize(function (arg) { var idArray = ["contentTextLeft", "optionsDiv"]; setPageHeight(idArray, 150, 374); });
            $(document).keydown(function (e) {
              var ctrlKey = 17, f5Key = 116, rKey = 82;
              modal.isRefresh = false;
              if (e.keyCode == f5Key) {
                modal.isRefresh = true;
              }
              if (e.keyCode == ctrlKey)
                modal.ctrlDown = true;
              if (modal.ctrlDown && (e.keyCode == rKey)) {
                modal.isRefresh = true;
              }})
            .keyup(function (e) {
              var ctrlKey = 17;
              if (e.keyCode == ctrlKey)
                modal.ctrlDown = false;
            });
            view.disableSelection($('#' + modal.Ids.Label.leftContent));
            $('#masterBody').attr({ 'oncopy': 'return false;', 'oncut': 'return false;' });
          },
          disableSelection: function (target) {
            if ($.browser.mozilla) {//Firefox
              $(target).css('MozUserSelect', 'none');
            } else if ($.browser.msie) {//IE
              $(target).bind('selectstart', function () { return false; });
            } else {//Opera, etc.
              $(target).mousedown(function () { return false; });
            }
          },
          askConfirm: function () {
            console.log(modal.test.isPageRefreshEnabled);
            controller.questionTimeUpdate(modal.test.currentQuestionNo);
            controller.addAnswerArrayToCookie();
            if (!modal.test.isPageRefreshEnabled) {
              modal.pageRefreshCounter++;
            }
            if (modal.test.isIntermediateSaveEnabled)
              controller.saveIntimidate();
            if (!modal.test.isPageRefreshEnabled && modal.pageRefreshCounter > modal.test.pageRefreshLimit) {
              alert("You are logged out of Test");
            }
            else
              return "You have attempted to leave this page. By doing this you will get disqualified from the test. Are you sure you want to exit this page?";
          },
          setSectionInfo: function (groupName, groupQuesCount, questionRange, totalSectionIndex, optionalGroupName) {
            var divCount = $('#divTotalCountForEachSection');
            var mainDiv = $('#label_strik');
            if (divCount != null) {
              if (totalSectionIndex == 0) {
                mainDiv.height(mainDiv.height() + 7);
                divCount.html("Groups:");
              }
              if (totalSectionIndex % 5 == 0) {
                mainDiv.height(mainDiv.height() + 10);
                modal.Ids.Label.innerDivCount = $('<div />').css({ 'width': '100%', 'float': 'left' }).appendTo(divCount);
              }
              if (totalSectionIndex != 0 && totalSectionIndex % 5 != 0) {
                modal.Ids.Label.innerDivCount.append(' |');
              }
              var start = questionRange + 1;
              var end = questionRange + groupQuesCount;
              var spanGroupSectionQuestionCount = "";
              if (optionalGroupName && optionalGroupName.length > 0)
                spanGroupSectionQuestionCount = $('<span />').addClass('color_a').css({ 'padding-left': '5px' }).html(optionalGroupName + "[" + groupName + "]" + ": ").appendTo(modal.Ids.Label.innerDivCount);
              else
                spanGroupSectionQuestionCount = $('<span />').addClass('color_a').css({ 'padding-left': '5px' }).html(groupName + ": ").appendTo(modal.Ids.Label.innerDivCount);
              if (start == end) {
                spanGroupSectionQuestionCount.append($('<label />').html(start).css({ 'color': 'black', 'font-size': '12px' }));
              }
              else {
                spanGroupSectionQuestionCount.append($('<label />').html(start + " to " + end).css({ 'color': 'black', 'font-size': '12px' }));
              }
            }
          },
          createFlagButtons: function () {
            var totalQuestions = 0;
            var questionInPreviousSection = 0;
            $('#' + modal.Ids.Label.flagButton).css('display', '').html(' ');
            if (modal.test.isSectionWiseTiming == true) {
              totalQuestions = modal.questionPaper.sectionWiseTiming[modal.test.sectionIndex].QuestionCount;
              for (var i = 0; i < modal.test.sectionIndex; i++)
                questionInPreviousSection += modal.questionPaper.sectionWiseTiming[i].QuestionCount;
              modal.test.currentQuestionNo = questionInPreviousSection;
            }
            else {
              totalQuestions = modal.questionPaper.responseArray.length;
            }
            for (var count = 0; count < totalQuestions; count++) {
              var questionValue = count + questionInPreviousSection;
              var btnTitle = (questionValue + 1);
              if (!modal.test.isPsychometricTestType)
                btnTitle = modal.questionPaper.responseArray[questionValue].group + ' - ' + modal.questionPaper.responseArray[questionValue].section;
              var flagBtn = $('<input />').click(function () { view.FlagClick($(this).attr('value') - 1); }).css({ 'width': '27px', 'margin-right': '3px' }).attr({ 'id': 'flag_' + questionValue, 'type': 'button', 'title': btnTitle, 'value': +(questionValue + 1) }).appendTo('#' + modal.Ids.Label.flagButton);
              if (modal.questionPaper.responseArray[questionValue].isQuestionAnswered == true)
                $(flagBtn).addClass('button_one');
              else
                $(flagBtn).addClass('button_three');
            }
          },
          viewTestQuestions: function (questionObj, questionNoToSaveTime) {
            if (!isNaN(questionNoToSaveTime) && questionNoToSaveTime)
              controller.questionTimeUpdate(questionNoToSaveTime);
            if (questionObj != null) {
              var toolTip = "";
              if (modal.tenantAlias && modal.test.testInstructionForHP && (modal.tenantAlias.toLowerCase() == "hp" || modal.test.isPsychometricTestType)) {
                toolTip = modal.test.testInstructionForHP.stripTags();
              }
              else if (questionObj.instruction && jQuery.trim(questionObj.instruction).length > 1) {
                toolTip = questionObj.section + " : " + questionObj.instruction;
              }
              else {
                toolTip = questionObj.section;
              }
              $('#' + modal.Ids.Image.instructionHelp).attr('title', toolTip);
              $('#' + modal.Ids.Label.currentQuestionNo).html(modal.test.currentQuestionNo + 1);
              $('#' + modal.Ids.Label.answerOptions).html($('<div />').attr('id', 'optionsTable').css({ 'width': '95%' }));
              if (!modal.test.isPsychometricTestType) {
                var groupName = (questionObj.group && questionObj.group.length > 30) ? questionObj.group.substr(0, 30) + "..." : questionObj.group;
                $('#' + modal.Ids.Label.sectionName).html(groupName).attr('title', questionObj.group);
                var sectionName = (questionObj.section && questionObj.section.length > 30) ? questionObj.section.substr(0, 30) + "..." : questionObj.section;
                $('#' + modal.Ids.Label.subSectionName).html(sectionName).attr('title', questionObj.section);
              }

              modal.typeOfQuestion = questionObj.typeOfQuestion;

              $('#' + modal.Ids.Label.leftContent).html(questionObj.question).find('p:first').css('display', 'inline');

              var position = modal.test.answerArray[modal.test.currentQuestionNo].A;

              switch (modal.typeOfQuestion) {
                case modal.QuestionTypeObj.Boolean:
                var boolAnswerArray = [];
                var answerTrue = {
                  "HTMLString": "True",
                  "Choice": "True"
                };
                boolAnswerArray.push(answerTrue);
                var answerFalse = {
                  "HTMLString": "False",
                  "Choice": "False"
                };
                boolAnswerArray.push(answerFalse);
                this.addAnswerOption(boolAnswerArray, position);
                break;
                case modal.QuestionTypeObj.MCQ:
                case modal.QuestionTypeObj.Psychometric:
                if (questionObj.answers != null) {
                  this.addAnswerOption(questionObj.answers, position);
                }
                break;
                case modal.QuestionTypeObj.Subjective:
                var txtArea = $('<Textarea />').attr({'placeholder': 'Type Here', 'id': questionObj.questionId, 'onpaste': 'return false' }).blur(function(){controller.optionClick();}).css({ 'height': '95%', 'width': '96%' });
                if (position != 0 && position != null && position != "null") {
                  $(txtArea).val(position);
                }
                $('#' + modal.Ids.Label.answerOptions).append(txtArea);
                break;
              }
            }
          },
          addAnswerOption: function (answer, position) {
            if (answer && answer.length > 0) {
              var divAnsOption = $('#optionsTable');
              for (var i = 0; i < answer.length; i++) {
                var lblAnsOption = $('<label />').appendTo(divAnsOption);
                var ckbAnsOption = $('<input name = "question" type = "radio" />').attr({ 'id': 'option' + i, 'value': answer[i].HTMLString, 'choice': answer[i].Choice }).click(function () { controller.optionClick(); }).css({ 'border': '0px', 'margin-right': '5px' }).appendTo(lblAnsOption);
                var spanAnsOption = $('<span />').attr({ 'id': 'span' + answer[i].Choice + 'Text' }).html(answer[i].HTMLString).appendTo(lblAnsOption);
                $(spanAnsOption).find('p:first').css('display', 'inline');
                divAnsOption.append($('<hr />').addClass('answerSeprator'));
              }
              if (position) {
                divAnsOption.find('input[choice="' + position + '"]').attr('checked', true);
              }
            }
          },
          FlagQuestion: function (obj) {
            var obj = $('#flag_' + modal.test.currentQuestionNo);
            if (obj.attr('class') == "button_two") {
              if (modal.questionPaper.responseArray[modal.test.currentQuestionNo].isQuestionAnswered == true)
                obj.attr('class', 'button_one');
              else
                obj.attr('class', 'button_three');
            }
            else {
              obj.attr('class', 'button_two');
            }
          },
          viewPreviousQuestion: function () {
            if (modal.questionIndexer > 0) {
              modal.test.currentQuestionNo--;
              modal.questionIndexer--;
              view.viewTestQuestions(modal.questionPaper.responseArray[modal.test.currentQuestionNo], modal.test.currentQuestionNo + 1);
              if (modal.questionIndexer == 0)
                    $('#' + modal.Ids.Button.previous)//.button({ disabled: true });
                  if (modal.questionIndexer <= modal.questionPaper.responseArray.length - 2)
                    $('#' + modal.Ids.Button.next)//.button({ disabled: false });
                }
              },
              viewNextQuestion: function () {
                var totalQuestionToView = (modal.test.isSectionWiseTiming == true) ? modal.questionPaper.sectionWiseTiming[modal.test.sectionIndex].QuestionCount - 1 : modal.questionPaper.responseArray.length - 1;

                if (modal.questionIndexer < totalQuestionToView) {
                  modal.test.currentQuestionNo++;
                  modal.questionIndexer++;
                  view.viewTestQuestions(modal.questionPaper.responseArray[modal.test.currentQuestionNo], modal.test.currentQuestionNo - 1);
                  if ((modal.test.isOptionalGroup && modal.questionIndexer == totalQuestionToView && modal.test.optionalSectionIndex == modal.questionPaper.nonMandatoryCollection.length) || (!modal.test.isOptionalGroup && modal.test.isSectionWiseTiming == true && modal.questionIndexer == totalQuestionToView && modal.test.sectionIndex == modal.questionPaper.sectionWiseTiming.length - 1) || (!modal.test.isOptionalGroup && modal.test.isSectionWiseTiming == false && modal.questionIndexer == totalQuestionToView)) {
                    $('#' + modal.Ids.Button.next)//.button({ disabled: true });
                    $('#' + modal.Ids.Button.submitTest)//.button({ disabled: false });
                  }
                }
                else if (modal.test.isSectionWiseTiming == true && modal.questionIndexer == totalQuestionToView && modal.test.sectionIndex < modal.questionPaper.sectionWiseTiming.length - 1) {
                  jConfirm('Are you sure you want to move to the next section?  You will not be able to revisit this section once you start the next section.<br /> Press OK to continue or Cancel to stay on the current page.', 'Information', function (r) {
                    if (r) {
                      controller.questionTimeUpdate(modal.test.currentQuestionNo);
                      view.sectionWiseTimerStop();
                    }
                  });
                }
                else if (modal.test.isOptionalGroup && modal.questionIndexer == totalQuestionToView && modal.test.optionalSectionIndex < modal.questionPaper.nonMandatoryCollection.length) {
                  controller.questionTimeUpdate(modal.test.currentQuestionNo);
                  view.OptionalGroups(modal.questionPaper.nonMandatoryCollection[modal.test.optionalSectionIndex].JsonGroupcollection.length);
                }

                if (modal.questionIndexer == 1)
                $('#' + modal.Ids.Button.previous)//.button({ disabled: false });
            },
            clearAnswers: function () {
              if (modal.typeOfQuestion == modal.QuestionTypeObj.Boolean || modal.typeOfQuestion == modal.QuestionTypeObj.MCQ || modal.QuestionTypeObj.Psychometric)
                $('input[name="question"]').removeAttr('checked');
              if (modal.typeOfQuestion == modal.QuestionTypeObj.Subjective)
                $('#' + modal.questionPaper.responseArray[modal.test.currentQuestionNo].questionId).val('');
              modal.test.answerArray[modal.test.currentQuestionNo].A = null;
              controller.addAnswerArrayToCookie();
              modal.questionPaper.responseArray[modal.test.currentQuestionNo].isQuestionAnswered = false;
              view.updateFlagBtn();
            },
            FlagClick: function (questionNo) {
              var totalQuestionToView = (modal.test.isSectionWiseTiming == true) ? modal.questionPaper.sectionWiseTiming[modal.test.sectionIndex].QuestionCount - 1 : modal.questionPaper.responseArray.length - 1;

              if (questionNo <= modal.questionPaper.responseArray.length - 1 && questionNo >= 0) {
                var questionToSave = modal.test.currentQuestionNo;
                var diff = questionNo - modal.test.currentQuestionNo;
                modal.questionIndexer += diff;
                modal.test.currentQuestionNo = questionNo;
                view.viewTestQuestions(modal.questionPaper.responseArray[modal.test.currentQuestionNo], questionToSave);
                if (modal.questionIndexer == 0)
                    $('#' + modal.Ids.Button.previous)//.button({ disabled: true });
                  if (modal.questionIndexer <= totalQuestionToView - 1)
                    $('#' + modal.Ids.Button.next)//.button({ disabled: false });
                  if ((modal.test.isOptionalGroup && modal.questionIndexer == totalQuestionToView && modal.test.optionalSectionIndex == modal.questionPaper.nonMandatoryCollection.length) || (!modal.test.isOptionalGroup && modal.test.isSectionWiseTiming == true && modal.questionIndexer == totalQuestionToView && modal.test.sectionIndex == modal.questionPaper.sectionWiseTiming.length - 1) || (!modal.test.isOptionalGroup && modal.test.isSectionWiseTiming == false && modal.questionIndexer == totalQuestionToView)) {
                    $('#' + modal.Ids.Button.next)//.button({ disabled: true });
                    $('#' + modal.Ids.Button.submitTest)//.button({ disabled: false });
                  }
                  if (modal.questionIndexer >= 1)
                    $('#' + modal.Ids.Button.previous)//.button({ disabled: false });
                }
              },
              updateFlagBtn: function () {
                var obj = $('#flag_' + modal.test.currentQuestionNo);
                if (obj.attr('class') != "button_two") {
                  if (modal.questionPaper.responseArray[modal.test.currentQuestionNo].isQuestionAnswered == true) {
                    obj.attr('class', 'button_one');
                  }
                  else {
                    obj.attr('class', 'button_three');
                  }
                }
              },
              sectionWiseTimerStop: function () {
                if (modal.timerID) {
                  clearTimeout(modal.timerID);
                  modal.timerID = 0;
                }
                modal.totalTimeSpent += modal.totalElapsedSeconds;
                if (modal.test.sectionIndex < modal.questionPaper.sectionWiseTiming.length - 1) {
                  controller.setGroupCookieInfo(modal.questionPaper.sectionWiseTiming[modal.test.sectionIndex].SectionId, false, 0);
                  modal.test.sectionIndex++;
                  modal.test.currentQuestionNo++;
                  modal.questionIndexer = 0;
                  var totalQuestionToView = (modal.test.isSectionWiseTiming == true) ? modal.questionPaper.sectionWiseTiming[modal.test.sectionIndex].QuestionCount - 1 : modal.questionPaper.responseArray.length - 1;
                  if (modal.questionIndexer == totalQuestionToView && ((!modal.test.isOptionalGroup && modal.test.sectionIndex == modal.questionPaper.sectionWiseTiming.length - 1) || (modal.test.isOptionalGroup && modal.test.optionalSectionIndex == modal.questionPaper.nonMandatoryCollection.length))) {
                    $('#' + modal.Ids.Button.next)//.button({ disabled: true });
                    $('#' + modal.Ids.Button.submitTest)//.button({ disabled: false });
                  }
                $('#' + modal.Ids.Button.previous)//.button({ disabled: true });
                view.createFlagButtons();
                view.viewTestQuestions(modal.questionPaper.responseArray[modal.test.currentQuestionNo]); //, modal.test.currentQuestionNo - 1
                modal.test.totalTime = modal.questionPaper.sectionWiseTiming[modal.test.sectionIndex].SectionTotalTime;
                controller.timerStart();
              }
            },
            OptionalGroups: function (options) {
              var sectionAttended = null;
              var sectionAttended = controller.getGroupCookieInfo(modal.test.optionalSectionIndex, false);
              if (modal.test.isReactivated == true && sectionAttended != null) {
                controller.optionalShow(sectionAttended);
              }
              else {
                var optionRadio = null;
                $('#modalChooseGroup').empty();

                var modalOptionGroup = $('<div />').attr({ 'id': 'modalChooseGroup', 'title': 'Choose Group' });
                var divOptionGrps = $('<div />').attr({ 'id': 'divChooseGroup' }).css({ 'margin': '5px' }).appendTo(modalOptionGroup);
                var optionList = $('<ol />').appendTo(divOptionGrps);
                var optionListHeight = 0;
                for (var i = 0; i < options; i++) {
                  var optionLi = $('<li />').css('margin-bottom', '5px').appendTo(optionList);
                  var optionLbl = $('<label />').appendTo(optionLi);
                  optionRadio = $('<input />').attr({ 'name': 'preview', 'type': 'radio', 'id': 'opt' + i, 'value': i, 'border': '0px' }).appendTo(optionLbl);
                  if (i == 0)
                    $(optionRadio).attr('checked', 'checked');
                  var optionSpan = $('<span />').attr({ 'id': 'span' + i }).html(modal.questionPaper.nonMandatoryCollection[modal.test.optionalSectionIndex].JsonGroupcollection[i].Name).appendTo(optionLbl);
                  optionListHeight += 20;
                }

                var divButton = $('<div />').attr({ 'id': 'modalButton' }).css({ 'margin': '5px', 'float': 'right' }).appendTo(modalOptionGroup);
                var dlMsg = $('<dl />').appendTo(divButton);
                var ddMsg = $('<dd />').append($('<div />').attr('id', 'err_txt_group_select').css({ 'color': '#ff0000', 'display': 'none' }).html('<b>* Select an Option to Proceed.</b>')).appendTo(dlMsg);

                $('#modalChooseGroup').html(modalOptionGroup);
                jQuery("#modalChooseGroup").dialog({
                  height: 150 + optionListHeight,
                  width: 400,
                  modal: true,
                    beforeclose: function (event, ui) {  },        //return checkSectionTime();
                    buttons: {
                      "Add": function () { view.addGroup(); },
                      "Preview": function () { view.preview(false); }
                    }
                  });
              }
            },
            addGroup: function () {
              var selectedSection = $('input[name="preview"]:checked').attr('value');
              if (selectedSection) {
                jConfirm('Are you sure, you want to add Group - ' + modal.questionPaper.nonMandatoryCollection[modal.test.optionalSectionIndex].JsonGroupcollection[selectedSection].Name + '. You cannot reselect other section .', 'Information', function (r) {
                  if (r) {
                    jQuery("#modalChooseGroup").dialog("destroy");
                    controller.setGroupCookieInfo(modal.questionPaper.nonMandatoryCollection[modal.test.optionalSectionIndex].JsonGroupcollection[selectedSection].Id, true, 1, selectedSection);
                    controller.optionalShow(selectedSection);
                  }
                });
              }
            },
            preview: function (isFullQuestionPaper) {
              var htmlString = null;
              $('#modalPreviewGroup').empty();
              $('#tblContent').find('td').parent('tr').remove();
              if (!isFullQuestionPaper) {
                var selectedSection = $('input[name="preview"]:checked').attr('value');
                htmlString = view.createPreview(modal.questionPaper.nonMandatoryCollection[modal.test.optionalSectionIndex].JsonGroupcollection[selectedSection]);
                $('#modalPreviewGroup').html($('<div />').html(htmlString).attr({ 'id': 'divPreviewGroup', 'Title': 'Preview: ' + modal.questionPaper.nonMandatoryCollection[modal.test.optionalSectionIndex].JsonGroupcollection[selectedSection].Name }));
              }
              else {
                var contentDiv = $('<div />').html('').attr({ 'id': 'divPreviewGroup', 'Title': 'Preview' })
                for (var groupIndex = 0; groupIndex < modal.questionPaper.mandatoryCollection.length; groupIndex++) {
                  htmlString = view.createPreview(modal.questionPaper.mandatoryCollection[groupIndex]);
                  $(contentDiv).append(htmlString);
                }
                $('#modalPreviewGroup').append(contentDiv);
              }
              if (htmlString) {
                jQuery("#modalPreviewGroup").dialog({
                  height: 650,
                  width: 950,
                  modal: true
                });
              }
            },
            createPreview: function (previewGroup) {
              if (previewGroup) {
                var htmlString = $('<div />');
                $('#tblContent').append($('<tr>').append($('<td />').html(previewGroup.Name)).append($('<td />')).append($('<td />')));
                var groupFieldSet = $('<fieldset />').addClass('ui-widget ui-widget-content ui-corner-all').append($('<legend />').html($('<b />').html('Group: ' + previewGroup.Name))).appendTo(htmlString);
                for (var i = 0; i < previewGroup.SectionTypeCollection.length; i++) {
                  $('#tblContent').append($('<tr>').append($('<td />')).append($('<td />').html(previewGroup.SectionTypeCollection[i].Name)).append($('<td />').html(previewGroup.SectionTypeCollection[i].QuestionType.length)));
                  var headerDiv = $('<div />').addClass('ui-state-default ui-corner-all').css('padding', '5px 10px').html($('<b />').html('Section: ' + previewGroup.SectionTypeCollection[i].Name)).append($('<br />')).appendTo(groupFieldSet);
                  var sectionInfoDiv = $('<div />').css('padding-left', '10px').appendTo(groupFieldSet);
                  var qType = $('<b />');
                  $(sectionInfoDiv).append(qType);
                  $(sectionInfoDiv).append($('<b />').html('Instruction: ')).append(previewGroup.SectionTypeCollection[i].Instruction).append($('<br />'));

                  for (var j = 0; j < previewGroup.SectionTypeCollection[i].QuestionType.length; j++) {
                    var typeofQuestion = previewGroup.SectionTypeCollection[i].QuestionType[j].TypeOfQuestion;
                    var queStr = $('<div />').css('padding-left', '10px');
                    switch (typeofQuestion) {
                      case modal.QuestionTypeObj.Boolean:
                      $(qType).html($('<b />').html('Question Type: Boolean Question')).append($('<br />'));
                      $(queStr).append(previewGroup.SectionTypeCollection[i].QuestionType[j].HTMLString + '<br/>').find('p:first').css('display', 'inline');
                      break;
                      case modal.QuestionTypeObj.MCQ:
                      $(qType).html($('<b />').html('Question Type: Multiple choices Question')).append($('<br />'));
                      $(queStr).append(previewGroup.SectionTypeCollection[i].QuestionType[j].HTMLString + '<br/>').find('p:first').css('display', 'inline');
                      break;
                      case modal.QuestionTypeObj.Psychometric:
                      $(qType).html($('<b />').html('Question Type: Psychometric Question')).append($('<br />'));
                      $(queStr).append(previewGroup.SectionTypeCollection[i].QuestionType[j].HTMLString + '<br/>').find('p:first').css('display', 'inline');
                      break;
                      case modal.QuestionTypeObj.Subjective:
                      $(qType).html($('<b />').html('Question Type: Subjective Question')).append($('<br />'));
                      $(queStr).append(previewGroup.SectionTypeCollection[i].QuestionType[j].HTMLString + '<br/>').find('p:first').css('display', 'inline');
                      break;
                      case modal.QuestionTypeObj.RTC:
                      $(qType).html($('<b />').html('Question Type: Reference To Context')).append($('<br />'));
                      $(queStr).append('<b> Passage:</b><br/>' + previewGroup.SectionTypeCollection[i].QuestionType[j].HTMLString + '<br/>').find('p:first').css('display', 'inline');
                      var CQGTC = previewGroup.SectionTypeCollection[i].QuestionType[j].ChildQuestionGeneralTypeCollection;
                      for (var k = 0; k < CQGTC.length; k++) {
                        $(queStr).append($('<b />').html('Question: ' + (j + 1) + '.' + (k + 1))).append(CQGTC[k].HTMLString);
                      }
                      break;
                    }
                    $(groupFieldSet).append($('<b />').css('padding-left', '10px').html('Question: ' + (j + 1))).append(queStr).append('<br />');
                  }
                }
                return htmlString;
              }
            },
            SubmitResultOnclick: function () {
              jConfirm('Are you sure you want to submit. You will not be able to make any changes once you submit the test.<br /> Press OK to continue or Cancel to stay on the current page.', 'Test Submission', function (r) {
                if (r) controller.timerStop();
              });
            }
          };
    //----------------[End] "View" part for Test module
    //----------------[start] "Controller" part for Test module
    var controller = {
      loadQuestions: function (){
            /*$.extend(modal.jsonQuestionRequest,modal.jsonGetResultRequest);
             if (modal.test.isReactivated) {
             sync.getTestResult(modal.jsonGetResultRequest);
             }
             else {
               modal.test.isReactivated = modal.test.enableLastSession;*/
               sync.startTest(modal.jsonQuestionRequest);
            //}
          },
          readFromResponse: function (answer, groupInfo) {
            var lostSessionJsonDataObj = answer;
            modal.lostSessionGroupObj = groupInfo;
            storageMgr.set('CandidateAnswers', $.stringify(lostSessionJsonDataObj));
            sync.startTest(modal.jsonQuestionRequest);
          },
          readFromCookie: function (){
            var candidateAnswers = storageMgr.get("CandidateAnswers");
            if (candidateAnswers != null && candidateAnswers != "") {
              var lostSessionJsonDataObj = $.parseJSON(candidateAnswers);
              for (var i = 0; i < lostSessionJsonDataObj.length; i++) {
                if (lostSessionJsonDataObj[i].A != null && lostSessionJsonDataObj[i].A != undefined && lostSessionJsonDataObj[i].TimeSpent > 0)
                  modal.intermediateAnswerCollection[lostSessionJsonDataObj[i].Q] = lostSessionJsonDataObj[i];
              }
            }
            sync.startTest(modal.jsonQuestionRequest);
          },
          setTestInfo: function (response){
            if (response.GroupWiseTiming == "undefined" || response.GroupWiseTiming == undefined) {
              modal.test.isSectionWiseTiming = false;
            }
            else {
              modal.test.isSectionWiseTiming = response.GroupWiseTiming;
            }
            if (response.IsOptionalGroup == "undefined" || response.IsOptionalGroup == undefined) {
              modal.test.isOptionalGroup = false;
            }
            else {
              modal.test.isOptionalGroup = response.IsOptionalGroup;
            }
            if (response.IsOptionRandomize == "undefined" || response.IsOptionRandomize == undefined) {
              modal.test.optionRandomize = false;
            }
            else {
              modal.test.optionRandomize = response.IsOptionRandomize;
            }
          },
          setQuestionPaperInfo: function (response){
            var totalSectionIndex = 0;
            var questionRange = 0;
            if (response.JsonGroupWithQuestioncollectionForMandatorySection != null) {
              modal.questionPaper.mandatoryCollection = response.JsonGroupWithQuestioncollectionForMandatorySection;
              for (var count = 0; count < response.JsonGroupWithQuestioncollectionForMandatorySection.length; count++) {
                var groupName = response.JsonGroupWithQuestioncollectionForMandatorySection[count].Name;
                var sectionQuestionCount = 0;
                var sectionName = "";
                var instructionString = "";
                var questionString = "";
                var sectionCollection = response.JsonGroupWithQuestioncollectionForMandatorySection[count].SectionTypeCollection;
                for (var i = 0; i < sectionCollection.length; i++) {
                  sectionName = sectionCollection[i].Name;
                  instructionString = sectionCollection[i].Instruction;
                  sectionQuestionCount += sectionCollection[i].QuestionType.length;
                  controller.createQuestionPaperJson(sectionCollection[i], sectionQuestionCount, groupName);
                }
                if (modal.test.isSectionWiseTiming == true) {
                  var sectionWiseTimingObj = {
                    "SectionId": response.JsonGroupWithQuestioncollectionForMandatorySection[count].Id,
                    "SectionName": sectionName,
                    "QuestionCount": sectionQuestionCount,
                    "SectionTotalTime": response.JsonGroupWithQuestioncollectionForMandatorySection[count].TotalTime
                  };
                  modal.questionPaper.sectionWiseTiming.push(sectionWiseTimingObj);
                }
                if (!modal.test.isPsychometricTestType) {
                  view.setSectionInfo(groupName, sectionQuestionCount, questionRange, totalSectionIndex, null);
                  questionRange = questionRange + sectionQuestionCount;
                  totalSectionIndex++;
                }
              }
            }
            var optionalGroupName = "";
            modal.questionPaper.nonMandatoryCollection = response.JsonGroupWithQuestioncollectionForNonMandatorySection;
            for (var i = 0; i < modal.questionPaper.nonMandatoryCollection.length; i++) {
              sectionQuestionCount = 0;
              if (modal.questionPaper.nonMandatoryCollection[i].Name)
                optionalGroupName = modal.questionPaper.nonMandatoryCollection[i].Name;
              else
                optionalGroupName = "Optional Group";
              var groupName = "";
              for (var j = 0; j < modal.questionPaper.nonMandatoryCollection[i].JsonGroupcollection.length; j++) {
                if (j != 0)
                  groupName += " or ";
                groupName += modal.questionPaper.nonMandatoryCollection[i].JsonGroupcollection[j].Name;
              }
              for (var l = 0; l < modal.questionPaper.nonMandatoryCollection[i].JsonGroupcollection[0].SectionTypeCollection.length; l++) {
                var TypeOfQuestion = modal.questionPaper.nonMandatoryCollection[i].JsonGroupcollection[0].SectionTypeCollection[l].QuestionType[0].TypeOfQuestion;
                if (TypeOfQuestion == modal.QuestionTypeObj.RTC) {
                  for (var k = 0; k < modal.questionPaper.nonMandatoryCollection[i].JsonGroupcollection[0].SectionTypeCollection[0].QuestionType.length; k++)
                    sectionQuestionCount += modal.questionPaper.nonMandatoryCollection[i].JsonGroupcollection[0].SectionTypeCollection[l].QuestionType[k].ChildQuestionGeneralTypeCollection.length;
                }
                else {
                  sectionQuestionCount += modal.questionPaper.nonMandatoryCollection[i].JsonGroupcollection[0].SectionTypeCollection[l].QuestionType.length;
                }
              }
              if (!modal.test.isPsychometricTestType) {
                view.setSectionInfo(groupName, sectionQuestionCount, questionRange, totalSectionIndex, optionalGroupName);
                questionRange = questionRange + sectionQuestionCount;
                totalSectionIndex++;
              }
            }
            if (modal.test.isSectionWiseTiming == true)
              modal.test.totalTime = modal.questionPaper.sectionWiseTiming[0].SectionTotalTime;
            var totalQuestionToView = (modal.test.isSectionWiseTiming == true) ? modal.questionPaper.sectionWiseTiming[modal.test.sectionIndex].QuestionCount - 1 : modal.questionPaper.responseArray.length - 1;
            if ((modal.test.isOptionalGroup && modal.questionIndexer == totalQuestionToView && modal.test.optionalSectionIndex == modal.questionPaper.nonMandatoryCollection.length) || (!modal.test.isOptionalGroup && modal.test.isSectionWiseTiming == true && modal.questionIndexer == totalQuestionToView && modal.test.sectionIndex == modal.questionPaper.sectionWiseTiming.length - 1) || (!modal.test.isOptionalGroup && modal.test.isSectionWiseTiming == false && modal.questionIndexer == totalQuestionToView)) {
                $('#' + modal.Ids.Button.next)//.button({ disabled: true });
                $('#' + modal.Ids.Button.submitTest)//.button({ disabled: false });
              }
              view.createFlagButtons();
              view.viewTestQuestions(modal.questionPaper.responseArray[0]);
              controller.timerStart();
            },
            createQuestionPaperJson:function(questionPagerCollection, sectionQuestionCount,groupName){
              var queId, queStr, answerCollection, answerTimeObj, sectionId, questionTenantId;
              var sectionName = questionPagerCollection.Name;
              var instructionString = questionPagerCollection.Instruction;
              for(var index = 0; index < questionPagerCollection.QuestionType.length; index++){
                var TypeOfQuestion =questionPagerCollection.QuestionType[index].TypeOfQuestion;
                if (TypeOfQuestion == modal.QuestionTypeObj.RTC) {
                  sectionQuestionCount--;
                  questionString = "<b>Passage:</b><br/>" + questionPagerCollection.QuestionType[index].HTMLString + "<br/><b>Question:</b><br/>";
                  var CQGTC = questionPagerCollection.QuestionType[index].ChildQuestionGeneralTypeCollection;
                  for (var k = 0; k < CQGTC.length; k++) {
                    sectionQuestionCount++;
                    queId = CQGTC[k].QuestionId;
                    queStr = questionString + CQGTC[k].HTMLString;
                    answerCollection = CQGTC[k].AnswerChoiceCollection;
                    TypeOfQuestion = CQGTC[k].TypeOfQuestion;
                    answerTimeObj = controller.getObjFromCookie(queId);
                    sectionId = questionPagerCollection.SectionId;
                    questionTenantId = CQGTC[k].QuestionTenantId;
                    controller.createResponseObject(groupName, sectionName, queId, queStr, instructionString, answerCollection, TypeOfQuestion, answerTimeObj.answer);
                    var answerObject = {
                      "Q": queId,
                      "A": answerTimeObj.answer,
                      "TimeSpent": (answerTimeObj.timeSpend == null) ? 0 : answerTimeObj.timeSpend,
                      "SecId": sectionId
                    }
                    if (modal.tenantId != questionTenantId)
                      answerObject.QTenantId = questionTenantId;
                    modal.test.answerArray.push(answerObject);
                  }
                }
                else if (TypeOfQuestion == modal.QuestionTypeObj.Boolean || TypeOfQuestion == modal.QuestionTypeObj.MCQ || TypeOfQuestion == modal.QuestionTypeObj.Subjective || modal.QuestionTypeObj.Psychometric) {
                  queId = questionPagerCollection.QuestionType[index].QuestionId;
                  queStr = questionPagerCollection.QuestionType[index].HTMLString;
                  answerCollection = questionPagerCollection.QuestionType[index].AnswerChoiceCollection;
                  answerTimeObj = controller.getObjFromCookie(queId);
                  sectionId = questionPagerCollection.SectionId;
                  questionTenantId = questionPagerCollection.QuestionType[index].QuestionTenantId;
                  controller.createResponseObject(groupName, sectionName, queId, queStr, instructionString, answerCollection, TypeOfQuestion, answerTimeObj.answer);
                  var answerObject = {
                    "Q": queId,
                    "A": answerTimeObj.answer,
                    "TimeSpent": (answerTimeObj.timeSpend == null) ? 0 : answerTimeObj.timeSpend,
                    "SecId": sectionId
                  }
                  if (TypeOfQuestion == modal.QuestionTypeObj.Subjective)
                    answerObject.IsSubjective = true;
                  if (modal.tenantId != questionTenantId)
                    answerObject.QTenantId = questionTenantId;
                  modal.test.answerArray.push(answerObject);
                }
              }
            },
            optionalShow: function (selectedSection) {
              var optionalGroups = modal.questionPaper.nonMandatoryCollection[modal.test.optionalSectionIndex].JsonGroupcollection[selectedSection];
              var groupName = optionalGroups.Name;
              var sectionQuestionCount = 0;
              for (var i = 0; i < optionalGroups.SectionTypeCollection.length; i++) {
                var sectionName = optionalGroups.SectionTypeCollection[i].Name;
                var instructionString = optionalGroups.SectionTypeCollection[i].Instruction;
                sectionQuestionCount += optionalGroups.SectionTypeCollection[i].QuestionType.length;
                controller.createQuestionPaperJson(optionalGroups.SectionTypeCollection[i], sectionQuestionCount, groupName);
              }
              modal.test.optionalSectionIndex++;
              if (modal.test.isSectionWiseTiming == true) {
                var sectionWiseTimingObj = {
                  "SectionId": optionalGroups.Id,
                  "SectionName": groupName,
                  "QuestionCount": sectionQuestionCount,
                  "SectionTotalTime": optionalGroups.TotalTime
                };
                modal.questionPaper.sectionWiseTiming.push(sectionWiseTimingObj);
                view.sectionWiseTimerStop();
              }
              else {
                modal.test.currentQuestionNo++;
                modal.questionIndexer++;
                var totalQuestionToView = (modal.test.isSectionWiseTiming == true) ? modal.questionPaper.sectionWiseTiming[modal.test.sectionIndex].QuestionCount - 1 : modal.questionPaper.responseArray.length - 1;
                if (modal.test.isOptionalGroup && modal.questionIndexer == totalQuestionToView && modal.test.optionalSectionIndex == modal.questionPaper.nonMandatoryCollection.length) {
                    $('#' + modal.Ids.Button.next)//.button({ disabled: true });
                    $('#' + modal.Ids.Button.submitTest)//.button({ disabled: false });
                  }
                  view.createFlagButtons();
                view.viewTestQuestions(modal.questionPaper.responseArray[modal.test.currentQuestionNo]);      //, modal.test.currentQuestionNo - 1
              }
            },
            createResponseObject: function (groupName, sectionName, questionId, questionString, instructionString, answercollection, TypeOfQuestion, ansString) {
              var isAnswered = (ansString != null && ansString != undefined && ansString.length > 0) ? true : false;
              answercollection = (modal.test.optionRandomize && answercollection && answercollection.length > 2) ? controller.jumble(answercollection) : answercollection;
              var responseObject = {
                "group": groupName,
                "section": sectionName,
                "questionId": questionId,
                "question": questionString,
                "instruction": instructionString,
                "answers": answercollection,
                "typeOfQuestion": TypeOfQuestion,
                "isQuestionAnswered": isAnswered
              }
              modal.questionPaper.responseArray.push(responseObject);
            },
            jumble: function (ansCollection) {
              var ansCollectionJumbled = [];
              var count = ansCollection.length;
              var consumedIndex = [];
              consumedIndex.push(count - 1);
              for (var i = 0; i < count - 1; i++) {
                var newIndex = Math.floor(Math.random() * count);
                while ($.inArray(newIndex, consumedIndex) != -1) {
                  newIndex = Math.floor(Math.random() * count);
                }
                consumedIndex.push(newIndex);
                ansCollectionJumbled[newIndex] = ansCollection[i];
              }
              ansCollectionJumbled.push(ansCollection[i]);
              return ansCollectionJumbled;
            },
            getObjFromCookie: function (questionId) {
              var obj = { answer: null, timeSpend: 0 };
              if (modal.test.isReactivated) {
                var lostSessionJsonDataObj = {};
                var candidateAnswers = storageMgr.get("CandidateAnswers");
                if (candidateAnswers != null && candidateAnswers != "")
                  lostSessionJsonDataObj = $.parseJSON(candidateAnswers);
                if (!$.isEmptyObject(lostSessionJsonDataObj)) {
                  for (var i = 0; i < lostSessionJsonDataObj.length; i++) {
                    if (lostSessionJsonDataObj[i].Q == questionId) {
                      obj.answer = lostSessionJsonDataObj[i].A;
                      obj.timeSpend = lostSessionJsonDataObj[i].TimeSpent;
                      return obj;
                    }
                  }
                }
              }
              return obj;
            },
            questionTimeUpdate: function (questionNo) {
              var questionEndTime = new Date().getTime();
              var timeDiffer = parseInt(Math.floor((questionEndTime - modal.test.questionStartTime) / 1000));
              modal.test.questionStartTime = questionEndTime;
              modal.test.answerArray[questionNo].TimeSpent += timeDiffer;
              if (modal.test.isIntermediateSaveEnabled)
                modal.intermediateAnswerCollection[modal.test.answerArray[questionNo].Q] = modal.test.answerArray[questionNo];
            },
            timerStart: function () {
              modal.totalRemainingSeconds = 0;
              $('#' + modal.Ids.Label.totalTime).html(modal.test.totalTime + ' minutes');
              if (modal.test.isReactivated == true) {
                if (modal.test.isSectionWiseTiming == true) {
                  modal.totalElapsedSeconds = 0;
                  modal.totalRemainingSeconds = parseInt(controller.getGroupCookieInfo(modal.test.sectionIndex, true));
                  if (modal.totalRemainingSeconds <= 0 && ((!modal.test.isOptionalGroup && modal.test.sectionIndex < modal.questionPaper.sectionWiseTiming.length - 1) || (modal.test.isOptionalGroup && modal.test.optionalSectionIndex < modal.questionPaper.nonMandatoryCollection.length))) {
                    if (!modal.test.isOptionalGroup)
                      view.sectionWiseTimerStop();
                    else
                      view.OptionalGroups(modal.questionPaper.nonMandatoryCollection[modal.test.optionalSectionIndex].JsonGroupcollection.length);
                    return;
                  }
                  else if (isNaN(modal.totalRemainingSeconds) || !modal.totalRemainingSeconds) {
                    modal.totalRemainingSeconds = parseInt(modal.test.totalTime) * 60;
                  }
                }
                else {
                  if (modal.totalElapsedSeconds == 0 && !modal.test.isReactivated)
                    modal.totalRemainingSeconds = parseInt(storageMgr.get("TimeRemaining"));
                  else
                    modal.totalRemainingSeconds = (parseInt(modal.test.totalTime) * 60) - modal.totalElapsedSeconds;
                }
              }
              else {
                modal.totalRemainingSeconds = parseInt(modal.test.totalTime) * 60;
              }
              if (modal.totalRemainingSeconds != null && modal.totalRemainingSeconds != "-1" && modal.totalRemainingSeconds > 0) {
                modal.totalElapsedSeconds = (parseInt(modal.test.totalTime) * 60) - modal.totalRemainingSeconds;
                modal.totalTimeSpent -= modal.totalElapsedSeconds;
                $('#' + modal.Ids.Label.elapsedTime).html(utility.FormatTimeFromSeconds(modal.totalElapsedSeconds));
                $('#' + modal.Ids.Label.remainingTime).html(utility.FormatTimeFromSeconds(modal.totalRemainingSeconds));
                modal.test.questionStartTime = new Date().getTime();
                if (!modal.timerID) {
                  modal.timerID = setInterval(function () { controller.UpdateTimer() }, 1000);
                }
                if (modal.test.isIntermediateSaveEnabled && !modal.intermediateTimerId)
                  modal.intermediateTimerId = setInterval(function () { controller.saveIntimidate(); }, (modal.intermediateIntervalInSec * 1000));
              }
              else
                this.timerStop();
            },
            UpdateTimer: function () {
              modal.totalRemainingSeconds--;
              modal.totalElapsedSeconds++;
              $('#' + modal.Ids.Label.elapsedTime).html(utility.FormatTimeFromSeconds(modal.totalElapsedSeconds));
              $('#' + modal.Ids.Label.remainingTime).html(utility.FormatTimeFromSeconds(modal.totalRemainingSeconds));
              if (modal.test.isSectionWiseTiming == true) {
                controller.setGroupCookieInfo(modal.questionPaper.sectionWiseTiming[modal.test.sectionIndex].SectionId, false, modal.totalRemainingSeconds);
              }
              else {
                storageMgr.set("TimeRemaining", modal.totalRemainingSeconds);
              }

              if (modal.totalRemainingSeconds <= 0) {
                if (modal.test.isSectionWiseTiming == true && ((!modal.test.isOptionalGroup && modal.test.sectionIndex < modal.questionPaper.sectionWiseTiming.length - 1) || (modal.test.isOptionalGroup && modal.test.optionalSectionIndex < modal.questionPaper.nonMandatoryCollection.length))) {
                  if (modal.timerID) {
                    clearInterval(modal.timerID);
                    modal.timerID = 0;
                  }
                  controller.questionTimeUpdate(modal.test.currentQuestionNo);
                  jAlert("Session Time Over You will move to next Section", "Information", function (r) {
                    if (!modal.test.isOptionalGroup)
                      view.sectionWiseTimerStop();
                    else
                      view.OptionalGroups(modal.questionPaper.nonMandatoryCollection[modal.test.optionalSectionIndex].JsonGroupcollection.length);
                  });
                }
                else
                  this.timerStop();
              }
            },
            timerStop: function () {
              if (modal.timerID) {
                clearInterval(modal.timerID);
                modal.timerID = 0;
              }
              controller.questionTimeUpdate(modal.test.currentQuestionNo);
              if (modal.intermediateTimerId) {
                clearInterval(modal.intermediateTimerId);
                modal.intermediateTimerId = 0;
              }
              controller.addAnswerArrayToCookie();
              $('#' + modal.Ids.Label.flagButton).html('<img src="/assets/Images/ajax-start-loader.gif" />').css('display', '').attr("align", "right");
              $('#' + modal.Ids.Label.leftContent + ', #' + modal.Ids.Label.answerOptions).html("&nbsp;");
            $('#' + modal.Ids.Button.submitTest + ', #' + modal.Ids.Button.flagUnflag + ', #' + modal.Ids.Button.previous + ', #' + modal.Ids.Button.next + ', #' + modal.Ids.Button.clearAnswer + ', #' + modal.Ids.Button.previewQuestions)//.button({ disabled: true });
            $("#modalChooseGroup, #modalPreviewGroup").remove();
            this.SubmitResult();
          },
          isDataPresent: function (quesId, JsonObjectArray) {
            for(var i = 0;i< JsonObjectArray.length;i++){
              if(quesId == JsonObjectArray[i].Q)
                return true;
            }
            return false;
          },
          SubmitResult: function () {
            controller.cleanupAfterSubmission();
            if (isOnlinePreview) {
              goToUrl("/test", "/submission", true);
              return;
            }
            var JsonObjectArray = [];
            if (modal.test.isIntermediateSaveEnabled) {
              $.each(modal.intermediateAnswerCollection, function (i, item) {
                JsonObjectArray.push(item);
              });
              if (modal.test.answerArray != null && modal.test.answerArray.length > 0) {
                for (var i = 0; i < modal.test.answerArray.length; i++) {
                  if (!modal.questionPaper.responseArray[i].isQuestionAnswered && modal.test.answerArray[i].TimeSpent == 0 && !this.isDataPresent(modal.test.answerArray[i].Q, JsonObjectArray))
                    JsonObjectArray.push(modal.test.answerArray[i]);
                }
              }
            }
            if (!modal.test.isIntermediateSaveEnabled && modal.test.answerArray != null && modal.test.answerArray.length != 0) {
              JsonObjectArray = modal.test.answerArray;
            }
            var d = new Date();
            var curr_date = d.getDate();
            var curr_month = d.getMonth() + 1;
            var curr_year = d.getFullYear();
            var curr_hour = d.getHours();
            var curr_min = d.getMinutes();
            var curr_sec = d.getSeconds();
            var timeStamp = curr_month + "/" + curr_date + "/" + curr_year + " " + curr_hour + ":" + curr_min + ":" + curr_sec;
            var tempTotalTimeSpent = modal.totalElapsedSeconds + modal.totalTimeSpent;
            $.extend(modal.JsonSubmitResult, {
              "IsPartialSubmission": false,
              "TotalTimeSpent": tempTotalTimeSpent,
              "Answers": JsonObjectArray,
              "TimeStamp": timeStamp
            });
            var JsonOfflineSubmitResult = {
              "IsOfflineTestResult": true
            };
            $.extend(JsonOfflineSubmitResult, modal.JsonSubmitResult);
            JsonOfflineSubmitResult.Answers = modal.test.answerArray;

            modal.encString = Base64.encode($.stringify(JsonOfflineSubmitResult));
            sync.submitTestResult(modal.JsonSubmitResult);
          },
          showCandidateAnswer: function () {
            $('#masterBody').attr('oncopy', 'return true;');
            jAlert("<textarea id=\"candidate_ans_txtarea\" onClick=\"$(this).focus();\" rows=\"4\" cols=\"30\" readonly=\"readonly\">" + modal.encString + "</textarea><br />", "Candidate Answers", function (r) { controller.SubmitResult(); });
          },
          saveIntimidate: function () {
            if (isOnlinePreview) {
              return;
            }
            var d = new Date();
            var curr_date = d.getDate();
            var curr_month = d.getMonth() + 1;
            var curr_year = d.getFullYear();
            var curr_hour = d.getHours();
            var curr_min = d.getMinutes();
            var curr_sec = d.getSeconds();
            var timeStamp = curr_month + "/" + curr_date + "/" + curr_year + " " + curr_hour + ":" + curr_min + ":" + curr_sec;
            var tempTotalTimeSpent = modal.totalElapsedSeconds + modal.totalTimeSpent;
            var answersCollection = [];
            $.each(modal.intermediateAnswerCollection, function (i, item) {
              answersCollection.push(item);
            });
            var groupSelectionCollection = [];
            $.each(modal.intermediateGroupCollection, function (i, item) {
              groupSelectionCollection.push(item);
            });
            $.extend(modal.JsonSubmitResult, {
              "IsPartialSubmission": true,
              "TotalTimeSpent": tempTotalTimeSpent,
              "Answers": answersCollection,
              "TestUserGroupInfoCollection": groupSelectionCollection,
              "TimeStamp": timeStamp
            });
            sync.intermediateSave(modal.JsonSubmitResult);
          },
          optionClick: function () {
            var answerText = "";
            if (modal.typeOfQuestion == modal.QuestionTypeObj.Boolean || modal.typeOfQuestion == modal.QuestionTypeObj.MCQ || modal.QuestionTypeObj.Psychometric)
              answerText = $('input[name="question"]:checked').attr('choice');
            if (modal.typeOfQuestion == modal.QuestionTypeObj.Subjective) {
              answerText = $('#' + modal.questionPaper.responseArray[modal.test.currentQuestionNo].questionId).val();
            }
            modal.test.answerArray[modal.test.currentQuestionNo].A = answerText;
            modal.questionPaper.responseArray[modal.test.currentQuestionNo].isQuestionAnswered = (answerText && answerText != "") ? true : false;
            controller.addAnswerArrayToCookie();
            view.updateFlagBtn();
          },
          addAnswerArrayToCookie: function () {
            if (modal.test.isIntermediateSaveEnabled && modal.test.currentQuestionNo > 0)
              modal.intermediateAnswerCollection[modal.test.answerArray[modal.test.currentQuestionNo].Q] = modal.test.answerArray[modal.test.currentQuestionNo];
            var JsonObjectArray = [];
            if (modal.test.answerArray != null && modal.test.answerArray.length != 0) {
              for (var i = 0; i < modal.test.answerArray.length; i++) {
                var jsonObject = {
                  "Q": modal.test.answerArray[i].Q,
                  "A": modal.test.answerArray[i].A,
                  "TimeSpent": modal.test.answerArray[i].TimeSpent
                }
                JsonObjectArray.push(jsonObject);
              }
              storageMgr.set('CandidateAnswers', $.stringify(JsonObjectArray));
              storageMgr.set('CandidateAnswersTimeStamp', new Date());
            }
          },
          setGroupCookieInfo: function (id, isSelectedOptionalGroup, timeRemains, selectedSection) {
            if (modal.test.isIntermediateSaveEnabled) {
              var obj = {
                "GroupId": id,
                "IsSelectedOptionalGroup": isSelectedOptionalGroup,
                "TimeSpent": timeRemains
              };
              modal.intermediateGroupCollection[id] = obj;
            }
            if (isSelectedOptionalGroup) {
              var cokieName = "optionalgrp_" + modal.loginName + modal.test.optionalSectionIndex;
              storageMgr.set(cokieName, selectedSection);
            }
            else {
              storageMgr.set(jQuery.trim(modal.loginName + modal.questionPaper.sectionWiseTiming[modal.test.sectionIndex].SectionId), timeRemains);
            }
          },
          getGroupCookieInfo: function (index, returnTime) {
            if (modal.test.isIntermediateSaveEnabled && modal.lostSessionGroupObj.length > 0) {
              if (returnTime) {
                for (var i = 0; i < modal.lostSessionGroupObj.length; i++) {
                  if (modal.questionPaper.sectionWiseTiming[modal.test.sectionIndex].SectionId == modal.lostSessionGroupObj[i].GroupId)
                    return modal.lostSessionGroupObj[i].TimeSpent;
                }
              }
              else {
                for (var i = 0; i < modal.questionPaper.nonMandatoryCollection[modal.test.optionalSectionIndex].JsonGroupcollection.length; i++) {
                  for (var j = 0; j < modal.lostSessionGroupObj.length; j++) {
                    if (modal.questionPaper.nonMandatoryCollection[modal.test.optionalSectionIndex].JsonGroupcollection[i].Id == modal.lostSessionGroupObj[j].GroupId)
                      return i;
                  }
                }
              }
            }
            else {
              if (returnTime) {
                var sectionCookie = jQuery.trim(modal.loginName) + modal.questionPaper.sectionWiseTiming[modal.test.sectionIndex].SectionId;
                return parseInt(storageMgr.get(jQuery.trim(sectionCookie)));
              }
              else {
                var cokieName = "optionalgrp_" + modal.loginName + modal.test.optionalSectionIndex;
                return storageMgr.get(cokieName);
              }
            }
          },
          cleanupAfterSubmission: function () {
            window.onblur = "";
            window.onfocus = "";
            window.onbeforeunload = "";
          }
        };
    //----------------[End] "Controller" part for Test module
    //----------------[start] "Sync" part for Test module
    var sync = {
      getTestResult: function (request) {
       utils.serviceCallMethodNames["GetTestResult"] = "../../JSONServices/JSONAssessmentManagementService.svc/GetTestResult";
       callAjaxService("GetTestResult", request, this.callBackGetResult, controller.readFromCookie);
     },
     callBackGetResult: function (response) {
      if (response != null && response.Answers != null && response.Answers.length > 0 && response.TimeStamp != null && response.TimeStamp != "") {
        if (!enableLastSession || (!storageMgr.get("CandidateAnswersTimeStamp") && storageMgr.get("CandidateAnswersTimeStamp") == null && storageMgr.get("CandidateAnswersTimeStamp") == "")) {
          controller.readFromResponse(response.Answers, response.TestUserGroupInfoCollection);
        }
        else {
          var datediff = utility.DateDiff(new Date(response.TimeStamp), new Date(storageMgr.get("CandidateAnswersTimeStamp")));
          if (datediff < 0) {
            controller.readFromResponse(response.Answers, response.TestUserGroupInfoCollection);
          } else {
            controller.readFromCookie();
          }
        }
      }
      else {
        controller.readFromCookie();
      }
    },
    startTest: function (request){
     utils.serviceCallMethodNames["GetOnlineTestBasicInfo"] = "../../JSONServices/JSONAssessmentManagementService.svc/GetOnlineTestBasicInfo";
     callAjaxService("GetQuestionsForOnlineAssessment", request, function (response, request){sync.callBackStartTest(response,request)}, function (response, request){sync.callBackStartTestFail(response, request)});
   },
   callBackStartTestFail: function (response, request) {
    var message = "";
    if (response != null && response.Message != null)
      message = response.Message;
    else
      message = "Unable to Connect Server, Check your Network Connections<br />";
    jAlert(message + " Click Ok to retry Again", "Network ERROR", function (r) { this.startTest(request); });
  },
  callBackStartTest: function (response, request) {
    if (response != null && (response.IsException == true || response.IsFailure == true)) {
      this.callBackStartTestFail(response, request);
    }
    else if (response != null) {
      controller.setTestInfo(response);
      controller.setQuestionPaperInfo(response);
    }
    else {
      this.callBackStartTestFail(response, request);
    }
  },
  submitTestResult: function (request){
        	utils.serviceCallMethodNames["SubmitTestResult"] = "/submit"; //virtualPath + "JSONServices/JSONAssessmentManagementService.svc/SubmitTestResult";
          callAjaxService("SubmitTestResult", request, this.callBackJsonSubmitResult, function(response, request){sync.callBackJsonSubmitResultFail(response, request)});
          modal.testSubmissionTimerId = setTimeout(function (request) { sync.callBackJsonSubmitResultFail({ "Message": "Results Cannot be Submitted Now" }), request }, (modal.testSubmissionIntervalInSec * 1000));
        },
        callBackJsonSubmitResult: function (response) {
          if (response == null || response.IsException == true || response.IsFailure == true) {
            this.callBackJsonSubmitResultFail(response);
          }
          else if (response != null) {
            if (modal.testSubmissionTimerId) {
              clearTimeout(modal.testSubmissionTimerId);
              modal.testSubmissionTimerId = null;
            }
                //cleanupAfterSubmission();
                goToUrl("/test", "/submission", true);
              }
            },
            callBackJsonSubmitResultFail: function (response, request) {
              if (modal.testSubmissionTimerId) {
                clearTimeout(modal.testSubmissionTimerId);
                modal.testSubmissionTimerId = null;
              }
              var errorMsg = (response && response.Message) ? response.Message : "Results Cannot be Submitted Now";
              if (modal.testSubmissionFailure < 3)
                errorMsg += ", Click OK to retry"
              else
                errorMsg += ", Click OK to retry  <input type='button' onclick='controller.showCandidateAnswer();' value='Get Candidate Answer' />"
              jAlert(errorMsg, "Network ERROR", function (r) {
                modal.testSubmissionFailure++;
                sync.submitTestResult(request);
              });
              modal.testSubmissionTimerId = setTimeout(function () { sync.callBackJsonSubmitResultFail({ "Message": "Results Cannot be Submitted Now" }), request }, (modal.testSubmissionIntervalInSec * 1000));
            },
            intermediateSave: function (request){
        	utils.serviceCallMethodNames["SubmitTestResult"] = "/submit"; //virtualPath + "JSONServices/JSONAssessmentManagementService.svc/SubmitTestResult";
          callAjaxService("SubmitTestResult", request, function (response) { sync.callBackJsonSaveIntimidate(response) }, function (response) { sync.callBackJsonSaveIntimidateFail(response) });
        },
        callBackJsonSaveIntimidate: function(){},
        callBackJsonSaveIntimidateFail: function (){}
      };
    //----------------[End] "Sync" part for Test module
    //----------------[start] "Utility" part for Test module
    var utility = {
    	onUtilityReady: function (){
    		String.prototype.stripTags = function () {
         return this.replace(/<([^>]+)>/g, '').replace(/[\t]{1,}/g, '').replace(/[\n]{1,}/g, '\n').replace(/&nbsp;/g, ' ').trimSpace();
       };
       String.prototype.trimSpace = function () {
         if (this != null)
           return this.replace(/(^\s*)|(\s*$)/g, "");
         else
           return null;
       };
       Base64 = {
         _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
         encode: function (input) {
           var output = "";
           var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
           var i = 0;
           input = Base64._utf8_encode(input);
           while (i < input.length) {
             chr1 = input.charCodeAt(i++);
             chr2 = input.charCodeAt(i++);
             chr3 = input.charCodeAt(i++);
             enc1 = chr1 >> 2;
             enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
             enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
             enc4 = chr3 & 63;
             if (isNaN(chr2)) {
               enc3 = enc4 = 64;
             } else if (isNaN(chr3)) {
               enc4 = 64;
             }
             output = output +
             this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
             this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
           }
           return output;
         },
         decode: function (input) {
           var output = "";
           var chr1, chr2, chr3;
           var enc1, enc2, enc3, enc4;
           var i = 0;
           input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
           while (i < input.length) {
             enc1 = this._keyStr.indexOf(input.charAt(i++));
             enc2 = this._keyStr.indexOf(input.charAt(i++));
             enc3 = this._keyStr.indexOf(input.charAt(i++));
             enc4 = this._keyStr.indexOf(input.charAt(i++));

             chr1 = (enc1 << 2) | (enc2 >> 4);
             chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
             chr3 = ((enc3 & 3) << 6) | enc4;

             output = output + String.fromCharCode(chr1);

             if (enc3 != 64) {
               output = output + String.fromCharCode(chr2);
             }
             if (enc4 != 64) {
               output = output + String.fromCharCode(chr3);
             }
           }
           output = Base64._utf8_decode(output);
           return output;
         },
         _utf8_encode: function (string) {
           string = string.replace(/\r\n/g, "\n");
           var utftext = "";
           for (var n = 0; n < string.length; n++) {
             var c = string.charCodeAt(n);
             if (c < 128) {
               utftext += String.fromCharCode(c);
             }
             else if ((c > 127) && (c < 2048)) {
               utftext += String.fromCharCode((c >> 6) | 192);
               utftext += String.fromCharCode((c & 63) | 128);
             }
             else {
               utftext += String.fromCharCode((c >> 12) | 224);
               utftext += String.fromCharCode(((c >> 6) & 63) | 128);
               utftext += String.fromCharCode((c & 63) | 128);
             }
           }
           return utftext;
         },
         _utf8_decode: function (utftext) {
           var string = "";
           var i = 0;
           var c = c1 = c2 = 0;
           while (i < utftext.length) {
             c = utftext.charCodeAt(i);
             if (c < 128) {
               string += String.fromCharCode(c);
               i++;
             }
             else if ((c > 191) && (c < 224)) {
               c2 = utftext.charCodeAt(i + 1);
               string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
               i += 2;
             }
             else {
               c2 = utftext.charCodeAt(i + 1);
               c3 = utftext.charCodeAt(i + 2);
               string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
               i += 3;
             }
           }
           return string;
         }
       };
     },
     DateDiff: function (startDate, endDate) {
      if (endDate && startDate)
        return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    },
    FormatTimeFromSeconds: function (secs) {
      var h = parseInt(secs / 3600).toFixed(0);
      var m = secs - (3600 * h);
      m = parseInt(m / 60).toFixed(0);
      var s = secs - (60 * m) - (3600 * h);
      var time = "";
      if (h && h > 0)
        time = (h > 9) ? h + ":" : "0" + h + ":";
      else
        time = "00:";
      if (m && m > 0)
        time += (m > 9) ? m + ":" : "0" + m + ":";
      else
        time += "00:";
      if (s && s > 0)
        time += (s > 9) ? s : "0" + s;
      else
        time += "00";
      return time;
    }
  };
  view.onViewReady();
    //----------------[End] "Utility" part for Test module
  }
