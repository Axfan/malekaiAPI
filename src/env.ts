export const Env = {
  production: process.env.NODE_ENV === 'production',
  url: process.env.NODE_ENV === 'production' ? 'https://api.malekai.network' : 'http://127.0.0.1:7070',
  cdnUrl: 'https://cdn.malekai.network',
  masterKey: 'fusrodah',
}

export default Env;
