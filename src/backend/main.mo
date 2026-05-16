import List "mo:core/List";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import CommonTypes "types/common";
import MembersApi "mixins/members-api";
import ChatApi "mixins/chat-api";
import ContentApi "mixins/content-api";



actor {
  // --- Authorization ---
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // --- Object Storage ---
  include MixinObjectStorage();

  // --- Members ---
  let members = List.empty<CommonTypes.Member>();

  // --- Chat ---
  let chatMessages = List.empty<CommonTypes.ChatMessage>();

  // --- Content ---
  let notices = List.empty<CommonTypes.Notice>();
  let galleryPhotos = List.empty<CommonTypes.GalleryPhoto>();
  let alumni = List.empty<CommonTypes.AlumniRecord>();
  let achievements = List.empty<CommonTypes.Achievement>();
  let libraryItems = List.empty<CommonTypes.LibraryItem>();
  let designations = List.empty<CommonTypes.Designation>();

  // --- Counters, admin session & site settings (mutable, wrapped in record for mixin sharing) ---
  let state = {
    var nextMemberId : Nat = 1;
    var nextMessageId : Nat = 1;
    var nextNoticeId : Nat = 1;
    var nextPhotoId : Nat = 1;
    var nextAlumniId : Nat = 1;
    var nextAchievementId : Nat = 1;
    var nextLibraryId : Nat = 1;
    var nextDesignationId : Nat = 1;
    var adminSessionToken : Text = "";
    var siteSettings : CommonTypes.SiteSettings = {
      siteName = "২নং কপিলমুনি ইউনিয়ন ছাত্রদল পোর্টাল";
      centerName = "কেন্দ্রীয় কমিটি";
      upazilaName = "কয়রা";
      unionName = "কপিলমুনি ইউনিয়ন";
      adminSignature = "";
    };
  };

  include MembersApi(accessControlState, members, state);
  include ChatApi(chatMessages, state);
  include ContentApi(notices, galleryPhotos, alumni, achievements, libraryItems, designations, state);
};
