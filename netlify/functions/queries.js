const faunadb = require('faunadb');

/* configure faunaDB Client with our secret */
const q = faunadb.query;
const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
});

/* export our lambda function as named "handler" export */
exports.handler = async (event, context) => {
    let statusCode, returnData;
      try {
        //const {title, description } = req.body;
        const title = "test";
        const description = "test";

        const { rdata } = await client.query(
          q.Create(q.Collection('logs'), { data: { title, description } })
        );
        statusCode = 200
        console.log(rdata);
        returnData = rdata;
      }
      catch (error) {
        statusCode = 500
        returnData = error;
        console.log(error);
      }

      return {
        statusCode: statusCode,
        body: JSON.stringify(data),
    }
  };