const { verifyToken } = require("./../utils");

const authMiddleware = (req, res, next) => {

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.json({
        success: false,
        error: "Token required"
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.json({
        success: false,
        error: "Invalid token"
      });
    }

    const decoded = verifyToken(token);

    req.user = decoded;

    next();

  } catch (error) {

    console.log(error);

    return res.json({
      success: false,
      error: "Unauthorized"
    });

  }

};

module.exports = authMiddleware;