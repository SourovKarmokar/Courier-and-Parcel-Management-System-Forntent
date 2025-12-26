import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* 🏷️ বাম পাশ: লোগো */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              📦 CourierPro
            </Link>
          </div>

          {/* 🔘 ডান পাশ: মেনু আইটেম */}
          <div className="flex items-center space-x-4">
            
            {/* যদি ইউজার লগইন করা থাকে */}
            {currentUser ? (
              <>
                <span className="text-gray-700 font-medium hidden sm:block">
                  Hello, {currentUser.firstName}
                </span>
                
                <Link 
                  to="/dashboard" 
                  className="text-gray-600 hover:text-blue-600 font-medium transition"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Logout
                </button>
              </>
            ) : (
              /* যদি ইউজার লগইন না থাকে */
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
              >
                Login
              </Link>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;