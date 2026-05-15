import List "mo:core/List";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import Storage "mo:caffeineai-object-storage/Storage";
import CommonTypes "../types/common";
import MemberTypes "../types/members";
import MembersLib "../lib/members";
import AdminLib "../lib/admin";

mixin (
  accessControlState : AccessControl.AccessControlState,
  members : List.List<CommonTypes.Member>,
  state : {
    var nextMemberId : Nat;
    var adminSessionToken : Text;
  },
) {
  /// Public: anyone can register as a member
  public shared func registerMember(payload : MemberTypes.RegisterMemberPayload) : async CommonTypes.MemberId {
    let member = MembersLib.register(members, state, payload);
    member.id;
  };

  /// Authenticated members can view their own profile
  public query ({ caller }) func getMyMemberProfile() : async ?CommonTypes.Member {
    members.find(func(m) { m.email == caller.toText() });
  };

  /// Admin: list all members
  public query func listMembers() : async [CommonTypes.Member] {
    MembersLib.listAll(members);
  };

  /// Admin: list members by status
  public query func listMembersByStatus(status : CommonTypes.MemberStatus) : async [CommonTypes.Member] {
    MembersLib.listByStatus(members, status);
  };

  /// Admin: get member by id
  public query func getMember(id : CommonTypes.MemberId) : async ?CommonTypes.Member {
    MembersLib.getById(members, id);
  };

  /// Admin: approve a pending member
  public shared func approveMember(id : CommonTypes.MemberId) : async Bool {
    MembersLib.approve(members, id, Time.now());
  };

  /// Admin: reject a pending member with a reason
  public shared func rejectMember(id : CommonTypes.MemberId, reason : Text) : async Bool {
    MembersLib.reject(members, id, reason);
  };

  /// Admin: update member details
  public shared func updateMember(id : CommonTypes.MemberId, payload : MemberTypes.UpdateMemberPayload) : async Bool {
    MembersLib.update(members, id, payload);
  };

  /// Admin: delete a member
  public shared func deleteMember(id : CommonTypes.MemberId) : async Bool {
    MembersLib.delete(members, id);
  };

  /// Public: get member stats
  public query func getMemberStats() : async CommonTypes.MemberStats {
    MembersLib.getStats(members, Time.now());
  };

  /// Admin: authenticate with email/password — returns session token
  public shared func adminLogin(email : Text, password : Text) : async ?Text {
    AdminLib.verifyAdminCredentials(email, password, state, Time.now());
  };

  /// Admin: validate session token
  public query func validateAdminSession(token : Text) : async Bool {
    AdminLib.validateSession(token, state);
  };
};
