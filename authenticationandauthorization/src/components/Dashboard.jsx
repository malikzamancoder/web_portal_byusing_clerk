import Chatbot from "./Chatbot";
import { UserButton, SignOutButton } from "@clerk/clerk-react";

function Dashboard() {
  return (
    <div>
      <UserButton />
      <SignOutButton />
      <Chatbot />
    </div>
  );
}

export default Dashboard;