export class CommonType {
    guest: Guest = new Guest;
    member: Member = new Member;
    staffType: string = "";
    minorType : string = ""
  }

  class Guest {
    joinType: string = "";
    buyPassType: string = "";
    checkInType: string = "";
    classPassMemberType: string = "";
    pickleballguestType : string = "";
    joinNowObj!: joinNowObj;
    checkInObj!: checkInObj;  
  }
  
  class joinNowObj {
    viewPlansType: string = "";
    healthInsuranceType: string = ""; 
  }
  class checkInObj {
    freePassType: string = "";
    paidPassType: string = "";
    memberGuestType: string = "";
    openHouseType : string = "";
    appointmentTourType : string = "";
    guestpickleballType : string = "";
    buypassType : string = "";
    virtualTourType : string = "";
  }
  
  class Member {
    memberShipType: string = "";
    personalTrainingType: string = "";
    upgradeMemberShipType: string = "";
    guestCheckInType: string = "";
    referFriendType: string = "";
    amenities: string = "";
    amenitiesTypeObj!: amenitiesTypeObj;
    manageMembership : string = "";
    manageMembershipObj! : manageMembershipObj
    workOutwinSweep : string = "";
  }
  
  class manageMembershipObj {
    updatePersonalInfo: string = "";
    updatePaymentInfo: string = "";
  }

  class amenitiesTypeObj {
    babysittingType: string = "";
    pickleballType: string = "";
  }