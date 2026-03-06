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

// Compile the graph
const agent = graph.compile();

console.log('🤖 Agent initialized successfully.');

// Define the main async function
async function main() {
  console.log('🚀 Starting the LangChain AI Agent application...');

  // Add your application logic here
}

// Define a test query
const testQuery = 'What time is it right now?';

// Call the agent's invoke method
async function testExecutor() {
  try {
    const result = await agent.invoke({ 
      messages: [
        new HumanMessage(testQuery)
      ]
    });
    // Extract the final message content
    if (result.messages && result.messages.length > 0) {
      const lastMessage = result.messages[result.messages.length - 1];
      console.log('Agent Response:', lastMessage.content || lastMessage.kwargs?.content);
    } else {
      console.log('Full Result:', JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error('Error invoking agent:', error);
  }
}

// Execute the main function and handle errors
main().catch(console.error);

// Run the test
await testExecutor();