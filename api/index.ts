import type { Request, Response } from 'express';
import app from '../server.ts';

/**
 * Point d'entrée unique Vercel pour l'API.
 * vercel.json transmet le chemin demandé dans `path`, puis Express reçoit
 * à nouveau son URL habituelle (ex. /api/auth/login).
 */
export default function handler(req: Request, res: Response) {
  const path = typeof req.query.path === 'string' ? req.query.path : '';
  req.url = `/api/${path}`;
  return app(req, res);
}
