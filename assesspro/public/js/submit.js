$(document).ready(function () {new htmlTestSubmition(); });    //Code written to initiate htmlTestSubmition.

function htmlTestSubmition(){
    /*   Contains fields required,
     1. To call GetCandidateResults Service on click of view result button.
     2.To Show/Hide Result button.
     */
    //-----[Start]Modal part of View candidate test result.
    var modal= {
        //Required to show view result button.
        instantResult:readCookie("IsInstantResult"),
        // GetCandidateTestResult Json Request.
        jsonGetCandidateResultsRequest:{
          UserId:0,
          TenantId:readCookie("TenantId"),
          TestId:readCookie("TestId"),
          CandidateId:readCookie("CandidateId")
        },
        // GetCandidateTestResult Json Response.
        jsonGetCandidateResultsResponse:{}
      };
    //-----[End]Modal part of View candidate test result.
    /* Contains functions,
     1. To show/hide view result button.
     2. To Construct Test Result Grid.
     */
    //-----[Start]View part of View candidate test result.
    var view = {
      onViewReady:function(){
            //Showing view result button and applying jquery ui to make button if instant result has been set.
            if (modal.instantResult && modal.instantResult == "true") {
              $("#btnViewResult").css("display", "");
              $("#btnViewResult").button();
            } else {
              $("#btnViewResult").css("display", "none");
            }
            //Registering onclick of view result if jsonGetCandidateResultsResponse field of modal has data hide the button if not.
            if(modal.jsonGetCandidateResultsResponse)  {
              $("#btnViewResult").click(function(){view.showHideCandidateTestResult()});
            }else{
              $("#btnViewResult").css("display", "none");
            }
            var idArray = ["submission_right_div", "ctl00_DefaultContent_contentTextLeft"];
            setPageHeight(idArray, 150, 320);
          },
          showHideCandidateTestResult : function(){
            //Checking if button text is View Result and score has not been loaded to call GetCandidateTestResult Service. if not hide the button.
            if ($("#btnViewResult").find("span").html().toLowerCase() == "view result") {
              $("#btnViewResult").find("span").html("Hide Result");
              $("#spanLoadingQuestionPaper").css("display", "");
              if (!$("#btnViewResult").attr("isScoreLoaded") || $("#btnViewResult").attr("isScoreLoaded") == "false") {
                controller.getCandidateResults();
              } else {
                $("#tableCandidateScore").css("display", "");
                $("#spanLoadingQuestionPaper").css("display", "none");
              }
            } else {
              $("#btnViewResult").find("span").html("View Result");
              $("#tableCandidateScore").css("display", "none");
              $("#spanLoadingQuestionPaper").css("display", "none");
            }
          },
          constructCandidateResultGrid : function(){
            //Code to construct the candidate test result grid if jsonGetCandidateResultsResponse field of modal has data.
            if (null != modal.jsonGetCandidateResultsResponse && null != modal.jsonGetCandidateResultsResponse.TotalCandidateScore && modal.jsonGetCandidateResultsResponse.TotalCandidateScore.length > 0) {
              var tabledata = $('<table id="tableCandidateScore"/>').attr({ 'cellspacing': "1",'cellpadding': "3",'width': "95%" }).addClass("ui-corner-all ui-widget-content ui-table-bottom-line").append($('<tr/>').attr("class", "ui-state-default").append($('<th/>').css('width', '2%')).append($('<th/>').html('Group').css({ 'font-weight': 'bold', 'width': '30%' })).append($('<th/>').html("Correct").css({ 'font-weight': 'bold', 'width': '15%' })).append($('<th/>').html("Wrong").css({ 'font-weight': 'bold', 'width': '15%' })).append($('<th/>').html("UnAttempted").css({ 'font-weight': 'bold', 'width': '15%' })).append($('<th/>').html("Score").css({ 'font-weight': 'bold', 'width': '15%' })));
              for (var i = 0; i < modal.jsonGetCandidateResultsResponse.TotalCandidateScore.length; i++) {
                if (modal.jsonGetCandidateResultsResponse.TotalCandidateScore[i].ParentGroupId == 0) {
                  var trscoredetails = $('<tr/>').attr("id", "trscore" + i).append($('<td/>').append($('<a/>').attr('id', 'ScoreAnchor' + i).html('+').attr('href', 'javascript:ShowSectionScore(' + i + ')'))).append($('<td/>').html(modal.jsonGetCandidateResultsResponse.TotalCandidateScore[i].GroupName)).append($('<td/>').html(modal.jsonGetCandidateResultsResponse.TotalCandidateScore[i].CorrectAnswer)).append($('<td/>').html(modal.jsonGetCandidateResultsResponse.TotalCandidateScore[i].InCorrectAnswer)).append($('<td/>').html(modal.jsonGetCandidateResultsResponse.TotalCandidateScore[i].UnAttendedQuestions)).append($('<td/>').html(modal.jsonGetCandidateResultsResponse.TotalCandidateScore[i].Score)).appendTo(tabledata);
                }
                var sectiontabledata = $('<table/>').attr({ cellspacing: "1", cellpadding: "2", width: "100%" }).addClass("ui-corner-all ui-widget-content ui-table-bottom-line").attr("style", "margin-bottom:5px", "margin-top:5px").append($('<tr/>').addClass("ui-state-default").append($('<th/>').html("Section Name").css({ 'font-weight': 'bold', 'width': '40%' })).append($('<th/>').html("Correct").css({ 'font-weight': 'bold', 'width': '15%' })).append($('<th/>').html("Wrong").css({ 'font-weight': 'bold', 'width': '15%' })).append($('<th/>').html("UnAttempted").css({ 'font-weight': 'bold', 'width': '15%' })).append($('<th/>').html("Score").css({ 'font-weight': 'bold', 'width': '15%' })));
                for (var j = 1; j < modal.jsonGetCandidateResultsResponse.TotalCandidateScore.length; j++) {
                  if (modal.jsonGetCandidateResultsResponse.TotalCandidateScore[j].ParentGroupId > 0 && modal.jsonGetCandidateResultsResponse.TotalCandidateScore[i].GroupId == modal.jsonGetCandidateResultsResponse.TotalCandidateScore[j].ParentGroupId) {
                    sectiontabledata.append($('<tr/>').append($('<td/>').html(modal.jsonGetCandidateResultsResponse.TotalCandidateScore[j].GroupName)).append($('<td/>').html(modal.jsonGetCandidateResultsResponse.TotalCandidateScore[j].CorrectAnswer)).append($('<td/>').html(modal.jsonGetCandidateResultsResponse.TotalCandidateScore[j].InCorrectAnswer)).append($('<td/>').html(modal.jsonGetCandidateResultsResponse.TotalCandidateScore[j].UnAttendedQuestions)).append($('<td/>').html(modal.jsonGetCandidateResultsResponse.TotalCandidateScore[j].Score)));
                  }
                }
                if ($(sectiontabledata).find('tr').length > 1)
                  var trScoreDetails = $('<tr/>').attr('id', "ScoreRelated" + i).css('display', 'none').append($('<td/>')).append($('<td/>').attr({ colspan: "5" }).append(sectiontabledata)).appendTo(tabledata);
              }
              $('#divInstantResult').append(tabledata);
              $("#btnViewResult").attr("isScoreLoaded", true);
            }
            $("#spanLoadingQuestionPaper").css("display", "none");
          }

        };
    //-----[End]View part of View candidate test result.
    /*  Contains functions,
     1. To call GetCandidateResults Service and it's Callbacks.
     */
    //-----[Start]Sync part of View candidate test result.
    var sync = {
      getCandidateResult : function(getCandidateResultRequest){
       utils.serviceCallMethodNames["GetCandidateResults"] = "../../JSONServices/JSONAssessmentManagementService.svc/ViewCandidateScoreByCandidateId";
       callAjaxService("GetCandidateResults", getCandidateResultRequest, this.callBackGetCandidateResult, this.errorHandler);
     },
     callBackGetCandidateResult : function(response){
      if(response){
        if(response.IsFailure || response.IsException){
          alert(response.Message);
          return false;
        }else{
          if(response.CandidateScore){
            controller.saveCandidateResultResponse(response.CandidateScore);
          }
        }
      }
    },
    errorHandler: function(response){
      view.reset();
            //console.log(response);
          }
        };
    //-----[End]Sync part of View candidate test result.
    /*  Contains functions,
     1. To save fields of modal.
     */
    //-----[Start]Controller part of View candidate test result.
    var controller = {
      saveCandidateResultResponse : function(candidateResultResponse){
        if(candidateResultResponse){
          modal.jsonGetCandidateResultsResponse = candidateResultResponse.CandidateScore;
          view.constructCandidateResultGrid();
        }
      },
      getCandidateResults:function(){
        sync.getCandidateResult(modal.jsonGetCandidateResultsRequest);
      }
    };
    view.onViewReady();
  }
//-----[End]Controller part of View candidate test result.
