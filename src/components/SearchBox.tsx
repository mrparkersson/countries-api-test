import React, { useState, useEffect, useRef } from "react";
import "../components/SearchBox.css";

interface SearchBoxProps {
  suggestions: string[];
}

const SearchBox: React.FC<SearchBoxProps> = ({ suggestions }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  const lastLinkRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query) {
        setFilteredSuggestions(
          suggestions
            .filter((suggestion) =>
              suggestion.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 5)
        );
      } else {
        setFilteredSuggestions([]);
      }
    }, 250);

    return () => {
      clearTimeout(handler);
    };
  }, [query, suggestions]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        console.log("=> hello");
        setFocusedIndex(
          (prevIndex) => (prevIndex + 1) % (filteredSuggestions.length + 1)
        );
      } else if (event.key === "ArrowUp") {
        setFocusedIndex(
          (prevIndex) =>
            (prevIndex - 1 + filteredSuggestions.length + 1) %
            (filteredSuggestions.length + 1)
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [filteredSuggestions]);

  return (
    <div className="search-container">
      <h1>Search App</h1>
      <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
        Open Search
      </button>
      {isSearchOpen && (
        <div ref={searchBoxRef} className="search-box">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
          />
          <button onClick={() => setIsSearchOpen(false)}>Close</button>
          <ul>
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                style={{
                  backgroundColor:
                    focusedIndex === index ? "#f0f0f0" : "transparent",
                }}
              >
                {suggestion}
              </li>
            ))}
            {query && (
              <li
                ref={lastLinkRef}
                style={{
                  backgroundColor:
                    focusedIndex === filteredSuggestions.length
                      ? "#f0f0f0"
                      : "transparent",
                }}
              >
                See more results...
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBox;
