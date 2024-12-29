import { Request, Response, NextFunction } from 'express';
import { isTokenValid } from '../utils';
import Token from '../models/Token';
import User, { IUser } from '../models/User';
import { attachCookiesToResponse } from '../utils';


interface UserPayload {
  id: string; 
  name: string;
  email: string;
}

interface TokenPayload {
  user: UserPayload;
  refreshToken: string;
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

// Middleware to authenticate user
const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const { refreshToken, accessToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken) as TokenPayload;
      req.user = payload.user;
      return next();
    }

    if (!refreshToken) {
      return res.status(401).json({ message: 'Authentication Invalid' });
    }

    const payload = isTokenValid(refreshToken) as TokenPayload;

    const existingToken = await Token.findOne({
      user: payload.user.id, // Match the 'id' field in IUser
      refreshToken: payload.refreshToken,
    });

    if (!existingToken || !existingToken.isValid) {
      return res.status(401).json({ message: 'Authentication Invalid' });
    }

    const user: IUser | null = await User.findById(payload.user.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    attachCookiesToResponse({
      res,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      refreshToken: existingToken.refreshToken,
    });

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    next();
  } catch (error) {
    console.error('Error during authentication:', error);
    return res.status(401).json({ message: 'Authentication Invalid' });
  }
};


export { authenticateUser};
