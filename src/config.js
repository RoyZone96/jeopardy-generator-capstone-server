module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'https://jeopardy-generator.vercel.app/',
  API_BASE_URL: 'https://jeapordy-generator-capstone.herokuapp.com/',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/jeopardy-generator-capstone-server',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
}
