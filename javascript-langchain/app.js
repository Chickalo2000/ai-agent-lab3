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

// Import necessary modules
import { ChatOpenAI } from '@langchain/openai';
import { DynamicTool } from '@langchain/core/tools';
import { HumanMessage } from '@langchain/core/messages';
import { StateGraph, START, END } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { Calculator } from '@langchain/community/tools/calculator';

// Create a ChatOpenAI instance
const chat = new ChatOpenAI({
  model: 'openai/gpt-4o',
  temperature: 0, // Deterministic responses
  apiKey: process.env.GITHUB_TOKEN, // Use GITHUB_TOKEN as the apiKey
  configuration: {
    baseURL: 'https://models.github.ai/inference',
    defaultHeaders: {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  }
});

console.log('🤖 ChatOpenAI instance created successfully.');

// Create a tools array
const tools = [
  new Calculator(),
  new DynamicTool({
    name: 'get_current_time',
    description: 'Returns the current date and time.',
    func: async () => new Date().toString()
  }),
  new DynamicTool({
    name: 'reverse_string',
    description: 'Reverses a string. Input should be a single string.',
    func: async (input) => input.split('').reverse().join('')
  }),
  new DynamicTool({
    name: 'get_weather',
    description: 'Provides weather information for a given date. Accepts a date parameter formatted as "yyyy-MM-dd". Returns "Sunny, 72°F" if the date matches today, otherwise returns "Rainy, 55°F".',
    func: async (input) => {
      const today = new Date().toISOString().split('T')[0]; // Get today's date in "yyyy-MM-dd" format
      if (input === today) {
        return 'Sunny, 72°F';
      }
      return 'Rainy, 55°F';
    }
  })
];

console.log('🛠️ Tools array initialized successfully.');

// Bind tools to the model
const modelWithTools = chat.bindTools(tools);

// Create state schema
const Channel = {
  messages: {
    value: (x, y) => (y ? [...(Array.isArray(x) ? x : []), ...(Array.isArray(y) ? y : [y])] : x),
    default: () => []
  }
};

// Create a simple agent graph
const graph = new StateGraph({ channels: Channel });

// Define the agent node
const agentNode = async (state) => {
  const messages = state.messages;
  const response = await modelWithTools.invoke(messages);
  return { messages: [response] };
};

// Define tools node
const toolsNode = new ToolNode(tools);

// Add nodes to graph
graph.addNode('agent', agentNode);
graph.addNode('tools', toolsNode);

// Add edges
graph.addEdge(START, 'agent');
graph.addConditionalEdges(
  'agent',
  (state) => {
    const lastMessage = state.messages[state.messages.length - 1];
    if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
      return 'tools';
    }
    return END;
  }
);
graph.addEdge('tools', 'agent');

// Define a system message to instruct the AI
const systemMessage = new HumanMessage({
  content: "You are an AI assistant. Always respond professionally and succinctly."
});

// Add the system message to the initial state
const initialState = {
  messages: [systemMessage]
};

// Compile the graph with the initial state
const agent = graph.compile(initialState);

console.log('🤖 Agent initialized successfully.');

// Define the main async function
async function main() {
  console.log('🚀 Starting the LangChain AI Agent application...');

  // Print header
  console.log('\nRunning example queries:');

  // Define an array of test queries
  const testQueries = [
    "What time is it right now?",
    "What is 25 * 4 + 10?",
    "Reverse the string 'Hello World'",
    "What's the weather like today?"
  ];

  // Iterate through each query
  for (const query of testQueries) {
    console.log(`\n${'─'.repeat(50)}`); // Separator line
    console.log(`🟢 Query: ${query}`);
    try {
      const result = await agent.invoke({
        messages: [
          new HumanMessage(query)
        ]
      });
      // Extract and print the result
      if (result.messages && result.messages.length > 0) {
        const lastMessage = result.messages[result.messages.length - 1];
        console.log(`✅ Result: ${lastMessage.content || lastMessage.kwargs?.content}`);
      } else {
        console.log('⚠️ No result returned. Full response:', JSON.stringify(result, null, 2));
      }
    } catch (error) {
      console.error(`❌ Error processing query: ${query}`, error);
    }
  }

  // Print completion message
  console.log(`\n${'─'.repeat(50)}`); // Final separator line
  console.log('🎉 All queries processed successfully!');
}

// Execute the main function and handle errors
main().catch(console.error);