import GenerateTokenService from "../../src/services/auth/generate-token.service.js";

export function generateJWT(user, accountId) {
  const generateTokenService = new GenerateTokenService();
  return generateTokenService.generateJWT(user, accountId);
}