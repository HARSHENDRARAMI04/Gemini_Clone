/* eslint-disable no-unused-vars */
import React, { useContext } from 'react';
import "./Main.css";
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';

const Main = () => {
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context);

    return (
        <div className='main'>
            <div className="nav">
                <p>Gemini</p>
                <img src={assets.user_icon} alt="" />
            </div>

            <div className="main-container">
                {!showResult ? (
                    <div className="greet">
                        <p><span>Hello, Harshendra</span></p>
                    </div>
                ) : (
                    <div className='result'>
                        {resultData.map((message, index) => (
                            <div key={index} className="message-container">
                                {/* User prompt */}
                                {message.role === "user" && (
                                    <div className="message-text user">
                                        <span dangerouslySetInnerHTML={{ __html: message.content }} />
                                    </div>
                                )}

                                {/* Gemini response */}
                                {message.role === "gemini" && (
                                    <div className="message-text gemini">
                                        <img src={assets.logo} alt="Gemini Logo" className="gemini-logo" />
                                        <span dangerouslySetInnerHTML={{ __html: message.content }} />
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && <div className="loader">
                            <img src={assets.logo} alt="Gemini Logo" className="gemini-logo" />
                        </div>
                        }
                    </div>
                )}

                <div className="main-bottom">
                    <div className="search-box">
                        <input
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            type="text"
                            placeholder='Enter a prompt here'
                        />
                        <div>
                            <img src={assets.gallery_icon} alt="" />
                            <img src={assets.mic_icon} alt="" />
                            {input && <img onClick={() => onSent()} src={assets.send_icon} alt="" />}
                        </div>
                    </div>
                    <p className="bottom-info">Gemini is gr8</p>
                </div>
            </div>
        </div>

    );
};

export default Main;
