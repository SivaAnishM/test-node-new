const express = require("express");
const route = express.Router();

const coodsModel = require("./coodsModel");

// route.post("/coords/postData", async (req, res) => {
//   let { email, date } = req.query;
//   const existingDocument = await coodsModel.findOne({ email: email });
//   // Initialize session number
//   let sessionNumber = 1;

//   // If the document exists, find the latest session number
//   if (existingDocument && existingDocument.Location[date]) {
//     const sessions = Object.keys(existingDocument.Location[date]);
//     sessionNumber = sessions.length;
//   }

//   let session = "session" + sessionNumber;

//   // Check if there is already a session1 and get its last coordinate's time
//   let lastSessionTime;
//   if (
//     existingDocument &&
//     existingDocument.Location[date] &&
//     existingDocument.Location[date][session]
//   ) {
//     const session1Coords = existingDocument.Location[date][session];
//     const lastCoord = session1Coords[session1Coords.length - 1];
//     lastSessionTime = new Date(lastCoord.time);
//   } else {
//     // If no session1 exists, set lastSessionTime to 0 to indicate the start of the day
//     lastSessionTime = new Date(0);
//   }

//   // Get the time of the new coordinate
//   const newCoordTime = new Date(req.body[0].coords.time);

//   // Calculate the time difference in milliseconds
//   const timeDifference = newCoordTime - lastSessionTime;

//   console.log(timeDifference);

//   // If the time difference is more than an hour (in milliseconds), increment session
//   if (timeDifference > 3600000) {
//     // Extract the session number
//     sessionNumber = sessionNumber + 1;
//     session = "session" + sessionNumber;
//   }

//   const updatedDocument = await coodsModel.findOneAndUpdate(
//     { email: email },
//     {
//       $push: {
//         [`Location.${date}.${session}`]: req.body[0].coords,
//       },
//     },
//     { new: true }
//   );
//   if (updatedDocument) {
//     console.log("data added successfully", date, updatedDocument);
//   }
//   res.status(200).send({ msg: "Data received successfullyy" });
// });

const handleLumpcoords = async (data, date, email) => {
  try {
    const bulkUpdateOps = data?.map((coord) => ({
      updateOne: {
        filter: { email: email },
        update: {
          $push: {
            [`Location.${date}`]: coord.coords,
          },
        },
      },
    }));

    const bulkResult = await coodsModel.bulkWrite(bulkUpdateOps, {
      ordered: false,
    });

    console.log("Bulk update result:", bulkResult);

    if (bulkResult.modifiedCount > 0 || bulkResult.upsertedCount > 0) {
      console.log("Data added successfully to", date);
    } else {
      console.log("No data added or modified");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

route.post("/coords/postData", async (req, res) => {
  let { email, date } = req.query;

  // const updatedDocument = await coodsModel.findOneAndUpdate(
  //   { email: email },
  //   {
  //     $push: {
  //       [`Location.${date}`]: req.body[0].coords,
  //     },
  //   },
  //   { new: true }
  // );
  // if (updatedDocument) {
  //   console.log("data added successfully", date);
  // }

  const existingDocument = await coodsModel.findOne({ email: email });

  if (existingDocument) {
    const existingLocationData = existingDocument.Location
      ? existingDocument.Location[date] || []
      : [];
    const newData = req.body; // New data to add

    // Merge existing data with new data using spread operator
    const mergedData = [...existingLocationData, ...newData];

    // Update the document with the merged data
    const updatedDocument = await coodsModel.findOneAndUpdate(
      { email: email },
      {
        $set: {
          [`Location.${date}`]: mergedData,
        },
      },
      { new: true }
    );

    if (updatedDocument) {
      console.log("Data added successfully for date:", date);
    } else {
      console.log("Failed to update document.");
    }
  } else {
    console.log("Document not found for email:", email);
  }

  res.status(200).send({ msg: "Data received successfullyy" });
});

route.get("/coords/getData", async (req, res) => {
  let { email } = req.query;
  const data = await coodsModel.findOne({ email: email });
  console.log("coords data send successfully");
  return res.status(200).send({ data: data });
});

route.post("/signup", async (req, res) => {
  let { email } = req.query;
  const existingUser = await coodsModel.findOne({ email: email });
  if (existingUser) {
    return res
      .status(200)
      .send({ status: "OK", message: "Email already exists" });
  } else {
    const body = { email: email, Location: {} };
    const data = await coodsModel.create(body);
    console.log("signup successfully");
    res.status(200).send({ status: "OK", data: data });
  }
});

route.get("/getAllData", async (req, res) => {
  const data = await coodsModel.find();
  console.log("All data send successfully");
  return res.status(200).send({ data: data });
});

module.exports = route;
