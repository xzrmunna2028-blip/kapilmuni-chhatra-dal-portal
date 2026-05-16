import CommonTypes "../types/common";

module {
  // Admin credentials stored backend-only — never exposed to frontend
  public func verifyAdminCredentials(
    adminPassword : Text,
    state : { var adminSessionToken : Text },
    now : CommonTypes.Timestamp,
  ) : ?Text {
    let validPassword = "MUNNA12061";
    if (adminPassword == validPassword) {
      let token = "admin-" # now.toText() # "-secured";
      state.adminSessionToken := token;
      ?token;
    } else {
      null;
    };
  };

  public func validateSession(
    token : Text,
    state : { var adminSessionToken : Text },
  ) : Bool {
    token != "" and token == state.adminSessionToken;
  };
};
