import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageCircle, User, Bot, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  userName: string;
}

// Mock AI responses for astronomy questions
const astronomyResponses = {
  "what is a star": "A star is a massive ball of plasma held together by gravity. Stars are primarily composed of hydrogen and helium, and they generate energy through nuclear fusion in their cores. Our Sun is the closest star to Earth!",
  
  "how many planets": "There are 8 planets in our solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Pluto was reclassified as a dwarf planet in 2006.",
  
  "what is a galaxy": "A galaxy is a vast system of stars, gas, dust, and dark matter held together by gravity. Our Milky Way galaxy contains hundreds of billions of stars and is just one of trillions of galaxies in the observable universe.",
  
  "black hole": "A black hole is a region of spacetime where gravity is so strong that nothing, not even light, can escape. They form when massive stars collapse at the end of their life cycle or when galaxies merge.",
  
  "solar system": "Our solar system consists of the Sun and everything that orbits around it, including 8 planets, dwarf planets, moons, asteroids, comets, and other celestial objects. It formed about 4.6 billion years ago from a cloud of gas and dust.",
  
  "mars": "Mars is the fourth planet from the Sun and is often called the 'Red Planet' due to its reddish appearance. It has the largest volcano in the solar system (Olympus Mons) and evidence suggests it once had liquid water on its surface.",
  
  "jupiter": "Jupiter is the largest planet in our solar system and the fifth from the Sun. It's a gas giant with a Great Red Spot (a massive storm) and at least 79 moons. Jupiter acts as a 'cosmic vacuum cleaner' protecting Earth from many asteroids.",
  
  "saturn": "Saturn is the sixth planet from the Sun and is famous for its spectacular ring system. It's another gas giant and has at least 82 moons. The rings are made mostly of ice particles and rock debris.",
  
  "moon": "The Moon is Earth's only natural satellite. It formed about 4.5 billion years ago, likely from debris left over after a Mars-sized object collided with Earth. The Moon's gravity causes ocean tides on Earth.",
  
  "constellation": "A constellation is a group of stars that form a recognizable pattern in the night sky. There are 88 officially recognized constellations. Ancient civilizations used them for navigation and storytelling.",
  
  "nebula": "A nebula is a cloud of gas and dust in space. Some nebulae are regions where new stars are forming, while others are the remains of dead stars. They can be some of the most beautiful objects in the universe.",
  
  "supernova": "A supernova is a powerful explosion that occurs when a massive star reaches the end of its life. These explosions can briefly outshine entire galaxies and are responsible for creating many of the heavy elements in the universe.",
  
  "light year": "A light year is the distance that light travels in one year, about 5.88 trillion miles (9.46 trillion kilometers). It's used to measure vast distances in space. The nearest star to Earth (Proxima Centauri) is about 4.2 light years away.",
  
  "big bang": "The Big Bang theory is the prevailing cosmological model explaining the origin of the universe. It suggests that the universe began as an extremely hot and dense point about 13.8 billion years ago and has been expanding ever since.",
  
  "dark matter": "Dark matter is a mysterious substance that makes up about 27% of the universe's mass-energy content. It doesn't emit, absorb, or reflect light, making it invisible, but its gravitational effects can be observed.",
  
  "exoplanet": "An exoplanet is a planet that orbits a star outside our solar system. Thousands of exoplanets have been discovered, and some may have conditions suitable for life. The search for exoplanets helps us understand planet formation and the potential for life elsewhere.",
  
  "asteroid": "Asteroids are rocky objects that orbit the Sun, mostly found in the asteroid belt between Mars and Jupiter. They range in size from tiny pebbles to objects hundreds of miles across. Some asteroids have struck Earth in the past.",
  
  "comet": "Comets are icy bodies that orbit the Sun. When they get close to the Sun, they develop a glowing coma and tail. Comets are often called 'dirty snowballs' because they're made of ice, dust, and rock.",
  
  "meteor": "A meteor is a streak of light in the sky caused by a meteoroid (a small piece of asteroid or comet) burning up as it enters Earth's atmosphere. If it survives and hits the ground, it's called a meteorite.",
  
  "pulsar": "A pulsar is a highly magnetized rotating neutron star that emits beams of electromagnetic radiation. They were first discovered as radio sources that pulse at regular intervals, hence the name 'pulsar'."
};

const MessagingPanel = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI Astronomy Assistant. Ask me anything about stars, planets, galaxies, or space exploration! 🌟",
      isUser: false,
      timestamp: new Date(),
      userName: 'AI Assistant'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for specific keywords and return relevant responses
    for (const [keyword, response] of Object.entries(astronomyResponses)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }
    
    // Default responses for general questions
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! I'm excited to help you explore the cosmos! What would you like to learn about today?";
    }
    
    if (lowerMessage.includes('thank')) {
      return "You're welcome! I love sharing knowledge about the universe. Feel free to ask more questions!";
    }
    
    if (lowerMessage.includes('help')) {
      return "I can help you learn about stars, planets, galaxies, black holes, the solar system, and much more! Just ask me anything about astronomy or space exploration.";
    }
    
    // Generic response for unrecognized questions
    return "That's an interesting question! While I'm focused on astronomy and space science, I'd be happy to help you learn about stars, planets, galaxies, black holes, the solar system, or any other cosmic topics. Could you rephrase your question about space?";
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      isUser: true,
      timestamp: new Date(),
      userName: user.name || 'Space Explorer'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setLoading(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(newMessage.trim());
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date(),
        userName: 'AI Assistant'
      };

      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const suggestedQuestions = [
    "What is a star?",
    "How many planets are in our solar system?",
    "What is a black hole?",
    "Tell me about Mars",
    "What is a galaxy?"
  ];

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-2">
          <Bot className="h-5 w-5 text-purple-400" />
          AI Astronomy Assistant
        </CardTitle>
        <p className="text-blue-200/80 text-sm">Ask me anything about the cosmos! 🌌</p>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 px-6 pb-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    message.isUser
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'bg-white/10 text-blue-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {message.isUser ? (
                      <User className="h-3 w-3" />
                    ) : (
                      <Bot className="h-3 w-3" />
                    )}
                    <span className="text-xs font-medium opacity-80">
                      {message.userName}
                    </span>
                    <span className="text-xs opacity-60">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-blue-200 rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Bot className="h-3 w-3" />
                    <span className="text-xs font-medium opacity-80">AI Assistant</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="animate-bounce">●</div>
                    <div className="animate-bounce" style={{animationDelay: '0.1s'}}>●</div>
                    <div className="animate-bounce" style={{animationDelay: '0.2s'}}>●</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="px-6 pb-4">
            <p className="text-blue-200/60 text-sm mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setNewMessage(question)}
                  className="text-xs border-white/20 text-blue-200 hover:bg-white/10"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="border-t border-white/10 p-4">
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask about stars, planets, galaxies..."
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-blue-200/60 focus:border-purple-400 focus:ring-purple-400/20"
              disabled={!user || loading}
            />
            <Button
              type="submit"
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              disabled={!newMessage.trim() || !user || loading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessagingPanel; 