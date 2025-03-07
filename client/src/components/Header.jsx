import React from 'react'
const Header = () => {
  return (
    <header className='h-[8vh] md:h-[10vh] w-full px-4 md:px-8 flex justify-between items-center'>
        <div className='w-auto h-full flex items-center gap-2'>
            <img className='w-auto h-[50%]' src='/assets/logo.svg' alt='logo'/>
            <h1 className='font-bold text-3xl md:text-4xl text-(--primary)'>Finbook</h1>
        </div>
    </header>
  )
}

export default Header