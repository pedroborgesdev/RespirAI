import { useState } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { Chat } from "@/pages/Chat";

const Index = () => {
  const [showChat, setShowChat] = useState(false);

  if (showChat) {
    return <Chat onBack={() => setShowChat(false)} />;
  }

  return <WelcomeScreen onStartChat={() => setShowChat(true)} />;
};

export default Index;
