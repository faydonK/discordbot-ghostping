# 🤖Ghost Ping Bot

This bot is designed to automatically mention a user in a specific channel when they join the server. This helps notify members of the arrival of a new user and welcome them.

## 🎮 Slash Commands

-   **`/setchannel`**  
    Set the current channel as the ghost ping channel.
    

----------

 ## 🚀 Setup

1.  **Create a Discord Bot**
    -   Go to the [Discord Developer Portal](https://discord.com/developers/applications).
    -   Create a new application and configure your bot.
    -   Retrieve your bot token and client ID.
    -   Ensure the following intents are enabled:
        -   `PRESENCE INTENT`
        -   `SERVER MEMBERS INTENT`
        -   `MESSAGE CONTENT INTENT`
2.  **Configure the Bot**
    
    -   Go to the `.env` file in the project directory and add your credentials:
        
        ```env
        DISCORD_TOKEN=your_bot_token
        CLIENT_ID=your_application_client_id
        ```
        
3.  **Install Dependencies**  
    Run the following command to install the required packages:
    
    ```bash
    npm install discord.js
    ```
    
4.  **Deploy Slash Commands**  
    Use the deployment script to register slash commands:
    
    ```bash
    npm run deploy
    ```
    
5.  **Start the Bot**  
    Launch the bot using:
    
    ```bash
    npm start
    ```


## 🛡️ Required Permissions

Ensure the bot has the following permissions:

-   `Send Messages`
-   `Use Slash Commands`
-   `Manage Messages` (to delete the ghost ping)
-   `View Channels`


## 🩷 Thanks to her!

Thanks to my girlfriend for encouraging me to finish this project.


----------

<img src="https://faydonk.fr/media/img/pfp-github.png" alt="GitHub Profile Picture" width="150">

*Made with ❤ by faydonK*