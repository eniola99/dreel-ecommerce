import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.statusCode(401).end();
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, `${process.env.NEXT_PUBLIC_SECRET_KEY}`);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.statusCode(401).end();
  }
}
