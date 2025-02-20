'use client'

import { Client } from '@stomp/stompjs';
import { useEffect } from 'react';

export default function Home() {

  
  useEffect(() => {
    const onConnected = () => {
      console.log('Connected!')
      client.subscribe("/topic/greetings", (msg) => {
        if (msg) {
          const jsonBody = JSON.parse(msg.body)
          console.log("JSON BODY: ")
          console.log(jsonBody)
        }
      })
    }

    const onDisconnected = () => {
      console.log("Disconnected!")
    }

    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      onConnect: onConnected,
      onDisconnect: onDisconnected
    })

    client.activate()

    return () => {
      client.forceDisconnect()
    }
  }, [])


  return (
    <h1>Hi</h1>
  );
}