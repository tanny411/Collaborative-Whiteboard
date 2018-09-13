package com.mycompany.whiteboard;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.*;
import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

/**
 *
 * @author Aysha Kamal
 */
@ServerEndpoint(value="/endpoint", encoders = {FigureEncoder.class}, decoders = {FigureDecoder.class})
public class MyWhiteboard {
    private static Set<Session> peers = Collections.synchronizedSet(new HashSet<Session>());

    private static Map<Session, String> map = Collections.synchronizedMap(new HashMap<Session, String>() );

    @OnMessage
    public void broadcastFigure(Figure figure, Session session) throws IOException, EncodeException {
        System.out.println("broadcastFigure: " + figure);
        String check=figure.getJson().toString().substring(2,6);
        if("chat".equals(check)){
            session.getBasicRemote().sendObject(figure);
        }
        else if("name".equals(check)){
            ///send my name to everyone, and get name of everyone already connected
            //setting map
            String name=figure.getJson().toString().substring( 9,figure.getJson().toString().length()-2 );
            if(map.containsKey(session)) return;
            map.put(session, name);
            //getting user list
            String users="l";
            for (Session peer : peers) {
                //System.out.println(map.get(peer));
                if (!peer.equals(session)) {
                    if(map.containsKey(peer)) users+=map.get(peer)+" ";
                }
            }
            //System.out.println(users);
            session.getBasicRemote().sendObject(users);
        }
        for (Session peer : peers) {
            if (!peer.equals(session)) {
                if(map.containsKey(peer)) peer.getBasicRemote().sendObject(figure);
            }
        }
    }
    
    @OnMessage
    public void broadcastSnapshot(ByteBuffer data, Session session) throws IOException {
        System.out.println("broadcastBinary: " + data);
        for (Session peer : peers) {
            if (!peer.equals(session)) {
               if(map.containsKey(peer)) peer.getBasicRemote().sendBinary(data);
            }
        }
    }
    
    @OnOpen
    public void onOpen (Session peer) {
        peers.add(peer);
    }
    @OnClose
    public void onClose (Session peer) {
        peers.remove(peer);
        //System.out.println(map.get(peer));
        map.remove(peer);
    }
}
