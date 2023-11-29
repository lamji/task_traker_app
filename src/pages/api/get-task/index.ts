import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Handle GET request
    res.status(200).json({ message: 'This is a GET request' });
  } else if (req.method === 'POST') {
    // Handle POST request
    res.status(200).json({ message: 'This is a POST request' });
  } else {
    // Handle other HTTP methods
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
