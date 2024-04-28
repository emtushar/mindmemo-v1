import express from "express";
import dataArray from "./constants.js";
import dotenv from "dotenv";

const app = express();
dotenv.config({ path: "./.env" });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.get("/", (req, res) => {
  res.render("index", { dataArray });
});
app.post("/create", (req, res) => {
  const { title, details } = req.body;

  if (!title || !details) {
    res.redirect("/");
    return;
  }
  dataArray.push({
    title,
    details,
  });
  res.redirect("/");
});
let data = {};
app.get("/:title", (req, res) => {
  const { title } = req.params;
  dataArray.forEach((item) => {
    if (item.title.replace(" ", "") == title) {
      data = item;
      return;
    }
  });
  res.render("note", { data });
});

app.get("/delete/:title", (req, res) => {
  const { title } = req.params;
  console.log(title);
  dataArray.forEach((item, i) => {
    if (item.title.replace(" ", "") === title) {
      dataArray.splice(i, 1);
    }
  });
  console.log("Sucessfully Deleted");
  res.redirect("/");
});

app.get("/update/:title", (req, res) => {
  const { title } = req.params;
  console.log(title);
  let data = {};
  dataArray.forEach((item) => {
    if (item.title.replace(" ", "") === title) {
      data = item;
    }
  });
  res.render("update", { title: data.title, details: data.details });
});

app.post("/update", (req, res) => {
  const { title, details } = req.body;
  dataArray.forEach((item) => {
    if (item.title === title) {
      item.details = details;
      res.redirect("/");
    }
  });
});

app.listen(process.env.PORT, () => {
  console.log(
    `Server started successfully at http://localhost:${process.env.PORT}`
  );
});
