import { StateSchema } from '@/app/providers/store-provider';

export const getChatEditableMessage = (state: StateSchema) => state.chat.editableMessage;
