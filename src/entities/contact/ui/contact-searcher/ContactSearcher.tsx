import { Search } from '@/shared/ui';
import { Contact } from '../../model/types/contact.ts';
import { useCallback, useEffect } from 'react';
import { useDebounce } from '@/shared/lib/hooks/useDebounce.ts';
import { searchContacts } from '../../model/service/searchContacts.ts';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';

export interface SearchContactProps {
  setSearchedContacts: (contacts: Contact[]) => void;
  setIsLoadingSearch: (isLoadingSearch: boolean) => void;
  searchedValue: string;
  setSearchedValue: (searchedValue: string) => void;
}

const ContactSearcher: React.FC<SearchContactProps> = (props) => {
  const { searchedValue, setSearchedValue, setSearchedContacts, setIsLoadingSearch  } = props;
  const debouncedSearchValue = useDebounce(searchedValue, 1000);
  const dispatch = useAppDispatch();
  
  const searchHandler = useCallback(async (value: string) => {
    setSearchedContacts([]);
    setSearchedValue(value);
    setIsLoadingSearch(true);
  }, []);

  useEffect(() => {
    if (debouncedSearchValue) {
      setIsLoadingSearch(true);

      const fetchContacts = async () => {
        try {
          const response = await dispatch(searchContacts(debouncedSearchValue)).unwrap();
          setSearchedContacts(response.searchUsers);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoadingSearch(false);
        }
      };

      fetchContacts();
    } else {
      setSearchedContacts([]);
      setIsLoadingSearch(false);
    }
  }, [debouncedSearchValue, dispatch]);

  return (
    <Search
      changeValue={searchHandler}
      value={searchedValue}
    />
  );
};

export default ContactSearcher;
