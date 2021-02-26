module.exports =  async (_, res, next) => {
  try {
    const user = res.locals.user;

    if (!user) return res.status(401).json({ error: "You have not loggedin" });

    return next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: "You have not loggedin" });
  }
};
