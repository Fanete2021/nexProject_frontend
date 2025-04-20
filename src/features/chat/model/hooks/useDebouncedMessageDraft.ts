import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { getChatMessageDrafts } from '../selectors/getChatMessageDrafts.ts';
import { useDebounce } from '@/shared/lib/hooks/useDebounce.ts';
import { chatActions } from '../slice/chatSlice.ts';

export const useDebouncedMessageDraft = (chatId: string) => {
  const dispatch = useAppDispatch();
  
  const drafts = useSelector(getChatMessageDrafts);
  
  const [draft, setDraft] = useState(drafts[chatId] || '');

  useDebounce(() => {
    if (chatId && draft !== drafts[chatId]) {
      dispatch(chatActions.setMessageDraft({ chatId, message: draft }));
    }
  }, 300);

  useEffect(() => {
    setDraft(drafts[chatId] || '');
  }, [chatId, drafts]);

  return [draft, setDraft] as [string, (value: string) => void];
};
