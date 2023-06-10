
export default async (request, context) => {
  const BLOCKED_COUNTRY_CODE = "GB";
  const countryCode = "US";
  const countryName = "United States of America";
  //const { ip } = JSON.parse(request.body);
  console.log(request);
  console.log("---")
  console.log(context);
  //const PANGEA_ACCESS_TOKEN = process.env.PANGEA_ACCESS_TOKEN;
  //const PROVIDER = process.env.PROVIDER;
  const PANGEA_ACCESS_TOKEN = Netlify.env.get("PANGEA_ACCESS_TOKEN");
  const PROVIDER = Netlify.env.get("PROVIDER");
  const ip = context["ip"];
  console.log(ip);

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
