-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "children" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rollno" TEXT NOT NULL,
    "dateOfBirth" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gender" VARCHAR(10) NOT NULL,
    "teacherId" TEXT NOT NULL,
    "testsTaken" INTEGER DEFAULT 0,

    CONSTRAINT "children_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "child_form_responses" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responses" JSONB NOT NULL,
    "formVersion" TEXT NOT NULL,

    CONSTRAINT "child_form_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visual_test_results" (
    "id" TEXT NOT NULL,
    "childId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "testName" TEXT DEFAULT 'Visual Discrimination Test',
    "options" TEXT NOT NULL,
    "score" DECIMAL(5,2),

    CONSTRAINT "visual_test_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vocabulary_test_results" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "childId" TEXT,
    "responses" TEXT,
    "score" DECIMAL(5,2),
    "testName" TEXT,

    CONSTRAINT "vocabulary_test_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "symbol_sequence_results" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "childId" TEXT,
    "difficulty" TEXT,
    "level" DECIMAL(5,2),
    "score" DECIMAL(5,2),
    "totalRounds" DECIMAL(5,2),
    "testName" TEXT,

    CONSTRAINT "symbol_sequence_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sound_blending_results" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "childId" TEXT,
    "totalScore" DECIMAL(5,2),
    "score" DECIMAL(5,2),
    "responses" TEXT,
    "testName" TEXT,

    CONSTRAINT "sound_blending_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sequence_test_results" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "childId" TEXT,
    "score" DECIMAL(5,2),
    "testName" TEXT,

    CONSTRAINT "sequence_test_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditory_memory_test_results" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "childId" TEXT,
    "score" DECIMAL(5,2),
    "forwardCorrect" DECIMAL(5,2),
    "reverseCorrect" DECIMAL(5,2),
    "testName" TEXT,

    CONSTRAINT "auditory_memory_test_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sound_discrimination_test_results" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "childId" TEXT,
    "score" DECIMAL(5,2),
    "testName" TEXT,

    CONSTRAINT "sound_discrimination_test_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reading_proficiency_test_results" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "childId" TEXT,
    "spokenWords" TEXT,
    "correctWords" TEXT,
    "incorrectWords" TEXT,
    "score" DECIMAL(5,2),
    "testName" TEXT,

    CONSTRAINT "reading_proficiency_test_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "picture_test_results" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" DECIMAL(5,2),
    "childId" TEXT,
    "testName" TEXT,
    "responses" TEXT,

    CONSTRAINT "picture_test_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grapheme_test_results" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "childId" TEXT,
    "results" TEXT,
    "score" DECIMAL(5,2),
    "testName" TEXT,

    CONSTRAINT "grapheme_test_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "continuous_assessments" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "childId" TEXT,
    "totalScore" DECIMAL(5,2),
    "testResults" TEXT,
    "analysis" TEXT,

    CONSTRAINT "continuous_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "child_form_analysis" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "formResponseId" TEXT NOT NULL,
    "developmentalMilestones" TEXT,
    "questionnaireInterpretation" TEXT,
    "furtherAssessmentRecommendations" TEXT,
    "parentSupportSuggestions" TEXT,
    "psychologicalFrameworks" TEXT,
    "observedSymptoms" JSONB,
    "questionnaireContext" TEXT,
    "previousDiagnoses" JSONB,
    "familyHistory" TEXT,
    "culturalEnvironmentalFactors" TEXT,
    "assessmentGoals" TEXT,
    "comdellAnalysis" JSONB,
    "isaaAnalysis" JSONB,
    "winnieDunnAssessment" JSONB,
    "sensorySeekingScore" DOUBLE PRECISION,
    "sensoryAvoidingScore" DOUBLE PRECISION,
    "sensorySensitivityScore" DOUBLE PRECISION,
    "sensoryRegistrationScore" DOUBLE PRECISION,
    "quadrantGridAnalysis" JSONB,
    "suggestedActivities" JSONB,
    "environmentalModifications" JSONB,
    "sensoryProcessingInterpretation" TEXT,
    "sensoryInterventionPlan" JSONB,
    "sensoryFollowUpStrategy" TEXT,
    "sensoryFriendlyEnvironmentGuidelines" JSONB,
    "parentImplementationStrategies" JSONB,
    "phonologicalDisorderAssessment" TEXT,
    "attentionDifficultiesEvaluation" TEXT,
    "dysarthriaAssessment" TEXT,
    "voiceDisorderEvaluation" TEXT,
    "eyeContactDifficulties" TEXT,
    "oromotorAssessment" JSONB,
    "speechAssessmentTools" JSONB,
    "speechTherapyGoals" JSONB,
    "speechActivitiesExercises" JSONB,
    "speechSupportStrategies" JSONB,
    "communicationEnvironmentTips" JSONB,
    "earlyInterventionImportance" TEXT,
    "speechCaseStudies" JSONB,
    "playBasedLearningIntegration" JSONB,
    "speechParentResources" JSONB,
    "adhdManagementTechniques" JSONB,
    "collaborativeApproaches" JSONB,
    "overallAssessment" TEXT,
    "strengths" JSONB,
    "areasOfConcern" JSONB,
    "learningStyle" TEXT,
    "recommendations" JSONB,
    "riskFactors" JSONB,
    "positiveIndicators" JSONB,
    "nextSteps" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "child_form_analysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "child_form_analysis_formResponseId_key" ON "child_form_analysis"("formResponseId");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "children" ADD CONSTRAINT "children_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "child_form_responses" ADD CONSTRAINT "child_form_responses_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visual_test_results" ADD CONSTRAINT "visual_test_results_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary_test_results" ADD CONSTRAINT "vocabulary_test_results_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symbol_sequence_results" ADD CONSTRAINT "symbol_sequence_results_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sound_blending_results" ADD CONSTRAINT "sound_blending_results_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sequence_test_results" ADD CONSTRAINT "sequence_test_results_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditory_memory_test_results" ADD CONSTRAINT "auditory_memory_test_results_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sound_discrimination_test_results" ADD CONSTRAINT "sound_discrimination_test_results_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_proficiency_test_results" ADD CONSTRAINT "reading_proficiency_test_results_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "picture_test_results" ADD CONSTRAINT "picture_test_results_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grapheme_test_results" ADD CONSTRAINT "grapheme_test_results_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "continuous_assessments" ADD CONSTRAINT "continuous_assessments_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "child_form_analysis" ADD CONSTRAINT "child_form_analysis_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "child_form_analysis" ADD CONSTRAINT "child_form_analysis_formResponseId_fkey" FOREIGN KEY ("formResponseId") REFERENCES "child_form_responses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
