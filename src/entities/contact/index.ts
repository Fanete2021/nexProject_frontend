import { Contact } from './model/types/contact.ts';
import ContactSearcher from './ui/contact-searcher/ContactSearcher.tsx';
import { searchContacts } from './model/service/searchContacts.ts';
import ContactPicker from './ui/contact-picker/ContactPicker.tsx';
import { fetchInterlocutors } from './model/service/fetchInterlocutors.ts';

export type {
  Contact
};

export {
  ContactSearcher,
  ContactPicker,

  searchContacts,
  fetchInterlocutors
};
