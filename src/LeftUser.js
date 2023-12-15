import React, { useEffect, useState } from 'react';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LeftUser = ({obj,socket,username,connectionrq,setConnectionrq,ret,setRet,setup,setSetup,setTochat,tochat}) => {
  const [sec,setSec] = useState(10);
  const [okk_for_recv,setOkkForRecv] = useState(false);
  const [okk_for_send,setOkkForSend] = useState(false);
  
  console.log(username);
  useEffect(() => {
    if (okk_for_recv === true) {
      setTimeout(() => {
        if (sec === 0) {
          setOkkForRecv(false);
          setSec(10);
          socket.emit("recvside..", {
            trueorfalse: false,
            send_username: username,
            send_id: socket.id,
            recv_id: obj.socket_id,
            recv_username : obj.username
          });
        } else {
          setSec((prevSec) => prevSec - 1);
        }
      }, 1000);
    }
  }, [okk_for_recv, sec]);
  
  useEffect(() => {
    if (connectionrq.send_id === obj.socket_id){
        setOkkForRecv(true);
        // alert(`${connectionrq.send_username} wants to talk with you`);
        toast.info(`${connectionrq.send_username} wants to talk with you ,timer is already started`,{
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTochat(connectionrq);
        setConnectionrq({});
    }
  }, [setup,connectionrq.send_id, obj.socket_id, obj.send_username]);

  useEffect(() => {
    if(ret.send_id === obj.socket_id){
      setOkkForSend(false);
      if(ret.trueorfalse === false){
        // alert(`${ret.send_username} is not intrested`);
        toast.warn(`${ret.send_username} is not intrested`,{
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setSetup(2);
      }
      else{
        setSetup(1);
        setTochat(ret);
      }
      setRet({});
    }
  },[obj.socket_id,ret.send_id,ret.trueorfalse,ret.send_username])

  const requestforchat = (obj) => {
    setOkkForSend(true);
    socket.emit('request',obj);
  }

  if(tochat.send_username === obj.username && setup === 1){
    return (
      <div className='live'>
      you are in live chat with {obj.username} <button><span class="close">+</span></button>
      </div>
    );
  }
  else{
    return (
      <div>
        <button className="button-5" type="submit" key={obj.username} disabled={setup===1} onClick={()=>requestforchat({send_username:username,send_id:socket.id,recv_id:obj.socket_id,recv_username:obj.username})}> {obj.username} </button>
        {okk_for_send === true && (<p>request ...</p> )}
        {okk_for_recv === true && (<p>{`please select any one option ${sec} sec(after 10 sec - automatic No)`}</p>)}
        {okk_for_recv &&
          (
          <div>
            <button onClick={() => {
              setOkkForRecv(false);
              setSec(10);
              socket.emit("recvside..", {
              trueorfalse: true,
              send_username: username,
              send_id: socket.id,
              recv_id: obj.socket_id,
              recv_username : obj.username
            });
            setSetup(1);
            }}>Yes</button>
            <button onClick={() => {
              setOkkForRecv(false);
              setSec(10);
              socket.emit("recvside..", {
              trueorfalse: false,
              send_username: username,
              send_id: socket.id,
              recv_id: obj.socket_id,
              recv_username:obj.username
            })
            setSetup(2);
            }}>No</button>
          </div>
        )
        }
        <br />
        <ToastContainer />
      </div>
    )
  }
}

export default LeftUser;