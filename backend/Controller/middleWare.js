const admin = require("firebase-admin");

const middlewareController = {
    // verifyToken
    verifyToken: async (req, res, next) => {
        const token = req.headers.authorization; // Đảm bảo token nằm trong header authorization
        if (token) {
            const accessToken = token.split(" ")[1];
            try {
                const decodedToken = await admin.auth().verifyIdToken(accessToken);
                req.user = decodedToken;
                next();
            } catch (error) {
                return res.status(403).json("Token is not valid");
            }
        } else {
            return res.status(401).json("You're not authenticated");
        }
    },

    verifyTokenAndAdminAuth: async (req, res, next) => {
      try {
          // Verify the token and set req.user
          await middlewareController.verifyToken(req, res, async () => {
              // Get the user data from Firestore based on uid from req.user
              const userDoc = await admin.firestore().collection('users').doc(req.user.uid).get();

              // Check if the user document exists
              if (!userDoc.exists) {
                  return res.status(404).json({ error: "User not found" });
              }

              const userData = userDoc.data();

              // Check if the user is either the owner of the resource or an admin
              if (req.user.uid === req.params.uid || userData.admin) {
                  return next(); // User is authorized
              } else {
                  return res.status(403).json("You're not allowed to delete others' resources");
              }
          });
      } catch (error) {
          console.error("Error verifying token or admin access:", error);
          return res.status(401).json({ error: "Unauthorized" });
      }
  },
};

module.exports = middlewareController;