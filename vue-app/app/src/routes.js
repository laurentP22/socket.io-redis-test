import Admin from './components/Admin'

export const routes = [
  {
    path:'/',
    name: 'home',
    component: Admin
  },
  {
    path:'/admin',
    name: 'admin',
    component: Admin
  }
];

