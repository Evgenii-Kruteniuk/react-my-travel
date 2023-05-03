import React from "react";
import "./index.scss";
import Collection from "./components/Collections";
import { useEffect } from "react";
import { useState } from "react";

const categories = [
  { name: "Все" },
  { name: "О.А.Э." },
  { name: "Грузия" },
  { name: "Абхазия" },
  { name: "Крым" },
  { name: "Сочи" },
  { name: "Лаго-Наки" },
];

function App() {
  //6. Сделаем пагинацию (переход по страницам внизу)
  const [page, setPage] = useState(1);
  //5. Сделаем вместо скелетонов надпись ЗАГРУЗКА пока фото грузятся если медл. инет
  const [isLoading, setIsLoading] = useState(true);
  //3. Создадим поиск по категориям: все, горы, море....
  const [categoryId, setCategoryId] = useState(0);
  //2.Сделаем поиск по строке
  const [searchValue, setSearchValue] = useState("");
  /* 1.Через fetch запрос получим наши данные с сервера (симулятора сервера)
  и сразу сделаем useState и поместим наши полученные данные в state с помощью
  setCollections(data) т е collections теперь равна data. Ну и сразу проверим 
  на отлов ошибок с помощью catch(err)*/
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    /* setIsLoading(true) для того, чтобы при переключении категорий тоже высвечивалось
     Загрузка... Если это не пропишем, то слово Загрузка... высветится 1 раз при первой загрузке*/
    setIsLoading(true);
    /*4. Добавим вызов фетч запроса при изменении категории и так же установим тернарник
    если категория 1,2,3 которые есть, то вызыв соотв объект или все если категория="" */
    /*6. Для пагинации дописываем page=${page}&limit=3& что значит, что при переходе
    по страницам, мы установили лимит в 3 объекта на странице. Пропишем page также в массиве зависимостей*/
    fetch(
      `https://6450c944e1f6f1bb229ee7bd.mockapi.io/collections_photos?page=${page}&limit=3&${
        categoryId ? `category=${categoryId}` : ""
      }`
    )
      .then((res) => res.json())
      .then((data) => {
        setCollections(data);
      })
      .catch((err) => console.warn(err))
      /* 5. Прописываем finally для того, чтобы менять состояние. Как только страница
      загрузится, сост изменится на false и надпись Загрузка... заменится на  фото */
      .finally(() => setIsLoading(false));
  }, [categoryId, page]);

  return (
    <div className="App">
      <h1>Мои путешествия по миру</h1>
      <div className="top">
        <ul className="tags">
          {categories.map((obj, ind) => (
            <li
              //При клике переключаем категори: все, горы, море....className подсвечивает выбр категорию
              onClick={() => {
                setCategoryId(ind);
                setPage(1);
              }}
              className={categoryId === ind ? "active" : ""}
              key={obj.name}
            >
              {obj.name}
            </li>
          ))}
        </ul>
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="search-input"
          placeholder="Поиск по названию"
        />
      </div>
      <div className="content">
        {/*Будем фильтровать коллекцию по нашему объекту так, если имя объекта приведенного
         к нижнему регистру будет включать строку которую ввел пользователь приведенную
         к нижнему регистру*/}
        {/*5. Надпись загрузка сделаем тернарником*/}
        {isLoading ? (
          <h2>Загрузка...</h2>
        ) : (
          collections
            .filter((obj) => {
              return obj.name.toLowerCase().includes(searchValue.toLowerCase());
            })
            .map((obj, index) => (
              <Collection
                // Создадим уникальный ключ
                key={obj.name + index}
                name={obj.name}
                images={obj.photos}
              />
            ))
        )}
      </div>
      <ul className="pagination">
        {/*Сделаем массив из 5 заглушечных элементов, проходимся по нему. В нем нету элементов
        но есть их индексы. Их и выводим начиная не с 0, а с 1*/}
        {[...Array(5)].map((_, ind) => (
          <li
            className={page === ind + 1 ? "active" : ""}
            onClick={() => setPage(ind + 1)}
            key={ind}
          >
            {ind + 1}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
