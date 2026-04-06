'use client';

import { uploadMultipleImage } from '@/app/_actions/mediaActions';
import { saveAs } from 'file-saver';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import ChatArea from '../ai-image/components/chat-area';
import HistorySidebar from '../ai-image/components/history-sidebar';
import InputBar from '../ai-image/components/input-bar';

const ImageGenerator = () => {
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [attachments, setAttachments] = useState([]); // Array for multiple files
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [imageUrl, setImageUrl] = useState(null);
    const [status, setStatus] = useState('idle');
    const [copied, setCopied] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(true);
    const fileInputRef = useRef(null);

    // Derived state for current chat history
    const currentChat = chats.find(c => c.id === activeChatId);
    const history = currentChat?.messages || [];

    const handleFileChange = e => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAttachments(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
        // Reset input so same file can be uploaded again
        e.target.value = '';
    };

    const removeAttachment = index => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const startNewChat = () => {
        setActiveChatId(null);
        setPrompt('');
        setAttachments([]);
        setImageUrl(null);
        setStatus('idle');
    };

    const generateImage = async () => {
        if (!prompt.trim()) return;
        setStatus('generating');

        const currentAttachments = [...attachments];
        let referenceImages = [];

        // LOGIC:
        // 1. If user uploaded a new file, use it as the reference.
        // 2. If NO new file but there is a history, use the LAST generated image as the reference.
        if (currentAttachments.length > 0) {
            referenceImages = currentAttachments.map(img => img.split(',')[1]);
        } else if (history.length > 0) {
            // history[0] is the most recent image in your state logic
            referenceImages = [history[0].url.split(',')[1]];
        }

        try {
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt:
                        referenceImages.length > 0
                            ? `Modify this image: ${prompt}`
                            : prompt,
                    aspectRatio,
                    referenceImages,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            const newItem = {
                id: Date.now(),
                url: data.url,
                prompt,
                userInputImages: currentAttachments,
                aspectRatio,
                timestamp: new Date(),
            };

            setImageUrl(data.url);

            // Update Chat History
            if (activeChatId) {
                setChats(prev =>
                    prev.map(chat =>
                        chat.id === activeChatId
                            ? {
                                  ...chat,
                                  messages: [newItem, ...chat.messages],
                                  updatedAt: new Date(),
                              }
                            : chat
                    )
                );
            } else {
                const newChatId = crypto.randomUUID();
                setChats(prev => [
                    {
                        id: newChatId,
                        title: prompt,
                        messages: [newItem],
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    ...prev,
                ]);
                setActiveChatId(newChatId);
            }

            setAttachments([]);
            setPrompt('');
            setStatus('completed');
        } catch (err) {
            toast.error(err.message || 'Generation failed');
            setStatus('idle');
        }
    };

    const generateImageVertex = async () => {
        if (!prompt.trim()) return;
        setStatus('generating');

        const currentAttachments = [...attachments];
        let imagesToSubmit = [];

        // If user uploaded files, use them.
        // Otherwise, use the last generated image as the base context (the poster).
        if (currentAttachments.length > 0) {
            imagesToSubmit = currentAttachments.map(img => img.split(',')[1]);
        } else if (history.length > 0) {
            // Grab the most recent image from history
            imagesToSubmit = [history[0].url.split(',')[1]];
        }

        try {
            const response = await fetch('/api/generate-image-vertex', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    aspectRatio,
                    referenceImages: imagesToSubmit,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            // Update your chats/history state...
            const newItem = {
                id: Date.now(),
                url: data.url,
                prompt,
                timestamp: new Date(),
            };

            setImageUrl(data.url);

            // Update Chat History
            if (activeChatId) {
                setChats(prev =>
                    prev.map(chat =>
                        chat.id === activeChatId
                            ? {
                                  ...chat,
                                  messages: [newItem, ...chat.messages],
                                  updatedAt: new Date(),
                              }
                            : chat
                    )
                );
            } else {
                const newChatId = crypto.randomUUID();
                setChats(prev => [
                    {
                        id: newChatId,
                        title: prompt,
                        messages: [newItem],
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    ...prev,
                ]);
                setActiveChatId(newChatId);
            }

            setAttachments([]);
            setPrompt('');
            setStatus('completed');
        } catch (err) {
            toast.error(err.message || 'Generation failed');
            setStatus('idle');
        }
    };
    const handleDownload = async (url, id) => {
        if (!url) return;
        setIsDownloading(true);
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            saveAs(blob, `tripwheel-art-${id}.png`);
        } catch (err) {
            toast.error('Download error');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleCloudinary = async (url, prompt) => {
        setStatus('uploading');
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const file = new File([blob], `gen-${Date.now()}.png`, {
                type: 'image/png',
            });
            const results = await uploadMultipleImage([file], {
                folder: 'ai-generated',
                tags: [prompt],
            });
            console.log(`result`, results);

            toast.success('Saved to Library');
        } catch (e) {
            toast.error('Upload failed');
        } finally {
            setStatus('completed');
        }
    };

    return (
        <div className='flex flex-col lg:flex-row gap-4 items-start w-full relative h-[calc(100vh-100px)]'>
            <HistorySidebar
                isHistoryOpen={isHistoryOpen}
                setIsHistoryOpen={setIsHistoryOpen}
                chats={chats}
                activeChatId={activeChatId}
                setActiveChatId={setActiveChatId}
                startNewChat={startNewChat}
                currentChat={currentChat}
            />

            <ChatArea
                history={history}
                status={status}
                prompt={prompt}
                attachments={attachments}
                handleDownload={handleDownload}
                handleCopy={url => {
                    navigator.clipboard.writeText(url);
                    toast.success('Link Copied');
                }}
                handleCloudinary={handleCloudinary}
                handleShare={p =>
                    navigator.share({
                        title: 'AI Art',
                        text: p,
                        url: window.location.href,
                    })
                }
                isDownloading={isDownloading}
                copied={copied}>
                <InputBar
                    prompt={prompt}
                    setPrompt={setPrompt}
                    generateImage={generateImage}
                    /*   generateImage={generateImageVertex} */
                    status={status}
                    attachments={attachments}
                    setAttachments={setAttachments}
                    removeAttachment={removeAttachment}
                    fileInputRef={fileInputRef}
                    handleFileChange={handleFileChange}
                    aspectRatio={aspectRatio}
                    setAspectRatio={setAspectRatio}
                />
            </ChatArea>
        </div>
    );
};

export default ImageGenerator;

