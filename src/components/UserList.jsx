import React from 'react'
import s from '../styles/Chat.module.css'

export const UserList = ({ listIsOpen, usersList}) => {
    return (
        <div className={listIsOpen ? s.userListActive : s.userList}>
            <h2>Users Online:</h2>
            <ul>
                {usersList.map(u => <li key={u.id}>{u.name}</li>)}
            </ul>
        </div>
    )
}
