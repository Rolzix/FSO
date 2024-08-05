const Notification = ({ message }) => {
  if (message[0] === null) {
    return null;
  }

  return <div className={`notification ${message[1]}`}>{message[0]}</div>;
};

export default Notification;
