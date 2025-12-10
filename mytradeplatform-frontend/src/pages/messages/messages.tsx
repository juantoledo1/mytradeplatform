import { useEffect, useState } from "react";
import classNames from "classnames";
import {
  attachIcon,
  chatIcon,
  doubleCheck,
  plusIcon,
  searchIcon,
  sendIcon,
} from "../../base/SVG";
import styles from "./messages.module.scss";

import placeholder from "@/assets/images/placeholder.png";
import { useNavigate } from "react-router-dom";
import { CustomButton } from "../../components/custom-button/custom-button";
import { messageList } from "../../constants/modul";

// third party
import { apiClient } from "@/services/api/client";
import BarLoader from "react-spinners/BarLoader";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// project import
import { SERVER_URL } from '../../config';
import { m } from "framer-motion";


export default function Messages() {
  const [loaded, setLoaded] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [message, setMessage] = useState("");

  const [chatFilterTerm, setChatFilterTerm] = useState("");
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);

  const [loadingSelectedChatMessages, setLoadingSelectedChatMessages] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedChatMessages, setSelectedChatMessages] = useState([]);

  const navigate = useNavigate();
  const handleSelectChat = (id) => {
    setChats(
      chats.map((msg) => ({
        ...msg,
        active: msg.id === id,
      }))
    );
    setMessage("");
    setSelectedChat(chats.find((msg) => msg.id === id));

    getChatMessages(id);
  };

  const logout = () => {
    // Limpiar localStorage al hacer logout
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    navigate("/auth/");
  };
  const getChats = () => {
    apiClient.get('/api/notifications/')
      .then((response) => {
        setChats(response.data);
        setFilteredChats(response.data);

        setLoaded(true);
      })
      .catch((error) => {

        // Check if error code 401
        if (error.response && error.response.status === 401) {
          // If so, logout
          logout();
          return;          
        }

        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  }

  const getChatMessages = (chatId) => {
    setLoadingSelectedChatMessages(true);

    apiClient.get(`/api/chats/${chatId}/messages`)
      .then((response) => {
        setSelectedChatMessages(response.data);

        setLoadingSelectedChatMessages(false);
      })
      .catch((error) => {
        setLoadingSelectedChatMessages(false);
        // Check if error code 401
        if (error.response && error.response.status === 401) {
          // If so, logout
          logout();
          return;
        }

        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  }

  const sendMessage = (chatId, message) => {
    setSendingMessage(true);

    apiClient.post(`/api/chats/${chatId}/messages`, {
      message
    })
      .then((response) => {

        // Update selected chat messages
        setSelectedChatMessages(response.data.messages);

        // Scroll to bottom in chat
        const chatBody = document.getElementById("chatBody");
        if (chatBody) {
          chatBody.scrollTop = chatBody.scrollHeight;
        }

        setSendingMessage(false);
      })
      .catch((error) => {
        setSendingMessage(false);
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  }

  const handleSendMessage = () => {
    if (!message.trim()) return;

    sendMessage(selectedChat.id, message);
    setMessage("");
  };

  // Catch enter key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleSendMessage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [message, selectedChat]);

  useEffect(() => {
    getChats();
  }, []);

  const filterChats = (searchTerm) => {

    if (!searchTerm) {
      setFilteredChats(chats);
      return;
    }

    const filtered = chats.filter(chat =>
      chat.last_message.toLowerCase().includes(searchTerm.toLowerCase())
      || chat.title.toLowerCase().includes(searchTerm.toLowerCase())
      || chat.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredChats(filtered);
  };

  useEffect(() => {
    filterChats(chatFilterTerm);
  }, [chatFilterTerm]);

  useEffect(() => {
    // Scroll to bottom in chat
    const chatBody = document.getElementById("chatBody");
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }, [loadingSelectedChatMessages]);

  if (!loaded) {
    return (
      <div
        className='flex justify-center items-center'
        style={{ height: "100vh", backgroundColor: "#fff" }}
      >
        <div
          style={{ top: "20vh", position: "relative" }}
        >
          <BarLoader color="#209999" 
            cssOverride={{
              display: "block",
              margin: "10vh auto",
              borderColor: "red",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <section className={styles["message"]}>
      <div className="auto__container">
        <div className={styles["message__inner"]}>
          <div className={styles["side"]}>
            <div className={styles["side__top"]}>
              <div className={styles["side__title"]}>
                <h4>
                  {chatIcon}
                  Messages
                </h4>
                {/*<button type="button">{plusIcon}</button>*/}
              </div>
              <div className={styles["side__search"]}>
                <span>{searchIcon}</span>
                <input
                  type="search"
                  placeholder="Search conversations..."
                  onChange={(e) => setChatFilterTerm(e.target.value)}
                />
              </div>
            </div>
            <div className={styles["side__col"]}>
              {filteredChats.length > 0 && (filteredChats.map((item, index) => {
                return (
                  <Item
                    {...item}
                    key={index}
                    onClick={() => handleSelectChat(item.id)}
                  />
                );
              }))}
              {
                filteredChats.length === 0 && (
                  <div 
                    style={{
                      padding: "1rem",
                      textAlign: "center",
                      color: "#999"
                    }}
                  >
                    <p>No chats found.</p>
                  </div>
                )
              }
            </div>
          </div>
          <div className={styles["chat"]}>
            {!selectedChat ? (
              <div className={styles["welcome"]}>
                <span>{chatIcon}</span>
                <h6>Select a conversation</h6>
                <p>Choose a conversation from the list to start chatting</p>
              </div>
            ) : loadingSelectedChatMessages ? (
              <div 
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  color: "#999",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <BarLoader color="#209999" />
              </div>
            ) : (
              <>
                <div className={styles["chatTop"]}>
                  <div
                    className={styles["chatProfile"]}
                    onClick={() => navigate("/user-profile")}
                  >
                    <div className={styles["chatProfile__avatar"]}>
                      <img src={SERVER_URL + "/profiles/" + (selectedChat.avatar || "default.png")} alt="avatar" />
                    </div>
                    <div className={styles["chatProfile__name"]}>
                      <h6>{selectedChat.username}</h6>
                      <div className={styles["chatProfile__info"]}>
                        <span>Online</span>
                        <p>{selectedChat.title}</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles["chatTop__item"]}>
                    <span>
                      <img src={placeholder} alt="avatar" />
                    </span>
                    <p>{selectedChat.title}</p>
                  </div>
                </div>
                <div
                  className={styles["chatBody"]}
                  id="chatBody"
                >
                  {
                    selectedChatMessages.length === 0 && (
                      <div
                        style={{
                          padding: "1rem",
                          textAlign: "center",
                          color: "#999"
                        }}
                      >
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    )
                  }
                  {
                    selectedChatMessages.map((message, index) => (
                      <div key={index} className={message.from_user_id == selectedChat.other_user_id ? styles["messageIn"] : styles["messageOut"]}>
                        <div className={message.from_user_id == selectedChat.other_user_id ? styles["messageIn__text"] : styles["messageOut__text"]}>
                          {message.message}
                        </div>
                        <div className={message.from_user_id == selectedChat.other_user_id ? styles["messageIn__time"] : styles["messageOut__time"]}>
                          {doubleCheck}
                          07:00 PM
                        </div>
                      </div>
                    ))
                  }
                  {/*<div className={styles["messageOut"]}>
                    <div className={styles["messageOut__text"]}>
                      Hi! I'm interested in trading for your TaylorMade driver.
                    </div>
                    <div className={styles["messageOut__time"]}>
                      {doubleCheck}
                      07:00 PM
                    </div>
                  </div>
                  <div className={styles["messageIn"]}>
                    <div className={styles["messageIn__avatar"]}>
                      <img src={selectedChat.avatar} alt="avatar" />
                    </div>
                    <div className={styles["messageIn__content"]}>
                      <div className={styles["messageIn__text"]}>
                        Great! What do you have to trade? I'm looking for
                        putters or wedges.
                      </div>
                      <div className={styles["messageIn__time"]}>07:00 PM</div>
                    </div>
                  </div>
                  <div className={styles["messageOut"]}>
                    <div className={styles["messageOut__text"]}>
                      I have a Scotty Cameron Newport 2 putter in excellent
                      condition.
                    </div>
                    <div className={styles["messageOut__time"]}>
                      {doubleCheck}
                      07:20 PM
                    </div>
                  </div>
                  <div className={styles["messageIn"]}>
                    <div className={styles["messageIn__avatar"]}>
                      <img src={selectedChat.avatar} alt="avatar" />
                    </div>
                    <div className={styles["messageIn__content"]}>
                      <div className={styles["messageIn__text"]}>
                        When would be a good time to meet for the trade?
                      </div>
                      <div className={styles["messageIn__time"]}>07:30 PM</div>
                    </div>
                  </div>{" "}
                  <div className={styles["messageOut"]}>
                    <div className={styles["messageOut__text"]}>
                      Hi! I'm interested in trading for your TaylorMade driver.
                    </div>
                    <div className={styles["messageOut__time"]}>
                      {doubleCheck}
                      07:00 PM
                    </div>
                  </div>
                  <div className={styles["messageIn"]}>
                    <div className={styles["messageIn__avatar"]}>
                      <img src={selectedChat.avatar} alt="avatar" />
                    </div>
                    <div className={styles["messageIn__content"]}>
                      <div className={styles["messageIn__text"]}>
                        Great! What do you have to trade? I'm looking for
                        putters or wedges.
                      </div>
                      <div className={styles["messageIn__time"]}>07:00 PM</div>
                    </div>
                  </div>
                  <div className={styles["messageOut"]}>
                    <div className={styles["messageOut__text"]}>
                      I have a Scotty Cameron Newport 2 putter in excellent
                      condition.
                    </div>
                    <div className={styles["messageOut__time"]}>
                      {doubleCheck}
                      07:20 PM
                    </div>
                  </div>
                  <div className={styles["messageIn"]}>
                    <div className={styles["messageIn__avatar"]}>
                      <img src={selectedChat.avatar} alt="avatar" />
                    </div>
                    <div className={styles["messageIn__content"]}>
                      <div className={styles["messageIn__text"]}>
                        When would be a good time to meet for the trade?
                      </div>
                      <div className={styles["messageIn__time"]}>07:30 PM</div>
                    </div>
                  </div>
                  <div className={styles["messageOut"]}>
                    <div className={styles["messageOut__text"]}>
                      Hi! I'm interested in trading for your TaylorMade driver.
                    </div>
                    <div className={styles["messageOut__time"]}>
                      {doubleCheck}
                      07:00 PM
                    </div>
                  </div>
                  <div className={styles["messageIn"]}>
                    <div className={styles["messageIn__avatar"]}>
                      <img src={selectedChat.avatar} alt="avatar" />
                    </div>
                    <div className={styles["messageIn__content"]}>
                      <div className={styles["messageIn__text"]}>
                        Great! What do you have to trade? I'm looking for
                        putters or wedges.
                      </div>
                      <div className={styles["messageIn__time"]}>07:00 PM</div>
                    </div>
                  </div>
                  <div className={styles["messageOut"]}>
                    <div className={styles["messageOut__text"]}>
                      I have a Scotty Cameron Newport 2 putter in excellent
                      condition.
                    </div>
                    <div className={styles["messageOut__time"]}>
                      {doubleCheck}
                      07:20 PM
                    </div>
                  </div>
                  <div className={styles["messageIn"]}>
                    <div className={styles["messageIn__avatar"]}>
                      <img src={selectedChat.avatar} alt="avatar" />
                    </div>
                    <div className={styles["messageIn__content"]}>
                      <div className={styles["messageIn__text"]}>
                        When would be a good time to meet for the trade?
                      </div>
                      <div className={styles["messageIn__time"]}>07:30 PM</div>
                    </div>
                  </div>*/}
                </div>
                <div className={styles["messageStart"]}>
                  <CustomButton
                    styleType="primary"
                    title="Start Trade"
                    onClick={() => navigate("/trade/steps")}
                  />
                </div>
                <div className={styles["chatFoot"]}>
                  <div className={styles["input"]}>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  <button type="button" className={styles["chatFoot__attach"]}>
                    {attachIcon}
                  </button>
                  <button
                    type="button"
                    className={styles["chatFoot__send"]}
                    onClick={handleSendMessage}
                    disabled={sendingMessage}
                  >
                    {sendIcon}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const Item = (props) => {
  return (
    <div
      className={classNames(styles["item"], {
        [styles.active]: props.active,
      })}
      onClick={props.onClick}
    >
      <div className={styles["item__avatar"]}>
        <img src={`${SERVER_URL}/profiles/${props.avatar || "default.png"}`} alt="avatar" />
        {props.message ? <span></span> : ""}
      </div>
      <div className={styles["item__content"]}>
        <div className={styles["item__row"]}>
          <h6>{props.username}</h6>
          <div className={styles["item__date"]}>
            {props.message ? <span>{props.message}</span> : ""}
            <p>{props.create_ts}</p>
          </div>
        </div>
        <div className={styles["item__title"]}>{props.title}</div>
        <div className={styles["item__text"]}>
          <p>{props.text}</p>
        </div>
      </div>
    </div>
  );
};

