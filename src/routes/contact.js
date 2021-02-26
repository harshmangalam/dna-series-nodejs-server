const router = require("express").Router();
const isAdmin = require("../middleware/isAdmin");
const prisma = require("../prisma");
const checkToken = require("../middleware/checkToken");

router.post("/create", checkToken, isAdmin, async (req, res) => {
  try {
    const { name, value } = req.body;

    const contact = await prisma.contact.create({
      data: {
        name,
        value,
      },
    });

    return res.status(200).json({ data: contact, message: "Contact Created" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

router.delete("/delete/:contactId", checkToken, isAdmin, async (req, res) => {
  try {
    await prisma.contact.delete({
      where: {
        id: parseInt(req.params.contactId),
      },
    });
    return res.status(200).json({ message: "Contact data deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/", async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany();
    return res.status(200).json({ data: contacts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
