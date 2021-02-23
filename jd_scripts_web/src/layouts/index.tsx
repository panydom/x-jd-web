import React from 'react';
import styles from './index.less'

const Layout:React.FC<any> = function Layout(props){
  return (
    <div className={styles.layout}>
      <div className={styles.container}>
      {props.children}
      </div>
    </div>
  )
}

export default Layout
