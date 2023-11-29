import Link from 'next/link';
import { CatLogoSvg } from '@svg/index';
import styles from '@styles/Header.module.css';

/**
 * It returns a header element with a logo, a title, and a navigation bar
 * @returns A JSX element
 */
function Header(): JSX.Element {
  return (
    <header className={styles.container}>
      <div className={styles.logo}>
        <div className="h-16">
          <Link href="/">
            <CatLogoSvg className="w-full h-full" />
          </Link>
        </div>
      </div>
      <div className={styles.name}>
        <Link href="/">Task Logger</Link>
      </div>
      <div className={styles.small}>
        <div className={styles.smallCat}>
          <Link href="/" aria-label="Cat">
            <CatLogoSvg className="w-full h-full" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
