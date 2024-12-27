import jwt from 'jsonwebtoken';

const secretKey = process.env.JSON_TOKEN || ""

export function generateJWT(id: string): string {
    const payload = { id };
    const token = jwt.sign(payload, secretKey, { expiresIn: '10d' });
    return token;
}

export function getIdFromJWT(token: string): string | null {
    try {
        const decoded = jwt.verify(token, secretKey) as jwt.JwtPayload;
        return decoded.id;
    } catch (error) {
        console.error('Invalid token', error);
        return null;
    }
}