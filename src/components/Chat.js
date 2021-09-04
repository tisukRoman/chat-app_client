import React, { useEffect, useState } from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'
import s from '../styles/Chat.module.css'
import ScrollToBottom from 'react-scroll-to-bottom';
import ReactEmoji from 'react-emoji'
import menu from '../assets/menu.png'
import { UserList } from './UserList';

let socket;

export const Chat = ({ location }) => {

    const [listIsOpen, setListIsOpen] = useState(false);
    const [usersList, setUsersList] = useState([]);
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT = 'https://react-chat-app13.herokuapp.com/';


    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);

        socket.emit('join', { name, room }, () => { });

        return () => {
            socket.disconnect();
            socket.off();
        }
    }, [location.search, ENDPOINT]);

    useEffect(() => {
        socket.on('message', (message) => {
            console.log(message);
            setMessages(m => [...m, message])
        })
    }, [])

    useEffect(() => {
        socket.on('roomData', ({ room, users }) => {
            setUsersList([...users])
        })
    }, [messages])

    const sendHandler = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        socket.emit('sendMessage', message, () => setMessage(''))
    }

    return (
        <div className={s.container}>
            <div className={s.header}>
                <div>Room Name: {room}</div>
                <div className={s.img} onClick={() => setListIsOpen(!listIsOpen)}>
                    <img src={menu} alt="users" />
                </div>
            </div>
            <ScrollToBottom className={s.field}>
                <UserList listIsOpen={listIsOpen} usersList={usersList} />
                {messages.map((mess, i) => (
                    mess.user === 'admin' ?
                        <div key={i} className={s.adminText}>
                            {ReactEmoji.emojify(mess.text)}
                        </div>
                        :
                        mess.user === name.trim().toLowerCase() ?
                            <div className={s.yourMessage} key={i}>
                                <div className={s.username}>{mess.user}</div>
                                <div className={s.yourMessageItem} >
                                    {ReactEmoji.emojify(mess.text)}
                                </div>
                            </div>
                            :
                            <div className={s.message} key={i}>
                                <div className={s.messageItem} >
                                    {ReactEmoji.emojify(mess.text)}
                                </div>
                                <div className={s.username}>{mess.user}</div>
                            </div>
                ))}
            </ScrollToBottom>
            <div className={s.inputPanel}>
                <input
                    onKeyPress={e => e.key === 'Enter' && sendHandler(e)}
                    onChange={e => setMessage(e.target.value)}
                    value={message}
                    type="text"
                    className={s.input}
                />
                <button
                    onClick={sendHandler}
                    className={s.button}
                >SEND</button>
            </div>
        </div>
    )
}
