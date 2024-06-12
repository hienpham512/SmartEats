import dotenv from 'dotenv'

dotenv.config()
const config = {
  firebase: {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
  },
  services: {
    exercises: {
      apiKey: process.env.EXERCISE_DB_API_KEY,
      host: process.env.EXERCISE_DB_API_HOST ?? 'exercisedb.p.rapidapi.com',
      url: process.env.EXERCISE_DB_URL ?? 'https://exercisedb.p.rapidapi.com/exercises',
    },
    huggingFace: {
      apiKey: process.env.HUGGING_FACE_API_KEY,
      url:
        process.env.HUGGING_FACE_URL ?? 'https://api-inference.huggingface.co/models/nateraw/food',
    },
    recipes: {
      url: process.env.EDAMAM_URL ?? 'https://api.edamam.com/api/recipes/v2',
      apiKey: process.env.EDAMAM_API_KEY,
      apiId: process.env.EDAMAM_API_ID,
      urlFoodDatabase:
        process.env.EDAMAM_URL_FOOD_DATABASE ??
        'https://api.edamam.com/api/food-database/v2/parser',
      apiIdFoodDatabase: process.env.EDAMAM_API_ID_FOOD_DATABASE,
      apiKeyFoodDatabase: process.env.EDAMAM_API_KEY_FOOD_DATABASE,
    },
  },
  server: {
    port: Number(process.env.PORT) ?? 8080,
    IP: process.env.IP ?? 'localhost',
    origin: process.env.ORIGIN,
  },
}

export default config
