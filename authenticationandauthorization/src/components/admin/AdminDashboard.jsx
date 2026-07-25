import { useUser, UserButton, SignOutButton } from "@clerk/clerk-react";
import { db } from "../../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [activeTab, setActiveTab] = useState("students");

  // Student form
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentRoll, setStudentRoll] = useState("");
  const [studentCourse, setStudentCourse] = useState("");

  // Teacher form
  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherSubject, setTeacherSubject] = useState("");

  const fetchStudents = async () => {
    const snapshot = await getDocs(collection(db, "students"));
    setStudents(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const fetchTeachers = async () => {
    const snapshot = await getDocs(collection(db, "teachers"));
    setTeachers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchStudents();
    fetchTeachers();
  }, []);

  const addStudent = async () => {
    if (!studentName || !studentEmail || !studentRoll || !studentCourse) return alert("Please fill all fields");
    await addDoc(collection(db, "students"), {
      name: studentName,
      email: studentEmail,
      roll: studentRoll,
      course: studentCourse,
    });
    setStudentName(""); setStudentEmail(""); setStudentRoll(""); setStudentCourse("");
    fetchStudents();
  };

  const addTeacher = async () => {
    if (!teacherName || !teacherEmail || !teacherSubject) return alert("Please fill all fields");
    await addDoc(collection(db, "teachers"), {
      name: teacherName,
      email: teacherEmail,
      subject: teacherSubject,
    });
    setTeacherName(""); setTeacherEmail(""); setTeacherSubject("");
    fetchTeachers();
  };

  const deleteStudent = async (id) => {
    await deleteDoc(doc(db, "students", id));
    fetchStudents();
  };

  const deleteTeacher = async (id) => {
    await deleteDoc(doc(db, "teachers", id));
    fetchTeachers();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
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

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
          <p className="text-slate-400 text-sm mb-1">Total Students</p>
          <p className="text-3xl font-bold text-indigo-400">{students.length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
          <p className="text-slate-400 text-sm mb-1">Total Teachers</p>
          <p className="text-3xl font-bold text-emerald-400">{teachers.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("students")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition ${activeTab === "students" ? "bg-indigo-600 text-white" : "bg-white/10 text-slate-300 hover:bg-white/20"}`}
        >
          🎓 Students
        </button>
        <button
          onClick={() => setActiveTab("teachers")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition ${activeTab === "teachers" ? "bg-emerald-600 text-white" : "bg-white/10 text-slate-300 hover:bg-white/20"}`}
        >
          👨‍🏫 Teachers
        </button>
      </div>

      {/* Students Tab */}
      {activeTab === "students" && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-lg mb-4">Add Student</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <input
              type="text"
              placeholder="Student Name"
              value={studentName}
              onChange={e => setStudentName(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white placeholder-slate-400 border border-white/10 focus:outline-none focus:border-indigo-500"
            />
            <input
              type="email"
              placeholder="Student Email"
              value={studentEmail}
              onChange={e => setStudentEmail(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white placeholder-slate-400 border border-white/10 focus:outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              placeholder="Roll Number"
              value={studentRoll}
              onChange={e => setStudentRoll(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white placeholder-slate-400 border border-white/10 focus:outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              placeholder="Course (e.g. BSCS)"
              value={studentCourse}
              onChange={e => setStudentCourse(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white placeholder-slate-400 border border-white/10 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            onClick={addStudent}
            className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition mb-8"
          >
            + Add Student
          </button>

          <h2 className="text-white font-semibold text-lg mb-4">Students List</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-300">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 px-3">Name</th>
                  <th className="text-left py-2 px-3">Email</th>
                  <th className="text-left py-2 px-3">Roll No</th>
                  <th className="text-left py-2 px-3">Course</th>
                  <th className="text-left py-2 px-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-6 text-slate-500">No students added yet</td></tr>
                ) : (
                  students.map(st => (
                    <tr key={st.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-2 px-3">{st.name}</td>
                      <td className="py-2 px-3">{st.email}</td>
                      <td className="py-2 px-3">{st.roll}</td>
                      <td className="py-2 px-3">{st.course}</td>
                      <td className="py-2 px-3">
                        <button
                          onClick={() => deleteStudent(st.id)}
                          className="px-3 py-1 rounded-lg bg-red-500/70 hover:bg-red-500 text-white text-xs transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Teachers Tab */}
      {activeTab === "teachers" && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-lg mb-4">Add Teacher</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <input
              type="text"
              placeholder="Teacher Name"
              value={teacherName}
              onChange={e => setTeacherName(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white placeholder-slate-400 border border-white/10 focus:outline-none focus:border-indigo-500"
            />
            <input
              type="email"
              placeholder="Teacher Email"
              value={teacherEmail}
              onChange={e => setTeacherEmail(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white placeholder-slate-400 border border-white/10 focus:outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              placeholder="Subject"
              value={teacherSubject}
              onChange={e => setTeacherSubject(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white placeholder-slate-400 border border-white/10 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            onClick={addTeacher}
            className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition mb-8"
          >
            + Add Teacher
          </button>

          <h2 className="text-white font-semibold text-lg mb-4">Teachers List</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-300">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 px-3">Name</th>
                  <th className="text-left py-2 px-3">Email</th>
                  <th className="text-left py-2 px-3">Subject</th>
                  <th className="text-left py-2 px-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {teachers.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-6 text-slate-500">No teachers added yet</td></tr>
                ) : (
                  teachers.map(t => (
                    <tr key={t.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-2 px-3">{t.name}</td>
                      <td className="py-2 px-3">{t.email}</td>
                      <td className="py-2 px-3">{t.subject}</td>
                      <td className="py-2 px-3">
                        <button
                          onClick={() => deleteTeacher(t.id)}
                          className="px-3 py-1 rounded-lg bg-red-500/70 hover:bg-red-500 text-white text-xs transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;