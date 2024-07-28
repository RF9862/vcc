import cors from "cors";
import express from "express";

import db from "./config/db.js";
import { PORT, SERVER_URL } from "./config/index.js";
import passport from "./config/passport.js";
import router from "./routes/index.js";

const app = express();

app.use(cors({ origin: SERVER_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

db();

router(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
