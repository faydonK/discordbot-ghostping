import dotenv from 'dotenv';

dotenv.config();

function validateConfig() {
  const required = {
    DISCORD_TOKEN: 'Bot token',
    CLIENT_ID: 'Application client ID'
  };

  for (const [key, name] of Object.entries(required)) {
    if (!process.env[key]) {
      throw new Error(
        `${name} not found! Please add to .env file:\n${key}=your_${key.toLowerCase()}_here`
      );
    }

    if (process.env[key] === `your_${key.toLowerCase()}_here`) {
      throw new Error(
        `Please replace the default ${name.toLowerCase()} in .env with your actual value`
      );
    }
  }
}

validateConfig();

export const config = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  reconnectDelay: 5000,
  maxReconnectAttempts: 5
};