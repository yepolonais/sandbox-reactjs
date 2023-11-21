

export function Component({primary, user}) {
    const text = user ? <p>Welcome {user}!</p> : <p>Welcome!</p>
    return primary ? <h1>{text}</h1> : <h2>{text}</h2>

  };

  export function MyButton() {
    const coucou = <button>Je suis un bouton</button>;
    const popo = <button>Je suis un autre bouton</button>;
    return (
        <>
        <div>{coucou}</div>
        <div>{popo}</div>
        </>
        );
  }