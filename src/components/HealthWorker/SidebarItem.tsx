import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface SidebarItemProps {
  icon: React.ReactNode;
  label?: string;
  href: string;
  isActive: boolean;
  isCollapsed: boolean;
  title?: string;
}

const SidebarItem = ({
  icon,
  label,
  href,
  isActive,
  isCollapsed,
  title,
}: SidebarItemProps) => {
  const navigate = useNavigate();

  // Determine text color
  const textColor = isActive ? "text-white" : "text-neutral-700";

  // Determine background classes
  const bgClasses = isActive
    ? "bg-primary-500 text-white rounded-md mx-2"
    : "hover:bg-primary-100 hover:text-primary-600 rounded-md mx-2";

  return (
    <motion.div
      whileHover={{ x: 4 }}
      onClick={() => navigate(href)}
      className={`flex items-center px-3 py-2 cursor-pointer ${bgClasses} ${
        isCollapsed ? "justify-center" : ""
      }`}
    >
      <div className={`text-md ${isActive ? "text-white" : "text-primary-500"}`}>
        {icon}
      </div>

      {!isCollapsed && (title || label) && (
        <span className={`ml-3 font-medium text-sm ${textColor}`}>
          {title || label}
        </span>
      )}
    </motion.div>
  );
};

export default SidebarItem;
