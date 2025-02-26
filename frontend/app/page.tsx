'use client'

import { Client } from '@stomp/stompjs';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  
  // useEffect(() => {
  //   const onConnected = () => {
  //     console.log('Connected!')
  //     client.subscribe("/topic/greetings", (msg) => {
  //       if (msg) {
  //         const jsonBody = JSON.parse(msg.body)
  //         console.log("JSON BODY: ")
  //         console.log(jsonBody)
  //       }
  //     })
  //   }

  //   const onDisconnected = () => {
  //     console.log("Disconnected!")
  //   }

  //   const client = new Client({
  //     brokerURL: 'ws://localhost:8080/ws',
  //     onConnect: onConnected,
  //     onDisconnect: onDisconnected
  //   })

  //   client.activate()

  //   return () => {
  //     client.forceDisconnect()
  //   }
  // }, [])

  return (
    <div className='mt-10'>
      <div className='w-fit m-auto'>
        <div className='flex flex-col justify-start mb-3 gap-y-3 xl:text-base text-sm'>
          <div>$ WELCOME TO HIVE_MIND.TMP</div>
          <Link href="/login" className='hover:text-[#C0C0C0]'>
            {'>'} Login to hive
          </Link>
          <div>
          <Link href="/register" className='hover:text-[#C0C0C0]'>
            {'>'} New user? create account
          </Link>
          </div>
        </div>
        {/* <div className='flex flex-col items-center justify-center xl:text-[0.8vw] text-[2.2vw]'>
          <div className='hover:text-[#C0C0C0] cursor-pointer'>
          {'█▓▒░'} CONNECT TO HIVE {'░▒▓█'}
          </div>
        </div> */}
      </div>
    </div>
  );
}