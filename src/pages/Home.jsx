import MovieCard from "../components/moviecard"
import { useState, useEffect, use } from "react"
import { searchMovies, getPopularMovies } from "../services/api"
import "../css/Home.css" // Assuming you have a CSS file for styling

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const searchResults = await searchMovies(searchQuery);
                const popularMovies = await getPopularMovies();
                setMovies(popularMovies);
            } catch (err) {
                console.log("Error fetching popular movies:", err)
                setError("Failed to load popular movies.")
            }
            finally {
                setLoading(false)
            }
        }
        loadPopularMovies();
    }, [])


    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return; // Prevent search if input is empty
        if (loading) return; // Prevent search while loading

        setLoading(true)
        try {
            const searchResults = await searchMovies(searchQuery)
            setMovies(searchResults)
            setError(null) // Clear any previous errors
        } catch (err) {
            console.log("Error searching movies:", err)
            setError("Failed to search movies.")
        } finally {
            setLoading(false)
        }

    };

    return <div className="home">
        <form onSubmit={handleSearch} className="search-form">
            <input
                type="text"
                placeholder="Search for a movie"
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">Search</button>
        </form>

        {error && <div className="error">{error}</div>}


        {loading ? <div className="loading">Loading...</div> : <div className="movies-grid">
            {movies.map(
                (movie) => (
                    (
                        <MovieCard movie={movie} key={movie.id} />
                    )
                ))}
        </div>}

    </div>
}

export default Home