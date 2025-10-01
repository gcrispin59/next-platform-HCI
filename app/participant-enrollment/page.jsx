'use client';

import { useState } from 'react';
import { Card } from 'components/card';
import { Button } from 'components/ui/Button';
import { ProgressBar } from 'components/ui/ProgressBar';

export default function ParticipantEnrollmentPage() {
    const [formData, setFormData] = useState({
        // Personal Information
        firstName: '',
        lastName: '',
        middleName: '',
        ssn: '',
        dob: '',
        gender: '',
        
        // Contact Information
        primaryPhone: '',
        secondaryPhone: '',
        email: '',
        preferredContact: '',
        
        // Address Information
        streetAddress: '',
        city: '',
        state: 'NC',
        zipCode: '',
        
        // Eligibility Information
        medicaidNumber: '',
        primaryDiagnosis: '',
        careLevel: '',
        hasRepresentative: '',
        
        // Emergency Contact
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelationship: ''
    });

    const [currentSection, setCurrentSection] = useState(0);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const sections = [
        {
            id: 'personal_information',
            title: 'Personal Information',
            fields: [
                { name: 'firstName', label: 'First Name', type: 'text', required: true },
                { name: 'lastName', label: 'Last Name', type: 'text', required: true },
                { name: 'middleName', label: 'Middle Name', type: 'text', required: false },
                { name: 'ssn', label: 'Social Security Number', type: 'text', required: true, pattern: '^\\d{3}-\\d{2}-\\d{4}$' },
                { name: 'dob', label: 'Date of Birth', type: 'date', required: true },
                { name: 'gender', label: 'Gender', type: 'select', required: true, options: ['Male', 'Female', 'Other', 'Prefer not to say'] }
            ]
        },
        {
            id: 'contact_information',
            title: 'Contact Information',
            fields: [
                { name: 'primaryPhone', label: 'Primary Phone', type: 'tel', required: true },
                { name: 'secondaryPhone', label: 'Secondary Phone', type: 'tel', required: false },
                { name: 'email', label: 'Email Address', type: 'email', required: false },
                { name: 'preferredContact', label: 'Preferred Contact Method', type: 'radio', required: true, options: ['Phone', 'Email', 'Mail'] }
            ]
        },
        {
            id: 'address_information',
            title: 'Address Information',
            fields: [
                { name: 'streetAddress', label: 'Street Address', type: 'text', required: true },
                { name: 'city', label: 'City', type: 'text', required: true },
                { name: 'state', label: 'State', type: 'select', required: true, options: ['NC'], default: 'NC' },
                { name: 'zipCode', label: 'ZIP Code', type: 'text', required: true, pattern: '^\\d{5}(-\\d{4})?$' }
            ]
        },
        {
            id: 'eligibility_criteria',
            title: 'Eligibility Information',
            fields: [
                { name: 'medicaidNumber', label: 'Medicaid Number', type: 'text', required: true },
                { name: 'primaryDiagnosis', label: 'Primary Diagnosis', type: 'text', required: true },
                { name: 'careLevel', label: 'Care Level', type: 'select', required: true, options: ['Level 1', 'Level 2', 'Level 3'] },
                { name: 'hasRepresentative', label: 'Do you have a legal representative?', type: 'radio', required: true, options: ['Yes', 'No'] }
            ]
        },
        {
            id: 'emergency_contact',
            title: 'Emergency Contact',
            fields: [
                { name: 'emergencyContactName', label: 'Emergency Contact Name', type: 'text', required: true },
                { name: 'emergencyContactPhone', label: 'Emergency Contact Phone', type: 'tel', required: true },
                { name: 'emergencyContactRelationship', label: 'Relationship', type: 'select', required: true, options: ['Spouse', 'Child', 'Parent', 'Sibling', 'Friend', 'Other'] }
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
            
            if (field.required && (!value || value.trim() === '')) {
                sectionErrors[field.name] = `${field.label} is required`;
            } else if (field.pattern && value && !new RegExp(field.pattern).test(value)) {
                if (field.name === 'ssn') {
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
                // Submit form data
                const response = await fetch('/api/forms/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        formType: 'participant_enrollment',
                        formData: formData
                    })
                });
                
                if (response.ok) {
                    alert('Form submitted successfully!');
                    // Reset form or redirect
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">HCI-CDS Participant Enrollment</h1>
                <p className="text-gray-600">Complete your enrollment in the Health Care Innovation and Community Development Services program.</p>
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
                            <div key={field.name} className={field.type === 'radio' ? 'md:col-span-2' : ''}>
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
                                ) : field.type === 'radio' ? (
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
                                ) : (
                                    <input
                                        type={field.type}
                                        id={field.name}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                                        pattern={field.pattern}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            {isSubmitting ? 'Submitting...' : 'Submit Enrollment'}
                        </Button>
                    )}
                </div>
            </form>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Important Information</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• All information is encrypted and stored securely</li>
                    <li>• Your enrollment will be reviewed by a Care Advisor</li>
                    <li>• You will receive confirmation within 2-3 business days</li>
                    <li>• Contact support if you need assistance: 919-855-3400</li>
                </ul>
            </div>
        </div>
    );
}
