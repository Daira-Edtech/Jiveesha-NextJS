import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { withAuth } from "@/lib/auth-utils";
import formData from "@/Data/formData.json";

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function evaluateFormWithGemini(
  questionAnswerPairs,
  childName,
  childAge
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
PROMPT FOR PSYCHOLOGY REPORT

Act as an expert developmental psychologist to diagnose a child named ${childName}, aged ${childAge}, based on the results of a questionnaire. Please analyze the responses using the ComDell and ISAA tools if the child is above 6 years old. Your analysis should include the following topics: 
   - Overview of developmental milestones appropriate for the child's age.
   - Interpretation of questionnaire results, highlighting any areas of concern.
   - Recommendations for further assessment or intervention strategies.
   - Suggestions for parents on how to support their child's development at home.
   - A friendly and approachable tone that encourages open communication with the parents.
   - Any relevant psychological theories or frameworks that may apply to the child's situation.

- Specific symptoms or behaviors observed in the child.
   - Context of the questionnaire (e.g., school performance, social interactions).
   - Any previous diagnoses or assessments the child has undergone.
   - Family history of developmental or psychological issues.
   - Cultural or environmental factors that may influence the child's development.
   - Goals for the assessment (e.g., understanding specific behaviors, improving social skills).

PROMPT FOR Sensory and Occupational REPORT

Act as an expert occupational therapist at Brio Kids and provide a comprehensive sensory assessment report for a child named ${childName}, aged ${childAge}, who has been diagnosed based on a psychology assessment report. Utilize the Winnie Dunn assessment tool to analyze the child's sensory processing abilities. Include a detailed quadrant grid analysis with the total raw scores for sensory seeking, avoiding, sensitivity, and registration. Based on these scores, suggest appropriate activities tailored for ${childName}, along with necessary environmental modifications to support their sensory needs. Structure the report according to the guidelines of the Winnie Dunn assessment tool, ensuring clarity and accessibility for parents or caregivers. Additionally, provide an interpretation of the quadrant grid analysis, outlining the implications of the scores. Conclude with an intervention plan that includes specific recommendations and a follow-up strategy to monitor progress. Topics to cover include:
Overview of the Winnie Dunn assessment tool
Explanation of sensory processing quadrants
Detailed raw score breakdown
Suggested activities for each sensory category
Environmental modifications
Interpretation of results
Intervention plan recommendations
Follow-up strategies
Additional Context for Prompt
Specific examples of activities for sensory seeking, avoiding, sensitivity, and registration
Guidelines for creating sensory-friendly environments
Strategies for parents to implement at home
Potential challenges and solutions in sensory processing
Importance of collaboration with other professionals (e.g., teachers, psychologists)
Resources for further reading or support groups
Case studies or examples of successful interventions

PROMPT FOR SPEECH AND LANGUAGE ASSESSMENT REPORT

Act as an expert speech-language pathologist at Brio Kids. I need your expertise to provide a comprehensive speech assessment for ${childName}, ${childAge}, diagnosed with (report of psychology). He presents with several challenges, including phonological disorder, lack of attention, sitting tolerance issues, dysarthria, voice disorder, and difficulties with eye contact. According to the Oromotor assessment, he needs to improve his tongue movement and produce palatal sounds. Please suggest a detailed speech assessment plan tailored to his specific needs, including the following topics:
Overview of phonological disorder, attention difficulties, dysarthria, voice disorders, and their impacts on communication.
Recommended assessment tools and methods for evaluating ${childName}'s speech and language skills.
Specific, measurable goals for therapy based on his diagnosis.
Engaging speech activities and exercises suitable for his age that can help address his difficulties.
Strategies for parents and educators to support ${childName}'s speech development at home and in school.
Tips for fostering a positive communication environment for ${childName}.
Importance of early intervention for children with speech and language disorders.
Examples of successful case studies or interventions for similar profiles.
Suggestions for integrating play-based learning into speech therapy.
Resources for parents, such as websites or books, that provide additional support.
Techniques for managing ADHD symptoms in the context of speech therapy.
Ideas for collaborative approaches with teachers and other professionals involved in ${childName}'s care.
Additional Context for Prompt
Specific characteristics of each disorder and how they manifest in children.
Detailed descriptions of assessment tools, including their purpose and how to administer them.
Examples of realistic and achievable therapy goals tailored to the child's age and abilities.
A variety of speech activities that cater to different learning styles and preferences.
Communication strategies that can be easily implemented in daily routines.
Information on the role of family involvement in speech therapy success.
Insights into the importance of consistency and routine in therapy.
Techniques for building rapport with the child to enhance therapy effectiveness.
Suggestions for monitoring progress and adjusting therapy plans as needed.
Information on local resources or support groups for families dealing with similar challenges.

Form Responses:
${JSON.stringify(questionAnswerPairs, null, 2)}

Please provide a comprehensive analysis in a structured JSON format with all the fields mentioned in the three assessment reports above. Include detailed information for psychology assessment, sensory and occupational assessment, and speech and language assessment.

Format your response as a structured JSON object with the following fields:
{
  "psychologyReport": {
    "developmentalMilestones": "Overview of developmental milestones appropriate for the child's age",
    "questionnaireInterpretation": "Interpretation of questionnaire results, highlighting areas of concern",
    "furtherAssessmentRecommendations": "Recommendations for further assessment or intervention strategies",
    "parentSupportSuggestions": "Suggestions for parents on how to support their child's development at home",
    "psychologicalFrameworks": "Relevant psychological theories or frameworks that may apply",
    "observedSymptoms": ["specific", "symptoms", "or", "behaviors"],
    "questionnaireContext": "Context of the questionnaire",
    "previousDiagnoses": ["any", "previous", "diagnoses"],
    "familyHistory": "Family history of developmental or psychological issues",
    "culturalEnvironmentalFactors": "Cultural or environmental factors",
    "assessmentGoals": "Goals for the assessment",
    "comdellAnalysis": {},
    "isaaAnalysis": {}
  },
  "sensoryOccupationalReport": {
    "winnieDunnAssessment": {},
    "sensorySeekingScore": 0,
    "sensoryAvoidingScore": 0,
    "sensorySensitivityScore": 0,
    "sensoryRegistrationScore": 0,
    "quadrantGridAnalysis": {},
    "suggestedActivities": {},
    "environmentalModifications": {},
    "sensoryProcessingInterpretation": "Interpretation of quadrant grid analysis",
    "sensoryInterventionPlan": {},
    "sensoryFollowUpStrategy": "Follow-up strategy to monitor progress",
    "sensoryFriendlyEnvironmentGuidelines": {},
    "parentImplementationStrategies": {}
  },
  "speechLanguageReport": {
    "phonologicalDisorderAssessment": "Assessment of phonological disorder",
    "attentionDifficultiesEvaluation": "Evaluation of attention difficulties",
    "dysarthriaAssessment": "Assessment of dysarthria",
    "voiceDisorderEvaluation": "Evaluation of voice disorders",
    "eyeContactDifficulties": "Assessment of eye contact difficulties",
    "oromotorAssessment": {},
    "speechAssessmentTools": {},
    "speechTherapyGoals": {},
    "speechActivitiesExercises": {},
    "speechSupportStrategies": {},
    "communicationEnvironmentTips": {},
    "earlyInterventionImportance": "Importance of early intervention",
    "speechCaseStudies": {},
    "playBasedLearningIntegration": {},
    "speechParentResources": {},
    "adhdManagementTechniques": {},
    "collaborativeApproaches": {}
  },
  "overallAssessment": "Brief overall assessment",
  "strengths": ["list", "of", "strengths"],
  "areasOfConcern": ["list", "of", "areas", "needing", "attention"],
  "learningStyle": "Identified learning style preferences",
  "recommendations": {
    "forParents": ["list", "of", "recommendations"],
    "forTeachers": ["list", "of", "recommendations"]
  },
  "riskFactors": ["any", "identified", "risk", "factors"],
  "positiveIndicators": ["positive", "developmental", "indicators"],
  "nextSteps": ["suggested", "next", "steps"]
}

Be thorough and detailed in your analysis for all three assessment areas.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON response:", parseError);
    }

    return {
      psychologyReport: {
        developmentalMilestones: `Developmental analysis for ${childName}, age ${childAge}: ${text}`,
        questionnaireInterpretation: "Analysis pending",
        furtherAssessmentRecommendations: "Manual review required",
        parentSupportSuggestions: "Consult with specialist",
        psychologicalFrameworks: "To be determined",
        observedSymptoms: [],
        questionnaireContext: "Assessment form responses",
        previousDiagnoses: [],
        familyHistory: "Not specified",
        culturalEnvironmentalFactors: "To be assessed",
        assessmentGoals: "Comprehensive evaluation",
        comdellAnalysis: {},
        isaaAnalysis: {},
      },
      sensoryOccupationalReport: {
        winnieDunnAssessment: {},
        sensorySeekingScore: null,
        sensoryAvoidingScore: null,
        sensorySensitivityScore: null,
        sensoryRegistrationScore: null,
        quadrantGridAnalysis: {},
        suggestedActivities: {},
        environmentalModifications: {},
        sensoryProcessingInterpretation: "Analysis pending",
        sensoryInterventionPlan: {},
        sensoryFollowUpStrategy: "To be determined",
        sensoryFriendlyEnvironmentGuidelines: {},
        parentImplementationStrategies: {},
      },
      speechLanguageReport: {
        phonologicalDisorderAssessment: "Assessment pending",
        attentionDifficultiesEvaluation: "Evaluation pending",
        dysarthriaAssessment: "Assessment pending",
        voiceDisorderEvaluation: "Evaluation pending",
        eyeContactDifficulties: "Assessment pending",
        oromotorAssessment: {},
        speechAssessmentTools: {},
        speechTherapyGoals: {},
        speechActivitiesExercises: {},
        speechSupportStrategies: {},
        communicationEnvironmentTips: {},
        earlyInterventionImportance: "Critical for development",
        speechCaseStudies: {},
        playBasedLearningIntegration: {},
        speechParentResources: {},
        adhdManagementTechniques: {},
        collaborativeApproaches: {},
      },
      overallAssessment: `Assessment for ${childName}, age ${childAge}: ${text}`,
      strengths: [],
      areasOfConcern: [],
      learningStyle: "Analysis pending",
      recommendations: {
        forParents: ["Consult with educational specialist"],
        forTeachers: ["Conduct manual assessment"],
      },
      riskFactors: [],
      positiveIndicators: [],
      nextSteps: ["Schedule professional assessment"],
    };
  } catch (error) {
    console.error("Gemini evaluation error:", error);
    return {
      psychologyReport: {
        developmentalMilestones: `Automated analysis failed for ${childName}, age ${childAge}. Manual review required.`,
        questionnaireInterpretation: "Manual assessment needed",
        furtherAssessmentRecommendations: "Consult with specialist",
        parentSupportSuggestions: "Seek professional guidance",
        psychologicalFrameworks: "Manual evaluation required",
        observedSymptoms: [],
        questionnaireContext: "Form submission error",
        previousDiagnoses: [],
        familyHistory: "Unknown",
        culturalEnvironmentalFactors: "To be assessed manually",
        assessmentGoals: "Professional evaluation needed",
        comdellAnalysis: {},
        isaaAnalysis: {},
      },
      sensoryOccupationalReport: {
        winnieDunnAssessment: {},
        sensorySeekingScore: null,
        sensoryAvoidingScore: null,
        sensorySensitivityScore: null,
        sensoryRegistrationScore: null,
        quadrantGridAnalysis: {},
        suggestedActivities: {},
        environmentalModifications: {},
        sensoryProcessingInterpretation: "Manual assessment required",
        sensoryInterventionPlan: {},
        sensoryFollowUpStrategy: "Professional evaluation needed",
        sensoryFriendlyEnvironmentGuidelines: {},
        parentImplementationStrategies: {},
      },
      speechLanguageReport: {
        phonologicalDisorderAssessment: "Manual assessment required",
        attentionDifficultiesEvaluation: "Professional evaluation needed",
        dysarthriaAssessment: "Manual assessment required",
        voiceDisorderEvaluation: "Professional evaluation needed",
        eyeContactDifficulties: "Manual assessment required",
        oromotorAssessment: {},
        speechAssessmentTools: {},
        speechTherapyGoals: {},
        speechActivitiesExercises: {},
        speechSupportStrategies: {},
        communicationEnvironmentTips: {},
        earlyInterventionImportance: "Critical - seek professional help",
        speechCaseStudies: {},
        playBasedLearningIntegration: {},
        speechParentResources: {},
        adhdManagementTechniques: {},
        collaborativeApproaches: {},
      },
      overallAssessment: `Automated analysis failed for ${childName}, age ${childAge}. Manual review required.`,
      strengths: [],
      areasOfConcern: [],
      learningStyle: "Manual assessment needed",
      recommendations: {
        forParents: ["Consult with educational specialist"],
        forTeachers: ["Conduct manual assessment"],
      },
      riskFactors: [],
      positiveIndicators: [],
      nextSteps: ["Schedule professional assessment"],
    };
  }
}

async function postHandler(req, context, { userId, user }) {
  try {
    const body = await req.json();
    const { childId, responses, formVersion = "1.0" } = body;

    const questionAnswerPairs = formData.questions.map((q) => ({
      label: q.label,
      name: q.name,
      type: q.type,
      value: responses[q.name] ?? null,
    }));

    let child;

    if (childId) {
      child = await prisma.children.findFirst({
        where: {
          id: childId,
          teacherId: userId,
        },
      });

      if (!child) {
        return NextResponse.json(
          { message: "Child not found or unauthorized" },
          { status: 404 }
        );
      }
    } else {
      const childName = responses.childName;
      const childDob = responses.childDob;
      const gender = responses.gender;

      if (!childName || !childDob || !gender) {
        return NextResponse.json(
          {
            message:
              "Missing required child information (name, date of birth, gender)",
          },
          { status: 400 }
        );
      }

      const rollNumber = `STU${Date.now()}`;

      child = await prisma.children.create({
        data: {
          name: childName,
          rollno: rollNumber,
          dateOfBirth: new Date(childDob),
          gender: gender,
          teacherId: userId,
        },
      });
    }

    // Calculate child's age
    const today = new Date();
    const birthDate = new Date(child.dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const childAge =
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ? age - 1
        : age;

    const geminiAnalysis = await evaluateFormWithGemini(
      questionAnswerPairs,
      child.name,
      childAge
    );
    const formResponse = await prisma.childFormResponse.create({
      data: {
        childId: child.id,
        responses: responses,
        formVersion,
      },
    });
    const analysis = await prisma.childFormAnalysisnew.create({
      data: {
        childId: child.id,
        formResponseId: formResponse.id,

        // Psychology Report Fields
        developmentalMilestones:
          geminiAnalysis.psychologyReport?.developmentalMilestones || null,
        questionnaireInterpretation:
          geminiAnalysis.psychologyReport?.questionnaireInterpretation || null,
        furtherAssessmentRecommendations:
          geminiAnalysis.psychologyReport?.furtherAssessmentRecommendations ||
          null,
        parentSupportSuggestions:
          geminiAnalysis.psychologyReport?.parentSupportSuggestions || null,
        psychologicalFrameworks:
          geminiAnalysis.psychologyReport?.psychologicalFrameworks || null,
        observedSymptoms:
          geminiAnalysis.psychologyReport?.observedSymptoms || null,
        questionnaireContext:
          geminiAnalysis.psychologyReport?.questionnaireContext || null,
        previousDiagnoses:
          geminiAnalysis.psychologyReport?.previousDiagnoses || null,
        familyHistory: geminiAnalysis.psychologyReport?.familyHistory || null,
        culturalEnvironmentalFactors:
          geminiAnalysis.psychologyReport?.culturalEnvironmentalFactors || null,
        assessmentGoals:
          geminiAnalysis.psychologyReport?.assessmentGoals || null,
        comdellAnalysis:
          geminiAnalysis.psychologyReport?.comdellAnalysis || null,
        isaaAnalysis: geminiAnalysis.psychologyReport?.isaaAnalysis || null,

        // Sensory and Occupational Report Fields
        winnieDunnAssessment:
          geminiAnalysis.sensoryOccupationalReport?.winnieDunnAssessment ||
          null,
        sensorySeekingScore:
          geminiAnalysis.sensoryOccupationalReport?.sensorySeekingScore || null,
        sensoryAvoidingScore:
          geminiAnalysis.sensoryOccupationalReport?.sensoryAvoidingScore ||
          null,
        sensorySensitivityScore:
          geminiAnalysis.sensoryOccupationalReport?.sensorySensitivityScore ||
          null,
        sensoryRegistrationScore:
          geminiAnalysis.sensoryOccupationalReport?.sensoryRegistrationScore ||
          null,
        quadrantGridAnalysis:
          geminiAnalysis.sensoryOccupationalReport?.quadrantGridAnalysis ||
          null,
        suggestedActivities:
          geminiAnalysis.sensoryOccupationalReport?.suggestedActivities || null,
        environmentalModifications:
          geminiAnalysis.sensoryOccupationalReport
            ?.environmentalModifications || null,
        sensoryProcessingInterpretation:
          geminiAnalysis.sensoryOccupationalReport
            ?.sensoryProcessingInterpretation || null,
        sensoryInterventionPlan:
          geminiAnalysis.sensoryOccupationalReport?.sensoryInterventionPlan ||
          null,
        sensoryFollowUpStrategy:
          geminiAnalysis.sensoryOccupationalReport?.sensoryFollowUpStrategy ||
          null,
        sensoryFriendlyEnvironmentGuidelines:
          geminiAnalysis.sensoryOccupationalReport
            ?.sensoryFriendlyEnvironmentGuidelines || null,
        parentImplementationStrategies:
          geminiAnalysis.sensoryOccupationalReport
            ?.parentImplementationStrategies || null,

        // Speech and Language Assessment Report Fields
        phonologicalDisorderAssessment:
          geminiAnalysis.speechLanguageReport?.phonologicalDisorderAssessment ||
          null,
        attentionDifficultiesEvaluation:
          geminiAnalysis.speechLanguageReport
            ?.attentionDifficultiesEvaluation || null,
        dysarthriaAssessment:
          geminiAnalysis.speechLanguageReport?.dysarthriaAssessment || null,
        voiceDisorderEvaluation:
          geminiAnalysis.speechLanguageReport?.voiceDisorderEvaluation || null,
        eyeContactDifficulties:
          geminiAnalysis.speechLanguageReport?.eyeContactDifficulties || null,
        oromotorAssessment:
          geminiAnalysis.speechLanguageReport?.oromotorAssessment || null,
        speechAssessmentTools:
          geminiAnalysis.speechLanguageReport?.speechAssessmentTools || null,
        speechTherapyGoals:
          geminiAnalysis.speechLanguageReport?.speechTherapyGoals || null,
        speechActivitiesExercises:
          geminiAnalysis.speechLanguageReport?.speechActivitiesExercises ||
          null,
        speechSupportStrategies:
          geminiAnalysis.speechLanguageReport?.speechSupportStrategies || null,
        communicationEnvironmentTips:
          geminiAnalysis.speechLanguageReport?.communicationEnvironmentTips ||
          null,
        earlyInterventionImportance:
          geminiAnalysis.speechLanguageReport?.earlyInterventionImportance ||
          null,
        speechCaseStudies:
          geminiAnalysis.speechLanguageReport?.speechCaseStudies || null,
        playBasedLearningIntegration:
          geminiAnalysis.speechLanguageReport?.playBasedLearningIntegration ||
          null,
        speechParentResources:
          geminiAnalysis.speechLanguageReport?.speechParentResources || null,
        adhdManagementTechniques:
          geminiAnalysis.speechLanguageReport?.adhdManagementTechniques || null,
        collaborativeApproaches:
          geminiAnalysis.speechLanguageReport?.collaborativeApproaches || null,

        // Legacy fields (keeping for backward compatibility)
        overallAssessment: geminiAnalysis.overallAssessment || null,
        strengths: geminiAnalysis.strengths || null,
        areasOfConcern: geminiAnalysis.areasOfConcern || null,
        learningStyle: geminiAnalysis.learningStyle || null,
        recommendations: geminiAnalysis.recommendations || null,
        riskFactors: geminiAnalysis.riskFactors || null,
        positiveIndicators: geminiAnalysis.positiveIndicators || null,
        nextSteps: geminiAnalysis.nextSteps || null,
      },
    });

    return NextResponse.json(
      {
        message: "Form submitted successfully",
        data: {
          child,
          formResponse,
          analysis: analysis,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json(
      { message: "Error submitting form", error: error.message },
      { status: 500 }
    );
  }
}

async function getHandler(req, context, { userId, user }) {
  try {
    const { searchParams } = new URL(req.url);
    const childId = searchParams.get("childId");

    if (!childId) {
      return NextResponse.json(
        { message: "childId is required" },
        { status: 400 }
      );
    }

    // Verify the child belongs to the authenticated user
    const child = await prisma.children.findFirst({
      where: {
        id: childId,
        teacherId: userId,
      },
    });

    if (!child) {
      return NextResponse.json(
        { message: "Child not found or unauthorized" },
        { status: 404 }
      );
    }

    // Fetch form responses and analysis for the child
    const formData = await prisma.childFormResponse.findMany({
      where: {
        childId: childId,
      },
      include: {
        analysisNew: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        message: "Form data retrieved successfully",
        data: {
          childDetails: child,
          formData: formData,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching form data:", error);
    return NextResponse.json(
      { message: "Error fetching form data", error: error.message },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getHandler);
export const POST = withAuth(postHandler);
