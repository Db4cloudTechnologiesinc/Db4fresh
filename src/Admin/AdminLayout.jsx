import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import { Outlet } from 'react-router-dom';
export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-red-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="p-6"><Outlet /></main>
      </div>
    </div>
  );
}