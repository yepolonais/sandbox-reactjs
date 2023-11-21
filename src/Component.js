

export function Component(props) {
    if (!props.warn) {
      return null;
    }
    return (
      <div className="warning">
        Warning!
      </div>
    );
  };