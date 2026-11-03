import { GlobalContext } from "@/Context/GlobalProvider";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingLoader from "@/CustomComponent/LoadingLoader";
import { GraduationCap, ChevronRight, Users } from "lucide-react";

const MyChildren = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(GlobalContext);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/parent/my-children");
        if (res.data.success) {
          setChildren(res.data.children || []);
        }
      } catch (err) {
        console.error("Failed to fetch children:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchChildren();
  }, [user]);

  if (loading) return <LoadingLoader />;

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Family Dashboard
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Welcome back! Select a profile below to monitor academic progress.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium w-fit">
            <Users size={18} />
            {children.length} {children.length === 1 ? 'Child' : 'Children'} Linked
          </div>
        </div>

        {/* Children Grid */}
        {children.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {children.map((child) => (
              <Link
                key={child._id}
                to={`/parent/${child._id}`}
                className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-green-200"
              >
                {/* Decorative Background Element */}
                <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-green-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

                <div className="flex flex-col items-center">
                  {/* Profile Image/Avatar Wrapper */}
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100 group-hover:border-green-100 transition-colors">
                      <img
                        src={child.profileImg?.url || `https://ui-avatars.com/api/?name=${child.firstName}&background=random`}
                        alt={child.firstName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 bg-green-500 p-1.5 rounded-full border-2 border-white text-white">
                      <GraduationCap size={14} />
                    </div>
                  </div>

                  {/* Student Info */}
                  <div className="mt-4 text-center">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                      {child.firstName} {child.lastName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 tracking-wider">
                      {child.email}
                    </p>
                  </div>

                  {/* Action Button Link */}
                  <div className="mt-6 w-full py-2.5 rounded-xl bg-gray-50 text-gray-600 font-semibold text-sm flex items-center justify-center gap-2 group-hover:bg-green-600 group-hover:text-white transition-all">
                    Access Dashboard
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Modern Empty State */
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 shadow-sm">
            <div className="bg-gray-50 p-6 rounded-full mb-4">
              <Users size={48} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">No students connected</h3>
            <p className="text-gray-500 mt-2 max-w-xs text-center">
              We couldn't find any student profiles linked to your parent email. Please contact support to link your children.
            </p>
            <button className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Contact Support
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyChildren;