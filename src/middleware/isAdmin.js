module.exports = async (_, res, next) => {
  try {
    const user = res.locals.user;

    if (user && user.role === "ADMIN") return next();

    return res
      .status(401)
      .json({ error: "You are not authorized as super user" });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: "You have not loggedin" });
  }
};
