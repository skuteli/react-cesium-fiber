// @ts-nocheck
import React, { useRef, useLayoutEffect, useState } from "react";
import { Viewer as CesiumViewer } from "cesium";
import { render } from "./reconciler";

import { ViewerProvider, useViewer } from "./context";

import { ReactCesiumFiber } from "./types";

// forward ref ?
export const Viewer = ({
  children,
  args = [],
  style = {},
  ...viewerProps
}: ReactCesiumFiber.Component<
  CesiumViewer,
 [ ConstructorParameters<typeof CesiumViewer>[1]]
> & {
  style?: React.CSSProperties;
}): React.ReactElement => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      const props = { args: [containerRef.current, ...args], ...viewerProps };
      const wrapped = (
        <viewer {...props}>
          <ViewerProvider value={viewer}>{children}</ViewerProvider>
        </viewer>
      );
      const returned = render(wrapped, containerRef.current);

      if (viewer == null && returned != null) {
        setViewer(returned);
      }
    }
  }, [children, containerRef.current, viewer]);

  return <div style={style} ref={containerRef}></div>;
};

export { useViewer };
