
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const GoogleCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get('code');
            if (!code) {
                setStatus('error');
                setError('No authorization code found');
                return;
            }

            try {
                const redirectUri = window.location.origin + '/google-callback';
                await api.post('/api/auth/google/callback', { code, redirectUri });
                setStatus('success');
                setTimeout(() => navigate('/student/antigravity'), 1500);
            } catch (err: any) {
                console.error('Callback failed', err);
                setStatus('error');
                setError(err.response?.data?.error || 'Failed to exchange token');
            }
        };

        handleCallback();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-apollo-dark flex items-center justify-center p-6">
            <div className="glass max-w-md w-full p-10 rounded-[40px] border-white/10 text-center animate-in zoom-in-95 duration-300">
                {status === 'loading' && (
                    <>
                        <Loader2 className="w-16 h-16 text-indigo-400 animate-spin mx-auto mb-6" />
                        <h1 className="text-2xl font-black text-white mb-2 tracking-tight">Syncing with Google</h1>
                        <p className="text-gray-400 text-sm">Validating your credentials and importing your curriculum...</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-400" />
                        </div>
                        <h1 className="text-2xl font-black text-white mb-2 tracking-tight">Access Granted!</h1>
                        <p className="text-gray-400 text-sm">Your Google Classroom is now linked to Antigravity.</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-10 h-10 text-red-400" />
                        </div>
                        <h1 className="text-2xl font-black text-white mb-2 tracking-tight">Connection Failed</h1>
                        <p className="text-red-400 font-bold mb-4">{error}</p>
                        <button
                            onClick={() => navigate('/student/antigravity')}
                            className="w-full py-4 bg-white/5 rounded-2xl font-bold text-white hover:bg-white/10 transition-all"
                        >
                            Return to Dashboard
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default GoogleCallback;
