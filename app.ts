function Bookmarks({ category }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchCategory = (async = () => {
      try {
        const initResponse = await fetch(`${endpoint}/${category}`);
        const response = await initResponse.json();

        setData(response);
      } catch (error) {
        setError(error);
      }
    });
  }, [category]);

  // Return JSX based on data and error states
}
