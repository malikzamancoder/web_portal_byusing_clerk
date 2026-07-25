import { useUser, UserButton, SignOutButton } from "@clerk/clerk-react";
import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("attendance");
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);

  const fetchStudentInfo = async () => {
    const snapshot = await getDocs(collection(db, "students"));
    const all = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    const found = all.find(st => st.email === user?.primaryEmailAddress?.emailAddress);
    setStudentInfo(found);
    return found;
  };

  const fetchAttendance = async (studentId) => {
    const q = query(collection(db, "attendance"), where("studentId", "==", studentId));
    const snapshot = await getDocs(q);
    setAttendance(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const fetchMarks = async (studentId) => {
    const q = query(collection(db, "marks"), where("studentId", "==", studentId));
    const snapshot = await getDocs(q);
    setMarks(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const fetchAssignments = async () => {
    const snapshot = await getDocs(collection(db, "assignments"));
    setAssignments(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const fetchQuizzes = async () => {
    const snapshot = await getDocs(collection(db, "quizzes"));
    setQuizzes(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    if (!user) return;
    fetchStudentInfo().then(found => {
      if (found) {
        fetchAttendance(found.id);
        fetchMarks(found.id);
      }
    });
    fetchAssignments();
    fetchQuizzes();
  }, [user]);

  // Attendance stats
  const totalDays = attendance.length;
  const presentDays = attendance.filter(a => a.status === "present").length;
  const attendancePercent = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  const tabs = [
    { key: "attendance", label: "📋 Attendance" },
    { key: "marks", label: "📊 Marks" },
    { key: "assignments", label: "📝 Assignments" },
    { key: "quizzes", label: "❓ Quizzes" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Student Dashboard</h1>
          <p className="text-slate-400 text-sm">Welcome, {user?.fullName}</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition"
          >
            ← Back
          </button>
          <UserButton />
          <SignOutButton>
            <button className="px-4 py-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white text-sm font-medium transition">
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </div>

      {/* Student Info Card */}
      {studentInfo ? (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 mb-6">
          <h2 className="text-white font-semibold text-lg mb-3">My Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Name</span>
              <p className="text-white font-medium">{studentInfo.name}</p>
            </div>
            <div>
              <span className="text-slate-500">Email</span>
              <p className="text-white font-medium">{studentInfo.email}</p>
            </div>
            <div>
              <span className="text-slate-500">Roll No</span>
              <p className="text-white font-medium">{studentInfo.roll}</p>
            </div>
            <div>
              <span className="text-slate-500">Course</span>
              <p className="text-white font-medium">{studentInfo.course}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5 mb-6">
          <p className="text-yellow-400 text-sm">⚠️ Your account is not linked to any student record. Please contact admin.</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
          <p className="text-slate-400 text-sm mb-1">Total Days</p>
          <p className="text-3xl font-bold text-white">{totalDays}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
          <p className="text-slate-400 text-sm mb-1">Present</p>
          <p className="text-3xl font-bold text-green-400">{presentDays}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
          <p className="text-slate-400 text-sm mb-1">Attendance %</p>
          <p className={`text-3xl font-bold ${attendancePercent >= 75 ? "text-green-400" : "text-red-400"}`}>
            {attendancePercent}%
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
          <p className="text-slate-400 text-sm mb-1">Assignments</p>
          <p className="text-3xl font-bold text-violet-400">{assignments.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab.key ? "bg-violet-600 text-white" : "bg-white/10 text-slate-300 hover:bg-white/20"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Attendance Tab */}
      {activeTab === "attendance" && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-lg mb-4">My Attendance</h2>
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 px-3">Date</th>
                <th className="text-left py-2 px-3">Status</th>
                <th className="text-left py-2 px-3">Teacher</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 ? (
                <tr><td colSpan={3} className="text-center py-6 text-slate-500">No attendance record found</td></tr>
              ) : (
                attendance.map(item => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-2 px-3">{item.date}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === "present" ? "bg-green-500/20 text-green-400" :
                        item.status === "absent" ? "bg-red-500/20 text-red-400" :
                        "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2 px-3">{item.teacherName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Marks Tab */}
      {activeTab === "marks" && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-lg mb-4">My Marks</h2>
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 px-3">Subject</th>
                <th className="text-left py-2 px-3">Marks</th>
                <th className="text-left py-2 px-3">Teacher</th>
              </tr>
            </thead>
            <tbody>
              {marks.length === 0 ? (
                <tr><td colSpan={3} className="text-center py-6 text-slate-500">No marks record found</td></tr>
              ) : (
                marks.map(item => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-2 px-3">{item.subject}</td>
                    <td className="py-2 px-3">
                      <span className={`font-bold ${
                        item.marks >= 80 ? "text-green-400" :
                        item.marks >= 50 ? "text-yellow-400" :
                        "text-red-400"
                      }`}>
                        {item.marks}/100
                      </span>
                    </td>
                    <td className="py-2 px-3">{item.teacherName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Assignments Tab */}
      {activeTab === "assignments" && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-lg mb-4">My Assignments</h2>
          {assignments.length === 0 ? (
            <p className="text-center py-6 text-slate-500">No assignments yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignments.map(item => (
                <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-medium">{item.title}</h3>
                    <span className="text-xs text-violet-400 bg-violet-500/20 px-2 py-1 rounded-full">{item.subject}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">{item.description}</p>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>👨‍🏫 {item.teacherName}</span>
                    <span className="text-red-400">Due: {item.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quizzes Tab */}
      {activeTab === "quizzes" && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-lg mb-4">My Quizzes</h2>
          {quizzes.length === 0 ? (
            <p className="text-center py-6 text-slate-500">No quizzes yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzes.map(item => (
                <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-medium">{item.title}</h3>
                    <span className="text-xs text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full">{item.subject}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-3">
                    <span>👨‍🏫 {item.teacherName}</span>
                    <span>Total Marks: {item.totalMarks}</span>
                    <span className="text-yellow-400">📅 {item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;