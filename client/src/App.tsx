import './App.css';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Outlet, Route, Routes } from 'react-router-dom';

import NavBar from './components/Navbar.tsx';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="flex-column justify-flex-start min-100-vh">
        <NavBar />
        <div className="container">
          <Routes>
          <Route path="/login" element={<LoginForm handleModalClose={() => {}} />} />
          <Route path="/signup" element={<SignupForm handleModalClose={() => {}} />} />
            {/* Other routes */}
            <Route path="/" element={<Outlet />} />
          </Routes>
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;
