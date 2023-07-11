import Link from 'next/link';

import MainNavigationStyle from './MainNavigation.module.css';

import { useContext } from 'react';

import AuthContext from '../../store/authContext';

const MainNavigation = () => {
  const authContext = useContext(AuthContext);

  return (
    <header className={MainNavigationStyle.Header}>
      <Link href="/">
        <a>
          <div className={MainNavigationStyle.Logo}>Next Auth</div>
        </a>
      </Link>
      <nav>
        <ul>
          <li>
            <Link href="/auth">Login</Link>
          </li>
          {authContext.auth && ( //render condicional -- quando NÃO ESTAMOS AUTENTICADOS, o 'Profile' não aparece...
            <li>
              <Link href="/profile">Profile</Link>
            </li>
          )}
          {!authContext.auth && ( //render condicional
            <li>
              <button>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
