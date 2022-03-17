const authConfig = {
  token: {
    secret: process.env.APP_SECRET,
    expiresIn: '15m',
  },
  refreshToken: {
    secret: process.env.APP_SECRET_TWO,
    expiresIn: '5d',
    expiresInDays: 5,
  },
};

export default authConfig;
