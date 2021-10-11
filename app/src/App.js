import { useState } from 'react';
import RegisterLogin from './components/RegisterLogin';
import Homepage from './components/Homepage';
import { isAuthenticated } from './helpers/authenticationHelper';

function App() {
  const [isAuthed, setIsAuthed] = useState(isAuthenticated());

  return (
    <>
      {isAuthed && (
        <Homepage setIsAuthed={setIsAuthed} />
      )}
      {!isAuthed && (
        <RegisterLogin setIsAuthed={setIsAuthed} />
      )}
    </>
  );
}

export default App;
