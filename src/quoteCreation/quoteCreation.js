import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { sharedService } from '../services/commonService'

const QuoteCreation = () => {
  const [quoteText, setQuoteText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // To store the uploaded image URL
  const navigate = useNavigate();

  // Handle quote text change
  const handleTextChange = (event) => {
    setQuoteText(event.target.value);
  };

  // Handle image file selection
  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  // Function to handle image upload
  const handleImageUpload = async () => {
    if (!imageFile) {
      setError('Please select an image to upload.');
      return;
    }

    setLoading(true);
    try {
      const uploadedImageUrl = await sharedService.uploadImage(imageFile);
      setImageUrl(uploadedImageUrl[0].url); // Set the image URL after successful upload
      setError('');
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle quote creation
  const handleQuoteSubmit = async () => {
    if (!quoteText || !imageUrl) {
      setError('Please enter a quote and upload an image.');
      return;
    }

    setLoading(true);
    try {
      // Call the API to create the quote
      let payload = {
        text: quoteText,
        mediaUrl: imageUrl,
      }
      await sharedService.post('/postQuote',payload);
      setQuoteText('');
      setImageFile(null);
      setImageUrl('');
      setError('');
      navigate('/quoteList');  // Redirect to the quotes list page
    } catch (err) {
      setError('Failed to create quote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Create a New Quote</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Form for Quote Creation */}
      <div className="mb-3">
        <label htmlFor="quoteText" className="form-label">Quote Text</label>
        <textarea
          id="quoteText"
          className="form-control"
          value={quoteText}
          onChange={handleTextChange}
          rows="4"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="imageUpload" className="form-label">Upload Image</label>
        <input
          type="file"
          className="form-control"
          id="imageUpload"
          onChange={handleImageChange}
        />
        {imageFile && (
          <button
            className="btn btn-primary mt-2"
            onClick={handleImageUpload}
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Image'}
          </button>
        )}
      </div>

      {imageUrl && (
        <div className="mb-3">
          <p>Image uploaded successfully!</p>
          <img style={{height:'20vh',width:'20vh'}} src={imageUrl} alt="Uploaded Media" className="img-fluid" />
        </div>
      )}

      <button
        className="btn btn-success"
        onClick={handleQuoteSubmit}
        disabled={loading}
      >
        {loading ? 'Creating Quote...' : 'Create Quote'}
      </button>
    </div>
  );
};

export default QuoteCreation;
