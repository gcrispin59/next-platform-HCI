/**
 * Ollama AI Integration Service
 * Handles communication with Ollama API for care advisor interviews
 */

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://host.docker.internal:11434';
const FALLBACK_URL = 'http://PraetorSpectral.mynetgear.com:11434';

class OllamaIntegration {
    constructor() {
        this.baseUrl = OLLAMA_BASE_URL;
        this.fallbackUrl = FALLBACK_URL;
        this.model = 'llama3.1:8b'; // Default model, can be configured
    }

    /**
     * Get the active Ollama URL
     */
    async getActiveUrl() {
        try {
            const response = await fetch(`${this.baseUrl}/api/tags`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                return this.baseUrl;
            }
        } catch (error) {
            console.log('Primary Ollama URL not available, trying fallback...');
        }

        try {
            const response = await fetch(`${this.fallbackUrl}/api/tags`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                return this.fallbackUrl;
            }
        } catch (error) {
            console.error('Both Ollama URLs are unavailable');
            throw new Error('Ollama service is not available');
        }
    }

    /**
     * Generate interview questions based on participant data
     */
    async generateInterviewQuestions(participantData) {
        const activeUrl = await this.getActiveUrl();
        
        const prompt = this.buildInterviewPrompt(participantData);
        
        try {
            const response = await fetch(`${activeUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.model,
                    prompt: prompt,
                    stream: false,
                    options: {
                        temperature: 0.7,
                        top_p: 0.9,
                        max_tokens: 2000
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Ollama API error: ${response.status}`);
            }

            const data = await response.json();
            return this.parseInterviewQuestions(data.response);
        } catch (error) {
            console.error('Error generating interview questions:', error);
            // Return fallback questions if AI is unavailable
            return this.getFallbackQuestions(participantData);
        }
    }

    /**
     * Analyze interview responses and provide recommendations
     */
    async analyzeInterviewResponses(participantData, interviewResponses) {
        const activeUrl = await this.getActiveUrl();
        
        const prompt = this.buildAnalysisPrompt(participantData, interviewResponses);
        
        try {
            const response = await fetch(`${activeUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.model,
                    prompt: prompt,
                    stream: false,
                    options: {
                        temperature: 0.5,
                        top_p: 0.8,
                        max_tokens: 1500
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Ollama API error: ${response.status}`);
            }

            const data = await response.json();
            return this.parseAnalysis(data.response);
        } catch (error) {
            console.error('Error analyzing interview responses:', error);
            return this.getFallbackAnalysis(participantData, interviewResponses);
        }
    }

    /**
     * Build the interview prompt for AI
     */
    buildInterviewPrompt(participantData) {
        return `
You are a care advisor AI assistant for the North Carolina HCI-CDS program. 
Generate a comprehensive set of interview questions for a care advisor to ask during the initial assessment.

Participant Information:
- Name: ${participantData.firstName} ${participantData.lastName}
- Age: ${this.calculateAge(participantData.dob)}
- Primary Diagnosis: ${participantData.primaryDiagnosis}
- Care Level: ${participantData.careLevel}
- Medicaid Number: ${participantData.medicaidNumber}

Generate 15-20 interview questions that cover:
1. Daily living activities and independence
2. Health conditions and medications
3. Social support network
4. Safety concerns and risk factors
5. Care preferences and goals
6. Transportation needs
7. Technology access and comfort
8. Cultural and language considerations
9. Emergency preparedness
10. Financial situation and resources

Format the response as a JSON object with this structure:
{
  "interviewQuestions": [
    {
      "category": "Daily Living",
      "question": "What daily activities do you need help with?",
      "required": true,
      "followUp": "Can you describe your typical day?"
    }
  ],
  "assessmentAreas": [
    "Functional Assessment",
    "Safety Assessment", 
    "Social Support",
    "Health Management"
  ],
  "estimatedDuration": "45-60 minutes"
}

Focus on questions that are:
- Person-centered and respectful
- Open-ended to encourage detailed responses
- Relevant to care planning
- Compliant with federal assessment requirements
- Culturally sensitive
`;
    }

    /**
     * Build the analysis prompt for AI
     */
    buildAnalysisPrompt(participantData, interviewResponses) {
        return `
You are a care advisor AI assistant analyzing interview responses for care planning.

Participant: ${participantData.firstName} ${participantData.lastName}
Primary Diagnosis: ${participantData.primaryDiagnosis}
Care Level: ${participantData.careLevel}

Interview Responses:
${JSON.stringify(interviewResponses, null, 2)}

Analyze the responses and provide:
1. Care needs assessment
2. Risk factors identified
3. Recommended services
4. Care plan priorities
5. Safety considerations
6. Resource recommendations

Format as JSON:
{
  "careNeeds": {
    "functional": ["list of functional needs"],
    "health": ["list of health needs"],
    "social": ["list of social needs"]
  },
  "riskFactors": ["list of identified risks"],
  "recommendedServices": [
    {
      "service": "Personal Care",
      "hours": 10,
      "priority": "high",
      "rationale": "Based on ADL limitations"
    }
  ],
  "carePlanPriorities": ["priority 1", "priority 2"],
  "safetyConsiderations": ["safety concern 1", "concern 2"],
  "nextSteps": ["step 1", "step 2"]
}
`;
    }

    /**
     * Parse AI-generated interview questions
     */
    parseInterviewQuestions(aiResponse) {
        try {
            // Extract JSON from AI response
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (error) {
            console.error('Error parsing AI response:', error);
        }
        
        return this.getFallbackQuestions();
    }

    /**
     * Parse AI analysis
     */
    parseAnalysis(aiResponse) {
        try {
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (error) {
            console.error('Error parsing AI analysis:', error);
        }
        
        return this.getFallbackAnalysis();
    }

    /**
     * Calculate age from date of birth
     */
    calculateAge(dob) {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    }

    /**
     * Fallback questions if AI is unavailable
     */
    getFallbackQuestions(participantData) {
        return {
            interviewQuestions: [
                {
                    category: "Daily Living",
                    question: "What daily activities do you need help with?",
                    required: true,
                    followUp: "Can you describe your typical day?"
                },
                {
                    category: "Health Management",
                    question: "What health conditions do you have and how do you manage them?",
                    required: true,
                    followUp: "Are you taking any medications?"
                },
                {
                    category: "Safety",
                    question: "Do you have any safety concerns in your home?",
                    required: true,
                    followUp: "Have you had any recent falls or accidents?"
                },
                {
                    category: "Social Support",
                    question: "Who helps you with daily activities?",
                    required: false,
                    followUp: "How often do you see family or friends?"
                },
                {
                    category: "Goals",
                    question: "What are your main goals for care?",
                    required: true,
                    followUp: "What would help you live more independently?"
                }
            ],
            assessmentAreas: [
                "Functional Assessment",
                "Safety Assessment",
                "Social Support",
                "Health Management"
            ],
            estimatedDuration: "45-60 minutes"
        };
    }

    /**
     * Fallback analysis if AI is unavailable
     */
    getFallbackAnalysis(participantData, interviewResponses) {
        return {
            careNeeds: {
                functional: ["ADL assistance", "Mobility support"],
                health: ["Medication management", "Health monitoring"],
                social: ["Social engagement", "Community connections"]
            },
            riskFactors: ["Fall risk", "Social isolation"],
            recommendedServices: [
                {
                    service: "Personal Care",
                    hours: 10,
                    priority: "high",
                    rationale: "Based on assessment needs"
                }
            ],
            carePlanPriorities: ["Safety", "Independence", "Health management"],
            safetyConsiderations: ["Fall prevention", "Emergency planning"],
            nextSteps: ["Develop care plan", "Coordinate services"]
        };
    }
}

export default OllamaIntegration;
