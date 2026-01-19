import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '@/shared/auth/AuthProvider'
import { LanguageSwitcher } from '@/shared/ui/LanguageSwitcher/LanguageSwitcher'
import { useTranslation } from 'react-i18next'


export default function Layout() {
  const { t } = useTranslation()
  const {
    user,
    // logout
  } = useAuth()
  // const navigate = useNavigate()

  // function handleLogout() {
  //   logout()
  //   navigate('/login')
  // }

  const linkClass =
    'px-[15px] py-[5px] rounded hover:bg-blue-200 transition-colors'

  const activeLinkClass =
    'bg-blue-300 font-medium'

  return (
    <div className="flex h-screen">
      <aside className="w-[250px] bg-blue-100 p-[15px] flex flex-col gap-[50px]">
        <p className="font-bold text-center">{t('financialConsultant')}</p>

        <nav className="flex flex-col gap-[7px]">
          <NavLink
            to="/accounts"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeLinkClass : ''}`}
          >
            {t('accounts.accounts')}
          </NavLink>

          <NavLink
            to="/operations"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeLinkClass : ''}`}
          >
            {t('operations.operations')}
          </NavLink>

          <NavLink
            to="/funds"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeLinkClass : ''}`}
          >
            {t('funds.funds')}
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeLinkClass : ''}`}
          >
            {t('analytics.analytics')}
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeLinkClass : ''}`}
          >
            {t('settings')}
          </NavLink>
        </nav>

        <div className="mt-auto flex flex-col">
          <LanguageSwitcher className="ml-auto"/>
          <p className="wrap-break-word">{t('user')}: {user?.username}</p>

          {/*<Button*/}
          {/*  variant='danger'*/}
          {/*  onClick={handleLogout}*/}
          {/*  className="w-full"*/}
          {/*>*/}
          {/*  Выйти*/}
          {/*</Button>*/}
        </div>
      </aside>


      <main className="grow overflow-auto bg-[url(/images/bg2.jpg)] bg-cover bg-center flex">
        <div className="grow overflow-auto p-[40px] backdrop-invert-100">
          <Outlet />
        </div>
      </main>
    </div>
  )
}