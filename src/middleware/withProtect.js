import jwt from 'jsonwebtoken';
import UserModel from '../models/User';

const withProtect = (handler) => {
  return async (req, res) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        token = req.headers.authorization.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let result = await UserModel.findOne({
          _id: decoded.id,
          email: decoded.email,
        }).select('-password');

        if (!result) {
          throw new Error('corrupted token');
        }

        req.cookies.user = JSON.stringify(result);

        return handler(req, res);
      } catch (err) {
        res.status(401).json({
          success: false,
          message: 'Not authorized, token failed',
          description: err.message,
        });
      }
    }
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
      });
    }
  };
};

export default withProtect;
