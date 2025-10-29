"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  href,
  icon,
  label,
  isActive,
}) => {
  return (
    <Link
      href={href}
      className={`
        flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 group
        ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
            : "text-gray-700 hover:bg-gray-50"
        }
      `}
    >
      <div
        className={`${isActive ? "text-white" : "text-gray-500 group-hover:text-blue-600"} transition-colors`}
      >
        {icon}
      </div>
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
};

export const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      href: "/dashboard",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      label: "Ideas",
    },
  ];

  if (isCollapsed) {
    return (
      <aside className="w-20 bg-white border-r border-gray-200 h-screen sticky top-0">
        <div className="p-4 flex flex-col items-center space-y-6 mt-20">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-3 rounded-xl bg-gray-50 text-gray-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all duration-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </button>

          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`p-3.5 rounded-xl transition-all duration-300 ${
                pathname === item.href
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item.icon}
            </Link>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-56 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="p-4 mt-20">
        {/* Collapse Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <div className="space-y-1">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.href}
              {...item}
              isActive={pathname === item.href}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState } from "react";

// interface SidebarItemProps {
//   href: string;
//   icon: React.ReactNode;
//   label: string;
//   isActive?: boolean;
// }

// const SidebarItem: React.FC<SidebarItemProps> = ({
//   href,
//   icon,
//   label,
//   isActive,
// }) => {
//   return (
//     <Link
//       href={href}
//       className={`
//         flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
//         ${
//           isActive
//             ? "bg-blue-50 text-blue-600"
//             : "text-gray-700 hover:bg-gray-100"
//         }
//       `}
//     >
//       {icon}
//       <span className="font-medium">{label}</span>
//     </Link>
//   );
// };

// export const Sidebar = () => {
//   const pathname = usePathname();
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   const menuItems = [
//     {
//       href: "/dashboard",
//       icon: (
//         <svg
//           className="w-5 h-5"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
//           />
//         </svg>
//       ),
//       label: "Ideas",
//     },
//     {
//       href: "/dashboard/settings",
//       icon: (
//         <svg
//           className="w-5 h-5"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
//           />
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//           />
//         </svg>
//       ),
//       label: "Settings",
//     },
//   ];

//   if (isCollapsed) {
//     return (
//       <aside className="w-16 bg-white border-r border-gray-200 h-screen sticky top-16">
//         <div className="p-4">
//           <button
//             onClick={() => setIsCollapsed(false)}
//             className="text-gray-600 hover:text-gray-900"
//           >
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M4 6h16M4 12h16M4 18h16"
//               />
//             </svg>
//           </button>
//         </div>
//       </aside>
//     );
//   }

//   return (
//     <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-16">
//       <div className="p-4 space-y-2">
//         <div className="flex justify-end mb-4">
//           <button
//             onClick={() => setIsCollapsed(true)}
//             className="text-gray-600 hover:text-gray-900"
//           >
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           </button>
//         </div>
//         {menuItems.map((item) => (
//           <SidebarItem
//             key={item.href}
//             {...item}
//             isActive={pathname === item.href}
//           />
//         ))}
//       </div>
//     </aside>
//   );
// };
