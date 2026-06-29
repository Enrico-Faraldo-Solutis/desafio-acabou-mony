import { Routes, Route } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'
import { AdminRoute } from './AdminRoute'
import { PublicLayout } from '../components/layout/PublicLayout'
import { PrivateLayout } from '../components/layout/PrivateLayout'
import Landing from '../pages/Landing/Landing'
import Login from '../pages/Login/Login'
import Verify2FA from '../pages/Verify2FA/Verify2FA'
import Register from '../pages/Register/Register'
import Dashboard from '../pages/Dashboard/Dashboard'
import Transactions from '../pages/Transactions/Transactions'
import Transfer from '../pages/Transfer/Transfer'
import Deposit from '../pages/Deposit/Deposit'
import CardList from '../pages/Cards/CardList'
import CardNew from '../pages/Cards/CardNew'
import Profile from '../pages/Profile/Profile'
import Auditing from '../pages/Auditing/Auditing'
import NotFound from '../pages/NotFound/NotFound'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-2fa" element={<Verify2FA />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/cards" element={<CardList />} />
          <Route path="/cards/new" element={<CardNew />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<PrivateLayout />}>
          <Route path="/auditing" element={<Auditing />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
