var APIURL = "https://kioskapi.youfit.com/";
// var environment = "sandbox";
// var environment = "development";
var environment = "production";


toastr.options = {
  "closeButton": true,
  "newestOnTop": false,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}


// $(document).ready(function onDocumentReady() {  
//   setInterval(function doThisEveryTwoSeconds() {
//     toastr.success("Hello World!");
//   }, 2000);   // 2000 is 2 seconds  
// });

function ConnectPlaidAPIForMemberPlan(linktoken, LinkToken_requestid, Linktoken_expired, PlaidID, ClubNumber, token) {
    var handler = Plaid.create({
        clientName: "YouFit Gyms",
        YouFitGyms: {
            client_user_id: "YouFit Gyms",
        },
        env: environment,
        token: linktoken,
        countryCode: ['US'],
        language: "en",
        product: ['auth'],
        onLoad: function () {
            // Optional, called when Link loads
        },
        onSuccess: function (public_token, metadata) {  
            publicToken = public_token != null ? public_token : "";
            link_session_id = metadata.link_session_id;
            institute_Name = "";
            institute_Name = (metadata.institution != null ? (metadata.institution.name != null ? metadata.institution.name : "") : "");
            if (metadata.accounts.length > 1) {
                // window.OpenPlaidAccountPopup(metadata.accounts,'MemberPlan');
            } else {
            //    window.LoadBankDetailsLoader();
                for (let i = 0; i < metadata.accounts.length; i++) {
                  GetAccessToken(public_token, metadata.accounts[i].id, LinkToken_requestid, Linktoken_expired, link_session_id, ClubNumber, linktoken, PlaidID, token);
                }
            }           
        },
        onExit: function (err, metadata) {

            var elementHeader = document.getElementById("bannerSectionHeader");
            elementHeader.style.height = null;
            // var elementFooter = document.getElementById("bannerSectionFooter");
            // elementFooter.style.marginBottom = "-100px";
            // element.classList.remove("");
          $("#MemberPlanPlaid").show();
          $('#bankingDetails').prop('checked', true);
          $("#DraftPaymentType").val("ACH")
          $("#AccHolderFirstName").val(null);
          $("#AccHolderLastName").val(null);
          $("#AccHolderAccNo").val(null);
          $("#AccountNumber").val(null);
          $('#AccountType').val(null);
          $("#AccHolderRoutingNo").val(null);
          $("#AccHolderAccNo").val(null);
          $("#AccountFullName").val(null);
        //   $("#MemberAccType").val(null);
          var checkedValue = $('.sameAsAboveCheckBox:checked').val();
          if(checkedValue != undefined){
            //   $("#MemberPTPlanPlaid").show();
            //   $('#PTbankingDetails').prop('checked', true);
              $("#DraftPaymentType").val("ACH")
          }
            if (err != null) {
                PlaidLog("", "err:- " + JSON.stringify(err) + " & metadata:- " + JSON.stringify(metadata), "Error", FirstName, LastName, EmailID, PhoneNo, PlanID, PlanName, PlanType);                
            }
        }
    });
    handler.open();
  }
  
  function GetAccessToken(publicToken, account_ids, LinkToken_requestid, Linktoken_expired, link_session_id, ClubNumber, LinkToken, PlaidID, token) {
    var PlanObj = JSON.parse(window.sessionStorage.getItem("PlanObj"));
      const data = {
          publicToken: publicToken,
          account_ids: account_ids,
          LinkToken_requestid: LinkToken_requestid,
          Linktoken_expired: Linktoken_expired,
          link_session_id: link_session_id,
          ClubNumber: ClubNumber,
          LinkToken: LinkToken,
          FirstName: document.getElementById("RGFirstName").value,
          LastName: document.getElementById("RGLastName").value,
          Email: document.getElementById("RGEmail").value,
          PhoneNumber: document.getElementById("RGPhoneNo").value,
          PlanId: PlanObj.planId,
          PlanName: PlanObj.planName,
          PlanType: PlanObj.membershipType,
          PlaidID: PlaidID
        };
        $.ajax({
          type: 'POST',
          url:  APIURL + 'api/Plaid/GetAccessToken',
          data: JSON.stringify(data),
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization' : 'Bearer ' + token,
            },
          success: function(data) {
              if (data.data != null) {
                  access_token = data.data.data.access_token != null ? data.data.access_token : "";
                  if (data.data.data.root != null) {
                      $("#AccountName").html(institute_Name);
                      if (data.data.data.root.accounts != null && data.data.data.root.accounts.length > 0) {
                          var accountType = data.data.data.root.accounts[data.data.data.root.accounts.length - 1].subtype;
                          $("#AccType").val(accountType);
                          accountType = accountType.charAt(0).toUpperCase() + accountType.slice(1);
                          $("#AccountType").html(accountType);
                          var maskData = data.data.data.root.accounts[data.data.data.root.accounts.length - 1].mask;                    
                        var nameData = data.data.data.root.accounts[data.data.data.root.accounts.length - 1].name;   
                        
                        var fName = nameData.split(" ");
                          let pattern = /\S/g;
                          let spaceCount = nameData.trim().replace(pattern, '').length;
                          var firstname = document.getElementById('RGFirstName').value;
                          var lastname = document.getElementById('RGLastName').value;
                          var fullname = firstname + " " + lastname;
                          if (spaceCount >= 2) {
                            //   $("#AccHolderFirstName").val(firstname);
                            //   $("#AccHolderLastName").val(lastname);
                            //   $("#AccountFullName").val(fullname);
                            //   $("#AccountFullName").html(fullname);
                          }
                          else if (spaceCount == 0) {
                            // $("#AccHolderFirstName").val(firstname);
                            // $("#AccHolderLastName").val(lastname);
                            // $("#AccountFullName").val(fullname);
                            // $("#AccountFullName").html(fullname);
                          }
                          else if (containsNumbers(fName[0]) == true || containsNumbers(fName[1]) == true) {
                            // $("#AccHolderFirstName").val(firstname);
                            // $("#AccHolderLastName").val(lastname);
                            // $("#AccountFullName").val(fullname);
                            // $("#AccountFullName").html(fullname);
                          }
                          else {
                            // $("#AccHolderFirstName").val(fName[0]);
                            // $("#AccHolderLastName").val(fName[1]);
                            // $("#AccountFullName").val(nameData);
                            // $("#AccountFullName").html(nameData);
                          }
                        
                          $("#AccHolderAccNo").val(maskData);
                          $("#AccountNumber").html(maskData);
                          $('#AccountType').val(accountType);
                          
                          MemberPlanMaskAccNo = maskData;
                          $("#plaidinfo").show();
                          $("#MemberPlanPlaid").hide();
                          $("#bankingDetails").prop('checked', true);
                          var element = document.getElementById("checkOut");
                          element.classList.remove("margin-top-200");
  
                        //   document.getElementById("AccHolderFirstName").value = fName[0];
                        //   document.getElementById("AccHolderLastName").value = fName[1];
                          document.getElementById("AccHolderAccNo").value = maskData;
                          document.getElementById("AccountType").value = accountType;
                          $('#AccountType').val(accountType);
                          var checkedValue = $('.sameAsAboveCheckBox:checked').val();
                          if(checkedValue != undefined){
                            //   $("#PTPlanAccountName").html(institute_Name);
                            //   $("#PTPlanAccountNumber").html(maskData);
                            //   $('#PTPlanAccountType').html(accountType);
                            //   $('#PTAccountFullName').html(fullname);
                              
                            //   $("#plaidPTinfo").show();
                            //   $("#PTbankingDetails").prop('checked', true);
                            //   $("#MemberPTPlanPlaid").hide();
                            //   $("#PTPlanAccHolderFirstName").val(fName[0]);
                            //   $("#PTPlanAccHolderLastName").val(fName[1]);
                            //   $("#PTPlanAccHolderAccNo").val(maskData);
                            //   $("#PTPlanAccountNumber").html(maskData);
                            //   document.getElementById("PTPlanAccHolderFirstName").value = fName[0];
                            //   document.getElementById("PTPlanAccHolderLastName").value = fName[1];
                            //   document.getElementById("PTPlanAccHolderAccNo").value = maskData;
                            //   document.getElementById("PTPlanAccountType").value = accountType;
                          }
                      }
                      else{
                          $("#DraftPaymentType").val("ACH");
                          toastr.warning("Warning","There is no any account details.");
                          //ShowErrorMessage("There is no any account details.", "Warning")
                      }
                      if(data.data.data.root.numbers != null)
                      {
                          if (data.data.data.root.numbers.ach != null && data.data.data.root.numbers.ach.length > 0) {
                              var accountNo = data.data.data.root.numbers.ach[data.data.data.root.numbers.ach.length - 1].account;
                              var routingNo = data.data.data.root.numbers.ach[data.data.data.root.numbers.ach.length - 1].routing;
                              $("#AccHolderRoutingNo").val(routingNo);
                              $("#AccHolderAccNo").val(accountNo);
                              var checkedValue = $('.sameAsAboveCheckBox:checked').val();
                              if(checkedValue != undefined){
                                //   $("#PTPlanAccHolderRoutingNo").val(routingNo);
                              }
                          }
                          else{
                              $("#DraftPaymentType").val("ACH");
                              toastr.warning("Warning","There is no any account details.");
                              //ShowErrorMessage("There is no any account details.", "Warning");
                          }
                      }
                      else{
                          $("#DraftPaymentType").val("ACH");
                          toastr.warning("Warning","There is no any account details.");
                          //ShowErrorMessage("There is no any account details.", "Warning");
                      }
                      $("#DraftPaymentType").val("Plaid");
                  }
                  else{
                      $("#DraftPaymentType").val("ACH");
                      toastr.error("Error","Oops something went wrong. Please try again.");
                      //ShowErrorMessage("Oops something went wrong. Please try again.", "Error");
                  }
              }
              else{
                  $("#DraftPaymentType").val("ACH");
                  toastr.warning("Warning","There is no any account details.");
                  //ShowErrorMessage("There is no any account details.", "Warning");
              }
              console.log(data);
          },
          error: function() {
              $("#DraftPaymentType").val("ACH");
              toastr.error("Error","Oops something went wrong. Please try again.");
              //ShowErrorMessage("Oops something went wrong. Please try again.", "Error");
              console.log("Error");
          }
      });
  }
  
  
//   function ConnectPlaidAPIForPTPlan(linktoken, LinkToken_requestid, Linktoken_expired, PlaidID, ClubNumber) {
    
//       var handler = Plaid.create({
//           clientName: "YouFit Gyms",
//           YouFitGyms: {
//               client_user_id: "YouFit Gyms",
//           },
//           env: "sandbox",
//           token: linktoken,
//           countryCode: ['US'],
//           language: "en",
//           product: ['auth'],
//           onLoad: function () {
//               // Optional, called when Link loads
//           },
//           onSuccess: function (public_token, metadata) {         
//               publicToken = public_token != null ? public_token : "";
//               link_session_id = metadata.link_session_id;
//               institute_Name = "";
//               institute_Name = (metadata.institution != null ? (metadata.institution.name != null ? metadata.institution.name : "") : "");
//               if (metadata.accounts.length > 1) {
//                   // window.OpenPlaidAccountPopup(metadata.accounts,'MemberPlan');
//               } else {
//                   // window.LoadBankDetailsLoader();
//                   for (let i = 0; i < metadata.accounts.length; i++) {
//                     GetAccessTokenForPTPlan(public_token, metadata.accounts[i].id, LinkToken_requestid, Linktoken_expired, link_session_id, ClubNumber, linktoken, PlaidID);
//                   }
//               }           
//           },
//           onExit: function (err, metadata) {
//             var elementHeader = document.getElementById("bannerSectionHeader");
//             elementHeader.style.height = null;
//             $("#PTPlanAccHolderFirstName").val(null);
//             $("#PTPlanAccHolderLastName").val(null);
//             $("#PTPlanAccHolderAccNo").val(null);
//             $("#PTPlanAccountNumber").val(null);
//             $("#PTPlanAccHolderRoutingNo").val(null);
//             $("#PTPlanAccHolderAccNo").val(null);
//             $("#PTPlanAccountType").val(null);
//             // var elementFooter = document.getElementById("bannerSectionFooter");
//             // elementFooter.style.marginBottom = "-100px";
//             $("#MemberPTPlanPlaid").show();
//             $('#PTbankingDetails').prop('checked', true);
//               if (err != null) {
//                   PlaidLog("", "err:- " + JSON.stringify(err) + " & metadata:- " + JSON.stringify(metadata), "Error", FirstName, LastName, EmailID, PhoneNo, PlanID, PlanName, PlanType);                
//               }
//               IsHideMemberRoute = false;
//               $("#DraftPaymentType").val("ACH");
//           }
//       });
//       handler.open();
//     }
    
//     function GetAccessTokenForPTPlan(publicToken, account_ids, LinkToken_requestid, Linktoken_expired, link_session_id, ClubNumber, LinkToken, PlaidID) {
//       var PlanObj = JSON.parse(window.sessionStorage.getItem("PlanObj"));
//       var PTPlanObj = JSON.parse(window.sessionStorage.getItem("PTPlanObj"));
//       var SGTPlanObj = JSON.parse(window.sessionStorage.getItem("SmallGroupPlanObj"));  
//       const data = {
//           publicToken: publicToken,
//           account_ids: account_ids,
//           LinkToken_requestid: LinkToken_requestid,
//           Linktoken_expired: Linktoken_expired,
//           link_session_id: link_session_id,
//           ClubNumber: ClubNumber,
//           LinkToken: LinkToken,
//           FirstName: document.getElementById("RGFirstName").value,
//           LastName: document.getElementById("RGLastName").value,
//           Email: document.getElementById("RGEmail").value,
//           PhoneNumber: document.getElementById("RGPhoneNo").value,
//           PlanId: PTPlanObj != null && PTPlanObj.ptPlanId ? PTPlanObj.ptPlanId : SGTPlanObj.planId,
//           PlanName: PTPlanObj != null ? PTPlanObj.planName : SGTPlanObj.planName,
//           PlanType: PTPlanObj != null ? PTPlanObj.ptPlanNameType : SGTPlanObj.ptPlanNameType,
//           PlaidID: PlaidID
//         };
  
//         $.ajax({
//           type: 'post',
//           url: 'https://localhost:44365/api/Plaid/GetAccessToken',
//           data: JSON.stringify(data),
//           headers: {
//               'Accept': 'application/json',
//               'Content-Type': 'application/json'
//             },
//           success: function(data) {
//               if (data.data != null) {
//                   access_token = data.data.data.access_token != null ? data.data.access_token : "";
//                   if (data.data.data.root != null) {
//                       $("#PTPlanAccountName").html(institute_Name);
//                       if (data.data.data.root.accounts != null && data.data.data.root.accounts.length > 0) {
//                           var accountType = data.data.data.root.accounts[data.data.data.root.accounts.length - 1].subtype;
//                           $("#PTAccType").val(accountType);
//                           accountType = accountType.charAt(0).toUpperCase() + accountType.slice(1);
//                           $("#PTPlanAccountType").html(accountType);
//                           var maskData = data.data.data.root.accounts[data.data.data.root.accounts.length - 1].mask;                    
//                           var nameData = data.data.data.root.accounts[data.data.data.root.accounts.length - 1].name;

//                           var fName = nameData.split(" ");
//                             let pattern = /\S/g;
//                             let spaceCount = nameData.trim().replace(pattern, '').length;
//                             var firstname = document.getElementById('RGFirstName').value;
//                             var lastname = document.getElementById('RGLastName').value;
//                             var fullname = firstname + " " + lastname;
//                             if (spaceCount >= 2) {
//                                 // $("#PTPlanAccHolderFirstName").val(firstname);
//                                 // $("#PTPlanAccHolderLastName").val(lastname);
//                                 // $("#PTAccountFullName").val(fullname);
//                                 // $("#PTAccountFullName").html(fullname);
//                             }
//                             else if (spaceCount == 0) {
//                             //   $("#PTPlanAccHolderFirstName").val(firstname);
//                             //   $("#PTPlanAccHolderLastName").val(lastname);
//                             //   $("#PTAccountFullName").val(fullname);
//                             //   $("#PTAccountFullName").html(fullname);
//                             }
//                             else if (containsNumbers(fName[0]) == true || containsNumbers(fName[1]) == true) {
//                             //   $("#PTPlanAccHolderFirstName").val(firstname);
//                             //   $("#PTPlanAccHolderLastName").val(lastname);
//                             //   $("#PTAccountFullName").val(fullname);
//                             //   $("#PTAccountFullName").html(fullname);
//                             }
//                             else {
//                             //   $("#PTPlanAccHolderFirstName").val(fName[0]);
//                             //   $("#PTPlanAccHolderLastName").val(fName[1]);
//                             //   $("#PTAccountFullName").val(nameData);
//                             //   $("#PTAccountFullName").html(nameData);
//                             }
                          
//                         //   $("#PTPlanAccHolderFirstName").val(fName[0]);
//                         //   $("#PTPlanAccHolderLastName").val(fName[1]);
//                           $("#PTPlanAccHolderAccNo").val(maskData);
//                           $("#PTPlanAccountNumber").html(maskData);
//                           MemberPlanMaskAccNo = maskData;
//                           $("#plaidPTinfo").show();
//                           // $("#MemberPlanPlaid").show();
//                           var element = document.getElementById("checkOut");
//                           element.classList.remove("margin-top-200");
  
                          
//                         //   document.getElementById("PTPlanAccHolderFirstName").value = fName[0];
//                         //   document.getElementById("PTPlanAccHolderLastName").value = fName[1];
//                           document.getElementById("PTPlanAccHolderAccNo").value = maskData;
//                           document.getElementById("PTPlanAccountType").value = accountType;
//                           $('#PTPlanAccountType').val(accountType);
//                           $("#DraftPaymentType").val("Plaid");
//                       }
//                       else{
//                           $("#DraftPaymentType").val("ACH");
//                           // angular.element($("#RGFirstName")).scope().$parent.ShowErrorMessage("There is no any account details.", "Warning");
//                       }
  
//                       if(data.data.data.root.numbers != null)
//                       {
//                           if (data.data.data.root.numbers.ach != null && data.data.data.root.numbers.ach.length > 0) {
//                               var accountNo = data.data.data.root.numbers.ach[data.data.data.root.numbers.ach.length - 1].account;
//                               var routingNo = data.data.data.root.numbers.ach[data.data.data.root.numbers.ach.length - 1].routing;
//                               $("#PTPlanAccHolderRoutingNo").val(routingNo);
//                               $("#PTPlanAccHolderAccNo").val(accountNo);
//                               IsHideMemberRoute = true;
//                           }
//                       }
//                       else{
//                           $("#DraftPaymentType").val("ACH");
//                           // angular.element($("#RGFirstName")).scope().$parent.ShowErrorMessage("There is no any account details.", "Warning");
//                       }
//                       $("#DraftPaymentType").val("Plaid");
//                   }
//                   else{
//                       $("#DraftPaymentType").val("ACH");
//                       // angular.element($("#RGFirstName")).scope().$parent.ShowErrorMessage("Oops something went wrong. Please try again.", "Error");
//                   }
//               }
//               else{
//                   $("#DraftPaymentType").val("ACH");
//                   // angular.element($("#RGFirstName")).scope().$parent.ShowErrorMessage(data.Message, "Error");
//               }
//               console.log(data);
//           },
//           error: function() {
//               angular.element($("#RGFirstName")).scope().UpdatePaymentType('PTPyament', 'ACH');
//               console.log("Error");
//           }
//       });
//   }
  
  
  
  function PlaidLog(public_token, response, status, firstName, lastName, emailID, phoneNo, planID, planName, planType) {
      var authObj = new Object();
      authObj.ClubNumber = ClubNumber;
      authObj.link_token_expiration = Linktoken_expired;
      authObj.link_token = LinkToken;
      authObj.link_token_request_id = LinkToken_requestid;
      authObj.public_token = public_token;
      authObj.link_session_id = link_session_id;
      authObj.access_token = access_token;
      authObj.access_token_request_id = null;
      authObj.item_id = null;
      authObj.plaid_response = response;
      authObj.status = status;
      authObj.FirstName = firstName;
      authObj.LastName = lastName;
      authObj.Email = emailID;
      authObj.PhoneNumber = phoneNo;
      authObj.PlanId = planID;
      authObj.PlanName = planName;
      authObj.PlanType = planType;
  
      $.ajax({
          type: 'POST',
          url: APIURL + "api/Plaid/PlaidLog",
          dataType: 'json',
          data: authObj,
          success: function (data) {
              if (data.IsValid == true) {
                  if (data.Message != null) {
                      PlaidID = data.Message;
                  }
              } else {
              }
          },
          error: function (ex) {
              PlaidLogData(PlaidID, "/api/Plan/PlaidLog", authObj, JSON.parse(ex), ex.InnerException.toString(), ex.Message.toString(), ex.Status, ex.StatusCode);
          }
      });
  }

function containsNumbers(str) {
    return /\d/.test(str);
}
  
function PlaidLogData(PlaidID,RequestURL,RequestBody,ResponseBody,InnerException,ExceptionMsg,Status,StatusCode) {
    var plaidLog = new Object();
    plaidLog.PlaidID = PlaidID;
    plaidLog.RequestURL = RequestURL;
    plaidLog.RequestBody = RequestBody;
    plaidLog.ResponseBody = ResponseBody;
    plaidLog.InnerException = InnerException;
    plaidLog.ExceptionMsg = ExceptionMsg;
    plaidLog.Status = Status;
    plaidLog.StatusCode = StatusCode;
    
    $.ajax({
        type: 'POST',
        url: APIURL + "api/Plaid/PlaidLogData",
        dataType: 'json',
        data: plaidLog,
        success: function (data) {
            if (data.IsValid == true) {
                if (data.Data != 0) {
                    var LogId = data.Data;
                }
            } else {
                angular.element($("#RGFirstName")).scope().$parent.ShowErrorMsg(data.Message, "Error");
            }
        },
        error: function (ex) {
            angular.element($("#RGFirstName")).scope().$parent.ShowErrorMsg(ex.Message, "Error");
        }
    });
}