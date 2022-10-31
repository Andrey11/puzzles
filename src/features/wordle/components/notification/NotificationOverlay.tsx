import React, { RefObject, useEffect, useState } from "react";
import Overlay from "react-bootstrap/Overlay";
import { useAppSelector } from "../../../../app/hooks/hooks";
import {
  isUserLostRound,
  isUserWonRound,
  showInvalidWordAnimation,
} from "../wordleversus/wordleVersusSlice";

import styles from "./NotificationOverlay.module.scss";

type NotificationProps = {
  targetRef: RefObject<any>;
};

const NotificationOverlay: React.FunctionComponent<NotificationProps> = ({
  targetRef,
}: NotificationProps) => {
  const showErrorNotification = useAppSelector(showInvalidWordAnimation);
  const userWonRound = useAppSelector(isUserWonRound);
  const userLostRound = useAppSelector(isUserLostRound);

  const [showOverlay, setShowOverlay] = useState<boolean>(false);

  const getNotificationElement = (): JSX.Element => {
    let statusCls = '';
    let message = '';
    if (showErrorNotification) {
      statusCls = styles.InvalidWord;
      message = "Not in word list";
    } else if (userWonRound) {
      statusCls = styles.UserWonRound;
      message = "You WON";
    } else if (userLostRound) {
      statusCls = styles.UserLostRound;
      message = "You LOST";
    }

    return (
      <div className={`${styles.NotificationComponent} ${statusCls}`}>
        {message}
      </div>
    );
  };

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (showErrorNotification || userLostRound || userWonRound) {
      setShowOverlay(true);
      timerId = setTimeout(() => {
        setShowOverlay(false);
      }, 2100);
    }

    return () => clearTimeout(timerId);
  }, [showErrorNotification, userLostRound, userWonRound]);

  return (
    <Overlay
      show={showOverlay}
      rootClose={true}
      target={targetRef.current}
      placement="top"
    >
      {({ placement, arrowProps, show: _show, popper, ...props }) =>
        getNotificationElement()
      }
    </Overlay>
  );
};

export default NotificationOverlay;
