import React, { FC, useState, useEffect } from 'react';
import useSettings from 'src/hooks/useSettings';
import { THEMES, LOGOS } from 'src/constants';

interface LogoProps {
  [key: string]: any;
  static?: string;
}

const Logo: FC<LogoProps> = props => {
  const { settings } = useSettings();
  const [src, setSrc] = useState<string>();
  const style = { width: '120px', height: 'auto' };

  useEffect(() => {
    if (!props.static) {
      const value =
        settings.theme === THEMES.ONE_DARK ? LOGOS.ONE_DARK : LOGOS.LIGHT;
      setSrc(value);
    } else {
      setSrc(LOGOS.ONE_DARK);
    }
  }, [settings.theme, props.static]);

  return <img alt="Logo" src={src} style={style} {...props} />;
};

export default Logo;
