const authConfig = {
  token: {
    secret: process.env.APP_SECRET,
    expiresIn: '15m',
  },
  refreshToken: {
    secret: process.env.APP_SECRET_TWO,
    expiresIn: '30d',
    expiresInDays: 30,
  },
};

export default authConfig;
