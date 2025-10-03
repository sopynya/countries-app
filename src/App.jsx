import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <Router>
    <div className={darkMode ? "dark" : ""}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/country/:name" element={<Country />} />
      </Routes>
    </div>
    </Router>
  );
}

function Header({ darkMode, toggleDarkMode }) {
  return (
    <header className={darkMode ? "darkHeader" : ""}>
      <h1>Where in the world?</h1>
      <p onClick={toggleDarkMode} style={{ cursor: "pointer" }}>
        <i id="moon" className="fa-regular fa-moon"></i> Dark Mode
      </p>
    </header>
  );
}

function Home() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [showRegion, setShowRegion] = useState(false);

  useEffect(() => {
    fetch("/data.json")
      .then(res => res.json())
      .then(data => setCountries(data));
  }, []);

  const filteredCountries = countries.filter(c => {
    const matchesRegion = region ? c.region.toLowerCase() === region.toLowerCase() : true;
    const matchesSearch = search ? c.name.toLowerCase().includes(search.toLowerCase()) : true;
    return matchesRegion && matchesSearch;
  });

  return (
    <section id="countriesSection">
      <section id="filtering">
        <div id="search">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Search for a country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div id="filter">
          <p onClick={() => setShowRegion(prev => !prev)} style={{ cursor: "pointer" }}>
            Filter by Region
          </p>
          <i className="fa-solid fa-chevron-down" onClick={() => setShowRegion(prev => !prev)}></i>

          {showRegion && (
            <div id="region">
              {["Africa", "Americas", "Asia", "Europe", "Oceania"].map(r => (
                <p key={r} onClick={() => setRegion(r)} style={{ cursor: "pointer", fontWeight: region === r ? "bold" : "normal" }}>
                  {r}
                </p>
              ))}
            </div>
          )}
        </div>
      </section>

      <ul>
        {filteredCountries.map(c => (
          <li className="country" key={c.name}>
            <Link to={`/country/${encodeURIComponent(c.name)}`}>
              <img src={c.flags.svg} alt={c.name} />
              <div id="info">
                <h2>{c.name}</h2>
                <p>Population: <span className="information">{c.population}</span></p>
                <p>Region: <span className="information">{c.region}</span></p>
                <p>Capital: <span className="information">{c.capital}</span></p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}



function Country() {
  const { name } = useParams();
  const [countries, setCountries] = useState([]); 
  const [country, setCountry] = useState(null);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => {
        setCountries(data);

        const found = data.find(
          (c) => c.name.toLowerCase() === decodeURIComponent(name).toLowerCase()
        );
        setCountry(found);
      });
  }, [name]);

  if (!country) return <p>Country not found!</p>;

  return (
    <>
      <section id="country">
        <Link to="/">← Back</Link>
        <img src={country.flags.svg} alt={country.name} />

        <section id="countryInfo">
          <h1>{country.name}</h1>

          <div className="flex">
            <div>
              <p>
                Native Name: <span className="information">{country.nativeName}</span>
              </p>
              <p>
                Population: <span className="information">{country.population}</span>
              </p>
              <p>
                Region: <span className="information">{country.region}</span>
              </p>
              <p>
                Sub Region: <span className="information">{country.subregion}</span>
              </p>
              <p>
                Capital: <span className="information">{country.capital}</span>
              </p>
            </div>
            <div>
              <p>
                Top Level Domain: <span className="information">{country.topLevelDomain}</span>
              </p>
              <p>
                Currencies: <span className="information">
                  {country.currencies
                    ? Object.values(country.currencies)
                        .map((c) => c.name)
                        .join(", ")
                    : "N/A"}
                </span>
              </p>
              <p>
                Languages: <span className="information">
                  {country.languages
                    ? Object.values(country.languages)
                        .map((l) => l.name)
                        .join(", ")
                    : "N/A"}
                </span>
              </p>
            </div>
          </div>

          <div id="border">
          <p>Border Countries:</p>
          <div className="borderList">
            {country.borders && country.borders.length > 0 ? (
              country.borders.map((borderCode) => {
                const borderCountry = countries.find(
                  (c) => c.alpha3Code === borderCode
                );
                return (
                  <span key={borderCode} className="borderCountry">
                  {borderCountry ? borderCountry.name : borderCode}
                  </span>
                );
              })
            ) : (
              <span className="borderCountry">None</span>
            )}
          </div>
          </div>

        </section>
      </section>
    </>
  );
}

export default App;

