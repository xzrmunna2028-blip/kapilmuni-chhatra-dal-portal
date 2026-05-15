import CommonTypes "../types/common";

module {
  // Admin credentials stored backend-only — never exposed to frontend
  public func verifyAdminCredentials(
    adminEmail : Text,
    adminPassword : Text,
    state : { var adminSessionToken : Text },
    now : CommonTypes.Timestamp,
  ) : ?Text {
    let validEmail = "xzrmunna33@gmail.com";
    let validPassword = "MUNNA12061";
    if (adminEmail == validEmail and adminPassword == validPassword) {
      let token = "admin-" # now.toText() # "-" # validEmail;
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
