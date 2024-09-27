import express from 'express';
import { createUser, getUserByEmail, getUserBySessionToken } from '../models/users';
import { random, hashPassword, comparePassword, generateSessionToken, hashSessionToken } from '../helpers';

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.sendStatus(400); // Bad Request
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.sendStatus(400); // Bad Request (User already exists)
    }

    const hashedPassword = await hashPassword(password);
    const salt = random();
    const sessionToken = generateSessionToken(salt, username);

    const user = await createUser({
      email,
      username,
      authentication: {
        password: hashedPassword,
        salt,
        sessionToken: hashSessionToken(sessionToken),
      },
    });

    res.cookie('DEEP-DEEP', sessionToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // Token expires after 1 day
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.error(error);
    return res.sendStatus(400); // Bad Request
  }
};

// export const login = async (req: express.Request, res: express.Response) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.sendStatus(400); // Bad Request
//     }

//     const user = await getUserByEmail(email).select('+authentication.password');
//     if (!user || !user.authentication) {
//       return res.sendStatus(400); // Bad Request (User not found)
//     }

//     const isPasswordValid = await comparePassword(password, user.authentication.password);
//     if (!isPasswordValid) {
//       return res.sendStatus(403); // Forbidden
//     }

//     const newSalt = random(); // Generate a new salt for each login
//     const sessionToken = generateSessionToken(newSalt, user.username);
//     const hashedSessionToken = hashSessionToken(sessionToken);
//     user.authentication.sessionToken = hashedSessionToken;

//     await user.save();

//     res.cookie('DEEP-DEEP', hashedSessionToken, {
//       httpOnly: true,
//       secure: true,
//       maxAge: 24 * 60 * 60 * 1000, // Token expires after 1 day
//     });

//     return res.status(200).json(user).end();
//   } catch (error) {
//     console.error(error);
//     return res.sendStatus(400); // Bad Request
//   }
// };
export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.sendStatus(400); // Bad Request
    }

    // Fetch the user and include password for comparison
    const user = await getUserByEmail(email).select('+authentication.password');
    if (!user || !user.authentication) {
      return res.sendStatus(400); // Bad Request (User not found)
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.authentication.password);
    if (!isPasswordValid) {
      return res.sendStatus(403); // Forbidden
    }

    // Generate a new session token
    const newSalt = random();
    const sessionToken = generateSessionToken(newSalt, user.username);
    const hashedSessionToken = hashSessionToken(sessionToken);

    // Update the user's session token in the database
    user.authentication.sessionToken = hashedSessionToken;
    await user.save();

    // Prepare the user data for the response, excluding sensitive fields
    const userWithoutSensitiveData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role,
      sessionToken: hashedSessionToken, // Include session token in the response
    };

    // Set the session token in an httpOnly cookie
    res.cookie('DEEP-DEEP', hashedSessionToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // Token expires after 1 day
    });

    // Return user data excluding password and other sensitive information
    return res.status(200).json(userWithoutSensitiveData).end();
  } catch (error) {
    console.error(error);
    return res.sendStatus(400); // Bad Request
  }
};

export const logout = async (req: express.Request, res: express.Response) => {
  try {
    const sessionToken = req.cookies['DEEP-DEEP'];
    if (!sessionToken) {
      return res.sendStatus(401); // Unauthorized
    }

    const user = await getUserBySessionToken(sessionToken);

    if (!user) {
      return res.sendStatus(401); // Unauthorized
    }
    if (!user.authentication) {
      return res.sendStatus(401);
    }
    user.authentication.sessionToken = null; // Expire the session token
    await user.save();

    res.clearCookie('DEEP-DEEP'); // Clear the cookie

    return res.sendStatus(200); // OK
  } catch (error) {
    console.log(error);
    return res.sendStatus(400); // Bad Request
  }
};
