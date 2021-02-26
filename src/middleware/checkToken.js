const jwt = require("jsonwebtoken");
const prisma = require("../prisma");
const { JWT_SECRET } = require("../config");
module.exports = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization &&
      req.headers.authorization.split("Bearer ")[1];
    if (!token)
      return res
        .status(401)
        .json({ error: "You have to loggedin to access this page" });

    const { userId } = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    res.locals.user = user;
    return next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: "You have not loggedin" });
  }
};
