const faunadb = require('faunadb');

/* configure faunaDB Client with our secret */
const q = faunadb.query;
const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
});

/* export our lambda function as named "handler" export */
exports.handler = async (event, context) => {
      try {
        //const {title, description } = req.body;
        const title = "test";
        const description = "test";
        const { data } = await client.query(
          q.Create(q.Collection('logs'), { data: { title, description } })
        );

        console.log(data);
      }
  };