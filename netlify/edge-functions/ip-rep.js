
export default async (request, context) => {

  const PANGEA_ACCESS_TOKEN = Netlify.env.get("PANGEA_ACCESS_TOKEN");
  const PROVIDER = Netlify.env.get("PROVIDER");
  const ip = context["ip"];

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

  if (score < 75 || data["result"]["data"]["verdict"] === "unknown") {
    return Response.redirect("https://bostondives.bar");
  } else {
    return new Response('Access Denied', {
      status: 403,
    });
  }
};


export const config = { path: "/test" };
