"use client";
import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { CollegeData } from "@/types/api";
import { loadCollegesWithCache } from "@/lib/colleges-cache";
import { updateCollege, UpdateCollegeRequest, createCollege, CreateCollegeRequest, deleteCollege } from "@/lib/api";

export default function SchoolTable() {
  const [colleges, setColleges] = useState<CollegeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    schoolName: "",
    nickname: "",
    city: "",
    state: "",
    type: "",
    subdivision: "",
    primary: "",
    walletAddress: "",
  });

  // Modal states
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    college: CollegeData | null;
  }>({ isOpen: false, college: null });

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    updates: UpdateCollegeRequest | null;
    college: CollegeData | null;
  }>({ isOpen: false, updates: null, college: null });

  const [editForm, setEditForm] = useState({
    name: "",
    nickname: "",
    walletAddress: "",
  });

  const [updating, setUpdating] = useState(false);

  // Add school modal states
  const [addModal, setAddModal] = useState<{
    isOpen: boolean;
  }>({ isOpen: false });

  const [addConfirmModal, setAddConfirmModal] = useState<{
    isOpen: boolean;
    collegeData: CreateCollegeRequest | null;
  }>({ isOpen: false, collegeData: null });

  const [addForm, setAddForm] = useState({
    name: "",
    commonName: "",
    nickname: "",
    city: "",
    state: "",
    type: "",
    subdivision: "",
    primary: "",
    walletAddress: "",
    logo: "",
  });

  const [creating, setCreating] = useState(false);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    college: CollegeData | null;
  }>({ isOpen: false, college: null });
  
  const [deleting, setDeleting] = useState(false);

  // Load colleges data on component mount
  useEffect(() => {
    const loadColleges = async () => {
      try {
        setLoading(true);
        setError(null);

        const {
          data,
          error: loadError,
          fromCache,
        } = await loadCollegesWithCache();

        if (loadError) {
          setError(loadError);
          console.error("Error loading colleges:", loadError);
        } else if (data) {
          setColleges(data);
          console.log(
            `Colleges loaded ${fromCache ? "from cache" : "from API"}`
          );
        }
      } catch (err) {
        setError("Failed to load colleges");
        console.error("Error loading colleges:", err);
      } finally {
        setLoading(false);
      }
    };

    loadColleges();
  }, []);

  // Handle opening edit modal
  const handleOpenEditModal = (college: CollegeData) => {
    setEditForm({
      name: college.name,
      nickname: college.nickname,
      walletAddress: college.walletAddress,
    });
    setEditModal({ isOpen: true, college });
  };

  // Handle closing edit modal
  const handleCloseEditModal = () => {
    setEditModal({ isOpen: false, college: null });
    setEditForm({ name: "", nickname: "", walletAddress: "" });
  };

  // Handle form submission
  const handleSubmitEdit = () => {
    if (!editModal.college) return;

    // Prepare updates object with only changed fields
    const updates: UpdateCollegeRequest = {};
    if (editForm.name !== editModal.college.name) {
      updates.name = editForm.name;
    }
    if (editForm.nickname !== editModal.college.nickname) {
      updates.nickname = editForm.nickname;
    }
    if (editForm.walletAddress !== editModal.college.walletAddress) {
      updates.walletAddress = editForm.walletAddress;
    }

    // Check if there are any changes
    if (Object.keys(updates).length === 0) {
      handleCloseEditModal();
      return;
    }

    // Close edit modal and open confirmation modal
    setEditModal({ isOpen: false, college: null });
    setConfirmModal({
      isOpen: true,
      updates,
      college: editModal.college,
    });
  };

  // Handle confirming the update
  const handleConfirmUpdate = async () => {
    if (!confirmModal.college || !confirmModal.updates) return;

    setUpdating(true);
    try {
      const { error } = await updateCollege(confirmModal.college.id, confirmModal.updates);
      
      if (error) {
        console.error('Failed to update college:', error);
        alert('Failed to update college. Please try again.');
      } else {
        // Success - close modal and reload data
        setConfirmModal({ isOpen: false, updates: null, college: null });
        
        // Reload colleges data
        const {
          data,
          error: loadError,
        } = await loadCollegesWithCache(true); // Force reload from API

        if (loadError) {
          console.error("Error reloading colleges:", loadError);
        } else if (data) {
          setColleges(data);
        }
      }
    } catch (err) {
      console.error('Error updating college:', err);
      alert('Failed to update college. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  // Handle closing confirmation modal
  const handleCloseConfirmModal = () => {
    setConfirmModal({ isOpen: false, updates: null, college: null });
  };

  // Handle opening add modal
  const handleOpenAddModal = () => {
    setAddForm({
      name: "",
      commonName: "",
      nickname: "",
      city: "",
      state: "",
      type: "",
      subdivision: "",
      primary: "",
      walletAddress: "",
      logo: "",
    });
    setAddModal({ isOpen: true });
  };

  // Handle closing add modal
  const handleCloseAddModal = () => {
    setAddModal({ isOpen: false });
    setAddForm({
      name: "",
      commonName: "",
      nickname: "",
      city: "",
      state: "",
      type: "",
      subdivision: "",
      primary: "",
      walletAddress: "",
      logo: "",
    });
  };

  // Handle add form submission
  const handleSubmitAdd = () => {
    // Validate required fields
    const requiredFields = ['name', 'commonName', 'nickname', 'city', 'state', 'type', 'subdivision', 'primary', 'walletAddress'];
    const missingFields = requiredFields.filter(field => !addForm[field as keyof typeof addForm].trim());
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    const collegeData: CreateCollegeRequest = {
      name: addForm.name.trim(),
      commonName: addForm.commonName.trim(),
      nickname: addForm.nickname.trim(),
      city: addForm.city.trim(),
      state: addForm.state.trim(),
      type: addForm.type.trim(),
      subdivision: addForm.subdivision.trim(),
      primary: addForm.primary.trim(),
      walletAddress: addForm.walletAddress.trim(),
      ...(addForm.logo.trim() && { logo: addForm.logo.trim() }),
    };
    setAddModal({ isOpen: false });
    setAddConfirmModal({
      isOpen: true,
      collegeData,
    });
  };

  // Handle confirming the creation
  const handleConfirmCreate = async () => {
    if (!addConfirmModal.collegeData) return;

    setCreating(true);
    try {
      const { error } = await createCollege(addConfirmModal.collegeData);
      
      if (error) {
        console.error('Failed to create college:', error);
        alert('Failed to create college. Please try again.');
      } else {
        // Success - close modal and reload data
        setAddConfirmModal({ isOpen: false, collegeData: null });
        
        // Reload colleges data
        const {
          data,
          error: loadError,
        } = await loadCollegesWithCache(true); // Force reload from API

        if (loadError) {
          console.error("Error reloading colleges:", loadError);
        } else if (data) {
          setColleges(data);
        }
      }
    } catch (err) {
      console.error('Error creating college:', err);
      alert('Failed to create college. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  // Handle closing add confirmation modal
  const handleCloseAddConfirmModal = () => {
    setAddConfirmModal({ isOpen: false, collegeData: null });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.college) return;
    setDeleting(true);
    try {
      const { error } = await deleteCollege(deleteModal.college.id);
      
      if (error) {
        console.error('Failed to delete college:', error);
        alert('Failed to delete college. Please try again.');
      } else {
        // Success - close modal and reload data
        setDeleteModal({ isOpen: false, college: null });
        
        // Reload colleges data
        const {
          data,
          error: loadError,
        } = await loadCollegesWithCache(true); // Force reload from API

        if (loadError) {
          console.error("Error reloading colleges:", loadError);
        } else if (data) {
          setColleges(data);
        }
      }
    } catch (err) {
      console.error('Error deleting college:', err);
      alert('Failed to delete college. Please try again.');
    } finally {
      setDeleting(false);
    }
  }

  const handleOpenDeleteModal = (college: CollegeData) => {
    setDeleteModal({ isOpen: true, college });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({ isOpen: false, college: null });
  };

  const schoolList = useMemo(
    () => colleges.slice().sort((a, b) => a.name.localeCompare(b.name)),
    [colleges]
  );

  const filteredSchoolList = useMemo(() => {
    const lowercased = {
      schoolName: filters.schoolName.toLowerCase(),
      nickname: filters.nickname.toLowerCase(),
      city: filters.city.toLowerCase(),
      state: filters.state.toLowerCase(),
      type: filters.type.toLowerCase(),
      subdivision: filters.subdivision.toLowerCase(),
      primary: filters.primary.toLowerCase(),
      walletAddress: filters.walletAddress.toLowerCase(),
    };

    return schoolList.filter((school) => {
      if (
        lowercased.schoolName &&
        !school.name.toLowerCase().includes(lowercased.schoolName)
      )
        return false;
      if (
        lowercased.nickname &&
        !school.nickname.toLowerCase().includes(lowercased.nickname)
      )
        return false;
      if (
        lowercased.city &&
        !school.city.toLowerCase().includes(lowercased.city)
      )
        return false;
      if (
        lowercased.state &&
        !school.state.toLowerCase().includes(lowercased.state)
      )
        return false;
      if (
        lowercased.type &&
        !school.type.toLowerCase().includes(lowercased.type)
      )
        return false;
      if (
        lowercased.subdivision &&
        !school.subdivision.toLowerCase().includes(lowercased.subdivision)
      )
        return false;
      if (
        lowercased.primary &&
        !school.primary.toLowerCase().includes(lowercased.primary)
      )
        return false;
      if (
        lowercased.walletAddress &&
        !school.walletAddress.toLowerCase().includes(lowercased.walletAddress)
      )
        return false;
      return true;
    });
  }, [filters, schoolList]);

  // Loading state
  if (loading) {
    return (
      <div className="bg-[#03211e] flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#15C0B9]"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="overflow-x-auto rounded-lg border border-white/10 bg-white/5 p-8">
        <div className="text-center text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Schools</h3>
        <button
          onClick={handleOpenAddModal}
          className="cursor-pointer px-4 py-2 rounded-md bg-[#15C0B9] text-white hover:bg-[#15C0B9]/80 transition-colors outline-none focus:ring-2 focus:ring-[#15C0B9] font-medium"
        >
          Add School
        </button>
      </div>

      {/* Schools Table */}
      <div className="overflow-x-auto rounded-lg border border-white/10 bg-white/5 overflow-scroll max-h-[500px] scrollbar-custom">
      <table className="min-w-full table-fixed text-left text-sm text-white/90">
        <thead className="sticky top-0 z-20 bg-[#2a413e] text-white">
          <tr>
            <th className="px-4 py-2 align-top min-w-[300px] max-w-[300px]">
              <div className="space-y-1">
                <div className="text-xs font-semibold mb-2">School name</div>
                <input
                  type="text"
                  value={filters.schoolName}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      schoolName: e.target.value,
                    }))
                  }
                  className="w-full rounded-md bg-white/10 px-2 py-1 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9]"
                />
              </div>
            </th>
            <th className="px-4 py-2 align-top">
              <div className="space-y-1">
                <div className="text-xs font-semibold mb-2">Nickname</div>
                <input
                  type="text"
                  value={filters.nickname}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      nickname: e.target.value,
                    }))
                  }
                  className="w-full rounded-md bg-white/10 px-2 py-1 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9]"
                />
              </div>
            </th>
            <th className="px-4 py-2 align-top">
              <div className="space-y-1">
                <div className="text-xs font-semibold mb-2">City</div>
                <input
                  type="text"
                  value={filters.city}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, city: e.target.value }))
                  }
                  className="w-full rounded-md bg-white/10 px-2 py-1 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9]"
                />
              </div>
            </th>
            <th className="px-4 py-2 align-top">
              <div className="space-y-1">
                <div className="text-xs font-semibold mb-2">State</div>
                <input
                  type="text"
                  value={filters.state}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, state: e.target.value }))
                  }
                  className="w-full rounded-md bg-white/10 px-2 py-1 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9]"
                />
              </div>
            </th>
            <th className="px-4 py-2 align-top">
              <div className="space-y-1">
                <div className="text-xs font-semibold mb-2">Type</div>
                <input
                  type="text"
                  value={filters.type}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full rounded-md bg-white/10 px-2 py-1 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9]"
                />
              </div>
            </th>
            <th className="px-4 py-2 align-top">
              <div className="space-y-1">
                <div className="text-xs font-semibold mb-2">Subdivision</div>
                <input
                  type="text"
                  value={filters.subdivision}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      subdivision: e.target.value,
                    }))
                  }
                  className="w-full rounded-md bg-white/10 px-2 py-1 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9]"
                />
              </div>
            </th>
            <th className="px-4 py-2 align-top">
              <div className="space-y-1">
                <div className="text-xs font-semibold mb-2">Primary</div>
                <input
                  type="text"
                  value={filters.primary}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, primary: e.target.value }))
                  } 
                  className="w-full rounded-md bg-white/10 px-2 py-1 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9]"
                />
              </div>
            </th>
            <th className="px-4 py-2 align-top">
              <div className="space-y-1">
                <div className="text-xs font-semibold mb-2">Wallet address</div>
                <input
                  type="text"
                  value={filters.walletAddress}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      walletAddress: e.target.value,
                    }))
                  }
                  className="w-full rounded-md bg-white/10 px-2 py-1 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9]"
                />
              </div>
            </th>
            <th className="px-4 py-2 align-top">
              <div className="space-y-1">
                <div className="text-xs font-semibold mb-2">Actions</div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredSchoolList.length > 0 ? (
            filteredSchoolList.map((school) => (
              <tr
                key={`${school.name}-${school.city}`}
                className="odd:bg-white/0 even:bg-white/[0.03]"
              >
                <td className="min-w-[300px] max-w-[300px] px-4 py-3 whitespace-nowrap truncate">
                  {school.name}
                </td>
                <td className="min-w-[150px] max-w-[150px] px-4 py-3 whitespace-nowrap truncate">
                  {school.nickname}
                </td>
                <td className="min-w-[150px] max-w-[150px] px-4 py-3 whitespace-nowrap truncate">
                  {school.city}
                </td>
                <td className="min-w-[80px] max-w-[80px] px-4 py-3 whitespace-nowrap truncate">
                  {school.state}
                </td>
                <td className="min-w-[100px] max-w-[100px] px-4 py-3 whitespace-nowrap truncate">
                  {school.type}
                </td>
                <td className="min-w-[120px] max-w-[120px] px-4 py-3 whitespace-nowrap truncate">
                  {school.subdivision}
                </td>
                <td className="min-w-[150px] max-w-[150px] px-4 py-3 whitespace-nowrap truncate">
                  {school.primary}
                </td>
                <td className="min-w-[150px] max-w-[150px] px-4 py-3 font-mono truncate">
                  <Link
                    href={`https://solscan.io/address/${school.walletAddress}`}
                    target="_blank"
                    className="text-blue-500 hover:text-blue-600 block truncate"
                  >
                    {school.walletAddress}
                  </Link>
                </td>
                <td className="min-w-[150px] max-w-[150px] px-4 py-3 font-mono truncate">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpenEditModal(school)}
                      className="cursor-pointer w-full rounded-md bg-white/10 px-2 py-1 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9] hover:bg-white/20 transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleOpenDeleteModal(school)}
                      className="cursor-pointer w-full rounded-md bg-red-500/40 px-2 py-1 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9] hover:bg-red-500/60 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="px-4 py-3 text-center text-white/50">
                No schools found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      {/* Edit Modal */}
      {editModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#2a413e] rounded-lg p-6 max-w-md w-full mx-4 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">
              Edit School: {editModal.college?.name}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  School Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-md bg-white/10 px-3 py-2 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9] border border-white/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Nickname
                </label>
                <input
                  type="text"
                  value={editForm.nickname}
                  onChange={(e) => setEditForm(prev => ({ ...prev, nickname: e.target.value }))}
                  className="w-full rounded-md bg-white/10 px-3 py-2 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9] border border-white/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Wallet Address
                </label>
                <input
                  type="text"
                  value={editForm.walletAddress}
                  onChange={(e) => setEditForm(prev => ({ ...prev, walletAddress: e.target.value }))}
                  className="w-full rounded-md bg-white/10 px-3 py-2 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9] border border-white/20 font-mono text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={handleCloseEditModal}
                className="cursor-pointer px-4 py-2 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors outline-none focus:ring-2 focus:ring-[#15C0B9]"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitEdit}
                className="cursor-pointer px-4 py-2 rounded-md bg-[#15C0B9] text-white hover:bg-[#15C0B9]/80 transition-colors outline-none focus:ring-2 focus:ring-[#15C0B9]"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#2a413e] rounded-lg p-6 max-w-md w-full mx-4 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">
              Confirm Changes
            </h2>
            
            <p className="text-white/80 mb-4">
              Are you sure you want to update <strong>{confirmModal.college?.name}</strong> with the following changes?
            </p>

            <div className="space-y-2 mb-6">
              {confirmModal.updates?.name && (
                <div className="text-sm">
                  <span className="text-white/60">Name:</span>{" "}
                  <span className="text-white">{confirmModal.updates.name}</span>
                </div>
              )}
              {confirmModal.updates?.nickname && (
                <div className="text-sm">
                  <span className="text-white/60">Nickname:</span>{" "}
                  <span className="text-white">{confirmModal.updates.nickname}</span>
                </div>
              )}
              {confirmModal.updates?.walletAddress && (
                <div className="text-sm">
                  <span className="text-white/60">Wallet Address:</span>{" "}
                  <span className="text-white font-mono text-xs">{confirmModal.updates.walletAddress}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={handleCloseConfirmModal}
                disabled={updating}
                className="cursor-pointer px-4 py-2 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors outline-none focus:ring-2 focus:ring-[#15C0B9] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUpdate}
                disabled={updating}
                className="cursor-pointer px-4 py-2 rounded-md bg-[#15C0B9] text-white hover:bg-[#15C0B9]/80 transition-colors outline-none focus:ring-2 focus:ring-[#15C0B9] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {updating && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {updating ? 'Updating...' : 'Confirm Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add School Modal */}
      {addModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#2a413e] rounded-lg p-6 max-w-2xl w-full mx-4 border border-white/10 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-white mb-4">
              Add New School
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  School Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-md bg-white/10 px-3 py-2 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9] border border-white/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Common Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={addForm.commonName}
                  onChange={(e) => setAddForm(prev => ({ ...prev, commonName: e.target.value }))}
                  className="w-full rounded-md bg-white/10 px-3 py-2 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9] border border-white/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Nickname <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={addForm.nickname}
                  onChange={(e) => setAddForm(prev => ({ ...prev, nickname: e.target.value }))}
                  className="w-full rounded-md bg-white/10 px-3 py-2 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9] border border-white/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  City <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={addForm.city}
                  onChange={(e) => setAddForm(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full rounded-md bg-white/10 px-3 py-2 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9] border border-white/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  State <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={addForm.state}
                  onChange={(e) => setAddForm(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full rounded-md bg-white/10 px-3 py-2 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9] border border-white/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Type <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={addForm.type}
                  onChange={(e) => setAddForm(prev => ({ ...prev, type: e.target.value }))}
                  placeholder="e.g., Private, Public"
                  className="w-full rounded-md bg-white/10 px-3 py-2 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9] border border-white/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Subdivision <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={addForm.subdivision}
                  onChange={(e) => setAddForm(prev => ({ ...prev, subdivision: e.target.value }))}
                  placeholder="e.g., FCS, FBS"
                  className="w-full rounded-md bg-white/10 px-3 py-2 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9] border border-white/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Primary Conference <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={addForm.primary}
                  onChange={(e) => setAddForm(prev => ({ ...prev, primary: e.target.value }))}
                  placeholder="e.g., Western Athletic Conference"
                  className="w-full rounded-md bg-white/10 px-3 py-2 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9] border border-white/20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Wallet Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={addForm.walletAddress}
                  onChange={(e) => setAddForm(prev => ({ ...prev, walletAddress: e.target.value }))}
                  className="w-full rounded-md bg-white/10 px-3 py-2 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9] border border-white/20 font-mono text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Logo URL <span className="text-white/60">(optional)</span>
                </label>
                <input
                  type="text"
                  value={addForm.logo}
                  onChange={(e) => setAddForm(prev => ({ ...prev, logo: e.target.value }))}
                  placeholder="https://example.com/logo.png"
                  className="w-full rounded-md bg-white/10 px-3 py-2 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9] border border-white/20"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={handleCloseAddModal}
                className="cursor-pointer px-4 py-2 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors outline-none focus:ring-2 focus:ring-[#15C0B9]"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAdd}
                className="cursor-pointer px-4 py-2 rounded-md bg-[#15C0B9] text-white hover:bg-[#15C0B9]/80 transition-colors outline-none focus:ring-2 focus:ring-[#15C0B9]"
              >
                Add School
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add School Confirmation Modal */}
      {addConfirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#2a413e] rounded-lg p-6 max-w-md w-full mx-4 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">
              Confirm New School
            </h2>
            
            <p className="text-white/80 mb-4">
              Are you sure you want to add <strong>{addConfirmModal.collegeData?.name}</strong> with the following details?
            </p>

            <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
              <div className="text-sm">
                <span className="text-white/60">Name:</span>{" "}
                <span className="text-white">{addConfirmModal.collegeData?.name}</span>
              </div>
              <div className="text-sm">
                <span className="text-white/60">Common Name:</span>{" "}
                <span className="text-white">{addConfirmModal.collegeData?.commonName}</span>
              </div>
              <div className="text-sm">
                <span className="text-white/60">Nickname:</span>{" "}
                <span className="text-white">{addConfirmModal.collegeData?.nickname}</span>
              </div>
              <div className="text-sm">
                <span className="text-white/60">Location:</span>{" "}
                <span className="text-white">{addConfirmModal.collegeData?.city}, {addConfirmModal.collegeData?.state}</span>
              </div>
              <div className="text-sm">
                <span className="text-white/60">Type:</span>{" "}
                <span className="text-white">{addConfirmModal.collegeData?.type}</span>
              </div>
              <div className="text-sm">
                <span className="text-white/60">Subdivision:</span>{" "}
                <span className="text-white">{addConfirmModal.collegeData?.subdivision}</span>
              </div>
              <div className="text-sm">
                <span className="text-white/60">Conference:</span>{" "}
                <span className="text-white">{addConfirmModal.collegeData?.primary}</span>
              </div>
              <div className="text-sm">
                <span className="text-white/60">Wallet Address:</span>{" "}
                <span className="text-white font-mono text-xs">{addConfirmModal.collegeData?.walletAddress}</span>
              </div>
              {addConfirmModal.collegeData?.logo && (
                <div className="text-sm">
                  <span className="text-white/60">Logo URL:</span>{" "}
                  <span className="text-white text-xs break-all">{addConfirmModal.collegeData.logo}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCloseAddConfirmModal}
                disabled={creating}
                className="cursor-pointer px-4 py-2 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors outline-none focus:ring-2 focus:ring-[#15C0B9] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCreate}
                disabled={creating}
                className="cursor-pointer px-4 py-2 rounded-md bg-[#15C0B9] text-white hover:bg-[#15C0B9]/80 transition-colors outline-none focus:ring-2 focus:ring-[#15C0B9] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {creating && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {creating ? 'Creating...' : 'Confirm Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#2a413e] rounded-lg p-6 max-w-md w-full mx-4 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">
              Confirm Delete
            </h2>
            
            <p className="text-white/80 mb-4">
              Are you sure you want to delete <strong>{deleteModal.college?.name}</strong>?
            </p>
            
            <p className="text-red-400 text-sm mb-6">
              This action cannot be undone. All data associated with this school will be permanently removed.
            </p>

            <div className="space-y-2 mb-6">
              <div className="text-sm">
                <span className="text-white/60">School:</span>{" "}
                <span className="text-white">{deleteModal.college?.name}</span>
              </div>
              <div className="text-sm">
                <span className="text-white/60">Nickname:</span>{" "}
                <span className="text-white">{deleteModal.college?.nickname}</span>
              </div>
              <div className="text-sm">
                <span className="text-white/60">Location:</span>{" "}
                <span className="text-white">{deleteModal.college?.city}, {deleteModal.college?.state}</span>
              </div>
              <div className="text-sm">
                <span className="text-white/60">Wallet Address:</span>{" "}
                <span className="text-white font-mono text-xs">{deleteModal.college?.walletAddress}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCloseDeleteModal}
                disabled={deleting}
                className="cursor-pointer px-4 py-2 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors outline-none focus:ring-2 focus:ring-[#15C0B9] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="cursor-pointer px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deleting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {deleting ? 'Deleting...' : 'Delete School'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
