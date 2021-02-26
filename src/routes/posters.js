const router = require("express").Router();
const isAdmin = require("../middleware/isAdmin");
const checkToken = require("../middleware/checkToken");
const prisma = require("../prisma");

router.get("/", async (req, res) => {
  let { page, take = 3 } = req.query;
  take = parseInt(take);

  let skip = page * take;
  page = parseInt(page);
  try {
    const posters = await prisma.poster.findMany({
      skip: skip,
      take: take,
      orderBy: {
        createdAt: "desc",
      },
    });

    if (posters.length) {
      return res.status(200).json({ data: posters, hasMore: true });
    }
    return res.status(200).json({ data: posters, hasMore: false });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/posterCount", async (req, res) => {
  try {
    const posterCount = await prisma.poster.count();

    return res.status(200).json({ data: posterCount });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/create", checkToken, isAdmin, async (req, res) => {
  const { url, description, title } = req.body;
  try {
    const createPoster = await prisma.poster.create({
      data: {
        url,
        description,
        title,
      },
    });

    res.status(200).json({
      message: "Poster added to website",
      data: createPoster,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

router.delete("/delete", checkToken, isAdmin, async (req, res) => {
  try {
    let { posterId } = req.query;
    posterId = parseInt(posterId);

    await prisma.poster.delete({
      where: {
        id: posterId,
      },
    });
    return res.status(201).json({ message: "Poster delete successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
