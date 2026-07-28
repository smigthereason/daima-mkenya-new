// app/admin/users/UserGrid.tsx
"use client";

import { useMemo, useState } from "react";
import { Mail, Trash2, Search, X, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import UserAvatar from "./UseAvatar";

type User = {
  _id: string;
  name?: string;
  email: string;
  image?: string;
  role?: string;
  _createdAt: string;
};

const PAGE_SIZE = 24;

export default function UserGrid({
  users,
  deleteUser,
  updateUserRole,
}: {
  users: User[];
  deleteUser: (formData: FormData) => Promise<void>;
  updateUserRole: (formData: FormData) => Promise<void>;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filteredUsers = useMemo(() => {
    let result = users;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q),
      );
    }

    if (roleFilter !== "all") {
      result = result.filter((u) => (u.role || "customer") === roleFilter);
    }

    return result;
  }, [users, searchQuery, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const updateSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };
  const updateRoleFilter = (value: string) => {
    setRoleFilter(value);
    setPage(1);
  };

  return (
    <div className="space-y-8">
      {/* ── SEARCH + FILTER BAR ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => updateSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-11 pr-4 py-3 border border-neutral-200 bg-white text-sm focus:border-black outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => updateSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Role Filter Dropdown */}
        <div className="relative sm:w-52">
          <select
            value={roleFilter}
            onChange={(e) => updateRoleFilter(e.target.value)}
            className="w-full appearance-none pl-4 pr-10 py-3 border border-neutral-200 bg-white text-[11px] font-black uppercase tracking-widest outline-none focus:border-black cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-900"
          />
        </div>
      </div>

      <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
        Showing {filteredUsers.length} of {users.length} customers
      </p>

      {/* ── USERS GRID ── */}
      {paginatedUsers.length === 0 ? (
        <div className="text-center py-20 bg-neutral-50 border border-neutral-100">
          <p className="text-neutral-500 text-sm font-medium">
            No customers match your search
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
          {paginatedUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white p-5 sm:p-6 md:p-8 border border-neutral-100 rounded-none group hover:border-neutral-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4 md:mb-6">
                  <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                    <UserAvatar
                      image={user.image}
                      name={user.name}
                      email={user.email}
                    />
                    <div className="overflow-hidden">
                      <h3 className="font-black text-sm text-neutral-900 tracking-tight truncate">
                        {user.name || "Unnamed User"}
                      </h3>
                      <p className="text-[10px] text-neutral-500 flex items-center gap-1.5 uppercase tracking-wider font-bold truncate">
                        <Mail size={12} className="text-[#be1e2d] shrink-0" />{" "}
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-neutral-100">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-[9px] uppercase font-black text-neutral-400 tracking-widest">
                    <span>Role</span>
                    <form
                      action={updateUserRole}
                      className="flex items-center gap-2"
                    >
                      <input type="hidden" name="id" value={user._id} />

                      {/* Individual User Card Role Dropdown */}
                      <div className="relative w-full sm:w-auto flex-1 sm:flex-none">
                        <select
                          name="role"
                          defaultValue={user.role || "customer"}
                          className="w-full appearance-none text-[10px] font-black bg-neutral-50 border border-neutral-100 pl-2.5 pr-7 py-2 rounded-none focus:ring-1 focus:ring-black outline-none uppercase tracking-widest cursor-pointer"
                        >
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                          <option value="manager">Manager</option>
                        </select>
                        <ChevronDown
                          size={12}
                          className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400"
                        />
                      </div>

                      <button
                        type="submit"
                        className="text-[8px] font-black bg-neutral-900 text-white px-3 py-2 rounded-none hover:bg-neutral-700 transition-colors uppercase tracking-widest shrink-0"
                      >
                        Update
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 md:mt-8 pt-4 border-t border-neutral-100">
                <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">
                  {new Date(user._createdAt).toLocaleDateString("en-KE", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <form
                  action={deleteUser}
                  className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <input type="hidden" name="id" value={user._id} />
                  <button className="flex items-center gap-2 text-[9px] font-black text-[#be1e2d] hover:text-red-700 uppercase tracking-widest">
                    <Trash2 size={12} /> Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-4 py-2.5 border border-neutral-200 text-[10px] font-black uppercase tracking-widest hover:border-black disabled:opacity-30 disabled:hover:border-neutral-200 transition-colors"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-4 py-2.5 border border-neutral-200 text-[10px] font-black uppercase tracking-widest hover:border-black disabled:opacity-30 disabled:hover:border-neutral-200 transition-colors"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Show total count */}
      <div className="text-center text-[10px] text-neutral-400 uppercase tracking-widest font-black pt-8 border-t border-neutral-100">
        Total Users: {users.length}
      </div>
    </div>
  );
}
