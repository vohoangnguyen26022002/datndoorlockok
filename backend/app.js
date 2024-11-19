const express = require('express');
const authRoutes = require('./routes/auth');
const userRoutes = require("./routes/admin");
const cors = require('cors');
const cron = require('node-cron');
const admin = require("firebase-admin");
const { deleteUserCronjob } = require('./Controller/auth');
const db = admin.firestore();

const app = express();
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cron job to delete users where can_open is still false after 1 minute of creation
// cron.schedule('* * * * *', async () => {
//   try {
//     const now = new Date();
//     const oneMinuteAgo = new Date(now.getTime() - 1 * 60 * 1000);

//     const usersToDelete = await db.collection('users')
//       .where('can_open', '==', false)
//       .where('createdAt', '<=', oneMinuteAgo.toISOString())
//       .get();
//     usersToDelete.forEach(async (userDoc) => {
//       const userId = userDoc.id;
//       try {
//         await admin.auth().deleteUser(userId);
//         await db.collection('users').doc(userId).delete();
//         console.log(`Deleted user with UID: ${userId} due to inactivity`);
//       } catch (error) {
//         console.error(`Failed to delete user with UID: ${userId}`, error);
//       }
//     });
//   } catch (error) {
//     console.error("Error running deletion cron job:", error);
//   }
// });

app.use('/auth', authRoutes);
app.use("/users", userRoutes);


// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server running on port 8000");
});
