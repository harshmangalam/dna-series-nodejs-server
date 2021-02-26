const router = require("express").Router();
const isAdmin = require("../middleware/isAdmin");
const checkToken = require("../middleware/checkToken");
const prisma = require("../prisma");

router.get("/contact", async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany();
    return res.status(200).json({ data: contacts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/about", async (req, res) => {
  try {
    const about = await prisma.website.findFirst({
      select: {
        aboutPage: true,
      },
    });
    return res.status(200).json({ data: about });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/create", checkToken, isAdmin, async (req, res) => {
  console.log("hello");
  try {
    const { title, headerTitle, headerPara, headerImg, aboutPage } = req.body;

    const website = await prisma.website.findFirst();
    console.log(website);

    let result;
    if (website) {
      let data = {
        title: title || website.title,
        headerTitle: headerTitle || website.headerTitle,
        headerPara: headerPara || website.headerPara,
        headerImg: headerImg || website.headerImg,
        aboutPage: aboutPage || website.aboutPage,
      };
      result = await prisma.website.update({
        where: {
          id: website.id,
        },
        data,
      });
    } else {
      result = await prisma.website.create({
        data: {
          title,
          headerImg,
          headerTitle,
          headerPara,
          aboutPage,
        },
      });
    }
    return res.status(200).json({ data: result, message: "Data updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/", async (req, res) => {
  try {
    const website = await prisma.website.findFirst();
    return res.status(200).json({ data: website });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
