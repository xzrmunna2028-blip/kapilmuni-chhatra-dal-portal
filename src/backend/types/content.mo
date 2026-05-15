import Storage "mo:caffeineai-object-storage/Storage";
import CommonTypes "common";

module {
  public type Notice = CommonTypes.Notice;
  public type GalleryPhoto = CommonTypes.GalleryPhoto;
  public type AlumniRecord = CommonTypes.AlumniRecord;
  public type Achievement = CommonTypes.Achievement;
  public type LibraryItem = CommonTypes.LibraryItem;
  public type Designation = CommonTypes.Designation;

  public type CreateNoticePayload = {
    title : Text;
    content : Text;
    author : Text;
  };

  public type CreateGalleryPhotoPayload = {
    photoBlob : Storage.ExternalBlob;
    caption : Text;
    uploaderName : Text;
  };

  public type CreateAlumniPayload = {
    name : Text;
    designation : Text;
    yearsActive : Text;
    currentStatus : Text;
    photoBlob : ?Storage.ExternalBlob;
  };

  public type CreateAchievementPayload = {
    memberName : Text;
    title : Text;
    description : Text;
    photoBlob : ?Storage.ExternalBlob;
  };

  public type CreateLibraryItemPayload = {
    title : Text;
    description : Text;
    fileBlob : Storage.ExternalBlob;
    category : Text;
  };
};
