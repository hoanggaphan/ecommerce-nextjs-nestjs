import type { NextApiRequest, NextApiResponse } from 'next';
import cloudinaryV2 from '../../../libs/cloudinary';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { image } = req.body;
    const data = await cloudinaryV2.uploader.upload(image); // Image have type base64
    return res.status(200).json(data);
  }

  return res.status(405).send({ message: 'Method is not supported' });
};
