import { client } from '../../lib/client';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  const { code } = req.body;

  try {
    const user = await client.fetch(`*[_type == 'account' && code == $code]`, {
      code,
    });
    if (user) {
      await client.patch(user[0]._id).set({ verified: true }).commit();
      res.status(201).json({
        status: 201,
        message: 'Your account as been verified, Proceed to Login',
      });
    } else {
      res
        .status(404)
        .json({ message: 'No document found with the given code' });
    }
  } catch (error) {
    console.log({ error });
  }
};
