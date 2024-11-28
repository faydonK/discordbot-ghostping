class ProtectionManager {
    constructor() {
      this.commandCounts = new Map();
      this.isProtectionMode = false;
      this.protectionEndTime = null;
      this.THRESHOLD = 5;
      this.PROTECTION_DURATION = 60000;
      this.WINDOW_SIZE = 10000;
    }
  
    logCommand(userId) {
      if (!this.commandCounts.has(userId)) {
        this.commandCounts.set(userId, []);
      }
  
      const now = Date.now();
      const userCommands = this.commandCounts.get(userId);
      
      const recentCommands = userCommands.filter(time => now - time < this.WINDOW_SIZE);
      recentCommands.push(now);
      
      this.commandCounts.set(userId, recentCommands);
  
      if (recentCommands.length >= this.THRESHOLD && !this.isProtectionMode) {
        this.enableProtection(userId);
        return true;
      }
  
      return false;
    }
  
    enableProtection(userId) {
      this.isProtectionMode = true;
      this.protectionEndTime = Date.now() + this.PROTECTION_DURATION;
      console.log('\x1b[41m\x1b[37m ALERT: Protection Mode Activated! \x1b[0m');
      console.log(`\x1b[33m⚠️  Cause: Spam detected from user ID: ${userId}\x1b[0m`);
      
      setTimeout(() => {
        this.isProtectionMode = false;
        this.protectionEndTime = null;
        console.log('\x1b[42m\x1b[30m Protection Mode Deactivated \x1b[0m');
      }, this.PROTECTION_DURATION);
    }
  
    isProtected() {
      if (!this.isProtectionMode) {
        return { protected: false };
      }
      
      return {
        protected: true,
        remainingTime: Math.ceil((this.protectionEndTime - Date.now()) / 1000)
      };
    }
  }
  
  export const protectionManager = new ProtectionManager();