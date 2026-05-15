import List "mo:core/List";
import CommonTypes "../types/common";
import ChatTypes "../types/chat";

module {
  public func send(
    messages : List.List<CommonTypes.ChatMessage>,
    state : { var nextMessageId : Nat },
    payload : ChatTypes.SendMessagePayload,
    now : CommonTypes.Timestamp,
  ) : CommonTypes.ChatMessage {
    let id = state.nextMessageId;
    state.nextMessageId += 1;
    let msg : CommonTypes.ChatMessage = {
      id;
      senderName = payload.senderName;
      senderPhotoUrl = payload.senderPhotoUrl;
      text = payload.text;
      timestamp = now;
    };
    messages.add(msg);
    msg;
  };

  public func listRecent(
    messages : List.List<CommonTypes.ChatMessage>,
    limit : Nat,
  ) : [CommonTypes.ChatMessage] {
    let total = messages.size();
    if (total == 0) return [];
    let start = if (total > limit) { total - limit } else { 0 };
    messages.sliceToArray(start, total);
  };

  public func deleteMessage(
    messages : List.List<CommonTypes.ChatMessage>,
    id : Nat,
  ) : Bool {
    let before = messages.size();
    let filtered = messages.filter(func(m) { m.id != id });
    messages.clear();
    messages.append(filtered);
    messages.size() < before;
  };
};
