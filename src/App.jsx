import { useEffect, useState } from "react";
import styles from "./App.module.css";
import { fetchData } from "./utils/dataFetch";

function App() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");
  const [coloredRows, setColoredRows] = useState(false);
  const [restoreDeleted, setRestoreDeleted] = useState([]);
  const [dataBeforeDelete, setDataBeforeDelete] = useState([]);
  const [orderByCountry, setOrderByCountry] = useState(true);
  const [hola, setHola] = useState([])

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData();
        setData(result);
        setDataBeforeDelete(result)
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  const handleDelete = (id) => {
    const newUserList = data.filter((users) => users.login.uuid !== id);
    setData(newUserList);
    setRestoreDeleted([...restoreDeleted, id]);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleColorRows = () => {
    setColoredRows(!coloredRows);
  };

  const restorToInitialState = () => {
    setData(dataBeforeDelete)
  };

  const filteredDataByCountry = data.filter((user) =>
    user.location.country.toLowerCase().includes(filter.toLowerCase())
  );

  const filterByCountryName = () =>{
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      const countryA = a.location.country.toLowerCase();
      const countryB = b.location.country.toLowerCase();
      if (countryA < countryB) {
        return -1;
      }
      if (countryA > countryB) {
        return 1;
      }
      return 0;
    });
  
    if (orderByCountry) {
      setData(sortedData); // Orden ascendente por país
    } else {
      setData(data); // Restaurar estado original
    }
  
    setOrderByCountry(!orderByCountry);
  }

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>Lista de usuarios</h1>
      <header>
        <button onClick={handleColorRows}>Colorea filas</button>
        <button onClick={filterByCountryName}>Ordena por país</button>
        <button onClick={restorToInitialState}>Restaurar estado inicial</button>
        <input
          type="text"
          placeholder="Filtrar por país"
          value={filter}
          onChange={handleFilterChange}
        ></input>
      </header>
      <main>
        <table>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>País</th>
              <th className={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredDataByCountry?.map((user, index) => {
              const rowClass = coloredRows
                ? index % 2 === 0
                  ? styles.tableRowEven
                  : styles.tableRowOdd
                : styles.tableRowDefault;
              return (
                <tr key={user.login.uuid} className={`${styles.tr} ${rowClass}`}>
                  <td>
                    <img src={user.picture.thumbnail} alt={user.name.first} />
                  </td>
                  <td>{user.name.first}</td>
                  <td>{user.name.last}</td>
                  <td>{user.location.country}</td>
                  <td>
                    <button onClick={() => handleDelete(user.login.uuid)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default App;
