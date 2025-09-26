import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'RespirAI',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,  
      launchAutoHide: true,
      backgroundColor: "#f711ffff", 
      showSpinner: false
    }
  }
};

export default config;
