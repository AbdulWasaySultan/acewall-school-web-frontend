import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "@/Context/GlobalProvider";

const MoreCoursesDropdown = () => {
  const [categories, setCategories] = useState([]);
  const [subCategoriesMap, setSubCategoriesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setSelectedSubcategoryId } = useContext(GlobalContext);

  // Fetch categories and subcategories
  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        const categoryRes = await axiosInstance.get("/category/get");
        const allCategories = categoryRes.data?.categories || [];

        const tempCategories = [];
        const tempSubMap = {};

        await Promise.allSettled(
          allCategories.map(async (category) => {
            if (!category._id) return;

            try {
              const subRes = await axiosInstance.get(
                `/category/subcategories/${category._id}`
              );
              const subcategories = subRes.data?.subcategories || [];
              if (subcategories.length > 0) {
                tempCategories.push(category);
                tempSubMap[category._id] = subcategories;
              }
            } catch (err) {
              console.error(
                `❌ Failed to load subcategories for ${category.title}:`,
                err.message
              );
            }
          })
        );

        setCategories(tempCategories);
        setSubCategoriesMap(tempSubMap);
      } catch (err) {
        console.error("❌ Error fetching categories:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndSubcategories();
  }, []);

  const handleNavigate = (subcategoryId) => {
    setSelectedSubcategoryId(subcategoryId);
    navigate(`/student/courses/${subcategoryId}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={categories.length > 0}
          aria-label="More Courses Dropdown"
          className="text-xs md:text-md lg:text-base font-medium text-gray-700 flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
        >
          MORE COURSES
          <ChevronDown className="w-4 h-4 transition-transform duration-300" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto"
        role="menu"
        aria-label="More Courses Subcategories"
      >
        {loading ? (
          <DropdownMenuItem disabled role="menuitem">
            Loading...
          </DropdownMenuItem>
        ) : categories.length > 0 ? (
          categories.map((category) => (
            <DropdownMenuSub key={category._id}>
              <DropdownMenuSubTrigger role="menuitem">
                {category.title}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent role="menu">
                {subCategoriesMap[category._id].map((sub) => (
                  <DropdownMenuItem
                    key={sub._id}
                    className="cursor-pointer"
                    onSelect={() => handleNavigate(sub._id)}
                    role="menuitem"
                  >
                    {sub.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ))
        ) : (
          <DropdownMenuItem disabled role="menuitem">
            No Topics available
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MoreCoursesDropdown;
