// ./controllers/mission.js
import Mission from "../models/mission.js";
import User from "../models/user.js";
import isEmpty from "../utils/isEmpty.js";

const createMission = async (req, res) => {
  let { title, detail, amount, dateDue, location, repeat, priority, link } =
    req.body;

  const userId = req._id;

  if (isEmpty(title) || title.length > 47) {
    return res.status(400).json({
      msg: "Title is required and should contain less than 48 characters",
    });
  }

  if (!isEmpty(detail) && detail.length > 108) {
    return res.status(400).json({
      msg: "Detail should contain less than 109 characters",
    });
  }

  let parsedAmount = parseFloat(amount);
  if (
    isEmpty(amount) ||
    isNaN(parsedAmount) ||
    parsedAmount > 5 ||
    parsedAmount < 0
  ) {
    return res.status(400).json({ msg: "The amount is invalid" });
  }
  amount = parsedAmount;

  if (typeof location !== "object") {
    try {
      location = JSON.parse(location);
    } catch (e) {}
  }

  if (
    isEmpty(location) ||
    isEmpty(location.name) ||
    isEmpty(location.type) ||
    location.type !== "Point" ||
    isEmpty(location.coordinates) ||
    location.coordinates.length !== 2
  ) {
    return res.status(400).json({ msg: "The location is not valid" });
  }

  let parsedPriority = parseInt(priority);
  if (
    isEmpty(priority) ||
    isNaN(parsedPriority) ||
    parsedPriority < 0 ||
    parsedPriority > 2
  ) {
    return res.status(400).json({
      msg: "The priority should be one of three options (0: low, 1: medium, 2: high)",
    });
  }

  if (isEmpty(dateDue)) {
    return res.status(400).json({
      msg: "The date or time is invalid",
    });
  }
  dateDue = new Date(dateDue);
  if (isNaN(dateDue.getTime()) || dateDue <= new Date()) {
    return res.status(400).json({
      msg: "The date or time is invalid",
    });
  }

  const mission = new Mission({
    user: userId,
    title,
    detail,
    amount,
    dateDue,
    location,
    repeat,
    priority: parsedPriority,
    link,
    dateCreated: new Date(),
    dateUpdated: new Date(),
    completed: false,
    success: false,
  });

  mission
    .save()
    .then((added) => {
      return res.status(200).json({ mission: added });
    })
    .catch((err) => {
      return res.status(400).json({ msg: err });
    });
};

const getMissions = async (req, res) => {
  const userId = req._id;
  Mission.find({ user: userId })
    .then((missions) => {
      if (isEmpty(missions)) {
        return res.status(404).json({ msg: "There are no missions", missions: [] });
      }
      return res.status(200).json({ missions });
    })
    .catch((err) => {
      return res.status(400).json({ msg: err });
    });
};

const editMission = async (req, res) => {
  const { id } = req.params;
  const { title, detail, link, priority } = req.body;

  if (!isEmpty(title) && title.length > 47) {
    return res
      .status(400)
      .json({ msg: "Title should contain less than 48 characters" });
  }
  if (!isEmpty(detail) && detail.length > 108) {
    return res
      .status(400)
      .json({ msg: "Detail should contain less than 109 characters" });
  }
  let parsedPriority = parseInt(priority);
  if (
    !isEmpty(priority) &&
    (isNaN(parsedPriority) || parsedPriority < 0 || parsedPriority > 2)
  ) {
    return res.status(400).json({
      msg: "The priority should be one of three options (0: low, 1: medium, 2: high)",
    });
  }

  Mission.findOne({ _id: id })
    .then((missionToUpdate) => {
      if (missionToUpdate.user.toString() !== req._id) {
        return res.status(400).json({ msg: "Access Denied" });
      }
      missionToUpdate.title = !isEmpty(title) ? title : missionToUpdate.title;
      missionToUpdate.detail = !isEmpty(detail) ? detail : missionToUpdate.detail;
      missionToUpdate.link = !isEmpty(link) ? link : missionToUpdate.link;
      missionToUpdate.priority = !isEmpty(priority) ? parsedPriority : missionToUpdate.priority;
      missionToUpdate.dateUpdated = new Date();

      missionToUpdate
        .save()
        .then((updatedMission) => {
          return res.status(200).json({ mission: updatedMission });
        })
        .catch((err) => {
          return res.status(400).json({
            msg: err,
          });
        });
    })
    .catch((err) => {
      return res.status(400).json({
        msg: err,
      });
    });
};

const deleteMission = async (req, res) => {
  const { id } = req.params;

  Mission.findById(id)
    .then((missionToDelete) => {
      if (isEmpty(missionToDelete)) {
        return res.status(404).json({
          msg: "No mission found",
        });
      }
      if (missionToDelete.user.toString() !== req._id) {
        return res.status(400).json({ msg: "Access Denied" });
      }

      missionToDelete
        .deleteOne()
        .then(() => {
          return res.status(200).json({
            mission: missionToDelete,
            msg: "Deleted successfully",
          });
        })
        .catch((err) => {
          return res.status(400).json({
            msg: err,
          });
        });
    })
    .catch((err) => {
      return res.status(400).json({
        msg: err,
      });
    });
};

const checkMissions = async (req, res) => {
  console.log("checkMissions function called");
  try {
    const { coordinates } = req.body;
    const userId = req._id;
    const currentDate = new Date();

    console.log(`Checking missions for user: ${userId}`);
    console.log(`Current coordinates: ${JSON.stringify(coordinates)}`);
    console.log(`Current date: ${currentDate}`);

    // Find nearby missions that are due within the next 30 minutes
    console.log("Searching for nearby missions...");
    const nearbyMissions = await Mission.find({
      user: userId,
      completed: false,
      dateDue: { $gte: currentDate, $lte: new Date(currentDate.getTime() + 30 * 60000) },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: coordinates,
          },
          $maxDistance: 500, // 500 meters radius
        },
      },
    });

    console.log(`Found ${nearbyMissions.length} nearby missions`);
    console.log("Nearby missions:", JSON.stringify(nearbyMissions, null, 2));

    let pointsEarned = 0;
    for (let mission of nearbyMissions) {
      console.log(`Processing mission: ${mission._id}`);
      mission.completed = true;
      mission.success = true;
      pointsEarned += 1;
      await mission.save();
      console.log(`Mission ${mission._id} marked as completed and successful`);
    }

    console.log(`Total points earned: ${pointsEarned}`);

    // Mark overdue missions as failed
    console.log("Marking overdue missions as failed...");
    const overdueResult = await Mission.updateMany(
      { user: userId, completed: false, dateDue: { $lt: currentDate } },
      { completed: true, success: false }
    );
    console.log(`Marked ${overdueResult.nModified} overdue missions as failed`);

    console.log("checkMissions completed successfully");
    res.status(200).json({ 
      msg: `Completed ${nearbyMissions.length} missions successfully.`,
      pointsEarned
    });
  } catch (error) {
    console.error("Error in checkMissions:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ msg: "An error occurred while checking missions." });
  }
};


export {
  createMission,
  getMissions,
  editMission,
  deleteMission,
  checkMissions,
};
