import Link from 'next/link';
import { CatLogoSvg } from '@svg/index';
import styles from '@styles/Header.module.css';
import { Box, Typography } from '@mui/material';
import BasicMenu from './menu';

/**
 * It returns a header element with a logo, a title, and a navigation bar
 * @returns A JSX element
 */
function Header(): JSX.Element {
  return (
    <header className={styles.container}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Box>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ height: '90px' }}>
              <Link href="/">
                <CatLogoSvg className="w-full h-full" />
              </Link>
            </Box>

            <div className={styles.name}>
              <Link href="/">Task Logger</Link>
            </div>
          </div>
        </Box>
        <Box sx={{ p: '20x', mx: 3 }}>
          <BasicMenu />
        </Box>
      </Box>
    </header>
  );
}

export default Header;
