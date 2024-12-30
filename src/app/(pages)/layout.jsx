import Navbar from "../_components/Navbar";

const Layout = ({ children }) => {
  return (
    <div>

        <Navbar />
        
        <main className="p-4 max-w-7xl m-auto">

          {children}
        
        </main>

    </div>
  )
}

export default Layout;