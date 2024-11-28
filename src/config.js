import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

function validateConfig() {
  const required = {
    DISCORD_TOKEN: 'Bot token',
    CLIENT_ID: 'Application client ID'
  };

  const missing = [];

  for (const [key, desc] of Object.entries(required)) {
    if (!process.env[key]) {
      missing.push(`${key}=${desc}`);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      'Bot token not found! Please add to .env file:\n' +
      missing.join('\n')
    );
  }
}

validateConfig();

export default {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID
};