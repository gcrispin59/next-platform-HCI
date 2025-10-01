'use client';

import { useState } from 'react';
import { Card } from 'components/card';
import { Button } from 'components/ui/Button';
import { ProgressBar } from 'components/ui/ProgressBar';

export default function ResponsiveForm({ 
    formConfig, 
    onSubmit, 
    initialData = {},
    showProgress = true 
}) {
    const [formData, setFormData] = useState(initialData);
    const [currentSection, setCurrentSection] = useState(0);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { sections, title, description } = formConfig;

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
            } else if (field.pattern && value && !new RegExp(field.pattern).test(value)) {
                if (field.name === 'ssn' || field.name === 'paSSN') {
                    sectionErrors[field.name] = 'Please enter SSN in format: XXX-XX-XXXX';
                } else if (field.name === 'zipCode') {
                    sectionErrors[field.name] = 'Please enter a valid ZIP code';
                }
            } else if (field.name === 'dob' && value) {
                const dob = new Date(value);
                const age = new Date().getFullYear() - dob.getFullYear();
                if (age < 18) {
                    sectionErrors[field.name] = 'Participant must be 18 or older';
                }
            } else if (field.name === 'weeklyHours' && value && (value < 1 || value > 40)) {
                sectionErrors[field.name] = 'Weekly hours must be between 1 and 40';
            } else if (field.name === 'monthlyBudget' && value && (value < 100 || value > 5000)) {
                sectionErrors[field.name] = 'Monthly budget must be between $100 and $5,000';
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
        
        if (allValid && onSubmit) {
            try {
                await onSubmit(formData);
            } catch (error) {
                console.error('Submission error:', error);
            }
        }
        
        setIsSubmitting(false);
    };

    const progress = showProgress ? ((currentSection + 1) / sections.length) * 100 : 0;

    const renderField = (field) => {
        const commonProps = {
            id: field.name,
            name: field.name,
            value: formData[field.name] || '',
            onChange: (e) => handleInputChange(field.name, e.target.value),
            className: `w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${field.readonly ? 'bg-gray-100' : ''}`,
            required: field.required,
            readOnly: field.readonly
        };

        switch (field.type) {
            case 'select':
                return (
                    <select {...commonProps}>
                        <option value="">Please select...</option>
                        {field.options.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                );
                
            case 'textarea':
                return (
                    <textarea
                        {...commonProps}
                        rows={4}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${field.readonly ? 'bg-gray-100' : ''}`}
                    />
                );
                
            case 'radio':
                return (
                    <div className="space-y-2">
                        {field.options.map((option) => (
                            <label key={option} className="flex items-center">
                                <input
                                    type="radio"
                                    name={field.name}
                                    value={option}
                                    checked={formData[field.name] === option}
                                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                                    className="mr-2"
                                    required={field.required}
                                />
                                <span className="text-sm text-gray-700">{option}</span>
                            </label>
                        ))}
                    </div>
                );
                
            case 'checkbox':
                return (
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
                );
                
            default:
                return (
                    <input
                        type={field.type}
                        {...commonProps}
                        pattern={field.pattern}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                    />
                );
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                {description && <p className="text-gray-600">{description}</p>}
            </div>

            {showProgress && (
                <Card className="mb-6">
                    <div className="mb-4">
                        <ProgressBar progress={progress} label={`Step ${currentSection + 1} of ${sections.length}`} />
                    </div>
                    
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">{sections[currentSection].title}</h2>
                    </div>
                </Card>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {sections[currentSection].fields.map((field) => (
                            <div key={field.name} className={field.type === 'textarea' || field.type === 'checkbox' || field.type === 'radio' ? 'md:col-span-2' : ''}>
                                <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-2">
                                    {field.label}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                
                                {renderField(field)}
                                
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
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}
