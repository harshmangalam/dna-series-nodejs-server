const router = require("express").Router();
const prisma = require("../prisma")
router.get("/", async (req, res) => {
  try {
    let { page=0, take = 6 } = req.query;
    take = parseInt(take)
    let skip = page * take;
    page = parseInt(page);
    const users = await prisma.user.findMany({
      take,
      skip,orderBy:{
        createdAt:"desc"
      }
    });
   
   
    return res.status(200).json({ data: users,hasMore:true});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "SOmething went wrong" });
  }
});

router.get("/userCount", async (req, res) => {
  try {
    const userCount = await prisma.user.count();

    return res.status(200).json({ data: userCount });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});
module.exports = router;
