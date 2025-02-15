package com.hivemind.configuration.WebSocket;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class MyWebSocketHeadler extends TextWebSocketHandler {
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage menssage) throws Exception{
        String payload = menssage.getPayload();
        System.out.println("Received: " + payload);
        session.sendMessage(new TextMessage("Echo: " + payload));
    }

    }

