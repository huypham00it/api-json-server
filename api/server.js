const jsonServer = require("json-server");
const fs = require("fs");
const express = require("express");

const server = jsonServer.create();

// Uncomment to allow write operations
// const fs = require('fs')
// const path = require('path')
// const filePath = path.join('db.json')
// const data = fs.readFileSync(filePath, "utf-8");
// const db = JSON.parse(data);
// const router = jsonServer.router(db)

// Comment out to allow write operations
const router = jsonServer.router("db.json");

const middlewares = jsonServer.defaults();

server.use(middlewares);
// Add this before server.use(router)
server.use(
    jsonServer.rewriter({
        "/api/*": "/$1",
        "/blog/:resource/:id/show": "/:resource/:id",
    })
);

server.get("/download/:fieldname", (req, res) => {
    const fieldName = req.params.fieldname;
    const data = JSON.parse(fs.readFileSync("db.json", "utf-8"));
    const fieldData = data[fieldName];
    res.setHeader(
        "Content-disposition",
        "attachment; filename=" + fieldName + ".json"
    );
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(fieldData, null, 2));
});

server.use(express.static("script"));

server.use(router);
server.listen(5000, () => {
    console.log("JSON Server is running");
});

// Export the Server API
module.exports = server;
