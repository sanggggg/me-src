const GoogleOAuth2 = require("google-oauth2-env-vars");
const dotenv = require("dotenv");

async function main() {
  dotenv.config({ path: "../.env" });
  const googleOAuth2 = new GoogleOAuth2({
    // .env token var name
    token: "GOOGLE_DOCS_TOKEN",
    // Authorization scope
    scope: ["https://www.googleapis.com/auth/drive"],
    //
    // Optional
    //
    // Port for node server
    port: 5123, // DEFAULT
  });
  const envVars = await googleOAuth2.generateEnvVars();
  return envVars;
}

main();
