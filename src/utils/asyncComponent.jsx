import React, { lazy, Suspense, memo, useState, useEffect } from "react";
import AppLoading from "../pages/amkoloading";

const componentCache = new WeakMap();

const asyncComponent = (
  importFunc,
  {
    fallback = <AppLoading />,
    errorFallback = <div>Error loading component</div>,
    displayName = "AsyncComponent",
    retryCount = 3,
  } = {}
) => {
  if (componentCache.has(importFunc)) {
    return componentCache.get(importFunc);
  }

  const LazyComponent = lazy(() => {
    let attempts = 0;

    const tryImport = async () => {
      try {
        return await importFunc();
      } catch (error) {
        attempts++;

        if (attempts < retryCount && error.name === "ChunkLoadError") {
          await new Promise((res) => setTimeout(res, 2 ** attempts * 500));
          return tryImport();
        }

        console.error(
          `${displayName} failed after ${attempts} attempts`,
          error
        );
        return { default: () => errorFallback };
      }
    };

    return tryImport();
  });

  const WrappedComponent = memo(
    (props) => {
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 300); // Small buffer
        return () => clearTimeout(timer);
      }, []);

      return (
        <>
          {loading && fallback}
          <Suspense
            fallback={null} // avoid replacing content
          >
            <LazyComponent {...props} />
          </Suspense>
        </>
      );
    },
    (prev, next) => {
      const prevKeys = Object.keys(prev);
      const nextKeys = Object.keys(next);
      return (
        prevKeys.length === nextKeys.length &&
        prevKeys.every((key) => prev[key] === next[key])
      );
    }
  );

  WrappedComponent.displayName = `Async(${displayName})`;
  WrappedComponent.preload = () => importFunc().catch(() => {});
  WrappedComponent.isLoaded = () => componentCache.has(importFunc);

  componentCache.set(importFunc, WrappedComponent);

  return WrappedComponent;
};

export default asyncComponent;

// Factory
asyncComponent.createFactory =
  (defaultOptions = {}) =>
  (importFunc, options = {}) =>
    asyncComponent(importFunc, { ...defaultOptions, ...options });

asyncComponent.preloadAll = (components) =>
  Promise.allSettled(
    components.map((c) =>
      typeof c.preload === "function" ? c.preload() : Promise.resolve()
    )
  );