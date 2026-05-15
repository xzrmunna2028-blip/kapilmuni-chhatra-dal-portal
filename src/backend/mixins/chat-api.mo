import List "mo:core/List";
import CommonTypes "../types/common";
import ChatTypes "../types/chat";
import ChatLib "../lib/chat";
import Time "mo:core/Time";

mixin (
  messages : List.List<CommonTypes.ChatMessage>,
  state : { var nextMessageId : Nat },
) {
  /// Any registered member can send a chat message (polling-based)
  public shared func sendChatMessage(payload : ChatTypes.SendMessagePayload) : async CommonTypes.ChatMessage {
    ChatLib.send(messages, state, payload, Time.now())
  };

  /// Poll: fetch the most recent N messages (default 50)
  public query func getChatMessages(limit : Nat) : async [CommonTypes.ChatMessage] {
    let effectiveLimit = if (limit == 0) { 100 } else { limit };
    ChatLib.listRecent(messages, effectiveLimit)
  };

  /// Admin: delete a message by id
  public shared func deleteChatMessage(id : Nat) : async Bool {
    ChatLib.deleteMessage(messages, id)
  };
};
