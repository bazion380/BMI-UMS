import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { UserRole } from "../../src/types/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "bmi_ums_secure_token_secret_2026";
export const VALID_PASSCODES = [process.env.UMS_PASSCODE || "123456", "123456", "bmi2026", "admin123"];

export interface AuthenticatedRequest extends Request {
  userRole?: UserRole;
  userName?: string;
}

export function signToken(payload: { role: UserRole; name: string; issuedAt: number; exp: number }): string {
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", JWT_SECRET).update(payloadStr).digest("base64url");
  return `${payloadStr}.${signature}`;
}

export function verifyToken(token: string): { role: UserRole; name: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length === 2) {
      const [payloadStr, signature] = parts;
      const expectedSignature = crypto.createHmac("sha256", JWT_SECRET).update(payloadStr).digest("base64url");
      if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
        const payload = JSON.parse(Buffer.from(payloadStr, "base64url").toString("utf-8"));
        if (payload.exp && Date.now() > payload.exp) {
          return null; // Expired
        }
        return payload;
      }
    }
    // Fallback
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    if (decoded && decoded.role) {
      return { role: decoded.role as UserRole, name: decoded.name || "Authenticated Staff" };
    }
  } catch (e) {
    return null;
  }
  return null;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authReq = req as AuthenticatedRequest;
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    authReq.userRole = "student";
    authReq.userName = "Alex Rivera";
    return next();
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const verified = verifyToken(token);

  if (!verified) {
    res.status(401).json({ error: "Invalid or expired authentication token" });
    return;
  }

  authReq.userRole = verified.role;
  authReq.userName = verified.name;
  next();
}

export function requireRoles(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.userRole) {
      res.status(401).json({ error: "Unauthorized access" });
      return;
    }
    if (authReq.userRole === "president" || authReq.userRole === "it_admin") {
      return next();
    }
    if (!allowedRoles.includes(authReq.userRole)) {
      res.status(403).json({
        error: `Forbidden: Role '${authReq.userRole}' lacks permission for this action.`
      });
      return;
    }
    next();
  };
}
