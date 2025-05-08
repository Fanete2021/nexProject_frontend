import { Contact } from './model/types/contact.ts';
import { searchContacts } from './model/service/searchContacts.ts';
import { fetchInterlocutors } from './model/service/fetchInterlocutors.ts';

export type {
  Contact
};

export {
  searchContacts,
  fetchInterlocutors
};
