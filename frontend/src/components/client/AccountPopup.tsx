import { UserCircleIcon, Cog6ToothIcon, BellIcon, FolderIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface AccountPopupProps {
  onClose: () => void;
  userName: string;
}

export default function AccountPopup({ onClose, userName }: AccountPopupProps) {
  const menuItems = [
    { name: 'Notifications', icon: BellIcon, href: '/notifications' },
    { name: 'Profile', icon: UserCircleIcon, href: '/profile' },
    { name: 'Files', icon: FolderIcon, href: '/files' },
    { name: 'Settings', icon: Cog6ToothIcon, href: '/settings' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="fixed left-16 top-0 z-50 h-screen w-80 bg-white shadow-lg">
        {/* User Info Section */}
        <div className="border-b p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-[#2D3B45] flex items-center justify-center">
              <UserCircleIcon className="h-12 w-12 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#2D3B45]">{userName}</h2>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg p-3 text-[#2D3B45] hover:bg-gray-100"
                  onClick={onClose}
                >
                  <item.icon className="h-6 w-6" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 w-full border-t p-4">
          <button
            onClick={() => {
              // Add logout logic here
              onClose();
            }}
            className="flex w-full items-center gap-3 rounded-lg p-3 text-[#2D3B45] hover:bg-gray-100"
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
