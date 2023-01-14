const faunadb = require('faunadb');

/* configure faunaDB Client with our secret */
const q = faunadb.query;
const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
});

/* export our lambda function as named "handler" export */
exports.handler = async (event, context) => {
    /* parse the string body into a useable JS object */
    //const data = JSON.parse(event.body);
    const data = {"test": "test"}

    console.log('Function `create` invoked', data);
    const item = {
      data: data
    };
    item = String(JSON.parse(item));
    console.log("item: ", item);
    /* construct the fauna query */
    return client
      .query(q.Create(q.Ref('logs'), item))
      .then(response => {
        console.log('success', response);
        /* Success! return the response with statusCode 200 */
        return {
          statusCode: 200,
          body: JSON.stringify(response)
        };
      })
      .catch(error => {
        console.log('error', error);
        /* Error! return the error with statusCode 400 */
        return {
          statusCode: 400,
          body: JSON.stringify(error)
        };
      });
  };