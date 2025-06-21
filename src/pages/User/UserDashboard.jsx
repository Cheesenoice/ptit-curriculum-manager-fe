import React from "react";

const UserDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">
          👋 Chào mừng, {user?.name}!
        </h1>
        <p className="text-lg text-base-content">
          Đây là giao diện Dashboard dành cho {user?.roles}
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-primary">Enrolled Courses</h2>
            <p className="text-3xl font-bold">5</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-primary">Upcoming Classes</h2>
            <p className="text-3xl font-bold">3</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-primary">Assignments Due</h2>
            <p className="text-3xl font-bold">2</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
