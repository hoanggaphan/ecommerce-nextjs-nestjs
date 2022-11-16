import type { NextApiRequest, NextApiResponse } from 'next';
import cloudinaryV2 from '../../../libs/cloudinary';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (id) {
      await cloudinaryV2.uploader.destroy(id as string);
    }
    return res.status(200).json({ message: 'Delete img success' });
  }
  return res.status(405).send({ message: 'Method is not supported' });
};
