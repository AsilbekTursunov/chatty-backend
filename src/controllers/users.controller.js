import { filterAccepted, filterRequest, filterUpcoming } from "../lib/index.js";
import FriendRequest from "../model/FriendRequest.js";
import User from "../model/User.js";

export const getRecommendedUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;
    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, // Exclude current user
        { isOnboarded: true }, // Only include onboarded users
        { _id: { $nin: currentUser.friends } } // Exclude users who are already friends
      ]
    });
    const recommendedUserDetails = recommendedUsers.map(user => ({
      id: user._id,
      fullName: user.fullName,
      profilePic: user.profilePic,
      nativeLanguage: user.nativeLanguage,
      learningLanguage: user.learningLanguage,
      location: user.location
    }));
    res.status(200).json(recommendedUserDetails);
  } catch (error) {
    console.error("Error fetching recommended users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const getMyFriends = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('friends').populate("friends", "fullName profilePic nativeLanguage learningLanguage location");
    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const sendFriendRequest = async (req, res) => {
  try {
    const { id: recipientId } = req.params;
    const currentUserId = req.user._id;
    console.log('recipientId', recipientId);
    console.log('currentUserId', currentUserId);


    if (recipientId == currentUserId) {
      return res.status(400).json({ message: "You cannot send a friend request to yourself." });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }
    // check if user is already friends
    if (recipient.friends.includes(currentUserId)) {
      return res.status(400).json({ message: "You are already friends with this user" });
    }

    // check if a req already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: currentUserId, recipient: recipientId },
        { sender: recipientId, recipient: currentUserId },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "A friend request already exists between you and this user" });
    }

    // Create a new friend request
    const friendRequest = await FriendRequest.create({
      sender: currentUserId,
      recipient: recipientId
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const acceptFriendRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params;
    const userId = req.user._id;
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }
    if (friendRequest.recipient.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not authorized to accept this request" });
    }
    // add each user to the other's friends array
    // $addToSet: adds elements to an array only if they do not already exist.
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    friendRequest.status = "accepted";
    await friendRequest.save();
    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const getFriendRequests = async (req, res) => {
  try {
    const upcomingFriendRequests = await FriendRequest.find({
      recipient: req.user._id,
      status: "pending"
    }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

    const acceptedFriendRequests = await FriendRequest.find({
      sender: req.user._id,
      status: "accepted"
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({
      upcomingFriendRequests: filterUpcoming(upcomingFriendRequests),
      acceptedFriendRequests: filterAccepted(acceptedFriendRequests)
    });
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const getOngoingFriendRequest = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const ongoingRequest = await FriendRequest.find({ sender: currentUserId, status: "pending" }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    if (!ongoingRequest) {
      return res.status(404).json({ message: "No ongoing friend request found" });
    }

    res.status(200).json(filterRequest(ongoingRequest));
  } catch (error) {
    console.error("Error fetching ongoing friend request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}