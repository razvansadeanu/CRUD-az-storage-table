const azure = require("azure-storage");
const uuid = require("uuid/v1");

const tableService = azure.createTableService();
const tableName = "Contact";

module.exports = function (context, req) {
  context.log("Request found");

  if (req.body) {
    context.log("Starting to create");
    const item = {
      PartitionKey: "Partition",
      RowKey: uuid(),
      Name: req.query.name || req.body.name,
      Email: req.query.email || req.body.email,
      Message: req.query.message || req.body.message,
    };
    // Use { echoContent: true } if you want to return the created item including the Timestamp & etag
    tableService.insertEntity(
      tableName,
      item,
      { echoContent: true },
      function (error, result, response) {
        if (!error) {
          context.res.status(201).json(response);
        } else {
          context.res.status(500).json({ error: error });
        }
      }
    );
  } else {
    context.res = {
      status: 400,
      body: "Please pass an item in the request body",
    };
    context.done();
  }
};
