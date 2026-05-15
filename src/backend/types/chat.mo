import CommonTypes "common";

module {
  public type ChatMessage = CommonTypes.ChatMessage;

  public type SendMessagePayload = {
    senderName : Text;
    senderPhotoUrl : Text;
    text : Text;
  };
};
