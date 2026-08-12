import { useState } from "react";

const Search = ({ history }) => {
    const [keyword, setKeyword] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const searchHandler = (e) => {
        e.preventDefault();

        if (keyword.trim()) {
            history.push(`/products/search/${keyword}`);
        } else {
            history.push("/products");
        }
    };

    return (
        <form onSubmit={searchHandler} className="search-form">
            <div className={`search-wrapper ${isFocused ? "focused" : ""}`}>
                <i className="fa fa-search search-icon" aria-hidden="true"></i>
                <input
                    type="text"
                    id="search_field"
                    placeholder="Search products..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                {keyword && (
                    <button
                        type="button"
                        className="clear-btn"
                        onClick={() => setKeyword("")}
                        aria-label="Clear search"
                    >
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </button>
                )}
                <button type="submit" className="search-btn" aria-label="Search">
                    Search
                </button>
            </div>
        </form>
    );
};

export default Search;