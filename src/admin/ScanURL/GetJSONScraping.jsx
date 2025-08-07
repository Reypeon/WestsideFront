import { useEffect, useState } from 'react';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const GetJSONScraping = () => {
  const [scrapings, setScrapings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${apiUrl}/api/GetAllJsoNScraping`)
      .then(res => {
        setScrapings(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando JSONs...</p>;
  if (error) return <p>Error al cargar: {error}</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Scraping JSONs</h2>
      {scrapings.length === 0 && <p>No se encontraron JSONs.</p>}
      {scrapings.map((item, index) => (
        <details key={index} style={{ marginBottom: '1rem' }}>
          <summary><strong>Scraping #{index + 1}</strong></summary>
          <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
            {JSON.stringify(item, null, 2)}
          </pre>
        </details>
      ))}
    </div>
  );
}
export default GetJSONScraping