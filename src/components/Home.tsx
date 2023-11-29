import styles from '@styles/Home.module.css';
import EditableTable from './Table';
import { Box } from '@mui/material';

function Home(): JSX.Element {
  return (
    <div className={styles.containers}>
      <EditableTable />
    </div>
  );
}

export default Home;
