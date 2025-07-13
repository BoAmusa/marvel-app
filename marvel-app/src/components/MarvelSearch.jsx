import * as React from  'react';
import '../MarvelSearchC.css'; // Assuming you have a CSS file for styling

const MarvelSearchC= ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert('Please enter a character name to search!');
      return;
    }

    setIsLoading(true);
    
    try {
      // Call the parent component's search function
      if (onSearch) {
        await onSearch(searchTerm.trim());
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Something went wrong with the search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="search-container">
      <div className="search-wrapper">
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Search for a Marvel character..."
            className="search-input"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          {searchTerm && (
            <button 
              className="clear-button"
              onClick={clearSearch}
              disabled={isLoading}
            >
              ×
            </button>
          )}
        </div>
        
        <button 
          className={`search-button ${isLoading ? 'loading' : ''}`}
          onClick={handleSearch}
          disabled={isLoading || !searchTerm.trim()}
        >
          <span className="button-text">
            {isLoading ? 'Searching...' : 'Search'}
          </span>
          <div className="button-glow"></div>
        </button>
      </div>
    </div>
  );
};

export default MarvelSearchC;