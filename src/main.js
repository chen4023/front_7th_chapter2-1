import "./styles.css";

import { getProducts } from "./api/productApi.js";
import HomePage from "./pages/HomePage.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: {
        url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
      },
    }),
  );

async function render() {
  const $root = document.querySelector("#root");

  $root.innerHTML = HomePage({ loading: true, error: null, products: [] }); // loading
  try {
    const data = await getProducts();
    $root.innerHTML = HomePage({ loading: false, error: null, products: data.products }); // 성공
  } catch (error) {
    $root.innerHTML = HomePage({ loading: false, error: error, products: [] }); // 실패
  }
  setupRetryButton();
}
// 재시도 버튼 제공
function setupRetryButton() {
  const retryBtn = document.querySelector("#retry-btn");
  retryBtn.addEventListener("click", () => {
    render();
  });
}

function main() {
  render();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
