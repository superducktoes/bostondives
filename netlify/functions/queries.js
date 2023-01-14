const faunadb = require('faunadb');

/* configure faunaDB Client with our secret */
const q = faunadb.query;
/*const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
});*/

/* export our lambda function as named "handler" export */
exports.handler = async (event, context) => {
    const data = {
    }

    return {
        statusCode: 200,
        body: JSON.stringify(data),
    }
};