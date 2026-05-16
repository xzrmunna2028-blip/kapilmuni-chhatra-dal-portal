import List "mo:core/List";
import Storage "mo:caffeineai-object-storage/Storage";
import CommonTypes "../types/common";
import ContentTypes "../types/content";
import ContentLib "../lib/content";
import Time "mo:core/Time";

mixin (
  notices : List.List<CommonTypes.Notice>,
  galleryPhotos : List.List<CommonTypes.GalleryPhoto>,
  alumni : List.List<CommonTypes.AlumniRecord>,
  achievements : List.List<CommonTypes.Achievement>,
  libraryItems : List.List<CommonTypes.LibraryItem>,
  designations : List.List<CommonTypes.Designation>,
  state : {
    var nextNoticeId : Nat;
    var nextPhotoId : Nat;
    var nextAlumniId : Nat;
    var nextAchievementId : Nat;
    var nextLibraryId : Nat;
    var nextDesignationId : Nat;
    var siteSettings : CommonTypes.SiteSettings;
  },
) {
  // --- Notices ---
  public query func listNotices(includeArchived : Bool) : async [CommonTypes.Notice] {
    ContentLib.listNotices(notices, includeArchived)
  };

  public shared func createNotice(payload : ContentTypes.CreateNoticePayload) : async CommonTypes.Notice {
    ContentLib.createNotice(notices, state, payload, Time.now())
  };

  public shared func archiveNotice(id : Nat) : async Bool {
    ContentLib.archiveNotice(notices, id)
  };

  public shared func deleteNotice(id : Nat) : async Bool {
    ContentLib.deleteNotice(notices, id)
  };

  // --- Gallery ---
  public query func listGalleryPhotos() : async [CommonTypes.GalleryPhoto] {
    ContentLib.listGalleryPhotos(galleryPhotos)
  };

  public shared func addGalleryPhoto(payload : ContentTypes.CreateGalleryPhotoPayload) : async CommonTypes.GalleryPhoto {
    ContentLib.addGalleryPhoto(galleryPhotos, state, payload, Time.now())
  };

  public shared func deleteGalleryPhoto(id : Nat) : async Bool {
    ContentLib.deleteGalleryPhoto(galleryPhotos, id)
  };

  // --- Alumni ---
  public query func listAlumni() : async [CommonTypes.AlumniRecord] {
    ContentLib.listAlumni(alumni)
  };

  public shared func addAlumni(payload : ContentTypes.CreateAlumniPayload) : async CommonTypes.AlumniRecord {
    ContentLib.addAlumni(alumni, state, payload)
  };

  public shared func deleteAlumni(id : Nat) : async Bool {
    ContentLib.deleteAlumni(alumni, id)
  };

  // --- Achievements ---
  public query func listAchievements() : async [CommonTypes.Achievement] {
    ContentLib.listAchievements(achievements)
  };

  public shared func addAchievement(payload : ContentTypes.CreateAchievementPayload) : async CommonTypes.Achievement {
    ContentLib.addAchievement(achievements, state, payload, Time.now())
  };

  public shared func deleteAchievement(id : Nat) : async Bool {
    ContentLib.deleteAchievement(achievements, id)
  };

  // --- Library ---
  public query func listLibraryItems() : async [CommonTypes.LibraryItem] {
    ContentLib.listLibraryItems(libraryItems)
  };

  public shared func addLibraryItem(payload : ContentTypes.CreateLibraryItemPayload) : async CommonTypes.LibraryItem {
    ContentLib.addLibraryItem(libraryItems, state, payload, Time.now())
  };

  public shared func deleteLibraryItem(id : Nat) : async Bool {
    ContentLib.deleteLibraryItem(libraryItems, id)
  };

  // --- Site Settings ---
  public query func getSiteSettings() : async CommonTypes.SiteSettings {
    ContentLib.getSiteSettings(state)
  };

  public shared func updateSiteSettings(newSettings : CommonTypes.SiteSettings) : async () {
    ContentLib.updateSiteSettings(state, newSettings)
  };

  // --- Designations ---
  public query func listDesignations() : async [CommonTypes.Designation] {
    ContentLib.listDesignations(designations)
  };

  public shared func addDesignation(title : Text, rank : Nat) : async CommonTypes.Designation {
    ContentLib.addDesignation(designations, state, title, rank)
  };

  public shared func deleteDesignation(id : Nat) : async Bool {
    ContentLib.deleteDesignation(designations, id)
  };
};
