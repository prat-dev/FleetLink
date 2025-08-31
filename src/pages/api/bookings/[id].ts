import {NextApiRequest, NextApiResponse} from 'next';
import {deleteBooking} from '@/lib/actions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {method} = req;
  const {id} = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({error: 'Invalid booking ID'});
  }

  switch (method) {
    case 'DELETE':
      try {
        await deleteBooking(id);
        res.status(200).json({message: 'Booking cancelled successfully'});
      } catch (error) {
        res.status(500).json({error: 'Failed to cancel booking'});
      }
      break;
    default:
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
