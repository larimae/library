import { useQuery, useMutation } from '@apollo/client';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { ME } from '../utils/query.ts';
import { REMOVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import type { Book } from '../models/User';


const SavedBooks = () => {
  const { loading, data } = useQuery(ME);
  const [removeBook] = useMutation(REMOVE_BOOK);
  const userData = data?.me || {};

  if (loading) {
  return <h2>LOADING...</h2>;
  }
  console.log(data);

  

  const handleDeleteBook = async (bookId: string) => {
    try {
      const { data } = await removeBook({
        variables: { bookId },
      });
  
      if (data?.removeBook) {
        console.log(`Book with ID ${bookId} removed.`);
      }
    } catch (error) {
      console.error('Error removing book:', error);
    }
  };

  return (
    <>
      {/* Header Section */}
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>
            {userData.username
              ? `Viewing ${userData.username}'s saved books!`
              : 'Viewing saved books!'}
          </h1>
        </Container>
      </div>
  
      {/* Books Display Section */}
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks?.map((book: Book) => (
            <Col md="4" key={book.bookId}>
              <Card border="dark">
                {book.image && (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                )}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors.join(', ')}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => {
                      if (!Auth.loggedIn()) {
                        console.error('You must be logged in to delete books.');
                        return;
                      }
                      handleDeleteBook(book.bookId);
                    }}
                    disabled={!Auth.loggedIn()} 
                    title={!Auth.loggedIn() ? 'Log in to delete books' : ''}
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );  
};

export default SavedBooks;
