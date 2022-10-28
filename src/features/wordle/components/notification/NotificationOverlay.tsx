import React from "react";
import Overlay from "react-bootstrap/Overlay";
import { useAppSelector } from "../../../../app/hooks/hooks";
import { showInvalidWordAnimation } from "../wordleversus/wordleVersusSlice";

import styles from "./NotificationOverlay.module.scss";

type NotificationProps = {
  targetRef: any;
};

const NotificationOverlay: React.FunctionComponent<NotificationProps> = ({
  targetRef,
}: NotificationProps) => {

  const showErrorNotification = useAppSelector(showInvalidWordAnimation);

  return (
    <Overlay
      target={targetRef.current}
      show={showErrorNotification}
      rootClose
      placement="top"
    >
      {({ placement, arrowProps, show: _show, popper, ...props }) => (
        <div className={styles.Notification}>Not in word list</div>
      )}
    </Overlay>
  );
};

export default NotificationOverlay;
