import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type MemberId = Nat;
  public type Timestamp = Int;

  public type MemberStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type Designation = {
    id : Nat;
    title : Text;
    rank : Nat; // lower rank = higher in hierarchy
  };

  public type Member = {
    id : MemberId;
    fullName : Text;
    phone : Text;
    email : Text;
    designation : Text;
    rank : Nat; // lower rank = higher in hierarchy (0 = top)
    fullAddress : Text;
    joinReason : Text;
    photoBlob : Storage.ExternalBlob;
    status : MemberStatus;
    rejectionReason : Text;
    adminNotes : Text;
    adminSignature : ?Text;
    registeredAt : Timestamp;
    approvedAt : ?Timestamp;
  };

  public type SiteSettings = {
    siteName : Text;
    centerName : Text;
    upazilaName : Text;
    unionName : Text;
    adminSignature : Text;
  };

  public type ChatMessage = {
    id : Nat;
    senderName : Text;
    senderPhotoUrl : Text;
    text : Text;
    timestamp : Timestamp;
  };

  public type Notice = {
    id : Nat;
    title : Text;
    content : Text;
    author : Text;
    date : Timestamp;
    archived : Bool;
  };

  public type GalleryPhoto = {
    id : Nat;
    photoBlob : Storage.ExternalBlob;
    caption : Text;
    uploadedDate : Timestamp;
    uploaderName : Text;
  };

  public type AlumniRecord = {
    id : Nat;
    name : Text;
    designation : Text;
    yearsActive : Text;
    currentStatus : Text;
    photoBlob : ?Storage.ExternalBlob;
  };

  public type Achievement = {
    id : Nat;
    memberName : Text;
    title : Text;
    description : Text;
    date : Timestamp;
    photoBlob : ?Storage.ExternalBlob;
  };

  public type LibraryItem = {
    id : Nat;
    title : Text;
    description : Text;
    fileBlob : Storage.ExternalBlob;
    category : Text;
    uploadedDate : Timestamp;
  };

  public type MemberStats = {
    total : Nat;
    joinedToday : Nat;
    joinedYesterday : Nat;
    pendingCount : Nat;
  };

  public type AdminSession = {
    token : Text;
    createdAt : Timestamp;
  };
};
