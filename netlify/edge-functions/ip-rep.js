// ipReputation.js
export const config = { path: "/test" };
const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { ip } = JSON.parse(event.body);

  const { PANGEA_ACCESS_TOKEN, PROVIDER } = process.env;

  const response = await fetch('https://ip-intel.aws.us.pangea.cloud/v1/reputation', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PANGEA_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ip,
      verbose: false,
      raw: false,
      provider: PROVIDER,
    }),
  });

  const data = await response.json();
  const score = data.score;

  if (score < 75) {
    return {
      statusCode: 302,
      headers: {
        'Location': 'https://bostondives.com',
      },
      body: '',
    };
  } else {
    return {
      statusCode: 403,
      body: 'Access Denied',
    };
  }
};
