import React from 'react'
import { useNavigate } from 'react-router-dom';
export const ChatBot = () => {
  const navigate = useNavigate();
  return (
    <div className=' h-20 w-20 rounded-full right-0 bg-slate-300'>
      <div onClick={() => navigate('/Chatbox')} className='bg-slate-900 h-20'></div>
    </div>
  )
}
