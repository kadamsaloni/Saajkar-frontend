import "./Categories.css";

function Categories() {

  const items = [
    "Rings",
    "Necklaces",
    "Earrings",
    "Bangles",
    "Bracelets",
    "Anklets",
    "Bridal",
    "Nath"
  ];

  return (

    <div className="categories">

      {items.map((item)=>(
        <button key={item}>
          {item}
        </button>
      ))}

    </div>

  );

}

export default Categories;