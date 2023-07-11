import Link from 'next/link';



import MainHeaderStyle from './MainHeader.module.css';

const MainHeader = () => {
    return (
        <header className={MainHeaderStyle.Header}>
                 <div className={MainHeaderStyle.Logo} >
      {/* <Link href="/" className={MainHeaderStyle.Logo}> USAR A VERSÃO DE BAIXO, pq é essa que deixa você estilizar o 'Link' (pq aí você usa a tag <a> para isso...) */}
      <Link href="/" >
          <a >
          NextEvents
          </a>
          </Link>
          {/* </Link> */}
</div>

<nav className={MainHeaderStyle.Navigation}>
    <ul>
        <li>
            {/* <Link href="/events">Browse All Events</Link> */}
            <Link href="/events">
            <a>Browse All Events</a>
            </Link>
        </li>
    </ul>
</nav>
        </header> 
    )
}



export default MainHeader;