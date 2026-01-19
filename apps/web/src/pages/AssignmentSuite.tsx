import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Plus, BookOpen, Clock, Users, Sparkles, Filter, ChevronRight, Calculator, Beaker, FileText, BookCopy, BrainCircuit, X, CheckCircle2, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AssignmentSuite: React.FC<{ embedMode?: boolean }> = ({ embedMode }) => {
    const navigate = useNavigate();
    const [isCreating, setIsCreating] = useState(false);
    const [isGeneratingIntervention, setIsGeneratingIntervention] = useState(false);
    const [interventionTask, setInterventionTask] = useState<any>(null);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDelete, setShowDelete] = useState<string | null>(null);

    // Form Stats
    const [newAsgn, setNewAsgn] = useState({ title: '', tool: 'Math Solver', description: 'Complete the following exercises.', due_date: 'Next Friday' });

    const fetchAssignments = async () => {
        try {
            const res = await api.get('/api/assignments');
            if (res.data && res.data.length > 0) {
                setAssignments(res.data);
            } else {
                setAssignments([]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const [students, setStudents] = useState<any[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [isAssigning, setIsAssigning] = useState(false);
    const [assignForm, setAssignForm] = useState({ title: '', description: '', dueDate: 'Next Monday', priority: 'High', subject: 'STEM' });

    const fetchStudents = async () => {
        try {
            const res = await api.get('/api/teacher/students');
            setStudents(res.data);
        } catch (err) {
            console.error('Failed to fetch students', err);
        }
    };

    useEffect(() => {
        fetchAssignments();
        fetchStudents();
    }, []);

    const handleDirectAssign = async () => {
        if (selectedStudents.length === 0 || !assignForm.title) return;
        try {
            setLoading(true);
            await api.post('/api/teacher/assign-tasks', {
                studentIds: selectedStudents,
                task: assignForm
            });
            setIsAssigning(false);
            setSelectedStudents([]);
            setAssignForm({ title: '', description: '', dueDate: 'Next Monday', priority: 'High', subject: 'STEM' });
            alert(`Task assigned to ${selectedStudents.length} students!`);
        } catch (err) {
            alert('Failed to assign task');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            await api.post('/api/assignments', {
                ...newAsgn,
                class_id: 'default_class', // Mock class
                subject: newAsgn.tool.includes('Math') ? 'Math' : 'Science'
            });
            setIsCreating(false);
            fetchAssignments(); // Refresh
        } catch (err) {
            alert('Failed to create assignment');
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                await api.delete(`/api/assignments/${id}`);
                setAssignments(prev => prev.filter(a => a.id !== id));
            } catch (err) {
                alert('Delete failed');
            }
        }
    };

    const aiTools = [
        { name: 'Math Solver', icon: <Calculator className="text-blue-400" />, path: '/student/hub?tool=math' },
        { name: 'Worksheet Gen', icon: <FileText className="text-yellow-400" />, path: '/student/hub?tool=study' },
        { name: 'Science Lab', icon: <Beaker className="text-green-400" />, path: '/student/hub?tool=science' },
        { name: 'Study Guide', icon: <BookCopy className="text-purple-400" />, path: '/student/hub?tool=study' },
    ];

    const generateIntervention = () => {
        setIsGeneratingIntervention(true);
        setTimeout(() => {
            setInterventionTask({
                title: 'Quadratic Intervention',
                description: 'Specialized 5-problem worksheet focusing on factoring quadratics with negative coefficients.',
                students: '8 Students',
                subject: 'Math',
                tool: 'Worksheet Generator'
            });
            setIsGeneratingIntervention(false);
        }, 2000);
    };

    const publishIntervention = async () => {
        if (!interventionTask) return;
        // Mocking student IDs for intervention based on stats (in real app, AI provides list)
        const demoStudentIds = students.slice(0, 3).map(s => s.id);
        try {
            setLoading(true);
            await api.post('/api/teacher/assign-tasks', {
                studentIds: demoStudentIds,
                task: {
                    title: `[Intervention] ${interventionTask.title}`,
                    description: interventionTask.description,
                    dueDate: 'In 2 Days',
                    priority: 'High',
                    subject: interventionTask.subject
                }
            });
            setInterventionTask(null);
            alert(`Intervention pushed to ${demoStudentIds.length} students.`);
        } catch (e) {
            alert('Push failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="p-8">
                {!embedMode && (
                    <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-bold mb-2 text-white italic">Assignment <span className="text-apollo-indigo">Suite</span></h1>
                            <p className="text-gray-400">Create and curate AI-enhanced learning experiences for your class.</p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsAssigning(true)}
                                className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all group"
                            >
                                <Users size={20} className="text-indigo-400 group-hover:scale-110" /> Assign To Students
                            </button>
                            <button
                                onClick={() => setIsCreating(true)}
                                className="bg-apollo-indigo hover:bg-apollo-indigo/80 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-apollo-indigo/20"
                            >
                                <Plus size={20} /> Create Class Work
                            </button>
                        </div>
                    </header>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Active Assignments List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <BookOpen size={20} className="text-apollo-indigo" /> Global Class Tasks
                            </h2>
                            <button className="text-xs text-gray-500 hover:text-white flex items-center gap-1 font-bold">
                                <Filter size={14} /> FILTER
                            </button>
                        </div>

                        {loading ? <div className="text-center text-gray-500 py-10">Loading tasks...</div> :
                            assignments.length === 0 ? <div className="text-center text-gray-500 py-10 bg-white/5 rounded-3xl">No active assignments. Create one!</div> :
                                assignments.map((asgn) => (
                                    <div
                                        key={asgn.id}
                                        className="glass rounded-3xl p-6 border-white/5 hover:border-apollo-indigo/30 transition-all group relative overflow-hidden"
                                        onMouseEnter={() => setShowDelete(asgn.id)}
                                        onMouseLeave={() => setShowDelete(null)}
                                    >
                                        <div className="flex items-start justify-between gap-6">
                                            <div className="flex items-start gap-4">
                                                <div className={`p-4 rounded-2xl ${asgn.submitted_count >= asgn.total_students && asgn.total_students > 0 ? 'bg-green-500/10' : 'bg-apollo-indigo/10'}`}>
                                                    <BookOpen className={asgn.submitted_count >= asgn.total_students && asgn.total_students > 0 ? 'text-green-400' : 'text-apollo-indigo'} size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-white mb-2">{asgn.title}</h3>
                                                    <div className="flex flex-wrap items-center gap-4">
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                                                            <Calculator size={12} /> {asgn.description?.substring(0, 20)}...
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                                            <Users size={14} /> {asgn.submitted_count || 0} Submitted
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                                            <Clock size={14} /> Due {asgn.due_date}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                {showDelete === asgn.id && (
                                                    <button
                                                        onClick={(e) => handleDelete(asgn.id, e)}
                                                        className="p-3 text-red-400 hover:bg-red-400/10 rounded-2xl transition-all animate-in fade-in"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                )}
                                                <button className="p-3 text-gray-500 hover:text-white transition-all group-hover:bg-white/5 rounded-2xl">
                                                    <ChevronRight size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                    </div>

                    {/* AI Insights Sidebar */}
                    <div className="space-y-8">
                        <div className="glass rounded-3xl p-8 border-yellow-500/10 bg-yellow-500/5 relative overflow-hidden">
                            {interventionTask ? (
                                <div className="animate-in fade-in zoom-in duration-300">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-green-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                            <CheckCircle2 size={14} /> Task Generated
                                        </div>
                                        <button onClick={() => setInterventionTask(null)}><X size={14} className="text-gray-500" /></button>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">{interventionTask.title}</h3>
                                    <p className="text-xs text-gray-400 mb-4 leading-relaxed">{interventionTask.description}</p>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded-md border border-white/5">{interventionTask.students} targeted</div>
                                        <div className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded-md border border-white/5">{interventionTask.tool}</div>
                                    </div>
                                    <button
                                        onClick={publishIntervention}
                                        className="w-full py-4 bg-apollo-indigo text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-apollo-indigo/20"
                                    >
                                        Push to Struggling Students
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 mb-6">
                                        <Sparkles size={24} className="text-yellow-400" />
                                        <h2 className="text-xl font-bold text-white">AI Intervention</h2>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                        Based on recent activity in "Math Solver", 8 students are finding quadratic equations challenging.
                                    </p>
                                    <button
                                        onClick={generateIntervention}
                                        disabled={isGeneratingIntervention}
                                        className={`w-full py-3 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 rounded-xl font-bold text-xs hover:bg-yellow-400/20 transition-all flex items-center justify-center gap-2 ${isGeneratingIntervention ? 'animate-pulse' : ''}`}
                                    >
                                        {isGeneratingIntervention ? (
                                            <>
                                                <BrainCircuit size={16} className="animate-spin" />
                                                Analyzing Needs...
                                            </>
                                        ) : (
                                            'Identify & Help Students'
                                        )}
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="glass rounded-3xl p-8 border-white/5">
                            <h2 className="text-xl font-bold text-white mb-6">Curriculum Tools</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {aiTools.map((tool, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => navigate(tool.path)}
                                        className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group text-center"
                                    >
                                        <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform">{tool.icon}</div>
                                        <div className="text-[10px] font-bold text-white uppercase tracking-wider">{tool.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Direct Student Assignment Modal */}
                {isAssigning && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
                        <div className="glass w-full max-w-4xl rounded-[40px] border-indigo-500/20 flex flex-col md:flex-row overflow-hidden shadow-3xl animate-in zoom-in-95 duration-300">
                            {/* Student Selector */}
                            <div className="w-full md:w-1/2 p-10 border-r border-white/5 flex flex-col">
                                <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                                    <Users className="text-indigo-400" />
                                    Select Students
                                </h2>
                                <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                                    {students.map(s => (
                                        <label key={s.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${selectedStudents.includes(s.id) ? 'bg-indigo-600/20 border-indigo-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold text-xs uppercase">{s.name[0]}</div>
                                                <div className="font-bold text-sm text-white">{s.name}</div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={selectedStudents.includes(s.id)}
                                                onChange={() => {
                                                    setSelectedStudents(prev =>
                                                        prev.includes(s.id) ? prev.filter(id => id !== s.id) : [...prev, s.id]
                                                    )
                                                }}
                                                className="w-5 h-5 rounded-md border-white/20 bg-black/40 text-indigo-600 focus:ring-0"
                                            />
                                        </label>
                                    ))}
                                </div>
                                <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{selectedStudents.length} Selected</span>
                                    <button onClick={() => setSelectedStudents(students.map(s => s.id))} className="text-xs text-indigo-400 font-bold hover:underline">Select All</button>
                                </div>
                            </div>
                            {/* Task Details */}
                            <div className="w-full md:w-1/2 p-10 bg-white/[0.02]">
                                <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                                    <Sparkles className="text-indigo-400" />
                                    Task Details
                                </h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Subject</label>
                                        <input
                                            value={assignForm.subject} onChange={e => setAssignForm({ ...assignForm, subject: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3 text-white focus:border-indigo-500/50 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Task Title</label>
                                        <input
                                            value={assignForm.title} onChange={e => setAssignForm({ ...assignForm, title: e.target.value })}
                                            placeholder="e.g. Personalized Physics Drill"
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3 text-white focus:border-indigo-500/50 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Instructions</label>
                                        <textarea
                                            value={assignForm.description} onChange={e => setAssignForm({ ...assignForm, description: e.target.value })}
                                            rows={3}
                                            placeholder="Focus on the kinematics section..."
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3 text-white focus:border-indigo-500/50 outline-none resize-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button onClick={() => setIsAssigning(false)} className="py-4 bg-white/5 rounded-2xl font-bold text-gray-400 hover:text-white transition-all">Cancel</button>
                                        <button
                                            onClick={handleDirectAssign}
                                            disabled={selectedStudents.length === 0 || !assignForm.title}
                                            className="py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:scale-100"
                                        >
                                            Push Mission
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Create Modal */}
                {isCreating && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                        <div className="glass w-full max-w-lg rounded-[40px] border-white/10 p-10 animate-in zoom-in-95 duration-200">
                            <h2 className="text-3xl font-bold mb-2">New Assignment</h2>
                            <p className="text-gray-400 text-sm mb-8">Set the parameters for your next learning mission.</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Assignment Title</label>
                                    <input
                                        type="text"
                                        value={newAsgn.title}
                                        onChange={e => setNewAsgn({ ...newAsgn, title: e.target.value })}
                                        placeholder="e.g. Chemistry Basics"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-apollo-indigo"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Select AI Tool</label>
                                    <select
                                        value={newAsgn.tool}
                                        onChange={e => setNewAsgn({ ...newAsgn, tool: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-apollo-indigo appearance-none"
                                    >
                                        <option>Math Solver</option>
                                        <option>Science Lab</option>
                                        <option>Worksheet Generator</option>
                                        <option>Study Guide</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => setIsCreating(false)} className="py-4 rounded-2xl border border-white/10 font-bold text-gray-400 hover:bg-white/5 transition-all">Cancel</button>
                                    <button onClick={handleCreate} className="py-4 bg-apollo-indigo rounded-2xl font-bold text-white hover:bg-apollo-indigo/80 transition-all">Publish Mission</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AssignmentSuite;
