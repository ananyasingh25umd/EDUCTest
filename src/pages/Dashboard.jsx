import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [teacherCount, setTeacherCount] = useState(null);
  const [studentCount, setStudentCount] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
  if (!file) return alert("Please select a file");

  // ----------- 1. Uploading file to Supabase Storage -----------------
  const { data, error } = await supabase.storage
    .from("transcripts") // the bucket we'll create in Supabase
    .upload(file.name, file, { upsert: true });

  if (error) {
    console.error("Storage upload error:", error.message);
    return;
  }

  console.log("File uploaded:", data.path);

  // ------------------- 2. Saving file info to database (transcripts table) --------------------
  const { data: { user } } = await supabase.auth.getUser(); // checks current logged-in user
  console.log("USER exists");

  const { data: transcriptData, error: dbError } = await supabase
    .from("transcripts") // gets the csv from the Supabase bucket where all the data gets stored
    .insert([
      { user_id: user.id, file_url: data.path },  // policies created for bucket to accept insert and select SQL queries
    ])
    .select()
    .single();

  if (dbError) {
    console.error("DB insert error:", dbError.message);
    return;
  }

  console.log("Transcript saved in DB successfully", transcriptData);

  // ------------------ 3. Calling the edge function in Supabase ------------------------
  const { data: analysisData, error: analysisError } = await supabase.functions.invoke(
  "parseTranscript",  // this is the name of my edge function inside Supabase
  {
    body: { file_url: data.path }
  }
);

if (analysisError) {
  console.error("Analysis error:", analysisError.message);
  return;
}

console.log("Analysis result:", analysisData);

// ------------- 4. Updating state & storing in Supabase DB (analysis table) ------------------------
setTeacherCount(analysisData.teacher); // calling the React state functions declared above
setStudentCount(analysisData.student); // these are storing the respective variables with data returned from edge function from Supabase

await supabase
  .from("analysis")
  .insert([
    {
      transcript_id: transcriptData.id,
      teacher_count: analysisData.teacher,
      student_count: analysisData.student,
    },
  ]);
};


// ----------------- LOGOUT FUNCTION -------------------------
const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout error:", error.message);
    return;
  }
  // clear state for all the variables
  setTeacherCount(null);
  setStudentCount(null);
  setFile(null);

  // redirect back to login page
  window.location.href = "/"; 
};

  return (
    <div className="container">
      <h2>Dashboard</h2>
    
    {/* ---------- File uploader dashed box area ------------ */}
    <div className="upload-box">
        <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            id="file-upload"
        />
        <label htmlFor="file-upload" className="upload-label">
            {file ? (<span className="file-name">Selected <em>{file.name}</em> successfully</span>) : ("Click here to select .csv transcript")}
        </label>
    </div>

    {/* -------------- Upload Button (uploads the selected file to the Supabase) --------------------*/}
      <button className="cta-button" onClick={handleUpload}>Upload & Show Results</button>

    {/* -------------- Results Cards --------------------*/}
      {teacherCount !== null && (
  <div className="results-container">
    <div className="result-card">
      <p className="result-label"># Teacher Turns</p>
      <h1 className="result-value">{teacherCount}</h1>
    </div>

    <div className="result-card">
      <p className="result-label"># Student Turns</p>
      <h1 className="result-value">{studentCount}</h1>
    </div>
  </div>
)}

{/* -------------- Log Out Button --------------------*/}
<button className="view-button" onClick={handleLogout}>Log Out</button>
    </div>
  );
}