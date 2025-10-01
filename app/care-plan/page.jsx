'use client';

import { useState } from 'react';
import { Card } from 'components/card';
import { Button } from 'components/ui/Button';
import { ProgressBar } from 'components/ui/ProgressBar';

export default function CarePlanPage() {
    const [formData, setFormData] = useState({
        // Participant Information
        participantId: '',
        planEffectiveDate: '',
        careAdvisor: '',
        
        // Care Goals
        primaryGoal: '',
        secondaryGoals: '',
        goalTimeframe: '',
        
        // Service Schedule
        weeklyHours: '',
        preferredDays: [],
        preferredTime: '',
        
        // Budget Information
        monthlyBudget: '',
        budgetCategories: [],
        
        // Additional Information
        riskAssessment: '',
        safetyPlan: '',
        familyInvolvement: '',
        culturalConsiderations: ''
    });

    const [currentSection, setCurrentSection] = useState(0);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const sections = [
        {
            id: 'participant_info',
            title: 'Participant Information',
            fields: [
                { name: 'participantId', label: 'Participant ID', type: 'text', required: true, readonly: true },
                { name: 'planEffectiveDate', label: 'Plan Effective Date', type: 'date', required: true },
                { name: 'careAdvisor', label: 'Assigned Care Advisor', type: 'text', required: true, readonly: true }
            ]
        },
        {
            id: 'care_goals',
            title: 'Care Goals and Objectives',
            fields: [
                { name: 'primaryGoal', label: 'Primary Care Goal', type: 'textarea', required: true },
                { name: 'secondaryGoals', label: 'Secondary Goals', type: 'textarea', required: false },
                { name: 'goalTimeframe', label: 'Goal Timeframe', type: 'select', required: true, options: ['3 months', '6 months', '12 months'] }
            ]
        },
        {
            id: 'service_schedule',
            title: 'Service Schedule',
            fields: [
                { name: 'weeklyHours', label: 'Weekly Service Hours', type: 'number', required: true, min: 1, max: 40 },
                { name: 'preferredDays', label: 'Preferred Service Days', type: 'checkbox', required: true, options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
                { name: 'preferredTime', label: 'Preferred Time', type: 'select', required: true, options: ['Morning', 'Afternoon', 'Evening', 'Flexible'] }
            ]
        },
        {
            id: 'budget_allocation',
            title: 'Budget Information',
            fields: [
                { name: 'monthlyBudget', label: 'Monthly Budget Allocation', type: 'number', required: true, min: 100, max: 5000 },
                { name: 'budgetCategories', label: 'Budget Categories', type: 'checkbox', required: true, options: ['Personal Care', 'Homemaker', 'Transportation', 'Respite Care', 'Equipment'] }
            ]
        },
        {
            id: 'additional_info',
            title: 'Additional Information',
            fields: [
                { name: 'riskAssessment', label: 'Risk Assessment Notes', type: 'textarea', required: false },
                { name: 'safetyPlan', label: 'Safety Plan', type: 'textarea', required: false },
                { name: 'familyInvolvement', label: 'Family Involvement', type: 'textarea', required: false },
                { name: 'culturalConsiderations', label: 'Cultural Considerations', type: 'textarea', required: false }
            ]
        }
    ];

    const handleInputChange = (fieldName, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
        
        // Clear error when user starts typing
        if (errors[fieldName]) {
            setErrors(prev => ({
                ...prev,
                [fieldName]: null
            }));
        }
    };

    const handleCheckboxChange = (fieldName, value, checked) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: checked 
                ? [...(prev[fieldName] || []), value]
                : (prev[fieldName] || []).filter(item => item !== value)
        }));
    };

    const validateSection = (sectionIndex) => {
        const section = sections[sectionIndex];
        const sectionErrors = {};
        
        section.fields.forEach(field => {
            const value = formData[field.name];
            
            if (field.required && (!value || (Array.isArray(value) && value.length === 0) || value.toString().trim() === '')) {
                sectionErrors[field.name] = `${field.label} is required`;
            } else if (field.name === 'weeklyHours' && value && (value < 1 || value > 40)) {
                sectionErrors[field.name] = 'Weekly hours must be between 1 and 40';
            } else if (field.name === 'monthlyBudget' && value && (value < 100 || value > 5000)) {
                sectionErrors[field.name] = 'Monthly budget must be between $100 and $5,000';
            }
        });
        
        setErrors(prev => ({ ...prev, ...sectionErrors }));
        return Object.keys(sectionErrors).length === 0;
    };

    const handleNext = () => {
        if (validateSection(currentSection)) {
            setCurrentSection(prev => Math.min(prev + 1, sections.length - 1));
        }
    };

    const handlePrevious = () => {
        setCurrentSection(prev => Math.max(prev - 1, 0));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Validate all sections
        let allValid = true;
        for (let i = 0; i < sections.length; i++) {
            if (!validateSection(i)) {
                allValid = false;
            }
        }
        
        if (allValid) {
            try {
                const response = await fetch('/api/forms/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        formType: 'care_plan',
                        formData: formData
                    })
                });
                
                if (response.ok) {
                    alert('Care plan submitted successfully!');
                } else {
                    throw new Error('Submission failed');
                }
            } catch (error) {
                console.error('Submission error:', error);
                alert('There was an error submitting the form. Please try again.');
            }
        }
        
        setIsSubmitting(false);
    };

    const progress = ((currentSection + 1) / sections.length) * 100;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">HCI-CDS Care Plan</h1>
                <p className="text-gray-600">Create a comprehensive care plan for the participant's healthcare needs.</p>
            </div>

            <Card className="mb-6">
                <div className="mb-4">
                    <ProgressBar progress={progress} label={`Step ${currentSection + 1} of ${sections.length}`} />
                </div>
                
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">{sections[currentSection].title}</h2>
                </div>
            </Card>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {sections[currentSection].fields.map((field) => (
                            <div key={field.name} className={field.type === 'textarea' || field.type === 'checkbox' ? 'md:col-span-2' : ''}>
                                <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-2">
                                    {field.label}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                
                                {field.type === 'select' ? (
                                    <select
                                        id={field.name}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required={field.required}
                                    >
                                        <option value="">Please select...</option>
                                        {field.options.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                ) : field.type === 'textarea' ? (
                                    <textarea
                                        id={field.name}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required={field.required}
                                    />
                                ) : field.type === 'checkbox' ? (
                                    <div className="space-y-2">
                                        {field.options.map((option) => (
                                            <label key={option} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name={field.name}
                                                    value={option}
                                                    checked={(formData[field.name] || []).includes(option)}
                                                    onChange={(e) => handleCheckboxChange(field.name, option, e.target.checked)}
                                                    className="mr-2"
                                                />
                                                <span className="text-sm text-gray-700">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <input
                                        type={field.type}
                                        id={field.name}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                                        min={field.min}
                                        max={field.max}
                                        readOnly={field.readonly}
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${field.readonly ? 'bg-gray-100' : ''}`}
                                        required={field.required}
                                    />
                                )}
                                
                                {errors[field.name] && (
                                    <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="flex justify-between">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handlePrevious}
                        disabled={currentSection === 0}
                    >
                        Previous
                    </Button>
                    
                    {currentSection < sections.length - 1 ? (
                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleNext}
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Care Plan'}
                        </Button>
                    )}
                </div>
            </form>

            <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-green-900 mb-2">Care Plan Guidelines</h3>
                <ul className="text-sm text-green-800 space-y-1">
                    <li>• Care plans are reviewed by qualified Care Advisors</li>
                    <li>• Goals should be specific, measurable, and achievable</li>
                    <li>• Service hours are based on assessed needs and available budget</li>
                    <li>• Plans are reviewed and updated regularly</li>
                </ul>
            </div>
        </div>
    );
}
