// SPA 라우팅을 위한 라우터
export const createRouter = () => {
  const routes = [];
  let notFoundHandler = null;

  // URL과 라우트 매칭
  const matchRoute = (pathname) => {
    for (const route of routes) {
      // 동적 파라미터 지원: /product/:id
      const paramNames = [];
      const pattern = route.path.replace(/:(\w+)/g, (_, name) => {
        paramNames.push(name);
        return "([^/]+)";
      });

      const regex = new RegExp(`^${pattern}$`);
      const matches = pathname.match(regex);

      if (matches) {
        const params = {};
        paramNames.forEach((name, i) => {
          params[name] = matches[i + 1];
        });
        return { handler: route.handler, params };
      }
    }
    return null;
  };

  // 라우트 변경 처리
  const handleRouteChange = () => {
    const matchedRoute = matchRoute(window.location.pathname);

    if (matchedRoute) {
      matchedRoute.handler(matchedRoute.params);
    } else if (notFoundHandler) {
      notFoundHandler();
    }
  };

  // 뒤로가기/앞으로가기 대응
  window.addEventListener("popstate", handleRouteChange);

  return {
    // 라우트 등록
    addRoute: (path, handler) => {
      routes.push({ path, handler });
    },

    // 404 핸들러 등록
    setNotFound: (handler) => {
      notFoundHandler = handler;
    },

    // 페이지 이동
    push: (path) => {
      window.history.pushState(null, "", path);
      handleRouteChange();
    },

    // 라우터 시작
    start: () => {
      handleRouteChange();
    },
  };
};

// 링크 클릭 이벤트를 라우터로 연결하는 헬퍼
export const setupLinkHandler = (router) => {
  document.addEventListener("click", (e) => {
    // data-link 속성이 있는 요소만 처리
    const link = e.target.closest("[data-link]");

    if (link) {
      e.preventDefault();
      const href = link.getAttribute("href");
      if (href) {
        router.push(href);
      }
    }
  });
};
