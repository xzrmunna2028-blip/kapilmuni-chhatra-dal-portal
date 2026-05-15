import Storage "mo:caffeineai-object-storage/Storage";
import CommonTypes "common";

module {
  public type MemberId = CommonTypes.MemberId;
  public type Member = CommonTypes.Member;
  public type MemberStatus = CommonTypes.MemberStatus;
  public type MemberStats = CommonTypes.MemberStats;

  public type RegisterMemberPayload = {
    fullName : Text;
    phone : Text;
    email : Text;
    designation : Text;
    fullAddress : Text;
    joinReason : Text;
    photoBlob : Storage.ExternalBlob;
  };

  public type UpdateMemberPayload = {
    fullName : Text;
    phone : Text;
    email : Text;
    designation : Text;
    fullAddress : Text;
    joinReason : Text;
    photoBlob : Storage.ExternalBlob;
    adminNotes : Text;
  };
};
