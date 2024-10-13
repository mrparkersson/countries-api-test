import React from "react";

import countries from "./data/countries";
import SearchBox from "./components/SearchBox";

const App: React.FC = () => {
  return (
    <div>
      <SearchBox suggestions={countries} />
    </div>
  );
};

export default App;
