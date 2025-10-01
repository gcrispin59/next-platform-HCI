'use client';

import { useState, useEffect } from 'react';
import { Card } from 'components/card';
import { Button } from 'components/ui/Button';
import { ProgressBar } from 'components/ui/ProgressBar';
import OllamaIntegration from 'lib/services/ollama-integration';

export default function CareAdvisorInterviewPage() {
    const [participantData, setParticipantData] = useState(null);
    const [interviewQuestions, setInterviewQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [responses, setResponses] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        // Load participant data and generate questions
        loadParticipantData();
    }, []);

    const loadParticipantData = async () => {
        try {
            // In a real implementation, this would fetch from the database
            const mockData = {
                firstName: 'John',
                lastName: 'Doe',
                dob: '1965-03-15',
                primaryDiagnosis: 'Diabetes, Hypertension',
                careLevel: 'Level 2',
                medicaidNumber: '123456789'
            };
            
            setParticipantData(mockData);
            
            // Generate AI-powered interview questions
            const ollama = new OllamaIntegration();
            const questions = await ollama.generateInterviewQuestions(mockData);
            setInterviewQuestions(questions.interviewQuestions || []);
            
        } catch (error) {
            console.error('Error loading participant data:', error);
            // Use fallback questions
            setInterviewQuestions([
                {
                    category: "Daily Living",
                    question: "What daily activities do you need help with?",
                    required: true,
                    followUp: "Can you describe your typical day?"
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResponseChange = (questionIndex, response) => {
        setResponses(prev => ({
            ...prev,
            [questionIndex]: response
        }));
    };

    const handleNext = () => {
        if (currentQuestion < interviewQuestions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        
        try {
            // Analyze responses with AI
            const ollama = new OllamaIntegration();
            const analysisResult = await ollama.analyzeInterviewResponses(participantData, responses);
            setAnalysis(analysisResult);
            
            // Submit to database
            const response = await fetch('/api/care-advisor/interview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    participantData,
                    interviewQuestions,
                    responses,
                    analysis: analysisResult
                })
            });
            
            if (response.ok) {
                alert('Interview completed successfully!');
            }
        } catch (error) {
            console.error('Error submitting interview:', error);
            alert('There was an error submitting the interview. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const progress = interviewQuestions.length > 0 ? ((currentQuestion + 1) / interviewQuestions.length) * 100 : 0;

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading interview questions...</p>
                </div>
            </div>
        );
    }

    if (analysis) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Interview Analysis Complete</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Care Needs Assessment</h3>
                        <div className="space-y-3">
                            <div>
                                <h4 className="font-medium text-gray-700">Functional Needs</h4>
                                <ul className="text-sm text-gray-600 list-disc list-inside">
                                    {analysis.careNeeds?.functional?.map((need, index) => (
                                        <li key={index}>{need}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700">Health Needs</h4>
                                <ul className="text-sm text-gray-600 list-disc list-inside">
                                    {analysis.careNeeds?.health?.map((need, index) => (
                                        <li key={index}>{need}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Factors</h3>
                        <ul className="text-sm text-gray-600 list-disc list-inside">
                            {analysis.riskFactors?.map((risk, index) => (
                                <li key={index}>{risk}</li>
                            ))}
                        </ul>
                    </Card>
                </div>

                <Card className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Services</h3>
                    <div className="space-y-3">
                        {analysis.recommendedServices?.map((service, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <span className="font-medium">{service.service}</span>
                                    <span className="text-sm text-gray-600 ml-2">
                                        {service.hours} hours/week
                                    </span>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                    service.priority === 'high' ? 'bg-red-100 text-red-800' :
                                    service.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                }`}>
                                    {service.priority} priority
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="flex justify-between">
                    <Button
                        variant="secondary"
                        onClick={() => setAnalysis(null)}
                    >
                        Back to Interview
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => window.location.href = '/care-plan'}
                    >
                        Create Care Plan
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Care Advisor Interview</h1>
                <p className="text-gray-600 mb-4">
                    Comprehensive assessment for {participantData?.firstName} {participantData?.lastName}
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                        <div className="text-blue-600">ℹ️</div>
                        <div>
                            <h3 className="text-sm font-semibold text-blue-900 mb-1">What should I expect?</h3>
                            <p className="text-sm text-blue-800">
                                This interview will help us understand your care needs and develop a personalized care plan. 
                                Your responses will be analyzed by our AI system to ensure comprehensive assessment.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Card className="mb-6">
                <div className="mb-4">
                    <ProgressBar progress={progress} label={`Question ${currentQuestion + 1} of ${interviewQuestions.length}`} />
                </div>
                
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {interviewQuestions[currentQuestion]?.category}
                    </h2>
                </div>
            </Card>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <Card>
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {interviewQuestions[currentQuestion]?.question}
                        </h3>
                        
                        {interviewQuestions[currentQuestion]?.required && (
                            <p className="text-sm text-red-600 mb-4">* Required</p>
                        )}
                        
                        <textarea
                            value={responses[currentQuestion] || ''}
                            onChange={(e) => handleResponseChange(currentQuestion, e.target.value)}
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Please provide a detailed response..."
                            required={interviewQuestions[currentQuestion]?.required}
                        />
                        
                        {interviewQuestions[currentQuestion]?.followUp && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">
                                    <strong>Follow-up:</strong> {interviewQuestions[currentQuestion].followUp}
                                </p>
                            </div>
                        )}
                    </div>
                </Card>

                <div className="flex justify-between">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                    >
                        Previous
                    </Button>
                    
                    {currentQuestion < interviewQuestions.length - 1 ? (
                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleNext}
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Analyzing...' : 'Complete Interview'}
                        </Button>
                    )}
                </div>
            </form>

            <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-green-900 mb-2">Interview Guidelines</h3>
                <ul className="text-sm text-green-800 space-y-1">
                    <li>• Take your time to provide detailed responses</li>
                    <li>• All information is confidential and secure</li>
                    <li>• Your responses help create a personalized care plan</li>
                    <li>• You can save and return to complete the interview later</li>
                </ul>
            </div>
        </div>
    );
}
