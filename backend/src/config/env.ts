import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { existsSync } from 'fs';
import { resolve } from 'path';

/**
 * Load environment variables with Next.js-like priority:
 * 1. .env.local (always loaded, should be gitignored)
 * 2. .env.development or .env.production (based on NODE_ENV)
 * 3. .env (default fallback)
 * 
 * Also supports variable expansion (e.g., API_URL=$BASE_URL/api)
 */
export function loadEnvironment() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const envDir = resolve(process.cwd());
  
  // Environment files in priority order (highest to lowest)
  const envFiles = [
    '.env.local',
    `.env.${nodeEnv}`,
    '.env'
  ];

  console.log(`Loading environment for NODE_ENV: ${nodeEnv}`);
  
  // Load each env file that exists
  envFiles.forEach(envFile => {
    const envPath = resolve(envDir, envFile);
    
    if (existsSync(envPath)) {
      console.log(`Loading env file: ${envFile}`);
      
      // Load and expand the environment file
      const result = dotenv.config({ path: envPath });
      
      if (result.error) {
        console.error(`Error loading ${envFile}:`, result.error);
      } else {
        // Expand variables (e.g., API_URL=$BASE_URL/api)
        dotenvExpand.expand(result);
      }
    } else {
      console.log(`Env file not found: ${envFile}`);
    }
  });
  
  console.log(`✅ Environment loaded successfully`);
}