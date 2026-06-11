/**
 * @file ui:app-screen
 * @requires @seed-design/react@~1.0.0
 * @requires @seed-design/css@~1.0.0
 **/

import { PullToRefreshRoot, PullToRefreshContent, PullToRefreshIndicator } from "./pull-to-refresh";
import { AppScreen as SeedAppScreen } from "@seed-design/stackflow";
import { useActivity, useFlow } from "@stackflow/react";
import { forwardRef } from "react";

export interface AppScreenProps extends SeedAppScreen.RootProps {
  preventSwipeBack?: boolean;
}

export const AppScreen = forwardRef<HTMLDivElement, AppScreenProps>(
  ({ children, onSwipeBackEnd, preventSwipeBack, ...otherProps }, ref) => {
    const { pop } = useFlow();
    const { isRoot } = useActivity();
    const shouldSwipeBack = !isRoot && !preventSwipeBack;

    return (
      <SeedAppScreen.Root
        ref={ref}
        onSwipeBackEnd={({ swiped }) => {
          if (swiped) {
            pop();
          }
          onSwipeBackEnd?.({ swiped });
        }}
        {...otherProps}
      >
        <SeedAppScreen.Dim />
        {children}
        {shouldSwipeBack && <SeedAppScreen.Edge />}
      </SeedAppScreen.Root>
    );
  },
);
AppScreen.displayName = "AppScreen";

export interface AppScreenContentProps extends SeedAppScreen.LayerProps {
  ptr?: boolean;

  onPtrReady?: () => void;

  onPtrRefresh?: () => Promise<void>;
}

const APP_SCREEN_LAYER_BG = "var(--seed-color-bg-neutral-weak)";

export const AppScreenContent = forwardRef<HTMLDivElement, AppScreenContentProps>(
  ({ children, ptr, onPtrReady, onPtrRefresh, style, ...otherProps }, ref) => {
    const layerStyle = {
      backgroundColor: APP_SCREEN_LAYER_BG,
      ...style,
    };

    if (!ptr) {
      return (
        <SeedAppScreen.Layer ref={ref} style={layerStyle} {...otherProps}>
          {children}
        </SeedAppScreen.Layer>
      );
    }

    return (
      <PullToRefreshRoot asChild onPtrReady={onPtrReady} onPtrRefresh={onPtrRefresh}>
        <SeedAppScreen.Layer ref={ref} style={layerStyle} {...otherProps}>
          <PullToRefreshIndicator />
          <PullToRefreshContent asChild>{children}</PullToRefreshContent>
        </SeedAppScreen.Layer>
      </PullToRefreshRoot>
    );
  },
);

/**
 * This file is a snippet from SEED Design, helping you get started quickly with @seed-design/* packages.
 * You can extend this snippet however you want.
 */
