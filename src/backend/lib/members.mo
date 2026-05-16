import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/members";
import CommonTypes "../types/common";

module {
  public func register(
    members : List.List<CommonTypes.Member>,
    state : { var nextMemberId : Nat },
    payload : Types.RegisterMemberPayload,
  ) : CommonTypes.Member {
    let id = state.nextMemberId;
    state.nextMemberId += 1;
    let member : CommonTypes.Member = {
      id;
      fullName = payload.fullName;
      phone = payload.phone;
      email = payload.email;
      designation = payload.designation;
      rank = 999;
      fullAddress = payload.fullAddress;
      joinReason = payload.joinReason;
      photoBlob = payload.photoBlob;
      status = #pending;
      rejectionReason = "";
      adminNotes = "";
      adminSignature = null;
      registeredAt = Time.now();
      approvedAt = null;
    };
    members.add(member);
    member;
  };

  public func getById(
    members : List.List<CommonTypes.Member>,
    id : CommonTypes.MemberId,
  ) : ?CommonTypes.Member {
    members.find(func(m) { m.id == id });
  };

  public func listAll(
    members : List.List<CommonTypes.Member>,
  ) : [CommonTypes.Member] {
    members.toArray();
  };

  public func listByStatus(
    members : List.List<CommonTypes.Member>,
    status : CommonTypes.MemberStatus,
  ) : [CommonTypes.Member] {
    members.filter(func(m) { m.status == status }).toArray();
  };

  public func approve(
    members : List.List<CommonTypes.Member>,
    id : CommonTypes.MemberId,
    now : CommonTypes.Timestamp,
    adminSignature : ?Text,
  ) : Bool {
    var found = false;
    members.mapInPlace(
      func(m) {
        if (m.id == id) {
          found := true;
          { m with status = #approved; approvedAt = ?now; adminSignature };
        } else { m };
      }
    );
    found;
  };

  public func reject(
    members : List.List<CommonTypes.Member>,
    id : CommonTypes.MemberId,
    reason : Text,
  ) : Bool {
    var found = false;
    members.mapInPlace(
      func(m) {
        if (m.id == id) {
          found := true;
          { m with status = #rejected; rejectionReason = reason };
        } else { m };
      }
    );
    found;
  };

  public func update(
    members : List.List<CommonTypes.Member>,
    id : CommonTypes.MemberId,
    payload : Types.UpdateMemberPayload,
  ) : Bool {
    var found = false;
    members.mapInPlace(
      func(m) {
        if (m.id == id) {
          found := true;
          {
            m with
            fullName = payload.fullName;
            phone = payload.phone;
            email = payload.email;
            designation = payload.designation;
            fullAddress = payload.fullAddress;
            joinReason = payload.joinReason;
            photoBlob = payload.photoBlob;
            adminNotes = payload.adminNotes;
          };
        } else { m };
      }
    );
    found;
  };

  public func delete(
    members : List.List<CommonTypes.Member>,
    id : CommonTypes.MemberId,
  ) : Bool {
    let before = members.size();
    let filtered = members.filter(func(m) { m.id != id });
    members.clear();
    members.append(filtered);
    members.size() < before;
  };

  public func updateDesignation(
    members : List.List<CommonTypes.Member>,
    id : CommonTypes.MemberId,
    newDesignation : Text,
    newRank : Nat,
  ) : Bool {
    var found = false;
    members.mapInPlace(
      func(m) {
        if (m.id == id) {
          found := true;
          { m with designation = newDesignation; rank = newRank };
        } else { m };
      }
    );
    found;
  };

  public func getStats(
    members : List.List<CommonTypes.Member>,
    now : CommonTypes.Timestamp,
  ) : CommonTypes.MemberStats {
    let nanosPerDay : Int = 86_400_000_000_000;
    let todayStart = now - (now % nanosPerDay);
    let yesterdayStart = todayStart - nanosPerDay;
    var total = 0;
    var joinedToday = 0;
    var joinedYesterday = 0;
    var pendingCount = 0;
    members.forEach(func(m) {
      total += 1;
      if (m.registeredAt >= todayStart) {
        joinedToday += 1;
      } else if (m.registeredAt >= yesterdayStart) {
        joinedYesterday += 1;
      };
      if (m.status == #pending) { pendingCount += 1 };
    });
    { total; joinedToday; joinedYesterday; pendingCount };
  };
};
