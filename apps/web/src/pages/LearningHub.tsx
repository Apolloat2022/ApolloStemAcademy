import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';

const LearningHub: React.FC = () => {
    return (
        <DashboardLayout>
            <div className="w-full h-screen">
                <iframe
                    src="https://apolloat2022.github.io/ApolloStemAcademyBackup/"
                    className="w-full h-full border-0"
                    title="AI Learning Tools"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                />
            </div>
        </DashboardLayout>
    );
};

export default LearningHub;
