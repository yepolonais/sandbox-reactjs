import { useState } from "react";

export function Component({primary, user}) {
    const text = user ? <p>Welcome {user}!</p> : <p>Welcome!</p>
    return primary ? <h1>{text}</h1> : <h2>{text}</h2>

  };

  export function Counter() {
    const [counter, setCounter] = useState(0);
    function handleClick () {
      setCounter(counter + 1);
    };
    const coucou = <button>Je suis un bouton</button>;
    const popo = <button>Je suis un autre bouton</button>;
    return (
        
        <button onClick={handleClick}>{counter}</button>
        );
  }

  export function Counter_2() {
    const [counter, setCounter] = useState(0);
    function handleClickPos () {
      setCounter(counter + 1);
    };
    function handleClickMin () {
        setCounter(counter - 1);
      };
    return (
        <div>
            <p id="value">{counter}</p>
            <button id="increment" onClick={handleClickPos}>+</button>
            <button id="decrement" onClick={handleClickMin}>-</button>
        </div>
    )
}