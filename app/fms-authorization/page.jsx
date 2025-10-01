'use client';

import { useState } from 'react';
import { Card } from 'components/card';
import { Button } from 'components/ui/Button';
import { ProgressBar } from 'components/ui/ProgressBar';

export default function FMSAuthorizationPage() {
    const [formData, setFormData] = useState({
        // Participant Details
        participantId: '',
        participantName: '',
        
        // Personal Assistant Information
        paFirstName: '',
        paLastName: '',
        paSSN: '',
        paAddress: '',
        paPhone: '',
        paEmail: '',
        
        // Service Authorization Details
        serviceHours: '',
        hourlyRate: '',
        startDate: '',
        endDate: '',
        
        // Additional Information
        serviceDescription: '',
        specialRequirements: '',
        emergencyContact: '',
        emergencyPhone: ''
    });

    const [currentSection, setCurrentSection] = useState(0);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const sections = [
        {
            id: 'participant_details',
            title: 'Participant Information',
            fields: [
                { name: 'participantId', label: 'Participant ID', type: 'text', required: true, readonly: true },
                { name: 'participantName', label: 'Participant Name', type: 'text', required: true, readonly: true }
            ]
        },
        {
            id: 'pa_information',
            title: 'Personal Assistant Information',
            fields: [
                { name: 'paFirstName', label: 'PA First Name', type: 'text', required: true },
                { name: 'paLastName', label: 'PA Last Name', type: 'text', required: true },
                { name: 'paSSN', label: 'PA Social Security Number', type: 'text', required: true, pattern: '^\\d{3}-\\d{2}-\\d{4}$' },
                { name: 'paAddress', label: 'PA Address', type: 'text', required: true },
                { name: 'paPhone', label: 'PA Phone Number', type: 'tel', required: true },
                { name: 'paEmail', label: 'PA Email Address', type: 'email', required: false }
            ]
        },
        {
            id: 'service_details',
            title: 'Service Authorization Details',
            fields: [
                { name: 'serviceHours', label: 'Authorized Hours per Week', type: 'number', required: true, min: 1, max: 40 },
                { name: 'hourlyRate', label: 'Hourly Rate', type: 'number', required: true, min: 15, max: 50, step: 0.01 },
                { name: 'startDate', label: 'Service Start Date', type: 'date', required: true },
                { name: 'endDate', label: 'Service End Date', type: 'date', required: true }
            ]
        },
        {
            id: 'additional_info',
            title: 'Additional Information',
            fields: [
                { name: 'serviceDescription', label: 'Service Description', type: 'textarea', required: false },
                { name: 'specialRequirements', label: 'Special Requirements', type: 'textarea', required: false },
                { name: 'emergencyContact', label: 'Emergency Contact Name', type: 'text', required: false },
                { name: 'emergencyPhone', label: 'Emergency Contact Phone', type: 'tel', required: false }
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

    const validateSection = (sectionIndex) => {
        const section = sections[sectionIndex];
        const sectionErrors = {};
        
        section.fields.forEach(field => {
            const value = formData[field.name];
            
            if (field.required && (!value || value.toString().trim() === '')) {
                sectionErrors[field.name] = `${field.label} is required`;
            } else if (field.pattern && value && !new RegExp(field.pattern).test(value)) {
                if (field.name === 'paSSN') {
                    sectionErrors[field.name] = 'Please enter SSN in format: XXX-XX-XXXX';
                }
            } else if (field.name === 'serviceHours' && value && (value < 1 || value > 40)) {
                sectionErrors[field.name] = 'Service hours must be between 1 and 40 per week';
            } else if (field.name === 'hourlyRate' && value && (value < 15 || value > 50)) {
                sectionErrors[field.name] = 'Hourly rate must be between $15 and $50';
            } else if (field.name === 'endDate' && value && formData.startDate && new Date(value) <= new Date(formData.startDate)) {
                sectionErrors[field.name] = 'End date must be after start date';
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
                        formType: 'fms_authorization',
                        formData: formData
                    })
                });
                
                if (response.ok) {
                    alert('FMS Authorization submitted successfully!');
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">FMS Provider Authorization</h1>
                <p className="text-gray-600">Authorize a Personal Assistant for Financial Management Services.</p>
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
                            <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                                <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-2">
                                    {field.label}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                
                                {field.type === 'textarea' ? (
                                    <textarea
                                        id={field.name}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required={field.required}
                                    />
                                ) : (
                                    <input
                                        type={field.type}
                                        id={field.name}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                                        pattern={field.pattern}
                                        min={field.min}
                                        max={field.max}
                                        step={field.step}
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
                            {isSubmitting ? 'Submitting...' : 'Submit Authorization'}
                        </Button>
                    )}
                </div>
            </form>

            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-yellow-900 mb-2">Authorization Requirements</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Personal Assistant must pass background check</li>
                    <li>• PA must complete required training</li>
                    <li>• Authorization is subject to approval by Care Advisor</li>
                    <li>• Service hours and rates must be within program guidelines</li>
                </ul>
            </div>
        </div>
    );
}
