const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const checkToken = require("../middleware/checkToken");
const { JWT_SECRET } = require("../config");

router.post("/register", async (req, res) => {
  const prisma = req.prisma;
  let { name, email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      return res
        .status(400)
        .json({ error: "Email address already registered" });
    }

    password = await bcrypt.hash(password, 6);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    return res.status(201).json({
      message: `You have registered successfully with email ${newUser.email}`,
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  const prisma = req.prisma;
  let { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res
        .status(401)
        .json({ error: "Email address or password are incorrect" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res
        .status(401)
        .json({ error: "Email address or password are incorrect" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600,
        path: "/",
      })
    );

    res.status(201).json({
      message: `You have loggedin successfully`,
      data: user,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { lastSeen: new Date().toISOString(), isActive: true },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/me", checkToken, async (_, res) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(401).json({ error: "You have not Loggedin" });
    }

    return res.status(200).json({
      data: {
        user,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/logout", checkToken, async (req, res) => {
  const prisma = req.prisma;
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(401).json({ error: "You have not Loggedin" });
    }

    res.set(
      "Set-Cookie",
      cookie.serialize("token", "", {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0),
        path: "/",
      })
    );

    res.status(200).json({
      message: "You have logout successfully",
    });

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastSeen: new Date().toISOString(),
        isActive: false,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});
module.exports = router;
