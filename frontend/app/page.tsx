'use client'

import BackText from '@/components/style/BackText';
import WhiteText from '@/components/style/WhiteText';
import Title from '@/components/title';
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
    <div>
      <div className=''><br/>
        <Title className="text-[#C0C0C0] overflow-x-hidden pl-2">
          <div>
            <BackText>#</BackText><WhiteText>@</WhiteText>       <br/>
            <BackText/><WhiteText>██</WhiteText>  <BackText/><WhiteText>██▌</WhiteText><br/>
            <BackText/>██▌ <BackText/>█▀ <br/>
            <BackText/>██▌ <BackText/>█# <br/>
            <BackText/>██████% <br/>
            <BackText/>▓█▌ <BackText/>█▓ <br/>
            <BackText/>▒█▌ <BackText/>█▓ <br/>
            <BackText/>██  <BackText/>▒█ <br/>
            <BackText/>▓█  <BackText/>▓█ <br/>
            <BackText>%</BackText>▒   <BackText/>▒  <br/>
            <BackText>%</BackText>@     ░ <br/>
          </div>
          <div><br/>
            <BackText>%</BackText><WhiteText>█#</WhiteText><br/>
            <BackText>░██</BackText><br/>
            <BackText/>██<br/>
            <BackText/>██<br/>
            <BackText/>██<br/>
            <BackText/>█▒<br/>
            <BackText/>▓█<br/>
            <BackText/>▓▓<br/>
            <BackText/>  <br/>
            <BackText/>
          </div>
          <div><br/>
            <BackText/><WhiteText>██</WhiteText>      <BackText/><WhiteText>█▌</WhiteText><br/>
            <BackText/>██<WhiteText>█</WhiteText>   <BackText>░░</BackText><WhiteText>██▌</WhiteText><br/>
            <BackText>░░</BackText>███  <BackText/>▒██<WhiteText>▌</WhiteText><br/> <BackText>░0</BackText>▓██ ░██  <br/>  <BackText>1░</BackText>██▄▒█▀<br/>   <BackText/><BackText/>▓███<br/>    <BackText/>███#<br/>     <BackText/>%█<br/>     <BackText/>%%<br/>      <BackText/>
          </div>
          <div><br/>
            <BackText/><WhiteText>███████</WhiteText><br/>
            <BackText/>▀█<WhiteText>█</WhiteText>   <br/>
            <BackText/>██     <br/>
            <BackText/>▒▓█████<br/>
            <BackText>0</BackText>██<WhiteText>▀</WhiteText>    <br/>
            <BackText/>██     <br/>
            <BackText/>▓█▄    <br/>
            <BackText/>▒▒██▓██<br/>
            <BackText/>%    <WhiteText>▀</WhiteText><br/>
          </div>
          <div><br/>
          <BackText/><WhiteText>██▌</WhiteText>  <BackText/><WhiteText>██</WhiteText><br/>
          <BackText/>███ <BackText/>██<WhiteText>█</WhiteText><br/>
          <BackText/>██▀██<BackText/>█@<br/>
          <BackText/>█▌   <BackText/>██<br/>
          <BackText/>██   <BackText/>██<br/>
          <BackText/>█@   <BackText/>▒█<br/>
          <BackText/>#▓▒  <BackText/>█▒<br/>
          <BackText/>▒▒    <BackText/>▒<br/>
          <BackText/>0
          </div>
          <div><br/>
            <BackText>#</BackText><WhiteText>*█</WhiteText><br/>
            <BackText>░██</BackText><br/>
            <BackText/>██<br/>
            <BackText/>██<br/>
            <BackText/>██<br/>
            <BackText/>█*<br/>
            <BackText/>▓█<br/>
            <BackText/>▓▓<br/>
            <BackText/>  <br/>
            <BackText/>
          </div>
          <div>
          <BackText>@</BackText><WhiteText>▄</WhiteText>        <br/>
          <BackText/><WhiteText>█▄</WhiteText>     <WhiteText>█▌</WhiteText><br/>
          <BackText/>██<WhiteText>▌</WhiteText>   ▄█<WhiteText>▌</WhiteText><br/>
          <BackText/>▓█<WhiteText>█</WhiteText>  <BackText>0</BackText>█▌<br/>
          <BackText>#</BackText>████ <BackText/>██▌<br/>
          <BackText/>▓█ ██<BackText/>██<WhiteText>▌</WhiteText><br/>
          <BackText/>██  ████ <br/>
          <BackText/>█1  <BackText/>▓▒█ <br/>
          <BackText/>▓█   <BackText/>█% <br/>
          <BackText/>█▀   <BackText/>▒▀ <br/>
          <BackText/>    <BackText>░░</BackText>  <br/>
          </div>
          <div><br/>
          <BackText>#</BackText>█<WhiteText>███▌</WhiteText>  <br/>
          <BackText/>██▀█<WhiteText>██</WhiteText> <br/>
          <BackText/>██ <BackText/>██<WhiteText>▌</WhiteText><br/>
          <BackText>@</BackText>█▓  <BackText>%</BackText>█▌<br/>
          <BackText/>██  <BackText/>█▌<br/>
          <BackText/>██ <BackText/>██<WhiteText>▌</WhiteText><br/>
          <BackText/>▓██▒██ <br/>
          <BackText/>█▒█▀▀  <br/>
          <BackText>#░░</BackText>    <br/><BackText/>
          </div>
        </Title>
      </div>
      <br/>
      <h1 className='pl-5'>Hi, WebPlus font here!</h1>
    </div>
  );
}