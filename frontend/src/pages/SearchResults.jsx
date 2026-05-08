import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Course_Card from '../components/core/Catalog/Course_Card';
import Loading from '../components/common/Loading';
import { searchCourses } from '../services/operations/courseDetailsAPI';

const SearchResults = () => {
  const location = useLocation();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const query = new URLSearchParams(location.search).get('q') || '';

  useEffect(() => {
    if (query) {
      (async () => {
        setLoading(true);
        const res = await searchCourses(query);
        setResults(res);
        setLoading(false);
      })();
    } else {
      setResults([]);
    }
  }, [query]);

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
      <p className="text-richblack-5 text-2xl mb-6">
        Search results for "<span className="text-yellow-25">{query}</span>"
      </p>
      {results && results.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {results.map((course, i) => (
            <Course_Card key={i} course={course} Height={"h-[300px]"} />
          ))}
        </div>
      ) : (
        <p className="text-richblack-200">No courses found.</p>
      )}
    </div>
  );
};

export default SearchResults;