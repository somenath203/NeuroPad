'use client';

import { useChat } from 'ai/react';
import { useUser } from '@clerk/nextjs';
import { Bot, BotIcon, Send, Trash, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';


const RenderChatMessages = ({ message: { role, content } }) => {

    const { user } = useUser();

    const isMessageFromAI = role === 'assistant';

    return (
        <div className={cn('mb-3 flex items-center', isMessageFromAI ? 'justify-start me-5' : 'justify-end ms-5')}>

            { isMessageFromAI && <BotIcon className='mr-2 shrink-0' /> }

            <p className={cn('whitespace-pre-line rounded-md border px-3 py-2', isMessageFromAI ? 'bg-background' : 'bg-primary text-primary-foreground')}>
                {content}
            </p>

            {!isMessageFromAI && user?.imageUrl && (
                <Image 
                    src={user.imageUrl} 
                    alt='user image' 
                    width={100} 
                    height={100} 
                    className='ml-2 rounded-full h-10 w-10 object-cover'
                />
            )}

        </div>
    )

}


const AiChatBot = ({ open, onClose }) => {


  const { messages, input, handleInputChange, handleSubmit, setMessages, isLoading, error } = useChat();


  const inputUserMessageRef = useRef(null);

  const scrollRef = useRef(null);


  useEffect(() => {

    if (scrollRef.current) {

        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

  }, [messages]);


  useEffect(() => {

    if (open) {

        inputUserMessageRef.current.focus();

    }

  }, [open]);


  const isLastMessageSentByUser = messages[messages.length - 1]?.role === 'user';


  return (
    <div className={cn('bottom-0 right-0 xl:right-36 z-10 w-full max-w-[500px] p-1', open ? 'fixed' : 'hidden')}>
        
        <Button variant='ghost' onClick={onClose} className='mb-1 ms-auto block'>

            <XCircle size={30} />

        </Button>

        <div className="h-[600px] flex flex-col rounded bg-background border shadow-xl">

            <div className='h-full m-2 px-3 overflow-y-auto' ref={scrollRef}>

                {messages.map((message) => (

                    <RenderChatMessages message={message} key={message?.id} />

                ))}

                {isLoading && isLastMessageSentByUser && (

                    <RenderChatMessages message={{ role: 'assistant', content: 'Thinking...' }} />
                )}

                {error && (

                    <RenderChatMessages message={{ role: 'assistant', content: 'Something went wrong. Please try again.' }} />

                )}

                {!error && messages?.length === 0 && (

                    <div className='h-full flex flex-col items-center justify-center gap-3'>

                        <Bot className='size-8' />

                        <span>Ask AI your questions regarding any added note.</span>

                    </div>

                )}

            </div>

            <form onSubmit={handleSubmit} className='m-3 flex gap-1'>

                <Button 
                    disabled={isLoading}
                    title='Clear Chat' 
                    variant='outline' 
                    size='icon' 
                    type='button'
                    className='shrink-0' 
                    onClick={() => setMessages([])} 
                >

                    <Trash />

                </Button>

                <Input 
                    value={input} 
                    onChange={handleInputChange} 
                    placeholder='ask something...'
                    ref={inputUserMessageRef}
                />

                <Button type='submit' disabled={isLoading}>
                    <Send />
                </Button>

            </form>

        </div>

    </div>
  )
}

export default AiChatBot;
