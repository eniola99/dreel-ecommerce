import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { client } from '../../lib/client';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  const { email, password, username } = req.body;

  try {
    const user = await client.fetch(
      `*[_type == 'account' && email == $email][0]`,
      {
        email,
      }
    );

    if (!user) {
      return res.status(401).json({ message: 'invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: 'invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id },
      `${process.env.NEXT_PUBLIC_SECRET_KEY}`,
      { expiresIn: '1d' }
    );

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
