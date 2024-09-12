export enum ApiMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}

export enum CustomErrorCodes {
  UN_KNOWN = 0,
}

export enum ClientError {
  HTTP_404_BAD_REQUEST = 400,
  HTTP_401_UNAUTHORIZED = 401,
}

export enum SuccessCodes {
  HTTP_200_OK = 200,
  HTTP_201_CREATED = 201,
  HTTP_202_ACCEPTED = 202
}

export enum AuthEndPoints {
  GET_CLUB = "api/Club/GetClubList",
  SEARCH_GUEST_MEMBER = "api/Search/SearchContact",
  SEARCH_MEMBER_GUEST = "api/Member/SearchMemberGuest",
  GET_SALES_MEMBER_DETAIL = "api/Guest/SalesPerson",
  GET_CLUB_VISE_PROCESSING_FEE = "api/Guest/GetClubViseProcessingFee",
  SAVE_LEAD_INFORMATION = "api/Guest/SaveContact",
  VALIDATE_EMAIL = "api/Search/ValidateEmail?Email=",
  GET_PTPLAN_DETAILS = "api/Plan/GetPTPlansDetails",
  UPSERT_CONTACT_INFORMATION = "api/Member/UpsertContactInfoInHubspot",
  GETMEMBER_PREVIOUS_PTPLAN_AVAILABLE = "api/Plan/CheckMemberPreviousPTPlanAvailable?MemberId=",
  INSERT_REFERRALS = "api/Club/SAVE_Referrals",
  UPGRADE_MEMBERSHIP = "api/Member/UpgradeMembership",
  CHILDCARE_PLAN_CHECKOUT = "api/Amenities/ChildCarePlanCheckOut",
  SAVE_PICKLEBALL = "api/Amenities/InsertPickleballLead",
  GET_MEMBER_SILVER_FIT_PLANS = "api/SilverSneakers/GetMemberSignupSilverSneakersPlans",
  VALIDATE_HUBSPOT_EMAIL = "api/Guest/ValidateHubSpotEmail?email",
  GET_MEMBER_RFC = "api/Guest/GetMemberReturnForCollection",
  UPDATE_RFC_FLAG = "api/Guest/SaveRFCMember",
  SAVE_MINOR = "api/Search/saveMinorInfo",
  SAVE_SURVEY = "api/Staff/InsertSurveyDetail",
  GET_MEMBERSHIP_PLANS = "api/Plan/GetMemberShipPlans?ClubNumber=",
  SEARCH_SILVER_FIT_DETAILS = "api/SilverSneakers/SearchSilverSneakersEligibility",
  SILVER_FIT_URL_SHORTCODE = "api/SilverSneakers/GetSilverSneakerURLShortCode",
  TOTSPOT_AND_PICKLEBALL_FLAG = "api/Amenities/GetTotspotandPickleballflag?ClubNumber=",
  EQUIPMENT_DETAILS = "api/Amenities/GetEquipmentDetails",
  MEMBER_CHECKOUT = "api/Plan/MemberCheckOut",
  CHECK_CREDITCARD_NUMBER = "api/Plan/CheckCreditCardNumber?CCnumber=",
  CHECKEMAIL_USER_BY_OTHER_CONTACT = "api/Search/CheckEmailUseByOtherContact",
  UPDATE_PERSONAL_INFO = "api/ManageMembership/updatePersonalInfo",
  UPDATE_PAYMENT_INFO = "api/ManageMembership/updatePaymentInfo",
  INSERT_TEMPORARY_AGREEMENT_DATA = "api/Guest/SaveReport",
  PLAID_CONNECT_API = "api/Plaid/ConnectPlaidAPI",
  ADD_MISSING_ABC_PROSPECTS = "api/Member/AddMissingABCProspects",
  GET_STAFF = "api/Staff/GetStaffDetails",
  GET_QLA_DETAILS = "api/Staff/GetQuestionOptionsDetails",
  VALIDATE_CREDENTIAL = "api/Staff/ValidateCredential",
  GET_STAFF_CONTACT = "api/Staff/GetStaffContactDetails",
  SEND_MAIL = "api/JiraTicket/SendMail",
  SAVE_WORK_FLOW = "api/SaveWorkFlow/SaveWorkFlow",
  CANCELLED_MEMBER = "api/Guest/SearchCancelledMember",
}

export const webConfig = {
  visibleMoreForSpecificClubs: "6437,6438,7334,7339,7370,7387,7396,7434,7444,7455,6439,6441,7344,7377,7411,7432,7751,7763,7768,7789,7797,2602,6440,6443,7349,7364,7366,7369,7388,7392,7447,7457,7460,7762,7788,7333,7358,7378,7759,7361,7362,7385,7393,7397,7456,7459,7739,7741,7765,7781",
  referralLead_FormId: "5WHV8FB3C90C",
  childCareFirstPlan: "1 Child,20",
  childCareSecondPlan: "2+ Children,35",
  amenitiesState: "TX,LA,GA,FL",
  childCareAmenitiesDocument: "/assets/document/AcknowledgementofExemption_",
  policyProceduresDocument: "../../../../assets/document/YouFitParentHandbook.pdf",
  isSurveyFlag: "6439,6441,7344,7377,7411,7432,7751,7763,7768,7789,7797",
  openHouseCampaignId: "open_house_extra",
  paidPassCampaignId: "guest_for_day",
  classPassCampaignId: "classpass",
  appointmentTourCampaignId: "walk_in",
  memberGuestCampaignId: "premium_premiumplus_guest",
  minorCampaignId: "minor",
  freePassCampaignId: "free_pass",
  pickleballCampaignId: "Break the Love Pickleball",
  fromDateForOpenHouse: "12/02/2023",
  toDateForOpenHouse: "12/04/2023",
  upgradeYearlyPlan: "Basic Term Monthly {0},Premium 1 Dollar to Join 12 Month {0},Premium + 1 Dollar to Join 12 Month {0}"

}

export const constMessage = {
  //#region Common messages
  warning: "Warning",
  info: "Information",
  success: "Success",
  error: "Error",
  required: "Required",
  networkError: "Opps something went wrong, Please try again later.",
  delete: "Are you sure want to delete ",
  exists: "Record Already Exists",
  emptyUser: "Something went wrong with user",
  dateValidation: "You can not select more than 31 days",
  admin: "You are now admin.",
  recurringPaymentRequired: "Recurring Payment Info. Required",
  billingInfoError: "Billing information error",
  continue: "CONTINUE",
  //#endregion End of common messages

  clubSelection: {
    clubWarning: "Please select club."
  },

  validPassword: "Please enter valid password.",

  dashBoard: {
    welcomeText: "Welcome to YouFit Gyms!",
    selectClubLocation: "Select a club location to sign-in",
    clubLocation: "Club Location"
  },

  minor: {
    welcomeText: "Please Enter Your Minor Information",
    minorheadingName: "THANK YOU!"
  },

  header: {
    youfit: "YouFit",
    staff: "Staff",
    submitbtn: "Submit",
    signOut: "Sign out",
    oldDgrUrl: "https://u.youfit.com/Home"
  },

  logOut: {
    signOut: "Sign out",
    signOutMessage: "You have successfully signed out.",
    loginbtn: "Login"
  },

  newUser: {
    welcomeText: "Let's Get Started!",
    subHeading: "Please fill out the form below.",
    profileinfo: "Profile Information",
    continuebtn: "CONTINUE",
    goalsLabel: "How did you hear about us?",
    referredbyLabel: "Referred by",
    healthLabel: "Silver & Fit Ash Fitness ID",
    headingName: "THANK YOU!",
    headingType: "Your guest pass have been activated.",
    thankyouText: "Start enjoying your workout today!"
  },

  checkIn: {
    welcomeText: "Get Your Free Pass!",
    subHeading: "Review your personal information below to get started.",

    paidPass: {
      headingText: "Be Our Guest!",
      subheadingText: "Review your personal information below to get started."
    },

    memberGuest: {
      headingText: "Activate Your Member Guest Pass!",
      subheadingText: "Enter your personal information below to get started."
    }

  },

  thankyou: {
    homebtn: "Home",
    goBack: "Go back",
    backbtn: "Back",
    OfficialText: "It's Official!",
    guestHeadingText: "Your Plan is activated and you are now a member of YouFit Gyms.",
    guestThankyouText: "Start working out today!",
  },

  search: {
    searchWelcomeText: "Welcome to YouFit Gyms!",
    subHeaderText: "Enter your email and phone number to get started.",
    searchbtn: "SEARCH",
    foundText: "We found you!",
    foundMessage: "We found an account matching your information",
    userCardText: "This is me. Let's go!",
    userFoundText: "Not me. Let's get to know each other.",
    userNotFoundText: "Let's get to know each other.",
    oopstext: "Oops!",
    errorFoundMessage: "It seems we couldn't find the prospect or member you are looking for, please select appropriate member or prospect and try again",
    insuranceSubHeadingText: "Verify and enter your information to get started",
    notFoundText: "Oh no! We couldn't find the guest or member account you are looking for.",
    eachOtherText: "Please go back or let's get to know each other.",
    goback: "Go back",
    headingName: "Welcome to YouFit Gyms!",
    headingType: "Enter your email or phone number to get started.",
  },

  member: {
    hitext: "Hi",
    welcomeText: "We're excited you're here!",
    subHeaderText: "Are you checking in a guest, starting personal training or ready to upgrade?",
    trainingTab: "BUY TRAINING",
    workOutwinSweepTab : "WORKOUT AND WIN SWEEPS",
    checkInTab: "GUEST CHECK-IN",
    upgradeTab: "UPGRADE",
    referFriendTab: "Refer a Friend",
    amenities: "Amenities",
    manageMembershp: "Manage Membership",
    homeGymError: "Home Gym Error: Please use DataTrak to create the member's personal training agreement.",
    okbtn: "Ok",

    guestCheckIn: {
      thankyoutext: "Thanks for signing in!",
      headingtext: "Enjoy your workout!",
      // Your account has been attached. 
      guestCheckInheadingName: "Let's Check In Your Guest!",
      guestCheckInheadingType: "Enter the guest's email or phone number to get started.",
      guestCheckInfoundText: "Member Guest Check-In",
      guestCheckInfoundMessage: "We found your guest!",
      guestCheckInnotFoundText: "Oh no! We couldn't find the guest account you are looking for.",
    },

    upgradePlan: {
      thankyoutext: "Thank you for upgrading your membership.",
      // subheaderText: "We will also send you a verification email."
      subheaderText: "See front desk to complete your upgrade."
    },

    membershipplan: {
      membership: "Memberships",
      headertext: "Choose a plan.",
      morebtn: "MORE"
    },

    ptPlan: {
      headertext: "Personal Training Add-Ons",
      selectPlantext: "Choose a personal training plan.",
      subPlanText: "Add on optional personal training packages.",
      planValueText: "monthly + tax",
      sessionText: "Per Session",
      buyNowbtn: "BUY NOW",
      upgradebtn: "UPGRADE",
      dollarSign: "$",
      NMSText: "New member special is only for memberships that have not had a previous Personal Training session.",
      skipbtn: "NEXT",
      sgtPlanText: "Unlimited",
      sgtheaderText: "Small Group Training Add-On's",
      sgtSelectPlanText: "Choose a small group training plan.",
      sgtSubPlanText: "Add on optional small group training packages."
    },

    manageMembershipObj: {
      UPInfotext: "update personal information",
      UPaymentInfo: "update payment information",

      UPersonalIObj: {
        headerText: "Update Your Information",
        subheaderText: "Make your changes below."
      },

      UPaymentIObj: {
        headerText: "Update Your Payment Method",
        subheaderText: "Edit your payment information below.",
        addOnPlanText: "Add-On Plan",
        dueTodayText: "Due Today"
      }

    },

    memberCheckOut:{
      thankyouText:"Thank you for being a member of YouFit Gyms!",
      subHeaderText:"Your payment was successful."
    }
  },

  guestInitialInfo: {
    headerText: "Please confirm your information and compelte remaining to finalize purchase",
    generalInfo: "GENERAL INFORMATION",
    profileInfo: "Profile Information",
    teamMemberLabel: "Is a team member helping you?",
    paymentInfo: "PAYMENT INFORMATION",
    paymentDetails: "Choose below how you would like to complete payment details",
    paymentbtn: "Complete Payment Below"
  },

  amenities: {
    amenitiestHeadermessage: "Select an option below to continue",
    pickleball: "PICKLEBALL",
    babysitting: "BABYSITTING",
    hitext: "Hi",
    flagValidation: "There is no amenities for this club",

    pickleballObj: {
      welcomeText: "Please confirm your personal information and complete equipment option below",
      personalInformation: "PERSONAL INFORMATION",
      equipmentLabel: "What equipment do you need?",
      pickleballthankyouText: "You're In! Let's dink",
      pickleballheadingtext: "Pick up your equipment rental at the front desk or start playing!"
    },

    babysittingObj: {
      welcometext: "Select the plan you want to sign up for below",
      babysittingthankyouText: "Thanks for signing up!",
      babysittingheadingtext: "Your plan has been activated today. Enjoy your workout!",
      teamMember: "Team Member"
    },
    updatePaymentInfoObj: {
      updatePaymentInfoheadingtext : "Your payment information has been updated."
    }
  },

  guest: {
    joinnow: "JOIN NOW",
    checkIn: "CHECK-IN",
    buypass: "Buy A Pass",
    classpass: "Classpass Member",
    pickleball: "Pickleball",
    healthInsurance: "HEALTH INSURANCE",
    freepass: "FREE PASS",
    guestFortheday: "GUEST FOR THE DAY",
    premiumguest: "PREMIUM/PREMIUM+ GUEST",
    viewPlans: "MEMBERSHIPS",
    joinHeadermessage: "Select an option below to continue",
    guestHeadermessage: "Thank you for visiting YouFit Gyms. Let’s get started!",
    guestSecondHeadermessage: "Check-in below to activate your free 3 day pass.",
    healthInsuranceText: "Health Insurance",
    appointment: "APPOINTMENT / TOUR",
    openhouseText: "OPEN HOUSE",
    paidpass: "PAID PASS",
    memberguestText: "MEMBER GUEST",
    virtualTourText : "VIRTUAL TOUR",
    join: {
      subHeadermessage: "Select an option below.",
      thankyouText: "Thank you for joining Youfit Gyms!",
      paymentText: "Your payment was successful.",
      agreementNumberText: "Your member agreement number is"
    },
    appointmentTour: {
      appointmentTourheadingName: "Visit the front desk to begin your appointment or tour."
    },
    paidPass: {
      paidPassheadingName: "Please see the front desk to complete your paid pass check-in.",
      paidPassheadingType: ""
    },
    openHouse: {
      openHouseheadingName: " Welcome to our Open House!",
      openHouseheadingType: "You are officially a member for the day. Take all the classes, try all the equipment, and get to know our team and community!",
      openHouseThankyou: ""
    },
    classPassMember: {
      classPassThankyou: "You're In!",
      classPassheadingName: "Your ClassPass reservation has been verified. Enjoy your workout!"
    },
    memberGuest: {
      // memberGuestheadingName : "Member Information",
      memberGuestheadingName: "Premium Member Verification",
      memberGuestheadingType: "Enter the member's email or phone number to get started.",
      memberGuestfoundText: "We found you!",
      memberGuestfoundMessage: "We found an account matching your information.",
      memberGuestnotFoundText: "Oh no! We couldn't find the member account you are looking for.",
      memberGuestthankyouText: "Enjoy your workout!"
    },

  },
  billingInfo: {
    generalInfo: {
      validateFirstName: "First name should allow only alphanumeric characters, apostrophes('), hyphens(-), or spaces and must begin with an alpha character.",
      requiredFirstName: "Please enter first name.",
      requiredFirstNameLength: "First name will not be greater than 15 characters.",
      validateLastName: "Last name should allow only alphanumeric characters, apostrophes('), hyphens(-), or spaces and must begin with an alpha character.",
      requiredLastName: "Please enter last name.",
      requiredLastNameLength: "Last name will not be greater than 15 characters.",
      validateEmail: "Please enter valid email.",
      validPhoneNumber: "Please enter 10 digits for your phone number (i.e. 9876543210).",
      correctPhoneNumber: "Please enter correct phone number.",
      validBirthDate: "Please enter/select valid birthdate.",
      requiredBirthDate: "Please enter/select birthdate.",
      validateMinorBirthDate: "We do not allow minors to join online. Please come visit us in person.",
      selectGender: "Please select gender."
    },
    billingAddress: {
      validateAddress: "Address will allow only alphanumeric characters, spaces, forward slashes(/), or pound signs(#)",
      requiredAddress: "Please enter address",
      requiredAddressLength: "Address will not be greater than 40 characters",
      validateCity: "City name will allow only alphanumeric characters(spaces, dashes, and apostrophes are allowed to separate)",
      requiredCity: "Please enter city",
      requiredCityLength: "city name will not be greater than 24 characters",
      requiredState: "Please select state",
      validZipCode: "Please enter proper zip code",
      requiredZipCode: "Please enter zip code",
      requiredZipCodeLength: "zip code will not be greater than 5 characters"
    },
    billingPayment: {
      validateCreditCardFirstName: "Cardholder's first name should allow only alphanumeric characters, apostrophes('), hyphens(-), or spaces and must begin with an alpha character.",
      requiredCreditCardFirstName: "Please enter cardholder's first name",
      validateCreditCardLastName: "Cardholder's last name should allow only alphanumeric characters, apostrophes('), hyphens(-), or spaces and must begin with an alpha character.",
      requiredCreditCardLastName: "Please enter cardholder's last name",
      validCreditCardNumber: "Please enter valid credit card number",
      requiredCreditCardNumber: "Please enter credit card number",
      validCreditCardType: "Please enter valid credit card number, it allow only Visa, MasterCard, American Express, Discover credit card",
      selectCreditCardMonth: "Please select credit card expiration month",
      selectCreditCardYear: "Please select credit card expiration year",
      validCreditCardCVV: "Please enter valid credit card CVV",
      requiredCreditCardCVV: "Please enter credit card CVV",
      validCreditCardZipCode: "Please enter proper credit card postal code",
      requiredCreditCardZipCode: "Please enter credit card postal code",
      selectBillingMethod: "Please select billing method",
      recurringPaymentInfo: {
        bankAccountInfo: {
          requiredRecurringFirstName: "Please enter bank account holder's first name",
          requiredRecurringLastName: "Please enter bank account holder's  last name",
          selectAccountType: "Please select bank account type",
          validRoutingNumber: "Please enter valid bank account routing number",
          requiredRoutingNumber: "Please enter bank account routing number",
          requiredAccountNumber: "Please enter bank account number"
        }
      }
    },
    selectMembershipAgreement: "Please select Membership Agreement Contract Checkbox",
    selectPTAgreement: "Please select PT Agreement Contract Checkbox",
    selectTermCondition: "Please select Terms and Conditions Checkbox",
    selectAuthorization: "Please select Authorization Terms Checkbox",
    selectNotice: "Please select 30-day notice Checkbox",
    signRequired: "Please do signature.",
    initialSignRequired: "Please do initial signature.",
    memberSignUpSuccess: "Member signup successfully",
    sgtSuccess: "SGT plan buy successfully",
    ptSuccess: "PT plan buy successfully",
    plaidAccountFname: "Please link your bank details with Plaid",
    cardOnfileMessage: "Billing information has not been set in Datatrack",
  },

  checkOut: {
    headerText: "You're almost there!",
    subHeaderText: "Please confirm your personal information and complete checkout to activate your membership.",
    PIText: "PERSONAL INFORMATION",
    paymentInfoText: "PAYMENT INFORMATION",
    billingInfoText: "Billing Information",
    memberPlanText: "Member Plan",
    MPText: "Monthly Payments",
    PTPlanText: "PT Plan",
    SGTPlanText: "SGT Plan",
    PrivacyPolicy : "https://youfit.com/privacy-policy/",
    planWarningText: "Apologies, you've already purchased this plan. Kindly verify the purchase through the DataTrack application. For any assistance, contact IT Helpdesk!."
  },

  qrCheckout : {
    header : "PLEASE FILL OUT THE INFORMATION BELOW"
  }
}