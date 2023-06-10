
export default async (request, context) => {
  const BLOCKED_COUNTRY_CODE = "GB";
  const countryCode = "US";
  const countryName = "United States of America";
  
  console.log(request);
  console.log("---")
  console.log(context);

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

  if (countryCode === BLOCKED_COUNTRY_CODE) {
    return new Response(`We're sorry, you can't access our content from ${countryName}!`, {
      headers: { "content-type": "text/html" },
      status: 451,
    });
  }

  return new Response(`Hello there! You can freely access our content from ${countryName}!`, {
    headers: { "content-type": "text/html" },
  });
};

export const config = { path: "/test" };
