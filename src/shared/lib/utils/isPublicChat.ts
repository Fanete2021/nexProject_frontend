import { ChatInfo } from '@/features/chat';

/**
 * Чат считается публичным, если у него есть хотя бы один топик.
 */
export const isPublicChat = (chat: ChatInfo) => chat.topics.length > 0;
