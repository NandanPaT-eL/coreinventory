export const metadata = {
  title: 'Authentication - CoreInventory',
  description: 'Sign in or create an account for CoreInventory',
}

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/50">
      {children}
    </div>
  )
}
