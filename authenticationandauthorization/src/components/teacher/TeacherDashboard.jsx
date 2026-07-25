import { useUser, UserButton, SignOutButton } from "@clerk/clerk-react";
import { db } from "../../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function TeacherDashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState("attendance");

  // Attendance
  const [attendance, setAttendance] = useState({});
  const [attendanceDate, setAttendanceDate] = useState("");

  // Marks
  const [marks, setMarks] = useState({});
  const [marksSubject, setMarksSubject] = useState("");

  // Assignment
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDesc, setAssignmentDesc] = useState("");
  const [assignmentDue, setAssignmentDue] = useState("");
  const [assignmentSubject, setAssignmentSubject] = useState("");

  // Quiz
  const [quizTitle, setQuizTitle] = useState("");
  const [quizSubject, setQuizSubject] = useState("");
  const [quizDate, setQuizDate] = useState("");
  const [quizTotal, setQuizTotal] = useState("");

  const fetchStudents = async () => {
    const snapshot = await getDocs(collection(db, "students"));
    setStudents(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Save Attendance
  const saveAttendance = async () => {
    if (!attendanceDate) return alert("Please select a date");
    if (students.length === 0) return alert("No students found");
    for (const student of students) {
      await addDoc(collection(db, "attendance"), {
        studentId: student.id,
        studentName: student.name,
        date: attendanceDate,
        status: attendance[student.id] || "present",
        teacherName: user?.fullName,
      });
    }
    alert("Attendance saved successfully!");
    setAttendance({});
    setAttendanceDate("");
  };

  // Save Marks
  const saveMarks = async () => {
    if (!marksSubject) return alert("Please enter subject name");
    for (const student of students) {
      if (!marks[student.id]) continue;
      await addDoc(collection(db, "marks"), {
        studentId: student.id,
        studentName: student.name,
        subject: marksSubject,
        marks: marks[student.id],
        teacherName: user?.fullName,
      });
    }
    alert("Marks saved successfully!");
    setMarks({});
    setMarksSubject("");
  };

  // Add Assignment
  const addAssignment = async () => {
    if (!assignmentTitle || !assignmentSubject || !assignmentDue) return alert("Please fill all fields");
    await addDoc(collection(db, "assignments"), {
      title: assignmentTitle,
      description: assignmentDesc,
      subject: assignmentSubject,
      dueDate: assignmentDue,
      teacherName: user?.fullName,
      createdAt: new Date().toISOString(),
    });
    alert("Assignment added successfully!");
    setAssignmentTitle(""); setAssignmentDesc(""); setAssignmentDue(""); setAssignmentSubject("");
  };

  // Add Quiz
  const addQuiz = async () => {
    if (!quizTitle || !quizSubject || !quizDate || !quizTotal) return alert("Please fill all fields");
    await addDoc(collection(db, "quizzes"), {
      title: quizTitle,
      subject: quizSubject,
      date: quizDate,
      totalMarks: quizTotal,
      teacherName: user?.fullName,
      createdAt: new Date().toISOString(),
    });
    alert("Quiz added successfully!");
    setQuizTitle(""); setQuizSubject(""); setQuizDate(""); setQuizTotal("");
  };

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
          <h1 className="text-2xl font-bold text-white">Teacher Dashboard</h1>
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

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab.key ? "bg-emerald-600 text-white" : "bg-white/10 text-slate-300 hover:bg-white/20"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Attendance Tab */}
      {activeTab === "attendance" && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-lg mb-4">Mark Attendance</h2>
          <input
            type="date"
            value={attendanceDate}
            onChange={e => setAttendanceDate(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/10 focus:outline-none focus:border-emerald-500 mb-6"
          />
          <table className="w-full text-sm text-slate-300 mb-6">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 px-3">Name</th>
                <th className="text-left py-2 px-3">Roll No</th>
                <th className="text-left py-2 px-3">Course</th>
                <th className="text-left py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-6 text-slate-500">No students found</td></tr>
              ) : (
                students.map(st => (
                  <tr key={st.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-2 px-3">{st.name}</td>
                    <td className="py-2 px-3">{st.roll}</td>
                    <td className="py-2 px-3">{st.course}</td>
                    <td className="py-2 px-3">
                      <select
                        value={attendance[st.id] || "present"}
                        onChange={e => setAttendance({ ...attendance, [st.id]: e.target.value })}
                        className="px-3 py-1 rounded-lg bg-white/10 text-white border border-white/10 focus:outline-none"
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="leave">Leave</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <button
            onClick={saveAttendance}
            className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition"
          >
            Save Attendance
          </button>
        </div>
      )}

      {/* Marks Tab */}
      {activeTab === "marks" && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-lg mb-4">Enter Marks</h2>
          <input
            type="text"
            placeholder="Subject Name"
            value={marksSubject}
            onChange={e => setMarksSubject(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/10 text-white placeholder-slate-400 border border-white/10 focus:outline-none focus:border-emerald-500 mb-6"
          />
          <table className="w-full text-sm text-slate-300 mb-6">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 px-3">Name</th>
                <th className="text-left py-2 px-3">Roll No</th>
                <th className="text-left py-2 px-3">Marks (out of 100)</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr><td colSpan={3} className="text-center py-6 text-slate-500">No students found</td></tr>
              ) : (
                students.map(st => (
                  <tr key={st.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-2 px-3">{st.name}</td>
                    <td className="py-2 px-3">{st.roll}</td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        placeholder="0-100"
                        value={marks[st.id] || ""}
                        onChange={e => setMarks({ ...marks, [st.id]: e.target.value })}
                        className="px-3 py-1 rounded-lg bg-white/10 text-white placeholder-slate-400 border border-white/10 focus:outline-none w-24"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <button
            onClick={saveMarks}
            className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition"
          >
            Save Marks
          </button>
        </div>
      )}

      {/* Assignments Tab */}
      {activeTab === "assignments" && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-lg mb-4">Add Assignment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Assignment Title"
              value={assignmentTitle}
              onChange={e => setAssignmentTitle(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white placeholder-slate-400 border border-white/10 focus:outline-none focus:border-emerald-500"
            />
            <input
              type="text"
              placeholder="Subject"
              value={assignmentSubject}
              onChange={e => setAssignmentSubject(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white placeholder-slate-400 border border-white/10 focus:outline-none focus:border-emerald-500"
            />
            <textarea
              placeholder="Assignment Description"
              value={assignmentDesc}
              onChange={e => setAssignmentDesc(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white placeholder-slate-400 border border-white/10 focus:outline-none focus:border-emerald-500 md:col-span-2 h-24 resize-none"
            />
            <div className="flex flex-col gap-1">
              <label className="text-slate-400 text-xs">Due Date</label>
              <input
                type="date"
                value={assignmentDue}
                onChange={e => setAssignmentDue(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/10 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <button
            onClick={addAssignment}
            className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition"
          >
            + Add Assignment
          </button>
        </div>
      )}

      {/* Quizzes Tab */}
      {activeTab === "quizzes" && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-lg mb-4">Add Quiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Quiz Title"
              value={quizTitle}
              onChange={e => setQuizTitle(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white placeholder-slate-400 border border-white/10 focus:outline-none focus:border-emerald-500"
            />
            <input
              type="text"
              placeholder="Subject"
              value={quizSubject}
              onChange={e => setQuizSubject(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white placeholder-slate-400 border border-white/10 focus:outline-none focus:border-emerald-500"
            />
            <div className="flex flex-col gap-1">
              <label className="text-slate-400 text-xs">Quiz Date</label>
              <input
                type="date"
                value={quizDate}
                onChange={e => setQuizDate(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/10 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <input
              type="number"
              placeholder="Total Marks"
              value={quizTotal}
              onChange={e => setQuizTotal(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white placeholder-slate-400 border border-white/10 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            onClick={addQuiz}
            className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition"
          >
            + Add Quiz
          </button>
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;