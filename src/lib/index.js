export const userDetails = (user) => {
  return {
    fullName: user.fullName,
    email: user.email,
    bio: user.bio,
    profilePic: user.profilePic,
    nativeLanguage: user.nativeLanguage,
    learningLanguage: user.learningLanguage,
    location: user.location,
    isOnboarded: user.isOnboarded,
    friends: user.friends,
    id: user._id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export const filterRequest = (reqs) => {
  return reqs.map(item => (
    {
      id: item._id,
      sender: item.sender,
      recipient: {
        id: item.recipient.id,
        fullName: item.recipient.fullName,
        profilePic: item.recipient.profilePic,
        nativeLanguage: item.recipient.nativeLanguage,
        learningLanguage: item.recipient.learningLanguage
      },
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }
  ))
}
export const filterUpcoming = (reqs) => {
  return reqs.map(item => (
    {
      id: item._id,
      recipient: item.recipient,
      sender: {
        id: item.sender._id,
        fullName: item.sender.fullName,
        profilePic: item.sender.profilePic,
        nativeLanguage: item.sender.nativeLanguage,
        learningLanguage: item.sender.learningLanguage
      },
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }
  ))
}

export const filterAccepted = (reqs) => {
  return reqs.map(item => (
    {
      id: item._id,
      sender: item.sender,
      recipient: {
        id: item.recipient._id,
        fullName: item.recipient.fullName,
        profilePic: item.recipient.profilePic,
      },
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }
  ))
}