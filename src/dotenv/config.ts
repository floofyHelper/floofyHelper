import * as dotenv from 'dotenv';

if (process.argv.includes('dev')) {
  dotenv.config({ path: '.env' });
} else {
  dotenv.config({ path: '.env.production' });
}
