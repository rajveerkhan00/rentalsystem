
'use client';

import { useState, useEffect } from 'react';
import { BlogPost, DomainData } from './types';
import { Plus, Edit2, Trash2, Globe, Search, Loader2, Save, X, FileText, Image as ImageIcon, Calendar, User } from 'lucide-react';

interface BlogManagementProps {
    domains: DomainData[];
}

export default function BlogManagement({ domains }: BlogManagementProps) {
    const [selectedDomain, setSelectedDomain] = useState<string>('');
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBlog, setCurrentBlog] = useState<BlogPost | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<BlogPost>>({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        author: '',
        date: new Date().toISOString().split('T')[0],
        slug: ''
    });

    // Load blogs when domain changes
    useEffect(() => {
        if (selectedDomain) {
            fetchBlogs();
        } else {
            setBlogs([]);
        }
    }, [selectedDomain]);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/blogs?domain=${selectedDomain}`);
            if (res.ok) {
                const data = await res.json();
                setBlogs(data);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setCurrentBlog(null);
        setFormData({
            title: '',
            excerpt: '',
            content: '',
            image: '',
            author: 'Admin',
            date: new Date().toISOString().split('T')[0],
            slug: '',
            domainName: selectedDomain
        });
        setIsEditing(true);
    };

    const handleEdit = (blog: BlogPost) => {
        setCurrentBlog(blog);
        setFormData(blog);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;

        try {
            const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchBlogs();
            } else {
                alert('Failed to delete blog');
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = currentBlog?._id ? `/api/blogs/${currentBlog._id}` : '/api/blogs';
            const method = currentBlog?._id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, domainName: selectedDomain })
            });

            if (res.ok) {
                setIsEditing(false);
                fetchBlogs();
            } else {
                alert('Failed to save blog');
            }
        } catch (error) {
            console.error('Error saving blog:', error);
        }
    };

    if (isEditing) {
        return (
            <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        {currentBlog ? <Edit2 className="w-6 h-6 text-[rgb(var(--primary))]" /> : <Plus className="w-6 h-6 text-[rgb(var(--primary))]" />}
                        {currentBlog ? 'Edit Blog Post' : 'New Blog Post'}
                    </h2>
                    <button
                        onClick={() => setIsEditing(false)}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1">Title</label>
                            <div className="relative group">
                                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[rgb(var(--primary))] transition-colors" />
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[rgb(var(--primary))]/50 focus:ring-1 focus:ring-[rgb(var(--primary))]/50 transition-all"
                                    placeholder="Enter blog title"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1">Slug</label>
                            <div className="relative group">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[rgb(var(--primary))] transition-colors" />
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[rgb(var(--primary))]/50 focus:ring-1 focus:ring-[rgb(var(--primary))]/50 transition-all"
                                    placeholder="url-friendly-slug"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400 ml-1">Display Image URL</label>
                        <div className="relative group">
                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[rgb(var(--primary))] transition-colors" />
                            <input
                                type="text"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[rgb(var(--primary))]/50 focus:ring-1 focus:ring-[rgb(var(--primary))]/50 transition-all"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1">Author</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[rgb(var(--primary))] transition-colors" />
                                <input
                                    type="text"
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[rgb(var(--primary))]/50 focus:ring-1 focus:ring-[rgb(var(--primary))]/50 transition-all"
                                    placeholder="Author Name"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1">Date</label>
                            <div className="relative group">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[rgb(var(--primary))] transition-colors" />
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[rgb(var(--primary))]/50 focus:ring-1 focus:ring-[rgb(var(--primary))]/50 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400 ml-1">Excerpt</label>
                        <textarea
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-[rgb(var(--primary))]/50 focus:ring-1 focus:ring-[rgb(var(--primary))]/50 transition-all min-h-[80px]"
                            placeholder="Brief summary of the blog post..."
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400 ml-1">Content (Markdown supported)</label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-[rgb(var(--primary))]/50 focus:ring-1 focus:ring-[rgb(var(--primary))]/50 transition-all min-h-[300px]"
                            placeholder="Write your blog content here..."
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl bg-[rgb(var(--primary))] hover:opacity-90 text-white font-bold transition-all shadow-[0_0_20px_rgba(var(--primary),0.3)] flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save Blog Post
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Blog Management</h2>
                        <p className="text-gray-400">Create, edit, and manage blog posts for your domains.</p>
                    </div>

                    {/* Domain Selector */}
                    <div className="relative min-w-[250px]">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <select
                            value={selectedDomain}
                            onChange={(e) => setSelectedDomain(e.target.value)}
                            className="w-full appearance-none bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-10 text-white focus:outline-none focus:border-[rgb(var(--primary))]/50 focus:ring-1 focus:ring-[rgb(var(--primary))]/50 transition-all cursor-pointer hover:bg-white/5"
                        >
                            <option value="" disabled>Select a domain</option>
                            {domains.map((domain) => (
                                <option key={domain.domainName} value={domain.domainName} className="bg-gray-900">
                                    {domain.domainName}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l border-white/10 pl-3">
                            <div className="border-t-[5px] border-t-white/50 border-x-[4px] border-x-transparent" />
                        </div>
                    </div>
                </div>

                {selectedDomain ? (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-white">Posts for {selectedDomain}</h3>
                            <button
                                onClick={handleCreate}
                                className="px-4 py-2 bg-[rgb(var(--primary))] hover:opacity-90 text-white font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(var(--primary),0.3)] flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add New Post
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="w-8 h-8 text-[rgb(var(--primary))] animate-spin" />
                            </div>
                        ) : blogs.length > 0 ? (
                            <div className="grid gap-4">
                                {blogs.map((blog) => (
                                    <div key={blog._id} className="group bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl p-4 transition-all hover:border-[rgb(var(--primary))]/30 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 rounded-xl bg-black/50 border border-white/10 overflow-hidden flex-shrink-0">
                                                {blog.image ? (
                                                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-600 bg-white/5">
                                                        <ImageIcon className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white group-hover:text-[rgb(var(--primary))] transition-colors line-clamp-1">{blog.title}</h4>
                                                <p className="text-sm text-gray-400 line-clamp-1">{blog.excerpt}</p>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {blog.author}</span>
                                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {blog.date}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(blog)}
                                                className="p-2 bg-white/10 hover:bg-white/20 hover:text-white text-gray-300 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(blog._id!)}
                                                className="p-2 bg-red-500/10 hover:bg-red-500/20 hover:text-red-400 text-red-500/70 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">No posts found</h3>
                                <p className="text-gray-400 mb-6">There are no blog posts for this domain yet.</p>
                                <button
                                    onClick={handleCreate}
                                    className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors"
                                >
                                    Create First Post
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5 border-dashed animate-in fade-in duration-500">
                        <Globe className="w-16 h-16 text-gray-700 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-3">Select a Domain</h3>
                        <p className="text-gray-400 max-w-md mx-auto">Please select a domain from the list above to manage its blog posts.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
