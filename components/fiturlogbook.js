"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function Logbook() {
  const [logs, setLogs] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);

  const fetchLogs = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5001/api/logbook", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setLogs(res.data);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length + files.length > 5) {
      toast.error("Maksimal 5 foto");
      return;
    }
    for (let file of selected) {
      if (!file.type.startsWith("image/")) {
        toast.error("Hanya file gambar");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Maks 2MB per foto");
        return;
      }
    }
    setFiles((prev) => [...prev, ...selected]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", title);
    form.append("content", content);
    files.forEach((f) => form.append("photos", f));

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5001/api/logbook", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Log terkirim!");
      setTitle("");
      setContent("");
      setFiles([]);
      fetchLogs();
    } catch {
      toast.error("Gagal simpan log!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 bg-white rounded shadow"
      >
        <h2 className="text-xl font-bold">Buat Log Baru</h2>
        <input
          placeholder="Judul"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded"
        />
        <textarea
          placeholder="Isi log..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded"
        />
        <div>
          <label className="block mb-2">
            Upload Foto (max 5, 2MB tiap foto)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFiles}
            className="block"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {files.map((f, i) => (
              <span key={i} className="bg-gray-200 px-2 py-1 rounded">
                {f.name}
              </span>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>

      <div className="space-y-6">
        <h2 className="text-xl font-bold">Riwayat Logbook</h2>
        {logs.map((log, i) => (
          <div key={log._id} className="p-4 bg-white rounded shadow space-y-2">
            <div className="text-sm text-gray-500">No. {logs.length - i}</div>
            <h3 className="text-lg font-semibold">{log.title}</h3>
            <p>{log.content}</p>
            <div className="flex flex-wrap gap-2">
              {log.photos.map((p) => (
                <img
                  key={p}
                  src={`http://localhost:5001${p}`}
                  className="w-24 h-24 object-cover rounded"
                />
              ))}
            </div>
            <div className="text-xs text-gray-400">
              {new Date(log.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
