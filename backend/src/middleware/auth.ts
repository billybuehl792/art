import type { Request, Response, NextFunction } from "express";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.slice("Bearer ".length);

  if (token !== process.env.ADMIN_API_KEY)
    return res.status(401).json({ error: "Unauthorized" });

  next();
};
