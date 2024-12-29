import jwt from 'jsonwebtoken';
import { Response } from 'express';

// Define the payload interface
interface JWTUserPayload {
  user: {
    id: string;
    name: string;
   email: string;
  };
  refreshToken?: string;
}

// Function to create a JWT
const createJWT = ({ payload }: { payload: object }): string => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string);
  return token;
};

// Function to validate a JWT
const isTokenValid = (token: string): object | string => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};

// Function to attach cookies to the response
const attachCookiesToResponse = ({
  res,
  user,
  refreshToken,
}: {
  res: Response;
  user: JWTUserPayload['user'];
  refreshToken: string;
}): void => {
  const accessTokenJWT = createJWT({ payload: { user } });
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

  const oneDay = 1000 * 60 * 60 * 24; 
  const longerExp = 1000 * 60 * 60 * 24 * 30; 

  // Attach access token cookie
  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });

  // Attach refresh token cookie
  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + longerExp),
  });
};

export { createJWT, isTokenValid, attachCookiesToResponse };
