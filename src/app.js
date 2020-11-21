const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

app.use("/repositories/:id", (request, response, next) => {
  const {id} = request.params;
  const idx = repositories.findIndex(repo => repo.id === id);

  if (!isUuid(id)) {
    return response.status(400).json({"error": "ID is not a valid UUID!"});
  }
  
  if (idx < 0) {
    return response.status(404).json({"error": "Repository not found!"});
  }
  
  return next();
});

const repositories = [];

app.get("/repositories", (request, response) => {
  response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const id = uuid();
  const {title, url, techs} = request.body;

  const repo = {
    "id": id,
    "title": title,
    "url": url,
    "techs": techs,
    "likes": 0
  };

  repositories.push(repo);

  response.status(201).json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  let repo = repositories.find(repo => repo.id === id);

  repo.title = title;
  repo.url = url;
  repo.techs = techs;

  response.status(200).json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const idx = repositories.findIndex(repo => repo.id === id);

  repositories.splice(idx, 1);

  response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  let repo = repositories.find(repo => repo.id === id);

  repo.likes++;

  response.status(201).json(repo);
});

module.exports = app;
