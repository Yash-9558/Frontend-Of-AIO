import './App.css';
import io from "socket.io-client";
import {useState,useEffect} from 'react';
import Chat from "./Chat";
import LeftUser from './LeftUser';
const socket = io.connect("https://backend-of-aio.onrender.com");

function App() {
  const [username, setusername] = useState("");
  const [setup,setSetup] = useState(0);

  //0 - start
  //1 - showchat
  //2 - welcome to the anonymous world
  //3 - user already exist
  
  const [all, setAll] = useState([]);
  const [connectionrq,setConnectionrq] = useState({});
  const [ret,setRet] = useState({});
  const [tochat,setTochat] = useState({});

  useEffect(()=>{
    socket.emit('getUsers');
  },[])

  socket.off('recv_users').on('recv_users',(users)=>{
    setAll(users);
  })

  socket.off('enter').on('enter', (users) => {
    setAll(users);
  });

  socket.off('exit').on('exit',(users) => {
    setAll(users);
  })

  socket.off('response').on('response',(obj) => {
    setConnectionrq(obj);
  })

  socket.off('senderside..').on('senderside..',(obj)=>{
    setRet(obj);
  })

  const join = () => {
    if (username !== ""){
      //pehla thi j user load kari didha aama
      const userExists = all.some((user) => user.username === username);
      if (userExists) {
        setSetup(3);
      } else {
        socket.emit("join", username);
        setSetup(2);
      }
    }
  };

  console.log(all);

  return (
    <div className="App">
      <div className="left">
      {(setup === 2 || setup === 1) && (<p className="username">welcome back {username}</p>)}
          {(setup === 2 || setup === 1) && 
            (<div>
            <h1>all online users</h1>
            {all.map((ele)=>{
              if(ele.username !== username){
                return(
                  <LeftUser tochat={tochat} obj={ele} socket={socket} username={username} connectionrq={connectionrq} setConnectionrq={setConnectionrq} ret = {ret} setRet = {setRet} setup={setup} setSetup={setSetup} setTochat={setTochat}/>
                )
              }
            })}
            </div>
            )
          }
      </div>
    <div className="right">
      {setup === 0 && 
      (
        <div className="joinChatContainer">
        <h2>Real Time Chat with Anonymous users</h2>
        <input type="text" placeholder="john..." value={username} onChange={(event) => {setusername(event.target.value);}}/>
        <button onClick={() => join()}>join a chat</button>
        </div>
      )
      }
      {setup === 2 &&
        (<div>
          <h1 className='setup-2'>welcome to the anonymous world</h1>
          <h2 className='setup-2-h2'>click on user to begin chat</h2>
        </div>)
      }
      {setup === 3 &&
        (<div className="joinChatContainer">
        <h2>user already exists</h2>
        <h2>Real Time Chat with Anonymous users</h2>
        <input type="text" placeholder="john..." value={username} onChange={(event) => {setusername(event.target.value);}}/>
        <button onClick={() => join()}>join a chat</button>
        </div>)
      }
      {setup === 1 && <Chat tochat={tochat} socket={socket}/>}
    </div>
    </div>
  );
}

export default App;