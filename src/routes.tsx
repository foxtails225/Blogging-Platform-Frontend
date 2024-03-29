import React, { Suspense, Fragment, lazy } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import MainLayout from 'src/layouts/MainLayout';
import DocsLayout from 'src/layouts/DocsLayout';
import HomeView from 'src/views/home/HomeView';
import LoadingScreen from 'src/components/LoadingScreen';
import AuthGuard from 'src/components/AuthGuard';
import GuestGuard from 'src/components/GuestGuard';
import AdminGuard from 'src/components/AdminGuard';
import SubAdminGuard from 'src/components/SubAdminGuard';

type Routes = {
  exact?: boolean;
  path?: string | string[];
  guard?: any;
  layout?: any;
  component?: any;
  routes?: Routes;
}[];

export const renderRoutes = (routes: Routes = []): JSX.Element => (
  <Suspense fallback={<LoadingScreen />}>
    <Switch>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Component = route.component;

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            render={props => (
              <Guard>
                <Layout>
                  {route.routes ? (
                    renderRoutes(route.routes)
                  ) : (
                    <Component {...props} />
                  )}
                </Layout>
              </Guard>
            )}
          />
        );
      })}
    </Switch>
  </Suspense>
);

const routes: Routes = [
  {
    exact: true,
    path: '/404',
    component: lazy(() => import('src/views/errors/NotFoundView'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: '/login',
    component: lazy(() => import('src/views/auth/LoginView'))
  },
  {
    exact: true,
    path: '/login-unprotected',
    component: lazy(() => import('src/views/auth/LoginView'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: '/register',
    component: lazy(() => import('src/views/auth/RegisterView'))
  },
  {
    exact: true,
    path: '/register-unprotected',
    component: lazy(() => import('src/views/auth/RegisterView'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: '/verify-code',
    component: lazy(() => import('src/views/auth/VerifyCodeView'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: '/password-recovery',
    component: lazy(() => import('src/views/auth/PasswordRecovery'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: '/password-reset/:id',
    component: lazy(() => import('src/views/auth/PasswordReset'))
  },
  {
    exact: true,
    layout: MainLayout,
    path: '/contact',
    component: lazy(() => import('src/views/contact'))
  },
  {
    exact: true,
    layout: MainLayout,
    path: '/users/:id',
    component: lazy(() => import('src/views/account/ProfileView'))
  },
  {
    exact: true,
    layout: MainLayout,
    path: '/posts/public/:id',
    component: lazy(() => import('src/views/post/PostView'))
  },
  {
    exact: true,
    layout: MainLayout,
    path: '/posts/all',
    component: lazy(() => import('src/views/post/PostAllView'))
  },
  {
    exact: true,
    layout: MainLayout,
    path: '/symbol/:id',
    component: lazy(() => import('src/views/symbol/SymbolView'))
  },
  {
    exact: true,
    guard: AdminGuard,
    layout: MainLayout,
    path: '/admin',
    component: lazy(() => import('src/views/admin/AdminView'))
  },
  {
    exact: true,
    guard: SubAdminGuard,
    layout: MainLayout,
    path: '/sub-admin',
    component: lazy(() => import('src/views/admin/SubAdminView'))
  },
  {
    path: '/account',
    guard: AuthGuard,
    layout: MainLayout,
    routes: [
      {
        exact: true,
        path: '/account/setting',
        component: lazy(() => import('src/views/account/AccountView'))
      },
      {
        exact: true,
        path: '/account/profile',
        component: lazy(() => import('src/views/account/ProfileView'))
      },
      {
        exact: true,
        path: '/account/dashboard',
        component: lazy(() => import('src/views/account/DashboardView'))
      },
      {
        exact: true,
        path: '/account/notification',
        component: lazy(() => import('src/views/account/NotificationView'))
      },
      {
        exact: true,
        path: '/user',
        component: () => <Redirect to="/user/profile" />
      },
      {
        component: () => <Redirect to="/404" />
      }
    ]
  },
  {
    path: '/posts',
    guard: AuthGuard,
    layout: MainLayout,
    routes: [
      {
        exact: true,
        path: '/posts/new',
        component: lazy(() => import('src/views/post/PostCreateView'))
      },
      {
        exact: true,
        path: '/posts/edit/:id',
        component: lazy(() => import('src/views/post/PostCreateView'))
      },
      {
        component: () => <Redirect to="/404" />
      }
    ]
  },
  {
    path: '/docs',
    layout: DocsLayout,
    routes: [
      {
        exact: true,
        path: '/docs',
        component: () => <Redirect to="/docs/policy" />
      },
      {
        exact: true,
        path: '/docs/policy',
        component: lazy(() => import('src/views/docs/PolicyView'))
      },
      {
        exact: true,
        path: '/docs/terms',
        component: lazy(() => import('src/views/docs/TermsView'))
      },
      {
        component: () => <Redirect to="/404" />
      }
    ]
  },
  {
    path: '*',
    layout: MainLayout,
    routes: [
      {
        exact: true,
        path: '/',
        component: HomeView
      },
      {
        exact: true,
        path: '/pricing',
        component: lazy(() => import('src/views/pricing/PricingView'))
      },
      {
        component: () => <Redirect to="/404" />
      }
    ]
  }
];

export default routes;
