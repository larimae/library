import { useState, FormEvent } from 'react';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import Auth from '../utils/auth';
import { searchGoogleBooks } from '../utils/googleBooks';
import { SAVE_BOOK } from '../utils/mutations';
import type { Book } from '../models/Book';
import type { GoogleAPIBook } from '../models/GoogleAPIBook';

const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState<Book[]>([]); 
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);
  const [searchInput, setSearchInput] = useState(''); 
  const [saveBook] = useMutation(SAVE_BOOK); 

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!searchInput.trim()) return ;
    
    try {
      const books = await searchGoogleBooks(searchInput);

      const formattedBooks = books.map((book: GoogleAPIBook) => ({
      bookId: book.id,
      authors: book.volumeInfo.authors || ['No author to display'],
      title: book.volumeInfo.title,
      description: book.volumeInfo.description || 'No description available',
      image: book.volumeInfo.imageLinks?.thumbnail || '',
      link: book.volumeInfo.infoLink || '',
      }));

      setSearchedBooks(formattedBooks);
      setSearchInput('');
    } catch (err) {
      console.error('Error fetching books:', err);
    }
  };

  const handleSaveBook = async (book: Book) => {
    try{
      const {data} = await saveBook({
        variables: {
          bookData: {
            bookId: book.bookId,
            authors: book.authors,
            description: book.description,
            title: book.title,
            image: book.image,
            link: book.link,
          },
        },
      });

      if (data) {
        console.log(`Book saved: ${data.saveBook.title}`);
      }

        setSavedBooks([...savedBooks, book]);

      console.log('Book saved: ${data.saveBook.title}');
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a book"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
  
      {/* Results Section */}
      <Container>
        <h2 className="pt-5">
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => (
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
                  {Auth.loggedIn() && (
                    <Button
                      // disabled={searchedBooks.some(
                      //   (savedBook) => savedBook.bookId === book.bookId
                      // )}
                      className="btn-block btn-info"
                      onClick={() => handleSaveBook(book)}
                    >
                      {savedBooks.some(
                        (savedBook) => savedBook.bookId === book.bookId
                      )
                        ? 'This book has already been saved!'
                        : 'Save this Book!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}  

export default SearchBooks;
