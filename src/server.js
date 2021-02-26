const express = require("express");
const compression = require("compression");
const http = require("http");
require("dotenv").config();
const { PORT, ORIGIN, NODE_ENV } = require("./config");
const cors = require("cors");
const prisma = require("./prisma");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const videoRoutes = require("./routes/videos");
const posterRoutes = require("./routes/posters");
const websiteRoutes = require("./routes/website");
const contactRoutes = require("./routes/contact");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(compression());
app.use(
  cors({
    origin: ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

if (NODE_ENV === "development") {
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

app.use((req, _, next) => {
  req.prisma = prisma;
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/posters", posterRoutes);
app.use("/api/website", websiteRoutes);
app.use("/api/contact", contactRoutes);

function main() {
  server.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready at port ${PORT}`)
  );
}
main();
