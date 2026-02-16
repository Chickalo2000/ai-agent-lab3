// Import and configure dotenv
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

// Check if GITHUB_TOKEN exists in environment variables
if (!process.env.GITHUB_TOKEN) {
  console.error('❌ GITHUB_TOKEN is missing! Please add it to your .env file.');
  console.error('👉 Example: GITHUB_TOKEN=your_github_token_here');
  process.exit(1); // Exit the process with an error code
}

console.log('✅ Environment variables loaded successfully.');

// Define the main async function
async function main() {
  console.log('🚀 Starting the LangChain AI Agent application...');

  // Add your application logic here
}

// Execute the main function and handle errors
main().catch(console.error);