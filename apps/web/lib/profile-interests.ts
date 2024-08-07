const profileInterestsDelimiter = "|";

export const profileInterestsStringToArray = (interests?: string | null) => {
  return interests?.split(profileInterestsDelimiter) || [];
};

export const profileInterestsArrayToString = (interestsArray?: string[]) => {
  return interestsArray?.join(profileInterestsDelimiter) || "";
};
