import React from 'react'
const Header = () => {
  return (
    <header className='h-[10vh] w-full bg-black px-[2rem] flex justify-between items-center'>
        <div className='w-auto h-full flex items-center gap-2'>
            <img className='w-auto h-[75%]' src='/assets/logo.svg' alt='logo'/>
            <h1 className='font-bold text-4xl text-(--primary)'>Finbook</h1>
        </div>
    </header>
  )
}

export default Header