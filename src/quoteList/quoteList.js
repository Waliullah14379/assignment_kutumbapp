import React, { useEffect, useState , useCallback} from 'react';
import { sharedService } from '../services/commonService'
import { useNavigate } from 'react-router-dom';
import dummyImg from '../assets/img.jpg'
const QuoteList = () => {
  const [quotes, setQuotes] = useState([]);  // Store quotes in state
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState('');  // Error state
  const [limit, setLimit] = useState(20);  // Set limit for quotes
  const [offset, setOffset] = useState(0);  // Set offset for pagination
  const [hasMore, setHasMore] = useState(true); // To control if more quotes should be fetched
  const history = useNavigate();  // Use

  // Function to fetch quotes on component mount or when limit/offset change
  const fetchQuotes = async () => {
    setLoading(true);
    setError(''); 

    try {        
        let response = await sharedService.get(`getQuotes?limit=${limit}&offset=${offset}`,'');
      if (response && response.data && response.data.length > 0) {
        setQuotes(prevQuotes => [...prevQuotes, ...response.data]);
      } else {
        setHasMore(false);  // If no data is returned, stop pagination
      }
    } catch (err) {
      setError('Failed to load quotes. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const handleScroll = useCallback(() => {
    // Check if the user has scrolled to the bottom
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const windowHeight = window.innerHeight;

    // If the user is at the bottom of the page and more data is available, load more quotes
    if (scrollTop + windowHeight >= scrollHeight - 50 && !loading && hasMore) {
      setOffset(prevOffset => prevOffset + limit);  // Increment offset to load next set of quotes
    }
  }, [loading, hasMore, limit]);
  useEffect(() => {
    fetchQuotes();

  }, [limit, offset]);  // Re-fetch when limit or offset changes

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Quotes</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Display loading indicator */}
      {loading && <div className="text-center">Loading quotes...</div>}

      {/* Display quotes list */}
      <div className="row">
        {quotes.length > 0 ? (
          quotes.map((quote, index) => (
            <div className="col-md-4" key={index}>
              <div className="card mb-4">
                {/* Image with overlay text */}
                <div className="position-relative">
                    <img style={{height:'35vh'}} src={quote.mediaUrl ? quote.mediaUrl:dummyImg} className="card-img-top" alt="Quote Image" /> 
                  
                  <div className="position-absolute bottom-0 start-0 text-white bg-dark p-2 w-100">
                    {quote.text}
                  </div>
                </div>

                {/* User info and created_at */}
                <div className="card-body">
                  <p className="card-text"><strong>Username:</strong> {quote.username}</p>
                  <p className="card-text"><strong>Created At:</strong> {new Date(quote.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No quotes available.</p>
        )}
      </div>

      {/* Stop the pagination if no more data */}
      {!hasMore && !loading && (
        <div className="text-center mt-4">
          <p>No more quotes available.</p>
        </div>
      )}

      {/* Floating Action Button for Creating a New Quote */}
      <button
        className="btn btn-primary position-fixed bottom-0 end-0 m-4 rounded-circle"
        style={{ width: '60px', height: '60px' }}
        onClick={() => history('/quoteCreation')} 
      >
        Add 
      </button>
    </div>
  );
};

export default QuoteList;
