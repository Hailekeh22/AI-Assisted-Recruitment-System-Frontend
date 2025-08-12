import { useAskchatbotMutation } from "@/services/chatAPI";
import { addMessage } from "@/store/slices/ChatSlice";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { MessageSquare, Send, X } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { RootState } from "../../store/store";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const dispatch = useDispatch();
  const { messages } = useSelector((state: RootState) => state.chat);
  const [sendMessage, { isLoading }] = useAskchatbotMutation();
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = { id: Date.now(), text: inputValue, sender: 'user' };
    dispatch(addMessage(userMessage));
    setInputValue('');

    try {
      const response = await sendMessage({ chatInput: inputValue }).unwrap();
      const botMessage: Message = { id: Date.now() + 1, text: response.chatOutput, sender: 'bot' };
      dispatch(addMessage(botMessage));
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = { id: Date.now() + 1, text: "Sorry, an error occurred. Please try again.", sender: 'bot' };
      dispatch(addMessage(errorMessage));
    }
  };

  return (
    <>
      {/* Chat Bubble Toggle Button */}
      <Button
        onClick={toggleChat}
        className="fixed bottom-5 right-5 z-50 h-12 w-12 rounded-full shadow-lg"
        size="icon"
      >
        <MessageSquare className="h-10 w-10" />
      </Button>

      {/* Chat Widget Window */}
      <div className={`fixed bottom-24 right-5 z-40 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
          <Card className="w-full max-w-sm h-[60vh] flex flex-col sm:max-w-md md:h-[60vh] lg:max-w-sm max-h-[calc(100vh-7rem)]">
            <CardHeader className="flex flex-row items-center justify-center p-2 border-b">
              <CardTitle className="text-lg">👋 Chat with us!</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((msg: Message) => (
                  <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-muted rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {/* The ref is attached here */}
                <div ref={chatEndRef} />
              </div>
            </CardContent>
            <CardFooter className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </CardFooter>
          </Card>
      </div>
    </>
  );
};