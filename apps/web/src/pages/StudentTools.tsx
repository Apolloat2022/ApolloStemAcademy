import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import AITool from '../components/AITool';
import { Calculator, Beaker, BookOpen, FileText, Bot, BrainCircuit } from 'lucide-react';

const TOOLS: Record<string, {
    title: string;
    description: string;
    placeholder: string;
    toolKey: string;
    icon: React.ReactNode;
    systemPrompt: string;
}> = {
    'math-solver': {
        title: 'STEM Math Solver',
        description: 'Step-by-step logic engine for complex problems.',
        placeholder: 'Enter your math problem (e.g., "Solve 2x + 5 = 15")',
        toolKey: 'math_solver',
        icon: <Calculator className="text-blue-400" size={32} />,
        systemPrompt: "You are an expert Math Tutor. Provide step-by-step solutions to math problems. Do not use LaTeX. Use plain text."
    },
    'science-lab': {
        title: 'Virtual Science Lab',
        description: 'Simulate experiments and understand phenomena.',
        placeholder: 'Describe an experiment or concept (e.g., "Explain Photosynthesis")',
        toolKey: 'science_lab',
        icon: <Beaker className="text-green-400" size={32} />,
        systemPrompt: "You are a Virtual Science Lab assistant. Explain scientific concepts with experimental logic and safety context."
    },
    'concept-explorer': {
        title: 'Concept Explorer',
        description: 'Deep dive into any STEM topic with AI-powered guides.',
        placeholder: 'What topic do you want to explore? (e.g., "Quantum Entanglement")',
        toolKey: 'study_guide',
        icon: <BookOpen className="text-yellow-400" size={32} />,
        systemPrompt: "You are a Concept Explorer. specific definitions, analogies, and real-world applications."
    },
    'worksheet-generator': {
        title: 'AI Worksheet Generator',
        description: 'Create custom practice sheets instantly.',
        placeholder: 'Topic and Grade Level (e.g., "Grade 8 Algebra")',
        toolKey: 'worksheet_gen',
        icon: <FileText className="text-purple-400" size={32} />,
        systemPrompt: "Generate a 5-question worksheet with an answer key for the requested topic."
    },
    'ai-coach': {
        title: 'AI Learning Coach',
        description: 'Personalized advice on how to study effectively.',
        placeholder: 'Ask for advice (e.g., "How should I prepare for a Physics final?")',
        toolKey: 'ai_coach',
        icon: <Bot className="text-pink-400" size={32} />,
        systemPrompt: "You are an AI Learning Coach. Provide study strategies, motivation, and time management advice."
    }
};

const StudentTools: React.FC = () => {
    const { toolId } = useParams();

    // Redirect if tool doesn't exist
    if (!toolId || !TOOLS[toolId]) {
        return <Navigate to="/student/hub" replace />;
    }

    const tool = TOOLS[toolId];

    return (
        <DashboardLayout>
            <div className="p-8 max-w-5xl mx-auto h-[calc(100vh-100px)]">
                <header className="mb-8 flex items-center gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        {tool.icon}
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white">{tool.title}</h1>
                        <p className="text-gray-400">{tool.description}</p>
                    </div>
                </header>

                <div className="h-full pb-20">
                    <AITool
                        title={tool.title}
                        description={tool.description}
                        placeholder={tool.placeholder}
                        toolKey={tool.toolKey}
                        icon={tool.icon}
                        systemPrompt={tool.systemPrompt}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentTools;
