import './App.css';
// import marvelBackground from './images/marvelBackground.jpg';
// import avengersA from './images/avengersA.jpg';
import avengersBackground from './images/avengersBackground.jpg';
import MarvelSearchC from './components/MarvelSearch';
import * as React from  'react';

export const App = () => {
  const [searchResults, setSearchResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  // This function will be called when the search is triggered
  const handleSearch = async (searchTerm) => {
    setLoading(true);
    console.log('Searching for:', searchTerm);
    
    try {
      const API_KEY = process.env.REACT_APP_MARVEL_API_KEY || '';
       if (!API_KEY) {
        throw new Error('Marvel API key is not configured.');
      }
       const response = await fetch(
        `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${encodeURIComponent(searchTerm)}&apikey=${API_KEY}&limit=10`
      );

      console.log("response:", response);
       if (!response.ok) {
        throw new Error(`Marvel API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      // Set the actual results from the API
      setSearchResults(data.data.results || []);
  
      if (data.data.results.length === 0) {
        console.warn('No results found for:', searchTerm);
      }
      
    } catch (error) {
      console.error('Search failed:', error);
      throw error; // Re-throw to let the component handle it
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="marvel-background" style={{ backgroundImage: `url(${avengersBackground})` }}>
      <MarvelSearchC onSearch={handleSearch} />

      {/* Display search results */}
      {loading && (
        <div className="loading-container">
          <p>Loading Marvel characters...</p>
        </div>
      )}
      
      {/* Display search results with enhanced styling */}
      {searchResults.length > 0 && !loading && (
        <div className="results-container">
          <h2 className="results-title">Found {searchResults.length} Characters</h2>
          <div className="characters-grid">
            {searchResults.map(character => (
              <div key={character.id} className="character-card">
                <div className="character-image">
                  {character.thumbnail && character.thumbnail.path && (
                    <img 
                      src={`${character.thumbnail.path}/standard_xlarge.${character.thumbnail.extension}`}
                      alt={character.name}
                      onError={(e) => {
                        // Fallback to a different image variant if the main one fails
                        e.target.src = `${character.thumbnail.path}/portrait_xlarge.${character.thumbnail.extension}`;
                      }}
                    />
                  )}
                </div>
                <div className="character-info">
                  <h3 className="character-name">{character.name}</h3>
                  <p className="character-description">
                    {character.description || 'No description available for this character.'}
                  </p>
                  <div className="character-stats">
                    <span className="stat">
                      Comics: {character.comics?.available || 0}
                    </span>
                    <span className="stat">
                      Series: {character.series?.available || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      )}
    </div>
  );
}

export default App;
