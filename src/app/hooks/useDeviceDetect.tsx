import { useEffect, useRef, useState } from 'react';
import {
  LOG_CLS_DESKTOP,
  LOG_CLS_EVENT,
  LOG_CLS_INFO,
  LOG_CLS_MOBILE,
} from '../../features/wordle/PuzzleWordle-helpers';
import {
  DeviceWidthSize,
  DEVICE_WIDTH_L,
  DEVICE_WIDTH_M,
  DEVICE_WIDTH_S,
  DEVICE_WIDTH_XL,
  DEVICE_WIDTH_XS,
  DEVICE_WIDTH_XXS,
} from '../../features/wordle/PuzzleWordle.types';
import useAddEventListener from './useAddEventListener';

export const getDeviceWidthSize = (w: number): DeviceWidthSize => {
  if (w <= 320) {
    return DEVICE_WIDTH_XXS;
  } else if (w <= 375) {
    return DEVICE_WIDTH_XS;
  } else if (w <= 425) {
    return DEVICE_WIDTH_S;
  } else if (w < 768) {
    return DEVICE_WIDTH_M;
  } else if (w <= 1024) {
    return DEVICE_WIDTH_L;
  }

  return DEVICE_WIDTH_XL;
};

function useDeviceDetect() {
  const timerRef = useRef<number>(Date.now());

  const userAgent = window.navigator.userAgent;
  const mobile = Boolean(
    userAgent.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
    )
  );
  const widthSize = getDeviceWidthSize(
    window.document.body.getBoundingClientRect().width
  );

  const [isMobile, setMobile] = useState<boolean>(mobile);
  const [deviceWidth, setDeviceWidth] = useState<DeviceWidthSize>(widthSize);
  const [prevWidth, setPrevWidth] = useState<DeviceWidthSize>(widthSize);

  useEffect(() => {
    if (deviceWidth && deviceWidth !== prevWidth) {
      setPrevWidth(deviceWidth);
      const userAgent =
        typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
      const mobile = Boolean(
        userAgent.match(
          /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
        )
      );

      setMobile(mobile);
      const stat = mobile
        ? { text: 'Mobile', style: LOG_CLS_MOBILE }
        : { text: 'Desktop', style: LOG_CLS_DESKTOP };
      console.log(
        `%cResize Event %c${stat.text} %c${deviceWidth}`,
        LOG_CLS_EVENT,
        stat.style,
        LOG_CLS_INFO
      );
    }
  }, [deviceWidth, prevWidth]);

  const onResizeEvent = (event: Event) => {
    // const vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    // document.documentElement.style.setProperty('--vh', `${vh}px`);

    const curTime = Date.now();
    const deltaDiff = curTime - timerRef.current;
    if (deltaDiff > 500) {
      timerRef.current = curTime;
      const rzEvent = event as UIEvent;
      const windowTarget = rzEvent.currentTarget
        ? (rzEvent.currentTarget as Window)
        : null;

      if (windowTarget) {
        const userAgent = windowTarget.navigator.userAgent;
        const mobile = Boolean(
          userAgent.match(
            /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
          )
        );
        const widthSize = getDeviceWidthSize(
          windowTarget.document.body.getBoundingClientRect().width
        );
        setMobile(mobile);
        setDeviceWidth(widthSize);
      }
      const stat = mobile
        ? { text: 'Mobile', style: LOG_CLS_MOBILE }
        : { text: 'Desktop', style: LOG_CLS_DESKTOP };
      console.log(
        `%cResize Event %c${stat.text} %c${deviceWidth}`,
        LOG_CLS_EVENT,
        stat.style,
        LOG_CLS_INFO
      );
    }
  };

  useAddEventListener('resize', onResizeEvent);

  const isDeviceWidth = (dw: string): boolean => deviceWidth === dw;
  const isDeviceWidthXXS = (): boolean => isDeviceWidth(DEVICE_WIDTH_XXS);
  const isDeviceWidthXS = (): boolean => isDeviceWidth(DEVICE_WIDTH_XS);
  const isDeviceWidthS = (): boolean => isDeviceWidth(DEVICE_WIDTH_S);
  const isDeviceWidthM = (): boolean => isDeviceWidth(DEVICE_WIDTH_M);
  const isDeviceWidthL = (): boolean => isDeviceWidth(DEVICE_WIDTH_L);
  const isDeviceWidthXL = (): boolean => isDeviceWidth(DEVICE_WIDTH_XL);

  return {
    isMobile,
    deviceWidth,
    isDeviceWidthXXS,
    isDeviceWidthXS,
    isDeviceWidthS,
    isDeviceWidthM,
    isDeviceWidthL,
    isDeviceWidthXL,
  };
}

export { useDeviceDetect as default };
