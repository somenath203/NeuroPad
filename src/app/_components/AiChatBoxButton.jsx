import { useState } from "react";

import AiChatBot from "./AiChatBot";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";


const AiChatBoxButton = () => {

  const [ openChatBox, setOpenChatBox ] = useState(false);

  return (
    <>
        
        <Button className='flex items-center gap-2' onClick={() => setOpenChatBox(true)}>

            <span>
                <Bot size={20} />
            </span>

            <span>AI Chat</span>

        </Button>

        <AiChatBot open={openChatBox} onClose={() => setOpenChatBox(false)} />

    </>
  )
}

export default AiChatBoxButton;