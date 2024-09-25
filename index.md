Slide 2

- Why You Want strike-through Need React Query?
- As you may ask a question why to use a 3rd party library where we easily fire a `fetch` in `useEffect` for simple fetching from server
  -Consider a simple fetch request using `useEffect`

      function Bookmarks({ category }) {

  const [data, setData] = useState([])
  const [error, setError] = useState()

  useEffect(() => {
  const fetchCategory = async = () => {
  try {
  const initResponse = await fetch(`${endpoint}/${category}`)
  const response = await initResponse.json();

          setData(response)
        } catch (error) {
          setError(error)
        }
      }

  }, [category]);

  // Return JSX based on data and error states
  }

  The above logic for fetching has lots of Major Bugs and Missing features

  - Race Condition: It may happen that for category value `books` and `movies`, response for `movies` will arrive before the response for `books`. (Because Network responses can arrive in a different order than we have sent them)
  - Loading State: In the above code, we don't have any loading, data and error states
  - Empty State: In the above code, if we initialize data state variable with empty array and actual response from server also comes empty , then we do not have distinguish between 'no data yet' and 'no data at all'.
  - Multiple fetches are efficiently deduplicated, including those fired by StrictMode in React
  - Caching: The above does not cache the response data, so that when same request will be trigger, data will consumed from cached memory instead of actual fetching a network call
