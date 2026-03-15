import React, { useState } from 'react';
import { FileText, CheckCircle, AlertCircle, Lightbulb, Copy, Download } from 'lucide-react';

interface SectionFeedback {
  strengths: string[];
  improvements: string[];
  suggestions: string[];
}

interface ReviewData {
  title: string;
  abstract: string;
  introduction: string;
  methodology: string;
  results: string;
  conclusion: string;
  references: string;
}

const PaperReviewTool: React.FC = () => {
  const [inputMode, setInputMode] = useState<'sections' | 'full'>('sections');
  const [reviewData, setReviewData] = useState<ReviewData>({
    title: '',
    abstract: '',
    introduction: '',
    methodology: '',
    results: '',
    conclusion: '',
    references: ''
  });
  const [feedback, setFeedback] = useState<Record<string, SectionFeedback>>({});
  const [showPromptTemplate, setShowPromptTemplate] = useState(false);

  const sectionCriteria = {
    title: {
      questions: ['Is it specific and not generic?', 'Does it indicate the research scope?', 'Is it 8-15 words?', 'Does it avoid jargon?'],
      focus: 'Clarity, specificity, and journal standards'
    },
    abstract: {
      questions: ['Does it follow Problem-Method-Result structure?', 'Is it 150-250 words?', 'Are key findings quantified?', 'Is methodology briefly mentioned?'],
      focus: 'Structure, conciseness, and completeness'
    },
    introduction: {
      questions: ['Is the research gap clearly identified?', 'Are citations recent and relevant?', 'Is the research question explicit?', 'Does it build logical flow?'],
      focus: 'Gap identification and literature context'
    },
    methodology: {
      questions: ['Is the method replicable?', 'Are tools/instruments described?', 'Is sample size justified?', 'Are limitations mentioned?'],
      focus: 'Reproducibility and rigor'
    },
    results: {
      questions: ['Are findings presented logically?', 'Are tables/figures clear?', 'Is statistical significance noted?', 'Are results interpretation-free?'],
      focus: 'Clarity and objective presentation'
    },
    conclusion: {
      questions: ['Does it answer the research question?', 'Are implications discussed?', 'Are limitations acknowledged?', 'Is future work suggested?'],
      focus: 'Completeness and impact'
    },
    references: {
      questions: ['Are 70% of references from last 5 years?', 'Is formatting consistent?', 'Are sources credible?', 'Is quantity appropriate (20-50)?'],
      focus: 'Currency, credibility, and formatting'
    }
  };

  const generateFeedback = (section: string, content: string): SectionFeedback => {
    const wordCount = content.trim().split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    
    let strengths: string[] = [];
    let improvements: string[] = [];
    let suggestions: string[] = [];

    switch (section) {
      case 'title':
        if (wordCount >= 8 && wordCount <= 15) {
          strengths.push('Word count is appropriate for journal standards (8-15 words)');
        } else if (wordCount < 8) {
          improvements.push('Title is too brief - may lack specificity');
          suggestions.push('Expand to include key research elements (method, scope, or outcome)');
        } else {
          improvements.push('Title is too long - may reduce readability');
          suggestions.push('Remove unnecessary words while maintaining core research elements');
        }
        
        if (content.includes('?')) {
          improvements.push('Question format may not suit all journal styles');
          suggestions.push('Consider declarative format: "Effect of X on Y" rather than "Does X affect Y?"');
        }
        
        if (!/[A-Z]/.test(content.replace(/^[A-Z]/, ''))) {
          suggestions.push('Consider using title case for professional presentation');
        }
        
        strengths.push('Title appears to focus on specific research area');
        break;

      case 'abstract':
        if (wordCount >= 150 && wordCount <= 250) {
          strengths.push('Word count is within optimal range (150-250 words)');
        } else if (wordCount < 150) {
          improvements.push('Abstract may be too brief for comprehensive coverage');
          suggestions.push('Expand methodology description and quantify key findings');
        } else {
          improvements.push('Abstract exceeds recommended length - may lose reader focus');
          suggestions.push('Condense by removing background details and focusing on core contributions');
        }

        if (sentences >= 6 && sentences <= 10) {
          strengths.push('Sentence structure allows for proper abstract flow');
        }

        if (content.toLowerCase().includes('method') || content.toLowerCase().includes('approach')) {
          strengths.push('Methodology component is present');
        } else {
          improvements.push('Methodology section appears missing or unclear');
          suggestions.push('Add 1-2 sentences describing your research approach and data collection');
        }
        break;

      case 'introduction':
        if (wordCount >= 500) {
          strengths.push('Substantial content allows for proper literature context');
        } else {
          improvements.push('Introduction may need more comprehensive literature review');
          suggestions.push('Expand background literature and strengthen gap identification');
        }

        if (content.toLowerCase().includes('gap') || content.toLowerCase().includes('lack') || content.toLowerCase().includes('limited')) {
          strengths.push('Research gap identification is present');
        } else {
          improvements.push('Research gap is not clearly articulated');
          suggestions.push('Explicitly state what is missing in current literature using phrases like "However, limited research has..." ');
        }
        break;

      case 'methodology':
        if (wordCount >= 300) {
          strengths.push('Sufficient detail for methodology description');
        } else {
          improvements.push('Methodology may lack sufficient detail for replication');
          suggestions.push('Add details about sample selection, data collection procedures, and analysis methods');
        }

        if (content.toLowerCase().includes('sample') || content.toLowerCase().includes('participant')) {
          strengths.push('Sample description is included');
        } else {
          suggestions.push('Clearly describe your sample size, selection criteria, and characteristics');
        }
        break;

      case 'results':
        if (content.includes('Table') || content.includes('Figure') || content.includes('p <') || content.includes('p=')) {
          strengths.push('Results include statistical evidence or visual elements');
        } else {
          suggestions.push('Consider adding tables/figures and statistical significance values');
        }

        if (wordCount >= 400) {
          strengths.push('Comprehensive results presentation');
        } else {
          improvements.push('Results section may need more detailed findings');
        }
        break;

      case 'conclusion':
        if (content.toLowerCase().includes('limitation') || content.toLowerCase().includes('future')) {
          strengths.push('Acknowledges limitations and/or future research directions');
        } else {
          improvements.push('Missing discussion of limitations or future research');
          suggestions.push('Add a paragraph discussing study limitations and recommendations for future research');
        }

        if (wordCount >= 200) {
          strengths.push('Adequate length for comprehensive conclusion');
        }
        break;

      case 'references':
        const refCount = content.split('\n').filter(line => line.trim()).length;
        if (refCount >= 20 && refCount <= 50) {
          strengths.push(`Reference count (${refCount}) is appropriate for scope`);
        } else if (refCount < 20) {
          improvements.push('Reference list may be insufficient for comprehensive literature coverage');
          suggestions.push('Expand literature review with more recent and relevant sources');
        } else {
          improvements.push('Reference list may be excessive - focus on most relevant sources');
        }
        break;
    }

    // Add general suggestions if content is very short
    if (wordCount < 50 && section !== 'title') {
      improvements.push('Section appears underdeveloped');
      suggestions.push('Expand content to meet academic standards and provide sufficient detail');
    }

    return { strengths, improvements, suggestions };
  };

  const handleReview = () => {
    const newFeedback: Record<string, SectionFeedback> = {};
    
    Object.entries(reviewData).forEach(([section, content]) => {
      if (content.trim()) {
        newFeedback[section] = generateFeedback(section, content);
      }
    });
    
    setFeedback(newFeedback);
  };

  const promptTemplate = `Act as a senior Scopus journal reviewer. Review this research paper section and provide feedback in this format:

**STRENGTHS:**
- [List 2-3 specific strengths]

**AREAS TO IMPROVE:**
- [List 2-3 specific improvement areas]

**ACTIONABLE SUGGESTIONS:**
- [List 2-3 concrete, implementable suggestions]

**SECTION CRITERIA:**
For Title: Check specificity, length (8-15 words), clarity, journal style
For Abstract: Verify Problem-Method-Result structure, 150-250 words, quantified findings
For Introduction: Assess gap identification, citation quality, research question clarity
For Methodology: Evaluate replicability, detail level, sample justification
For Results: Review logical flow, figure/table quality, statistical presentation
For Conclusion: Check research question answer, implications, limitations discussion
For References: Verify currency (70% last 5 years), formatting, credibility

Please review the following [SECTION TYPE]:

[PASTE YOUR CONTENT HERE]`;

  const copyPromptTemplate = () => {
    navigator.clipboard.writeText(promptTemplate);
  };

  const exportFeedback = () => {
    let exportText = "RESEARCH PAPER REVIEW FEEDBACK\n";
    exportText += "================================\n\n";
    
    Object.entries(feedback).forEach(([section, sectionFeedback]) => {
      exportText += `${section.toUpperCase()}\n`;
      exportText += "-------------------\n";
      
      if (sectionFeedback.strengths.length > 0) {
        exportText += "STRENGTHS:\n";
        sectionFeedback.strengths.forEach(strength => exportText += `• ${strength}\n`);
        exportText += "\n";
      }
      
      if (sectionFeedback.improvements.length > 0) {
        exportText += "AREAS TO IMPROVE:\n";
        sectionFeedback.improvements.forEach(improvement => exportText += `• ${improvement}\n`);
        exportText += "\n";
      }
      
      if (sectionFeedback.suggestions.length > 0) {
        exportText += "ACTIONABLE SUGGESTIONS:\n";
        sectionFeedback.suggestions.forEach(suggestion => exportText += `• ${suggestion}\n`);
        exportText += "\n";
      }
      
      exportText += "\n";
    });

    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'paper-review-feedback.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Bonus 13: PAPER COMMENTS</h1>
          </div>
          <p className="text-lg text-gray-600 mb-2">What to Improve in Title, and All Sections of the Paper</p>
          <p className="text-sm text-gray-500">Senior Scopus Journal Reviewer Feedback Tool</p>
        </div>

        {/* Input Mode Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Input Method</h2>
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setInputMode('sections')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                inputMode === 'sections'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Section-wise Input
            </button>
            <button
              onClick={() => setInputMode('full')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                inputMode === 'full'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Full Paper Input
            </button>
          </div>

          {inputMode === 'sections' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(sectionCriteria).map(([section, criteria]) => (
                <div key={section} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </label>
                    <p className="text-xs text-gray-500 mb-2">Focus: {criteria.focus}</p>
                    <textarea
                      value={reviewData[section as keyof ReviewData]}
                      onChange={(e) => setReviewData({...reviewData, [section]: e.target.value})}
                      placeholder={`Paste your ${section} content here...`}
                      className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <div className="text-xs text-gray-400">
                    <p className="font-medium">Review criteria:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {criteria.questions.map((question, idx) => (
                        <li key={idx}>{question}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {inputMode === 'full' && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Full Paper Content
              </label>
              <textarea
                value={Object.values(reviewData).join('\n\n')}
                onChange={(e) => {
                  const sections = e.target.value.split('\n\n');
                  const newData = { ...reviewData };
                  const keys = Object.keys(reviewData) as (keyof ReviewData)[];
                  sections.forEach((section, idx) => {
                    if (keys[idx]) {
                      newData[keys[idx]] = section;
                    }
                  });
                  setReviewData(newData);
                }}
                placeholder="Paste your complete paper here. The tool will analyze each section..."
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
              <p className="text-sm text-gray-500">
                Tip: Separate sections with double line breaks for better analysis
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={handleReview}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Generate Review
            </button>
            
            <button
              onClick={() => setShowPromptTemplate(!showPromptTemplate)}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              AI Prompt Template
            </button>

            {Object.keys(feedback).length > 0 && (
              <button
                onClick={exportFeedback}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Feedback
              </button>
            )}
          </div>
        </div>

        {/* AI Prompt Template */}
        {showPromptTemplate && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">AI Prompt Template</h2>
              <button
                onClick={copyPromptTemplate}
                className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Template
              </button>
            </div>
            <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap border">
              {promptTemplate}
            </pre>
            <p className="text-sm text-gray-600 mt-3">
              <strong>How to use:</strong> Copy this template, replace [SECTION TYPE] and [PASTE YOUR CONTENT HERE] with your actual content, then paste into ChatGPT or any AI tool for instant peer-review style feedback.
            </p>
          </div>
        )}

        {/* Feedback Results */}
        {Object.keys(feedback).length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Review Feedback</h2>
            
            {Object.entries(feedback).map(([section, sectionFeedback]) => (
              <div key={section} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Strengths */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-green-700 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Strengths
                    </h4>
                    <div className="space-y-2">
                      {sectionFeedback.strengths.map((strength, idx) => (
                        <div key={idx} className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                          <p className="text-sm text-green-800">{strength}</p>
                        </div>
                      ))}
                      {sectionFeedback.strengths.length === 0 && (
                        <p className="text-sm text-gray-500 italic">Review content to identify strengths</p>
                      )}
                    </div>
                  </div>

                  {/* Areas to Improve */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-orange-700 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Areas to Improve
                    </h4>
                    <div className="space-y-2">
                      {sectionFeedback.improvements.map((improvement, idx) => (
                        <div key={idx} className="bg-orange-50 p-3 rounded-lg border-l-4 border-orange-400">
                          <p className="text-sm text-orange-800">{improvement}</p>
                        </div>
                      ))}
                      {sectionFeedback.improvements.length === 0 && (
                        <p className="text-sm text-gray-500 italic">No major improvements identified</p>
                      )}
                    </div>
                  </div>

                  {/* Actionable Suggestions */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-blue-700 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Actionable Suggestions
                    </h4>
                    <div className="space-y-2">
                      {sectionFeedback.suggestions.map((suggestion, idx) => (
                        <div key={idx} className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                          <p className="text-sm text-blue-800">{suggestion}</p>
                        </div>
                      ))}
                      {sectionFeedback.suggestions.length === 0 && (
                        <p className="text-sm text-gray-500 italic">Content meets current standards</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {Object.keys(feedback).length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Ready for Review</h2>
            <p className="text-gray-500">
              Input your research paper content above and click "Generate Review" to receive detailed feedback from a senior Scopus journal reviewer perspective.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaperReviewTool;