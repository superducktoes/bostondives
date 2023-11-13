const faunadb = require('faunadb');
const fetch = require('node-fetch');

/* configure faunaDB Client with our secret */
const q = faunadb.query;
const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
});

const pangeaToken = process.env.PANGEA_KEY

/* export our lambda function as named "handler" export */
exports.handler = async (event, context) => {
    let statusCode, returnData, postData, stringData;
    let collection = "logs";

    let clientip = event["multiValueHeaders"]["X-Forwarded-For"][0].split(",")[0];
    let useragent = event["headers"]["user-agent"];

    const queryString = event.queryStringParameters;
    const bar = queryString.bar || 'None';
    const barSaved = queryString.barSaved || 'None';
    const error = queryString.error || 'None';

    const barsCompleted = queryString.barsCompleted || 'None';
    const barsVisitedCounter = queryString.barsVistedCounter || 'None';
    const barsNotVisitedCounter = queryString.barsNotVisitedCounter || 'None';

    if (bar != "None") {
        console.log("closest_bar: ", bar);
        console.log("useragent: ", useragent);
        console.log("clientip: ", clientip);

        collection = "closest_bar";
        postData = { "closest_bar": [{ "bar": bar }, { "clientip": clientip }, { "userAgent": useragent }] };
        stringData `closest_bar: ${bar}, clientip: ${clientip}, user_agent:${useragent}`

    } else if (barSaved != "None") {
        console.log("saved_bar: ", barSaved);
        console.log("useragent: ", useragent);
        console.log("clientip: ", clientip);

        postData = { "saved_bar": [{ "bar": barSaved }, { "clientip": clientip }, { "userAgent": useragent }] }
        stringData = `saved_bar: ${barSaved}, clientip: ${clientip}, user_agent: ${useragent}`

    } else if (error != "None") {
        console.log("error_message:", error);
        console.log("useragent: ", useragent);
        console.log("clientip: ", clientip);

        collection = "errors";
        postData = { "error_message": [{ "error_message": error }, { "clientip": clientip }, { "userAgent": useragent }] }
        stringData = `error_message: ${error}, clientip: ${clientip}, user_agent: ${useragent}`

    } else if (barsCompleted != "None") {
        console.log("bars completed: ", barsCompleted);
        console.log("bars visisted: ", barsVisitedCounter);
        console.log("bars not visited: ", barsNotVisitedCounter);

        console.log("error_message:", error);
        console.log("useragent: ", useragent);
        console.log("clientip: ", clientip);

        collection = "stats";
        postData = {
            "stats": [{ "barsCompleted": barsCompleted },
            { "barsVisited": barsVisitedCounter },
            { "barsNotVisited": barsNotVisitedCounter },
            { "clientip": clientip },
            { "userAgent": useragent }
            ]
        }

        stringData = `bars_completed: ${barsCompleted}, bars_visited: ${barsVisitedCounter}, bars_not_visited: ${barsNotVisitedCounter}, clientip: ${clientip}, user_agent:${useragent}`
    } else {
        console.log("Not Sharing Location");
        console.log("useragent: ", useragent);
        console.log("clientip: ", clientip);

        postData = { "not_sharing_location": [{ "clientip": clientip }, { "userAgent": useragent }] }
        stringData = `not_sharing_location: true, clientip: ${clientip}, useragent: ${useragent}`
    }

    try {
        //const {title, description } = req.body;
        //let postData = { "saved_bar": [{ "bar": "test" }, { "ip": "ip" }, { "userAgent": "agent" }] }
        /*const { rdata } = await client.query(
            q.Create(q.Collection(collection), { data: postData })
        );
        statusCode = 200
        console.log(rdata);
        returnData = rdata;
*/
        
          const data = JSON.stringify({
            'config_id': 'pci_chp3tsozuiuztyizjpe4kq7i6vuiyytw',
            'event': {
              'message': postData,
            },
          });
        console.log(`Bearer ${pangeaToken}`)
          try {
            const response = await fetch('https://audit.aws.us.pangea.cloud/v1/log', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${pangeaToken}`,
                'Content-Type': 'application/json',
              },
              body: {"event": {"message": JSON.stringify(data)}},
            });
        
            const responseData = await response.json();
            console.log(responseData);
        
            return {
              statusCode: response.status,
              body: JSON.stringify(responseData),
            };
          } catch (error) {
            console.error('Error making HTTP request:', error);
        
            return {
              statusCode: 500,
              body: JSON.stringify({ error: 'Internal Server Error' }),
            };
          }
    }
    catch (error) {
        statusCode = 500
        returnData = error;
        console.log(error);
    }

    return {
        statusCode: statusCode,
        body: JSON.stringify(returnData),
    }
};