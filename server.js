const express = require("express");
const app = express();
const port = 4000;

const environment = process.env.NODE_ENV || "development";
const config = require("./knexfile")[environment];
const knex = require("knex")(config);

// app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  knex("todos")
    .select()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      res.json({ status: 500, error: err });
    });
});

function validTodo(todo) {
  return (
    typeof todo.title === "string" &&
    todo.title.trim() !== "" &&
    typeof todo.priority !== "undefined" &&
    !isNaN(Number(todo.priority))
  );
}

function buildTodoFields(req) {
  return {
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority
  };
}

app.post("/todos", (req, res) => {
  console.log("request body", req.body);
  const todo = buildTodoFields(req);
  if (validTodo(todo)) {
    knex("todos")
      .returning(["id", "title", "priority"])
      .insert(todo)
      .then(todo => {
        res.json(todo);
      });
  } else {
    // const errors = {messages: ""}
    // res.render("new", errors)
    res.send("Oops! You have an error on the form");
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
