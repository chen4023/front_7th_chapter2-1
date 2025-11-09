import ProductFilter from "../components/product/ProductFilter";
import ProductList from "../components/product/ProductList";
import Layout from "../components/Layout";

export default function HomePage({ loading, products }) {
  const content = /*html*/ `
    ${ProductFilter({ loading })}
    ${ProductList({ loading, products })}
  `;
  return Layout({ children: content });
}
