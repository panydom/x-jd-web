import React, { useMemo } from 'react';
import { Button } from 'antd';
export interface linkProps {
  label?: string;
  value: string;
  [ key: string ]: any
}

const Link: React.FC<linkProps> = ({ label, value, ...props }) => {
  const href = useMemo(() => {
    if(/^https?:\/\//.test(value)){
      return value
    }
  }, [value])
  const text = useMemo(() =>  href ? label : value, [href, label, value])
  if(href){
    return (<Button type="link" href={href} {...props}>{label}</Button>);
  }
  return <>{text}</>
};

export default Link;
