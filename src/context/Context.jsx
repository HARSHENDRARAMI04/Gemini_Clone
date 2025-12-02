import { createContext, useState } from "react";
import PropTypes from "prop-types";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = ({ children }) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState([]);  // Changed to an array

    const delayPara = (index, nextWord, role) => {
        setTimeout(() => {
            setResultData(prev => {
                const lastMessage = prev.length > 0 ? prev[prev.length - 1] : null;
                
                if (lastMessage && lastMessage.role === role) {
                    return prev.map((msg, i) =>
                        i === prev.length - 1 ? { ...msg, content: msg.content + " " + nextWord } : msg
                    );
                } else {
                    return [...prev, { role, content: nextWord }];
                }
            });
        }, 30 * index);
    };

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setResultData([]);
    };

    const onSent = async (prompt) => {
        setLoading(true);
        setShowResult(true);

        let currentPrompt = prompt || input;

        if (!prompt) {
            setPrevPrompts(prev => [...prev, input]);
            setRecentPrompt(input);
        } else {
            setRecentPrompt(prompt);
        }

        setResultData(prev => [...prev, { role: "user", content: currentPrompt }]);

        let response = await run(currentPrompt);
        let responseArray = response.split("**");
        let formattedResponse = responseArray.map((text, i) => (i % 2 === 1 ? `<b>${text}</b>` : text)).join("");
        let finalResponse = formattedResponse.split("*").join("</br>");
        let responseWords = finalResponse.split(" ");

        // setResultData(prev => [...prev, { role: "user", content: currentPrompt }]);

        responseWords.forEach((word, i) => delayPara(i, word, "gemini"));

        setLoading(false);
        setInput("");
    };

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
    };

    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    );
};

ContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ContextProvider;
