import React, {  useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

function Chat({tochat,socket}) {
      const [currentmessage, setcurrentmessage] = useState("");
      const [messagelist,setmessagelist] = useState([]);

      //socket. off() does not stop the this client-side socket from receiving any server-sent messages, it just prevents the specified event handler from firing.
      socket.off("receive_message").on("receive_message", (data) => {
            setmessagelist((list)=>[...list,data]);
      });

      useEffect(()=>{
            setcurrentmessage("");
            setmessagelist([]);
      },[tochat])

      return (
            <div className="opp">
            <div className="chat-window">
                  <div className="chat-header">
                        <p>Live Chat</p>
                  </div>
                  <div className="chat-body">
                  <ScrollToBottom className='message-container'>
                        {
                              messagelist.map((messagecontent)=>{
                                    
                                          return (
                                                <div className="message" id ={tochat.recv_username === messagecontent.author ? "you" : "other"}>
                                                      <div>
                                                            <div className="message-content">
                                                                  <p>{messagecontent.message}</p>
                                                            </div>
                                                            <div className="message-meta">
                                                                  <p id="time">{messagecontent.time}</p>
                                                                  <p id="author">{messagecontent.author}</p>
                                                            </div>
                                                      </div>
                                                </div>
                                          );
      
                              })
                        }
                  </ScrollToBottom>
                  </div>
                  <div className="chat-footer">
                        <input type="text" value = {currentmessage} placeholder="Hey..." onChange={(event) => {setcurrentmessage(event.target.value) }}/>
                        <button onClick={(event) => {

                              if(event.type === 'keypress' && event.key === 'Enter' || event.type === 'click'){
                                    if (currentmessage !== "") {
                                          const messagedata = {
                                                room:tochat.send_id ,
                                                author: tochat.recv_username,
                                                message: currentmessage, 
                                                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
                                          };
                                          console.log(tochat);
                                          socket.emit("send_message", messagedata);
                                          setmessagelist((list)=>[...list,messagedata]);
                                          setcurrentmessage("");
                                    }
                              }

                        }}>&#9658;</button>
                  </div>
                  </div>
            </div>
      );
}

export default Chat;