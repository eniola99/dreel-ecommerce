import bcrypt from 'bcryptjs';

import { client } from '../../lib/client';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  const {
    email,
    password,
    firstname,
    lastname,
    username,
    number,
    address,
    currency,
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await client.fetch(
      `*[_type == 'account' && email == $email][0]`,
      {
        email,
      }
    );
    if (!user) {
      const user = await client.create({
        _type: 'account',
        firstname,
        lastname,
        username,
        email,
        password: hashedPassword,
        address,
        currency,
        number,
      });

      res.status(201).json({ message: `${user.email} account created` });
      return;
    } else {
      res.status(401).json({ message: `${email} account already exist` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
