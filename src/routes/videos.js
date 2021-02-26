const router = require("express").Router();
const isAdmin = require("../middleware/isAdmin");
const checkToken = require("../middleware/checkToken");
const prisma = require("../prisma");

router.get("/", async (req, res) => {
  let { page = 0, take = 3 } = req.query;
  take = parseInt(take);
  let skip = page * take;
  page = parseInt(page);
  try {
    const videos = await prisma.video.findMany({
      skip: skip,
      take: take,
      orderBy: {
        createdAt: "desc",
      },
    });

    if (videos.length) {
      return res.status(200).json({ data: videos, hasMore: true });
    }
    return res.status(200).json({ data: videos, hasMore: false });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/create", checkToken, isAdmin, async (req, res) => {
  const { videoId, description, title } = req.body;
  try {
    const createVideo = await prisma.video.create({
      data: {
        videoId,
        description,
        title,
      },
    });

    res.status(200).json({
      message: "Video added to website",
      data: createVideo,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/videoCount", async (req, res) => {
  try {
    const videoCount = await prisma.video.count();

    return res.status(200).json({ data: videoCount });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

router.delete("/delete", checkToken, isAdmin, async (req, res) => {
  try {
    let { videoId } = req.query;
    videoId = parseInt(videoId);

    await prisma.video.delete({
      where: {
        id: videoId,
      },
    });
    return res.status(201).json({ message: "Video delete successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router
