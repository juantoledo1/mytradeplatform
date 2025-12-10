import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageResponseDto } from './dto/message-response.dto';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private prisma: PrismaService) {}

  async createMessage(
    userId: number,
    createMessageDto: CreateMessageDto,
  ): Promise<MessageResponseDto> {
    const { conversationId, content, messageType, replyToId } = createMessageDto;

    // Verify user is participant in conversation
    const participant = await this.prisma.chatParticipant.findFirst({
      where: {
        conversationId,
        userId,
        isActive: true,
      },
    });

    if (!participant) {
      throw new ForbiddenException(
        'You are not a participant in this conversation',
      );
    }

    // Verify conversation exists
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Verify reply-to message exists if provided
    if (replyToId) {
      const replyToMessage = await this.prisma.chatMessage.findFirst({
        where: { id: replyToId, conversationId },
      });

      if (!replyToMessage) {
        throw new BadRequestException('Reply-to message not found');
      }
    }

    // Create message
    const message = await this.prisma.chatMessage.create({
      data: {
        conversationId,
        senderId: userId,
        content,
        messageType: messageType || 'TEXT',
        replyToId,
      },
    });

    // Update conversation lastMessageAt
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    this.logger.log(
      `Message created: ${message.id} in conversation ${conversationId}`,
    );

    return new MessageResponseDto(message);
  }

  async getConversationMessages(
    conversationId: number,
    userId: number,
    skip = 0,
    take = 50,
  ): Promise<MessageResponseDto[]> {
    // Verify user is participant
    const participant = await this.prisma.chatParticipant.findFirst({
      where: {
        conversationId,
        userId,
        isActive: true,
      },
    });

    if (!participant) {
      throw new ForbiddenException(
        'You are not a participant in this conversation',
      );
    }

    const messages = await this.prisma.chatMessage.findMany({
      where: {
        conversationId,
        isDeleted: false,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });

    return messages.map((msg) => new MessageResponseDto(msg));
  }

  async markAsRead(
    conversationId: number,
    userId: number,
  ): Promise<{ message: string }> {
    const participant = await this.prisma.chatParticipant.findFirst({
      where: {
        conversationId,
        userId,
        isActive: true,
      },
    });

    if (!participant) {
      throw new ForbiddenException(
        'You are not a participant in this conversation',
      );
    }

    await this.prisma.chatParticipant.update({
      where: { id: participant.id },
      data: { lastReadAt: new Date() },
    });

    return { message: 'Messages marked as read' };
  }

  async deleteMessage(
    messageId: number,
    userId: number,
  ): Promise<{ message: string }> {
    const message = await this.prisma.chatMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    await this.prisma.chatMessage.update({
      where: { id: messageId },
      data: { isDeleted: true, content: '[Message deleted]' },
    });

    return { message: 'Message deleted successfully' };
  }
}








