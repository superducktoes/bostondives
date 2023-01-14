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
    const data = JSON.parse({"test": "test"})
    console.log('Function `create` invoked', data);
    const item = {
      data: data
    };
    /* construct the fauna query */
    return client
      .query(q.Create(q.Ref('9d861bad-bf9e-4bdd-92c2-7ceb583e3c15/logs'), item))
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