import { FC, ReactNode } from 'react';
import { User as UserIcon } from 'react-feather';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';

export interface NavItemProps {
  children?: ReactNode;
  className?: string;
  depth: number;
  href?: string;
  icon?: any;
  info?: any;
  title: string;
  anchorEl?: any;
  onAnchorEl?: (val: any) => void;
}

interface Item {
  href?: string;
  icon?: ReactNode;
  info?: ReactNode;
  items?: Item[];
  title: string;
}

interface Section {
  title: string;
  icon: FC<any>;
  href: string;
  items?: Item[];
}

export const sections: Section[] = [
  {
    title: 'Home',
    icon: HomeOutlinedIcon,
    href: '/'
  },
  // TODO: Remove in initial release version.
  // {
  //   title: 'Products',
  //   icon: ShoppingCartIcon,
  //   href: '/management/products',
  //   items: [
  //     {
  //       title: 'List Products',
  //       href: '/management/products'
  //     },
  //     {
  //       title: 'Create Product',
  //       href: '/management/products/create'
  //     }
  //   ]
  // },
  {
    title: 'Me',
    href: '/account',
    icon: UserIcon,
    items: [
      {
        title: 'Setting',
        href: '/account/setting'
      },
      {
        title: 'Profile',
        href: '/account/profile'
      },
      {
        title: 'Dashboard',
        href: '/account/dashboard'
      }
    ]
  }
];
