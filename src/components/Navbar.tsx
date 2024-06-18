"use client"

import { User } from 'next-auth';
import { signOut, useSession } from 'next-auth/react'
import React from 'react'
import { Button } from './ui/button';
import Link from 'next/link';
function Navbar() {
    const {data : session} = useSession();
    const user : User = session?.user;
  return (
    <nav className='bg-gray-900 text-white p-4 md:p-6'>
        <div className='container flex flex-col md:flex-row justify-between items-center'>
            <a href='#' className='text-xl font-bold'>True Feedback</a>
        {
            session ? (
                <div>
                    <span className='mr-4'>
                        Welcome, {user.username || user.email}
                    </span>
                    <Button className='bg-slate-100 text-black w-full md:w-auto' variant='outline' onClick={() => signOut()}>
                        Logout
                    </Button>
                </div>
            ):(
                <Link href ='/sign-in'>
            <Button className="w-full mt-4 md:w-auto bg-slate-100 text-black" variant={'outline'}>Login</Button>
                </Link>
            )
            }
        </div>
    </nav>
  )
}

export default Navbar