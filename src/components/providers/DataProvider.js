import axios from 'axios';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const API_URL = 'https://rickandmortyapi.com/api/character/';

export function DataProvider({ children }) {
  const [activePage, setActivePage] = useState(0);
  const [characters, setCharacters] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [info, setInfo] = useState({});
  const [filters, setFilters] = useState({
    name: '',
    status: '',
    species: '',
    type: '',
    gender: ''
  });

  const fetchData = async (url) => {
    setIsFetching(true);
    setIsError(false);

    try {
      const { data } = await axios.get(url);
      setCharacters(data.results);
      setInfo(data.info);
    } catch (error) {
      setIsError(true);
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    const filterParams = new URLSearchParams(filters).toString();
    const url = filterParams
      ? `${API_URL}?${filterParams}&page=${activePage + 1}`
      : `${API_URL}?page=${activePage}`;
    fetchData(url);
  }, [activePage, filters]);

  const dataValue = useMemo(
    () => ({
      activePage,
      setActivePage,
      characters,
      isFetching,
      isError,
      info,
      filters,
      setFilters
    }),
    [activePage, characters, isFetching, isError, info, filters]
  );

  return (
    <DataContext.Provider value={dataValue}>{children}</DataContext.Provider>
  );
}

const DataContext = createContext({});

export const useData = () => useContext(DataContext);
