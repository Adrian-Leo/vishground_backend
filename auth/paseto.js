import { V3 } from "paseto";

const secretKeyHex = process.env.PASETO_SECRET_KEY;
const secretKey = Buffer.from(secretKeyHex, 'hex');
const paseto = {
  async createToken(payload) {
    return await V3.encrypt(payload, secretKey);
  },
  async verifyToken(token) { // return promise of the payload i.e. google_id
    return await V3.decrypt(token, secretKey);
  },
};

export default paseto;
