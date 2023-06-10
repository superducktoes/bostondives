export default async (request, context) => {
  const BLOCKED_COUNTRY_CODE = "GB";
  const countryCode = "US";
  const countryName = "United States of America";
  const { ip } = JSON.parse(request.body);
  const { PANGEA_ACCESS_TOKEN, PROVIDER } = process.env;

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
