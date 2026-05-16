import List "mo:core/List";
import Nat "mo:core/Nat";
import CommonTypes "../types/common";
import ContentTypes "../types/content";

module {
  // --- Notices ---
  public func createNotice(
    notices : List.List<CommonTypes.Notice>,
    state : { var nextNoticeId : Nat },
    payload : ContentTypes.CreateNoticePayload,
    now : CommonTypes.Timestamp,
  ) : CommonTypes.Notice {
    let id = state.nextNoticeId;
    state.nextNoticeId += 1;
    let notice : CommonTypes.Notice = {
      id;
      title = payload.title;
      content = payload.content;
      author = payload.author;
      date = now;
      archived = false;
    };
    notices.add(notice);
    notice;
  };

  public func listNotices(
    notices : List.List<CommonTypes.Notice>,
    includeArchived : Bool,
  ) : [CommonTypes.Notice] {
    if (includeArchived) {
      notices.toArray();
    } else {
      notices.filter(func(n) { not n.archived }).toArray();
    };
  };

  public func archiveNotice(
    notices : List.List<CommonTypes.Notice>,
    id : Nat,
  ) : Bool {
    var found = false;
    notices.mapInPlace(
      func(n) {
        if (n.id == id) {
          found := true;
          { n with archived = true };
        } else { n };
      }
    );
    found;
  };

  public func deleteNotice(
    notices : List.List<CommonTypes.Notice>,
    id : Nat,
  ) : Bool {
    let before = notices.size();
    let filtered = notices.filter(func(n) { n.id != id });
    notices.clear();
    notices.append(filtered);
    notices.size() < before;
  };

  // --- Gallery ---
  public func addGalleryPhoto(
    photos : List.List<CommonTypes.GalleryPhoto>,
    state : { var nextPhotoId : Nat },
    payload : ContentTypes.CreateGalleryPhotoPayload,
    now : CommonTypes.Timestamp,
  ) : CommonTypes.GalleryPhoto {
    let id = state.nextPhotoId;
    state.nextPhotoId += 1;
    let photo : CommonTypes.GalleryPhoto = {
      id;
      photoBlob = payload.photoBlob;
      caption = payload.caption;
      uploadedDate = now;
      uploaderName = payload.uploaderName;
    };
    photos.add(photo);
    photo;
  };

  public func listGalleryPhotos(
    photos : List.List<CommonTypes.GalleryPhoto>,
  ) : [CommonTypes.GalleryPhoto] {
    photos.toArray();
  };

  public func deleteGalleryPhoto(
    photos : List.List<CommonTypes.GalleryPhoto>,
    id : Nat,
  ) : Bool {
    let before = photos.size();
    let filtered = photos.filter(func(p) { p.id != id });
    photos.clear();
    photos.append(filtered);
    photos.size() < before;
  };

  // --- Alumni ---
  public func addAlumni(
    alumni : List.List<CommonTypes.AlumniRecord>,
    state : { var nextAlumniId : Nat },
    payload : ContentTypes.CreateAlumniPayload,
  ) : CommonTypes.AlumniRecord {
    let id = state.nextAlumniId;
    state.nextAlumniId += 1;
    let record : CommonTypes.AlumniRecord = {
      id;
      name = payload.name;
      designation = payload.designation;
      yearsActive = payload.yearsActive;
      currentStatus = payload.currentStatus;
      photoBlob = payload.photoBlob;
    };
    alumni.add(record);
    record;
  };

  public func listAlumni(
    alumni : List.List<CommonTypes.AlumniRecord>,
  ) : [CommonTypes.AlumniRecord] {
    alumni.toArray();
  };

  public func deleteAlumni(
    alumni : List.List<CommonTypes.AlumniRecord>,
    id : Nat,
  ) : Bool {
    let before = alumni.size();
    let filtered = alumni.filter(func(a) { a.id != id });
    alumni.clear();
    alumni.append(filtered);
    alumni.size() < before;
  };

  // --- Achievements ---
  public func addAchievement(
    achievements : List.List<CommonTypes.Achievement>,
    state : { var nextAchievementId : Nat },
    payload : ContentTypes.CreateAchievementPayload,
    now : CommonTypes.Timestamp,
  ) : CommonTypes.Achievement {
    let id = state.nextAchievementId;
    state.nextAchievementId += 1;
    let achievement : CommonTypes.Achievement = {
      id;
      memberName = payload.memberName;
      title = payload.title;
      description = payload.description;
      date = now;
      photoBlob = payload.photoBlob;
    };
    achievements.add(achievement);
    achievement;
  };

  public func listAchievements(
    achievements : List.List<CommonTypes.Achievement>,
  ) : [CommonTypes.Achievement] {
    achievements.toArray();
  };

  public func deleteAchievement(
    achievements : List.List<CommonTypes.Achievement>,
    id : Nat,
  ) : Bool {
    let before = achievements.size();
    let filtered = achievements.filter(func(a) { a.id != id });
    achievements.clear();
    achievements.append(filtered);
    achievements.size() < before;
  };

  // --- Library ---
  public func addLibraryItem(
    items : List.List<CommonTypes.LibraryItem>,
    state : { var nextLibraryId : Nat },
    payload : ContentTypes.CreateLibraryItemPayload,
    now : CommonTypes.Timestamp,
  ) : CommonTypes.LibraryItem {
    let id = state.nextLibraryId;
    state.nextLibraryId += 1;
    let item : CommonTypes.LibraryItem = {
      id;
      title = payload.title;
      description = payload.description;
      fileBlob = payload.fileBlob;
      category = payload.category;
      uploadedDate = now;
    };
    items.add(item);
    item;
  };

  public func listLibraryItems(
    items : List.List<CommonTypes.LibraryItem>,
  ) : [CommonTypes.LibraryItem] {
    items.toArray();
  };

  public func deleteLibraryItem(
    items : List.List<CommonTypes.LibraryItem>,
    id : Nat,
  ) : Bool {
    let before = items.size();
    let filtered = items.filter(func(i) { i.id != id });
    items.clear();
    items.append(filtered);
    items.size() < before;
  };

  // --- Site Settings ---
  public func getSiteSettings(
    settings : { var siteSettings : CommonTypes.SiteSettings },
  ) : CommonTypes.SiteSettings {
    settings.siteSettings;
  };

  public func updateSiteSettings(
    settings : { var siteSettings : CommonTypes.SiteSettings },
    newSettings : CommonTypes.SiteSettings,
  ) {
    settings.siteSettings := newSettings;
  };

  // --- Designations ---
  public func addDesignation(
    designations : List.List<CommonTypes.Designation>,
    state : { var nextDesignationId : Nat },
    title : Text,
    rank : Nat,
  ) : CommonTypes.Designation {
    let id = state.nextDesignationId;
    state.nextDesignationId += 1;
    let designation : CommonTypes.Designation = { id; title; rank };
    designations.add(designation);
    designation;
  };

  public func listDesignations(
    designations : List.List<CommonTypes.Designation>,
  ) : [CommonTypes.Designation] {
    designations.sort(func(a, b) { Nat.compare(a.rank, b.rank) }).toArray();
  };

  public func deleteDesignation(
    designations : List.List<CommonTypes.Designation>,
    id : Nat,
  ) : Bool {
    let before = designations.size();
    let filtered = designations.filter(func(d) { d.id != id });
    designations.clear();
    designations.append(filtered);
    designations.size() < before;
  };
};
