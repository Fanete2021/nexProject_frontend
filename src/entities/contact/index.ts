import { Contact } from './model/types/contact.ts';
import SearchContact from './ui/search-contact/SearchContact.tsx';
import { searchContacts } from './model/service/searchContacts.ts';

export type {
  Contact
};

export {
  SearchContact,

  searchContacts
};
