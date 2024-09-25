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

  Slide 3

- Getting Started with React Query
- 1. Installation
  - We can install via npm, command `npm i @tanstack/react-query`
  2. Wrap your entire application with `QueryClientProvider`
  - const `queryClient` = `new QueryClient()`
  - export default function App() {
    // Provide the client to your App
    return (
    <QueryClientProvider client={queryClient}>
    <Outlet />;
    </QueryClientProvider>
    );
    }

Slide 3.1

- React Query has 3 core concepts
  - Queries (for fetching date from Server)
  - Mutations (for Writing data on the Server)
  - Query Invalidation (for Manually Invalid already fired Network Query)

Slide 4

- Basic usage of useQuery
  -import { getTodo } from "@/utils/api";
  import { useQuery } from "@tanstack/react-query";

const Todo = () => {
// Queries
const { data, isPending, isError, error } = useQuery({
queryKey: ["todo"],
queryFn: getTodo,
});

if (isPending) {
return <span>Pending...</span>;
}

if (isError) {
return <span>{error.message}</span>;
}

return (

<div>
Todo
<ul>
{data?.map((todo) => (
<li key={todo.id}>
{todo.id}.{todo.title}
</li>
))}
</ul>
</div>
);
};

export { Todo };

Slide 5

- Breakdown of various server state return by `useQuery`

  - `data` - contains the success response return from API Server
  - `isPending` - the query has no data yet
  - `isError` - the queryFunction has triggered and query encountered an error
  - `error` - the error received via queryFunction

- Beyond these primary server states, query has more states
  - `fetchStatus` - which gives information about `queryFn` whether is it running or not
    - `fetchStatus` === 'fetching' - the query is currently fetching
    - `fetchStatus` === 'paused' - The query wanted to fetch, but it is paused.
    - `fetchStatus` === 'idle' - The query is not doing anything at the moment.

Slide 6

- Dependent Queries
  - Dependent (or serial) queries depend on previous queries to finish before they can execute
  - `enabled` - Set this to false or a function that return false to disable automatic refetching when the query mounts or changes query keys
- const {
  status,
  fetchStatus,
  data: projects,
  } = useQuery({
  queryKey: ['projects', userId],
  queryFn: getProjectsByUser,
  // The query will not execute until the userId exists
  enabled: !!userId,
  })

  - userId -> null || undefined

  - `projects` Query overall status

    - `status`: 'pending'
    - `isPending`: true
    - `fetchStatus`: 'idle'

  - userId -> exist ()
  - `projects` Query overall status
  - `status`: 'pending'
  - `isPending`: true
  - `fetchStatus`: 'fetching'

    Once the `projects` Query has executed

  - `projects` Query overall status
    - `status`: 'success'
    - `isPending`: false
    - `fetchStatus`: 'idle'

Slide 7

- useQuery Config Options
  - `refetchInterval` - defines a interval in milliseconds after which all queries will re fetch
  - `refetchOnWindowFocus` - boolean value to fe refetch query on windows focus
  - `gcTime` - defines Garbage Collection time in milliseconds that unused/inactive cache data remains in memory.
  - `staleTime` - defines a stale time in milliseconds after data is considered stale
  - `refetchOnMount` -
    - If set to true, the query will refetch on mount if the data is stale.
    - If set to false, the query will not refetch on mount.
    - If set to "always", the query will always refetch on mount.

Slide 8

- Parallel Queries
- To Execute parallel queries on React Component Mounts `useQueries()`
  -const [todoQuery, userQuery] = useQueries({
  queries: [
  // Query to Fetch `Todo`
  {
  queryKey: ["todo"],
  queryFn: getTodo,
  },

      // Query to Fetch `User`
      {
        queryKey: ["user"],
        queryFn: getUsers,
      },

  ],
  });

  /_
  Now `todoQuery` and `userQuery` contains all information regarding their respective query results
  todoQuery.data, todoQuery.isPending, todoQuery.isError, todoQuery.error
  userQuery.data, userQuery.isPending, userQuery.isError, userQuery.error
  _/

Slide 9

- Caching in React Query
  -Refer to Notes

Slide 10

- Mutations

  - To write data (i.e. perform create/update/delete functionality on server data) we can use `useMutation` hook.
  - // To mutate data along with Synchronous
    const { mutate } = useMutation({
    mutationFn: (newTodo) => {
    return axios.post("/todos", newTodo);
    },
    });

  // To mutate data along with Asynchronous
  const { mutateAsync } = useMutation({
  mutationFn: (newTodo) => {
  return axios.post("/todos", newTodo);
  },
  });

  <button
  onClick={() => {
  mutate({ id: new Date(), title: 'New Todo Added' })
  }} >
  Create Todo
  </button>

Slide 11

- Mutation Server states
- `isIdle` or status === 'idle' - The mutation is currently idle or in a fresh/reset state
- `isPending` or status === 'pending' - The mutation is currently running
- `isError` or status === 'error' - The mutation encountered an error
- `isSuccess` or status === 'success' - The mutation was successful and mutation data is available

Slide 12

- Resetting Mutation State

  - Sometimes we need to reset the mutation state like `error` and `data`.
  - Use `reset()` function from `useMutation()` Instance
  - // To reset mutation states
    const { reset } = useMutation({
    mutationFn: (newTodo) => {
    return axios.post("/todos", newTodo);
    },
    });

  // JSX
  <button onClick={() => reset()}></button>

Slide 13

- Mutation Side Effects
- `useMutation()` has comes with some helper functions, which will helps to manage side-effects at any stage during mutation
- useMutation({
  mutationFn: addTodo,
  onMutate: (variables) => {
  // A mutation is about to happen!

      // Optionally return a context containing data to use when for example rolling back
      return { id: 1 }

  },
  onError: (error, variables, context) => {
  // An error happened!
  console.log(`rolling back optimistic update with id ${context.id}`)
  },
  onSuccess: (data, variables, context) => {
  // After Mutation has done!
  },
  onSettled: (data, error, variables, context) => {
  // Error or success... doesn't matter!
  },
  })

Slide 14

- Query Invalidation
- import { useQuery, useQueryClient } from '@tanstack/react-query'

// Get QueryClient from the context
const queryClient = useQueryClient()

// Invalidate every query in the cache
queryClient.invalidateQueries()

// Invalidate every query with a key that starts with `todos`
queryClient.invalidateQueries({ queryKey: ['todos'] })

// Both queries below will be invalidated
const todoListQuery = useQuery({
queryKey: ['todos'],
queryFn: fetchTodoList,
})
const todoListQuery = useQuery({
queryKey: ['todos', { page: 1 }],
queryFn: fetchTodoList,
})

- To Invalidate specific Query
- `exact: true`
- queryClient.invalidateQueries({
  queryKey: ['todos'],
  exact: true,
  })

// The query below will be invalidated
const todoListQuery = useQuery({
queryKey: ['todos'],
queryFn: fetchTodoList,
})

// However, the following query below will NOT be invalidated
const todoListQuery = useQuery({
queryKey: ['todos', { type: 'done' }],
queryFn: fetchTodoList,
})

Slide 15

- Bonus: Aborting Previous Pending Query if new Query is Fired Again
- function Bookmarks({ category }) {
  const { isLoading, data, error } = useQuery({
  queryKey: ['bookmarks', category],
  queryFn: ({ signal }) =>
  fetch(`${endpoint}/${category}`, { signal }).then((res) => {
  return res.json()
  }),
  })

  // Return JSX based on data and error state
  }

