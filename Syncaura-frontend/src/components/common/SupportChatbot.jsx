import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
    Send,
    Pause,
    Mic,
    Bot,
    User,
    Briefcase,
    Calendar,
    HelpCircle,
    FileQuestion,
    MessageCircle,
    X,
    Dot,
    Minus,
} from "lucide-react";
import api from "../../config/axios";
const renderMessageText = (text) => {
    if (!text) return "";
    
    const lines = text.split("\n");
    return lines.map((line, idx) => {
        let content = line;
        let isH3 = false;
        let isH2 = false;
        let isBullet = false;
        let isBlockquote = false;

        if (line.startsWith("### ")) {
            content = line.substring(4);
            isH3 = true;
        } else if (line.startsWith("## ")) {
            content = line.substring(3);
            isH2 = true;
        } else if (line.startsWith("- ")) {
            content = line.substring(2);
            isBullet = true;
        } else if (line.startsWith("> ")) {
            content = line.substring(2);
            isBlockquote = true;
        }
        
        const bRegex = /\*\*(.*?)\*\*/g;
        let match;
        const parts = [];
        let lastIndex = 0;
        
        while ((match = bRegex.exec(content)) !== null) {
            if (match.index > lastIndex) {
                parts.push(content.substring(lastIndex, match.index));
            }
            parts.push(<strong key={match.index} className="font-bold text-gray-900 dark:text-white">{match[1]}</strong>);
            lastIndex = bRegex.lastIndex;
        }
        if (lastIndex < content.length) {
            parts.push(content.substring(lastIndex));
        }

        const processedLine = parts.length > 0 ? parts : content;

        if (isH3) {
            return (
                <h3 key={idx} className="text-sm font-bold mt-2 mb-1 dark:text-white text-gray-900">
                    {processedLine}
                </h3>
            );
        }
        if (isH2) {
            return (
                <h2 key={idx} className="text-base font-bold mt-3 mb-1 dark:text-white text-gray-900">
                    {processedLine}
                </h2>
            );
        }
        if (isBullet) {
            return (
                <div key={idx} className="flex items-start gap-1.5 ml-2 my-0.5 text-gray-800 dark:text-gray-200">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="flex-1">{processedLine}</span>
                </div>
            );
        }
        if (isBlockquote) {
            return (
                <blockquote key={idx} className="border-l-4 border-blue-400 pl-2 py-1 my-2 bg-gray-50 dark:bg-gray-800 italic text-xs rounded text-gray-600 dark:text-gray-300">
                    {processedLine}
                </blockquote>
            );
        }
        
        return <p key={idx} className="min-h-[1.2em]">{processedLine}</p>;
    });
};

const quickActions = [
    { id: 1, title: "Projects", desc: "Find projects", icon: Briefcase },
    { id: 2, title: "Meetings", desc: "Schedule meetings", icon: Calendar },
    { id: 3, title: "Support", desc: "Contact team", icon: HelpCircle },
    { id: 4, title: "FAQ", desc: "Common questions", icon: FileQuestion },
];

const bubbleVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1 },
};

export default function SupportChatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [micError, setMicError] = useState("");
    const [isHovered, setIsHovered] = useState(false);
    const user = useSelector((state) => state.auth.user);
const userInitial = (user?.first_name || user?.name || "U").charAt(0).toUpperCase();
    const chatRef = useRef(null);
    const bottomRef = useRef(null);
    const streamRef = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    /* Outside click close */
    useEffect(() => {
        const handler = (e) => {
            if (chatRef.current && !chatRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        if (open) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    /* Speech recognition */
    useEffect(() => {
        if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
            const SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;
            const recog = new SpeechRecognition();
            recog.lang = "en-US";
            recog.continuous = false;
            recog.interimResults = false;
            recog.onresult = (e) => {
                const transcript = e.results[0][0].transcript;
                sendMessage(transcript);
            };
            recognitionRef.current = recog;
        }
    }, []);

    const botTextRef = useRef("");

    const streamBotMessage = (text) => {
        const chunks = text.split(" ");
        let i = 0;

        botTextRef.current = "";

        setMessages((p) => [...p, { from: "bot", text: "" }]);

        streamRef.current = setInterval(() => {
            if (i >= chunks.length) {
                clearInterval(streamRef.current);
                setLoading(false);
                return;
            }

            botTextRef.current += (i === 0 ? "" : " ") + chunks[i];

            setMessages((prev) =>
                prev.map((m, idx) =>
                    idx === prev.length - 1
                        ? { ...m, text: botTextRef.current }
                        : m
                )
            );

            i++;
        }, 120);
    };



    const terminateBot = () => {
        clearInterval(streamRef.current);
        setLoading(false);
    };

    const sendMessage = async (voiceText) => {
        const text = voiceText ?? input;
        if (!text.trim()) return;

        if (loading) {
            terminateBot();
            return;
        }

        setMessages((p) => [...p, { from: "user", text }]);
        setInput("");
        setLoading(true);

        try {
            const response = await api.post("/chatbot", { message: text });
            const replyText = response.data?.reply || "I'm sorry, I couldn't get a response. Please try again.";
            streamBotMessage(replyText);
        } catch (error) {
            setLoading(false);
            const errMsg = error.response?.data?.message || "Oops! Something went wrong. Please check your connection and try again.";
            setMessages((p) => [...p, { from: "bot", text: errMsg }]);
        }
    };

    const startVoice = async () => {
        setMicError("");
        if (!navigator.mediaDevices?.getUserMedia) {
            setMicError("Microphone not supported in this browser");
            return;
        }
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            recognitionRef.current?.start();
        } catch {
            setMicError("Please plug in or allow access to a microphone");
        }
    };

    return (
        <>
            <div 
                className="fixed bottom-28 right-10 z-[9999] flex items-center gap-3"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >

                {/* Tooltip bubble */}
                {isHovered && !open && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.8 }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            scale: [1, 1.05, 1],
                            y: [0, -4, 0],
                        }}
                        transition={{
                            duration: 0.6,
                            delay: 0.3,
                            ease: "easeOut",
                            repeat: Infinity,
                            repeatDelay: 3,
                        }}
                        className="bg-blue-500 text-white absolute -top-9 rounded-br-none right-10 w-40 text-xs px-3 py-2 rounded-full shadow-md"
                    >
                        Need help? ask me!
                    </motion.div>
                )}


                {/* Button with pulse + float */}
                <motion.button
                    onClick={() => setOpen((p) => !p)}
                    whileTap={{ scale: 0.9 }}
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="relative bg-blue-500 border dark:border-white text-white p-4 rounded-full shadow-lg"
                >
                    {/* Pulse Ring */}
                    <span className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-30" />

                    {/* Icon */}
                    <img src="/images/headerchatbot.png" className="relative z-10 size-6" />
                </motion.button>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        ref={chatRef}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        className="fixed bottom-24 right-4 z-[99999] w-[96vw] sm:w-96 max-h-[85vh] bg-white dark:bg-[#111111] rounded-2xl shadow-xl dark:shadow-gray-800 dark:shadow-2xl overflow-y-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center rounded-t-2xl justify-between py-5 px-6 bg-[#2A8BEE] border-b border-[#53A2F1]  ">
                            <div className="flex items-center justify-center gap-5 ">
                                <div className="size-10 rounded-full flex items-center justify-center bg-blue-400 border border-blue-200  ">
                                    <img src="/images/headerchatbot.png" className="size-6" alt="" />
                                </div>
                                <div className="flex flex-col items-start justify-center -space-y-2 ">
                                    <h1 className="text-[#FFFFFF] text-lg font-bold" >Support ChatBot</h1>
                                    <div className="flex items-center justify-center text-[#CFE5FD] -space-x-2 ">
                                        <p className="text-base" >Online</p>
                                        <Dot className="text-[#CFE5FD] size-8" />
                                        <p className="text-base" >Instant replies</p>
                                    </div>
                                </div>

                            </div>
                            <div className="flex items-center gap-5 ">
                                <button className="btn-hover" onClick={() => setOpen(false)} >
                                    <Minus className="text-white size-6" />
                                </button>
                                <button className="btn-hover" onClick={() => setOpen(false)} >
                                    <X className="text-white size-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-3 space-y-3 dark:bg-[#111111]">
                            <div className="flex gap-4 items-end   ">
                                <div className="bg-[#E7F2FD] border border-[#D4E8FB] dark:bg-[#111E2D] dark:border-[#000000] p-2 rounded-full h-fit">
                                    <img src="/images/chatbot.png" className="size-5" alt="" />
                                </div>
                                <div className="text-sm bg-gray-100 dark:bg-[#283039] rounded-2xl rounded-bl-none w-full p-3">
                                    <p className="font-medium text-[#000000] dark:text-[#FFFFFF]">Hi there!</p>
                                    <p className="text-[#000000] dark:text-[#FFFFFF]" >What can I help you with today? 😊</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {quickActions.map((q) => (
                                    <div
                                        key={q.id}
                                        onClick={() => sendMessage(`Show me my ${q.title.toLowerCase()}`)}
                                        className="border border-gray-200 dark:bg-[#1A222C] dark:border-[#000000] pb-4 rounded-xl p-2 text-xs flex items-center gap-2 shadow-[1px_4px_5px_0_rgba(0,0,0,0.1)] cursor-pointer hover:bg-gray-50 dark:hover:bg-[#222c39] transition-all"
                                    >
                                        <q.icon className="text-[#000000] size-5 dark:text-gray-300" />
                                        <div>
                                            <p className="font-medium text-[#000000] dark:text-[#FFFFFF]">{q.title}</p>
                                            <p className=" text-[#000000] dark:text-gray-400">{q.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-3 space-y-3 no-scrollbar dark:bg-[#111111]">
                            <AnimatePresence>
                                {messages.map((m, i) => (
                                    <motion.div
                                        key={i}
                                        variants={bubbleVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className={`flex gap-2 ${m.from === "user" ? "justify-end" : "justify-start"
                                            }`}
                                    >
                                        {m.from === "bot" && (
                                            <div className="bg-[#E7F2FD] dark:bg-[#111E2D] dark:border-[#000000] border border-[#D4E8FB] p-2 rounded-full h-fit">
                                                <img src="/images/chatbot.png" className="size-5" alt="" />
                                            </div>
                                        )}

                                        <div
                                            className={`px-3 py-2 rounded-2xl  text-sm max-w-[70%] ${m.from === "user"
                                                ? "bg-[#137FEC] text-white rounded-tr-none"
                                                : "bg-[#F3F4F6] dark:bg-[#283039] dark:text-[#D0D4DB] text-gray-800 rounded-tl-none"
                                                }`}
                                        >
                                            {m.from === "bot" ? renderMessageText(m.text) : m.text}
                                        </div>

                                        {m.from === "user" && (
    <div className="bg-linear-180 from-red-400 to-red-800 p-2 rounded-full flex size-8 items-center justify-center">
        <p className="text-white text-base">{userInitial}</p>
    </div>
)}
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {loading && (
                                <p className="text-xs text-gray-400">Bot typing...</p>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        <div className="px-4 w-full flex flex-col py-4 gap-1 dark:bg-[#111418] border dark:border-[#000000] ">
                            <div className="border-t p-2 flex gap-2 items-center bg-[#F9FAFB] dark:bg-[#1A222C] border rounded-xl border-[#E2E4E9] dark:border-[#000000] py-2 px-1">
                                <button onClick={startVoice} className="text-blue-500 btn-hover">
                                    <Mic size={18} />
                                </button>
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                    className="flex-1 text-sm outline-none placeholder:text-[#9CA3AF] text-gray-800 dark:text-gray-200 bg-transparent"
                                    placeholder="Type or speak..."
                                />
                                <button
                                    onClick={() => (loading ? terminateBot() : sendMessage())}
                                    className="bg-blue-500 text-white p-2 rounded-full btn-hover"
                                >
                                    {loading ? <Pause size={16} /> : <Send size={16} />}
                                </button>
                            </div>
                            <div className="flex items-center justify-center w-full ">
                                <p className="text-[#9CA3AF] text-sm" >Powered by @SupportChat</p>
                            </div>
                        </div>

                        {micError && (
                            <p className="text-xs text-red-500 px-3 pb-2 dark:bg-[#111418]">{micError}</p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
