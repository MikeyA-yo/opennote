"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCommunity() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        type: "Other",
        imageUrl: "",
    });
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = formData.imageUrl;

            // Upload image if selected
            if (file) {
                setUploading(true);
                const uploadData = new FormData();
                uploadData.append("file", file);

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadData,
                });

                if (!uploadRes.ok) {
                    throw new Error("Image upload failed");
                }

                const uploadJson = await uploadRes.json();
                imageUrl = uploadJson.secure_url;
                setUploading(false);
            }

            const res = await fetch("/api/communities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, imageUrl }),
            });

            if (res.ok) {
                router.push("/communities");
            } else {
                alert("Failed to create community");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50">
            <div className="py-12 px-6">
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
                    <h1 className="text-3xl font-serif mb-8 text-stone-900">Create a Community</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">Community Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">Description</label>
                            <textarea
                                required
                                rows={4}
                                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">Type</label>
                            <select
                                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="Family">Family</option>
                                <option value="Organization">Organization</option>
                                <option value="Cause">Cause</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">Cover Image</label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-stone-300 border-dashed rounded-lg cursor-pointer bg-stone-50 hover:bg-stone-100 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <p className="mb-2 text-sm text-stone-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-stone-500">SVG, PNG, JPG or GIF</p>
                                    </div>
                                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                </label>
                            </div>
                            {file && (
                                <div className="mt-4 text-sm text-stone-600">
                                    Selected: {file.name}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || (!file && !formData.imageUrl)}
                            className="w-full bg-stone-900 text-white py-3 rounded-full font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
                        >
                            {loading ? (uploading ? "Uploading Image..." : "Creating...") : "Create Community"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
