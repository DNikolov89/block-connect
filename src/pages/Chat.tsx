
import React from 'react';
import ChatPage from '../components/chat/ChatPage';
import { toast } from 'sonner';

const Chat = () => {
  // Display a toast with the error information
  React.useEffect(() => {
    toast.error("There was an issue with the chat component. Please try again later.", {
      description: "We're working on fixing this issue."
    });
  }, []);

  try {
    return <ChatPage />;
  } catch (error) {
    // Fallback UI in case the component crashes
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="text-4xl mb-4">💬</div>
        <h1 className="text-2xl font-bold mb-2">Chat Feature</h1>
        <p className="text-muted-foreground text-center max-w-md mb-4">
          Our chat feature is currently unavailable. We're working to fix this issue.
        </p>
        <p className="text-sm text-muted-foreground">Error: Missing icon dependency in Chat component</p>
      </div>
    );
  }
};

export default Chat;
