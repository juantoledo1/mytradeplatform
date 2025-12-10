import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinConversation')
  async handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: number; userId: number },
  ) {
    const room = `conversation-${data.conversationId}`;
    client.join(room);
    this.logger.log(`User ${data.userId} joined ${room}`);
    
    return {
      event: 'joinedConversation',
      data: { conversationId: data.conversationId },
    };
  }

  @SubscribeMessage('leaveConversation')
  async handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: number; userId: number },
  ) {
    const room = `conversation-${data.conversationId}`;
    client.leave(room);
    this.logger.log(`User ${data.userId} left ${room}`);
    
    return {
      event: 'leftConversation',
      data: { conversationId: data.conversationId },
    };
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: number; message: CreateMessageDto },
  ) {
    try {
      const message = await this.chatService.createMessage(
        data.userId,
        data.message,
      );

      const room = `conversation-${data.message.conversationId}`;
      this.server.to(room).emit('newMessage', message);

      return {
        event: 'messageSent',
        data: message,
      };
    } catch (error) {
      this.logger.error(`Error sending message: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        event: 'error',
        data: { message: 'Failed to send message' },
      };
    }
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: number; userId: number; isTyping: boolean },
  ) {
    const room = `conversation-${data.conversationId}`;
    client.to(room).emit('userTyping', {
      userId: data.userId,
      isTyping: data.isTyping,
    });
  }
}








